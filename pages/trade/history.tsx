import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { Backdrop, Box, CircularProgress, Container } from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { EscrowData, EscrowTable, NavBar } from '@components';

import { ApiTradesResponse, mapApiEscrowToEscrow } from 'utils';
import { useSnackbar } from 'notistack';

const TradeHistoryPage: NextPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [maxEscrows, setMaxEscrows] = useState(0);
  const [escrows, setEscrows] = useState([] as EscrowData[]);

  useEffect(() => {
    if (status !== 'connected') {
      setEscrows([]);
      return;
    }

    setOpenBackdrop(true);
    const getEscrowsPromise = axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/api/trades?offset=0&limit=10&tradeClosed=true')
      .then(({ data }: { data: ApiTradesResponse }) => {
        setMaxEscrows(data.pagination.total);
        setEscrows(data.trades.map(mapApiEscrowToEscrow));
        setOpenBackdrop(false);
      })
      .catch((error) => {
        enqueueSnackbar('Something went wrong :(', { variant: 'error' });
        setOpenBackdrop(false);
      });

    return () => {
      setEscrows([]);
      setOpenBackdrop(false);
    }
  }, [status, chainId]);

  return (
    <Container>
      <Head>
        <title>Swap2p - Trades History</title>
        <meta name="description" content="Swap2p escrow service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Backdrop open={openBackdrop}>
        <CircularProgress />
      </Backdrop>

      <NavBar />

      <Box style={{ display: status === 'connected' ? 'flex' : 'none' }}>
        <EscrowTable maxEscrows={maxEscrows} tradeClosed={true} escrows={escrows} setters={{ setEscrows, setOpenBackdrop }} />
      </Box>
    </Container>
  );
}

export default TradeHistoryPage;
