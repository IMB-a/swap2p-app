import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Autocomplete, Button, CircularProgress, Container, FormControl, Paper, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { AssetData, NavBar } from '@components';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Swap2pInterface, addressRegexp, ERC20Interface, swap2pAddress, mapApiAssetToAsset } from 'utils';
import { useSnackbar } from 'notistack';
import { utils, providers } from 'ethers';
import axios from 'axios';

const CreateTradePage: NextPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const YOwnerDefault = '0x0000000000000000000000000000000000000000';
  const [XAssetAddress, setXAssetAddress] = useState('');
  const [XAmount, setXAmount] = useState('');
  const [YOwner, setYOwner] = useState('');
  const [YAssetAddress, setYAssetAddress] = useState('');
  const [YAmount, setYAmount] = useState('');

  const [XAssetDisabled, setXAssetDisabled] = useState(false);
  const [assets, setAssets] = useState([] as AssetData[]);

  const [buttonStatus, setButtonStatus] = useState<'create' | 'in_progress' | 'completed'>('create');

  useEffect(() => {
    if (!router.isReady || status !== 'connected') return;

    const {
      XAssetAddress: XAssetAddressQuery,
      XAmount: XAmountQuery,
      YOwner: YOwnerQuery,
      YAssetAddress: YAssetAddressQuery,
      YAmount: YAmountQuery,
    } = router.query;

    setXAssetAddress(XAssetAddressQuery as string ?? '');
    setXAmount(XAmountQuery as string ?? '');
    setYOwner(YOwnerQuery as string ?? '');
    setYAssetAddress(YAssetAddressQuery as string ?? '');
    setYAmount(YAmountQuery as string ?? '');

    const balancePromise = axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/api/balance?wallet=${account}`)
      .then(({ data }) => {
        setAssets(data.map(mapApiAssetToAsset));
      })
      .catch(() => {
        enqueueSnackbar('Something went wrong :(', { variant: 'error' });
      });
  }, [router.isReady, status]);

  const XAssetAddressMatch = XAssetAddress.match(addressRegexp);
  const YOwnerMatch = YOwner.length ? YOwner.match(addressRegexp) : true;
  const YAssetAddressMatch = YAssetAddress.match(addressRegexp);

  const canCreate = Boolean(XAssetAddressMatch && XAmount !== '' && YOwnerMatch && YAssetAddressMatch && YAmount !== '');

  const handleSelectAsset = (event: SelectChangeEvent) => {
    const address = event.target.value;
    setXAssetAddress(address);
    setXAssetDisabled(address !== '');
  };
  const handleSubmit = async () => {
    try {
      setButtonStatus('in_progress');

      let tx;
      const provider = new providers.Web3Provider(ethereum)
      const XAsset = assets.find(a => a.address.toLowerCase() === XAssetAddress.toLowerCase());
      const YAsset = assets.find(a => a.address.toLowerCase() === YAssetAddress.toLowerCase());
      const XAmountPenny = utils.parseUnits(XAmount, XAsset?.decimals ?? 18);
      const YAmountPenny = utils.parseUnits(YAmount, YAsset?.decimals ?? 18);

      const approveData = ERC20Interface.encodeFunctionData('approve', [swap2pAddress, XAmountPenny]);
      tx = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: XAssetAddress,
          from: ethereum.selectedAddress,
          chainId: chainId,
          data: approveData,
        }],
      });

      await provider.waitForTransaction(tx);

      // get fee
      const getFeeData = Swap2pInterface.encodeFunctionData('fee', []);
      const feeData = await ethereum.request({
        method: 'eth_call',
        params: [{
          to: swap2pAddress,
          from: ethereum.selectedAddress,
          chainId: chainId,
          data: getFeeData,
        }, 'latest'],
      });

      const [fee] = Swap2pInterface.decodeFunctionResult('fee', feeData);
      const escrowData = Swap2pInterface.encodeFunctionData(
        'createEscrow',
        [XAssetAddress, XAmountPenny, YAssetAddress, YAmountPenny, YOwner.length ? YOwner : YOwnerDefault],
      );
      tx = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          to: swap2pAddress,
          from: ethereum.selectedAddress,
          chainId: chainId,
          value: fee.toString(),
          data: escrowData,
        }],
      });

      await provider.waitForTransaction(tx);

      setButtonStatus('completed');
    } catch (error) {
      setButtonStatus('create');
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

      <Paper style={{ marginTop: '80px', padding: '20px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
        <FormControl fullWidth component='form'>
          <Stack direction='column'>
            <Typography variant='h4' align='center'><b>Create trade</b></Typography>
            <Stack direction='row'>
              <Paper elevation={3} style={{ padding: '10px', width: '50%' }}>
                <Stack direction='column' spacing='10px' padding='0px 10px'>
                  <TextField
                    fullWidth
                    label='Your address'
                    value={account ?? ''}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Autocomplete
                    fullWidth
                    freeSolo
                    forcePopupIcon
                    options={assets}
                    getOptionLabel={option => typeof option === 'string' ? option : option.address}
                    onChange={(e, v) => setXAssetAddress(typeof v === 'string' ? v : v?.address ?? '')}
                    renderInput={params => (
                      <TextField
                        {...params}
                        required
                        label='Your token'
                        value={XAssetAddress}
                        InputProps={{
                          ...params.InputProps,
                          readOnly: XAssetDisabled,
                        }}
                      />
                    )}
                    renderOption={(props, option) => <li {...props}>{typeof option === 'string' ? option : option.displayName}</li>}
                  />
                  <TextField
                    required
                    fullWidth
                    label='Your token amount'
                    type='number'
                    value={XAmount}
                    onChange={e => setXAmount(e.target.value)}
                  />
                </Stack>
              </Paper>
              <Paper elevation={5} style={{
                margin: 'auto -30px auto -10px',
                zIndex: 200,
                borderRadius: '10px',
                height: '40px',
              }}>
                <ArrowForwardIcon style={{ fontSize: 40 }} />
              </Paper>
              <Paper elevation={3} style={{ padding: '10px', width: '50%' }}>
                <Stack direction='column' spacing='10px' padding='0px 10px'>
                  <TextField
                    fullWidth
                    label='Desired address'
                    value={YOwner}
                    onChange={e => setYOwner(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    label='Desired token'
                    value={YAssetAddress}
                    onChange={e => setYAssetAddress(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    label='Desired token amount'
                    type='number'
                    value={YAmount}
                    onChange={e => setYAmount(e.target.value)}
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

      <footer />
    </Container>
  );
};

export default CreateTradePage;
