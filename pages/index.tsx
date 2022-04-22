import { useEffect, useState } from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import { Backdrop, CircularProgress, Container } from '@mui/material'
import axios from 'axios';

import { useMetaMask } from 'metamask-react'

import { AssetData, AssetTable, NavBar } from '@components';

import { useSnackbar } from 'notistack';
import { mapApiAssetToAsset } from 'utils';

const Home: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [assets, setAssets] = useState([] as AssetData[]);

  useEffect(() => {
    if (status === 'connected') {
      setOpenBackdrop(true);
      const balancePromise = axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/api/balance?wallet=${account}`)
        .then(({ data }) => {
          setAssets(data.map(mapApiAssetToAsset));
          setOpenBackdrop(false);
        })
        .catch(() => {
          setOpenBackdrop(false);
          enqueueSnackbar('Something went wrong :(', { variant: 'error' });
        });
      return () => {
        setAssets([]);
        setOpenBackdrop(false);
      };
    }
    setAssets([]);
  }, [status, chainId]);

  return (
    <Container>
      <Head>
        <title>Swap2p</title>
        <meta name="description" content="Swap2p escrow service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Backdrop open={openBackdrop}>
        <CircularProgress />
      </Backdrop>

      <NavBar />

      <Container style={{ display: status === 'connected' ? 'flex' : 'none' }}>
        <AssetTable assets={assets} />
      </Container>
    </Container>
  )
}

export default Home
