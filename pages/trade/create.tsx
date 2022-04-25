import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Autocomplete, Button, CircularProgress, Container, FormControl, FormGroup, Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { AssetData, NavBar } from '@components';

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

      <FormControl component='form'>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='ChainId'
              value={chainId ?? ''}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='XOwner'
              value={account ?? ''}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label='YOwner'
              value={YOwner}
              onChange={e => setYOwner(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
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
                  label='XAssetAddress'
                  value={XAssetAddress}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: XAssetDisabled,
                  }}
                />
              )}
              renderOption={(props, option) => <li {...props}>{typeof option === 'string' ? option : option.displayName}</li>}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label='YAssetAddress'
              value={YAssetAddress}
              onChange={e => setYAssetAddress(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label='XAmount'
              type='number'
              value={XAmount}
              onChange={e => setXAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label='YAmount'
              type='number'
              value={YAmount}
              onChange={e => setYAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </FormControl>
    </Container>
  );
};

export default CreateTradePage;
