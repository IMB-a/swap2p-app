import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, CircularProgress, Container, FormControl, IconButton, InputAdornment, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { AssetData, NavBar, SelectTokenDialog } from '@components';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { addressRegexp, mapApiAssetToAsset, contractType, allContractTypes, contractTypeToString, splitContractType, tokenTypePlaceholders } from 'utils';
import { useSnackbar } from 'notistack';
import { utils, BigNumber } from 'ethers';
import axios from 'axios';
import { handle } from 'contractHandlers';

const CreateTradePage: NextPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const YOwnerDefault = '0x0000000000000000000000000000000000000000';
  const [XAssetAddress, setXAssetAddress] = useState('');
  const [XAmountOrId, setXAmount] = useState('');
  const [YAssetAddress, setYAssetAddress] = useState('');
  const [YAmountOrId, setYAmount] = useState('');
  const [YOwner, setYOwner] = useState('');

  const [contract, setContract] = useState<contractType>('20_20');
  const [dialogXOpen, setDialogXOpen] = useState(false);
  const [dialogYOpen, setDialogYOpen] = useState(false);
  const [assets, setAssets] = useState([] as AssetData[]);
  const [buttonStatus, setButtonStatus] = useState<'create' | 'in_progress' | 'completed'>('create');

  const [t1, t2] = splitContractType(contract);

  useEffect(() => {
    if (!router.isReady || status !== 'connected') return;

    const {
      XAssetAddress: XAssetAddressQuery,
      XAmount: XAmountQuery,
      YOwner: YOwnerQuery,
      YAssetAddress: YAssetAddressQuery,
      YAmount: YAmountQuery,
      contract: contractQuery,
    } = router.query;

    setXAssetAddress(XAssetAddressQuery as string ?? '');
    setXAmount(XAmountQuery as string ?? '');
    setYOwner(YOwnerQuery as string ?? '');
    setYAssetAddress(YAssetAddressQuery as string ?? '');
    setYAmount(YAmountQuery as string ?? '');
    setContract(contractQuery as contractType ?? '20_20');

    const balancePromise = axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/api/balance?wallet=${account}`)
      .then(({ data }) => {
        setAssets(data.map(mapApiAssetToAsset));
      })
      .catch(() => {
        enqueueSnackbar('Something went wrong :(', { variant: 'error' });
      });
  }, [router.isReady, status]);

  const XAssetAddressMatch = XAssetAddress.match(addressRegexp);
  const YAssetAddressMatch = YAssetAddress.match(addressRegexp);
  const YOwnerMatch = YOwner.length ? YOwner.match(addressRegexp) : true;

  const canCreate = Boolean(
    XAssetAddressMatch && XAmountOrId !== '' &&
    YAssetAddressMatch && YAmountOrId !== '' && YOwnerMatch
  );

  const resetArgs = () => {
    setXAssetAddress('');
    setXAmount('');
    setYAssetAddress('');
    setYAmount('');
    setYOwner('');
  }

  const handleSwapAssets = () => {
    setXAssetAddress(YAssetAddress);
    setXAmount(YAmountOrId);
    setYAssetAddress(XAssetAddress);
    setYAmount(XAmountOrId);
  }
  const handleSubmit = async () => {
    try {
      setButtonStatus('in_progress');

      const XAsset = assets.find(a => a.address.toLowerCase() === XAssetAddress.toLowerCase());
      const YAsset = assets.find(a => a.address.toLowerCase() === YAssetAddress.toLowerCase());
      const XArg = {
        '20': (() => utils.parseUnits(XAmountOrId, XAsset?.decimals ?? 18)),
        '721': (() => BigNumber.from(XAmountOrId)),
      }[t1]();
      const YArg = {
        '20': (() => utils.parseUnits(YAmountOrId, YAsset?.decimals ?? 18)),
        '721': (() => BigNumber.from(YAmountOrId)),
      }[t2]();

      await handle(contract, ethereum, chainId ?? '', [XAssetAddress, XArg, YAssetAddress, YArg, YOwner.length ? YOwner : YOwnerDefault]);

      setButtonStatus('completed');
    } catch (error) {
      setButtonStatus('create');
      console.log(error)
      enqueueSnackbar('Something went wrong :(', { variant: 'error' });
    }
  };

  return (
    <Container>
      <Head>
        <title>Swap2p - Create Escrow</title>
        <meta name="description" content="Swap2p escrow service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <Paper style={{ marginTop: '80px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <FormControl fullWidth component='form'>
          <Stack direction='column'>
            <Stack direction='row' justifyContent='space-between'>
              <Typography variant='h4' align='center'><b>Create trade</b></Typography>
              <Select
                value={contract}
                onChange={(e) => { resetArgs(); setContract(e.target.value as contractType); }}
              >
                {allContractTypes.map(t => (<MenuItem value={t} key={t}>{contractTypeToString(t)}</MenuItem>))}
              </Select>
            </Stack>
            <Stack direction='column'>
              <Paper elevation={3} style={{ padding: '20px 10px' }}>
                <Stack direction='column'>
                  <TextField
                    required
                    fullWidth
                    placeholder={tokenTypePlaceholders[t1]}
                    type='number'
                    value={XAmountOrId}
                    onChange={e => setXAmount(e.target.value)}
                    InputProps={{
                      autoComplete: 'off',
                      endAdornment: <InputAdornment position='end'>
                        <Button endIcon={<ArrowDropDownIcon />} onClick={() => setDialogXOpen(true)}>
                          <Typography>{assets.find(a => a.address === XAssetAddress.toLowerCase())?.shortName ?? 'Select'}</Typography>
                        </Button>
                      </InputAdornment>
                    }}
                  />
                </Stack>
              </Paper>
              <Paper elevation={5} style={{
                margin: '-10px auto -30px auto',
                padding: '0px',
                zIndex: 200,
                borderRadius: '10px',
                height: '40px',
                width: '40px',
              }}>
                <IconButton onClick={handleSwapAssets} disableRipple style={{ width: '40px', height: '40px' }}>
                  <SwapVertIcon viewBox='-2 -2 28 28' style={{ fontSize: 40 }} />
                </IconButton>
              </Paper>
              <Paper elevation={3} style={{ padding: '20px 10px' }}>
                <Stack direction='column'>
                  <TextField
                    required
                    fullWidth
                    placeholder={tokenTypePlaceholders[t2]}
                    type='number'
                    value={YAmountOrId}
                    onChange={e => setYAmount(e.target.value)}
                    InputProps={{
                      autoComplete: 'off',
                      endAdornment: <InputAdornment position='end'>
                        <Button endIcon={<ArrowDropDownIcon />} onClick={() => setDialogYOpen(true)}>
                          <Typography>{assets.find(a => a.address === YAssetAddress.toLowerCase())?.shortName ?? 'Select'}</Typography>
                        </Button>
                      </InputAdornment>
                    }}
                  />
                  <TextField
                    fullWidth
                    placeholder='0x0000...0000'
                    value={YOwner}
                    onChange={e => setYOwner(e.target.value)}
                  />
                </Stack>
              </Paper>
            </Stack>
            {
              {
                'create': <Button
                  fullWidth
                  disabled={!canCreate}
                  onClick={handleSubmit}
                ><Typography>Create</Typography></Button>,
                'in_progress': <Button
                  fullWidth
                  disabled
                  startIcon={<CircularProgress />}
                >
                  In progress...
                </Button>,
                'completed': <Button
                  fullWidth
                  disabled
                >
                  Done!
                </Button>,
              }[buttonStatus]
            }
          </Stack>
        </FormControl>
      </Paper>

      <SelectTokenDialog open={dialogXOpen} close={() => setDialogXOpen(false)} assets={t1 === '20' ? assets : []} tokenSetter={setXAssetAddress} />
      <SelectTokenDialog open={dialogYOpen} close={() => setDialogYOpen(false)} assets={t2 === '20' ? assets : []} tokenSetter={setYAssetAddress} />

      <footer />
    </Container>
  );
};

export default CreateTradePage;
