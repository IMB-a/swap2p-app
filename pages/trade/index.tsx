import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Container, Typography } from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { MetaMaskConnectCard } from '@components';

import { Swap2pInterface } from 'utils';
import { useSnackbar } from 'notistack';

const TradePage: NextPage = () => {
  const router = useRouter();
  const { TokenX, TokenY, YAddress } = router.query;
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const { enqueueSnackbar } = useSnackbar();

  const [showTradeControl, setShowTradeControl] = React.useState(false);

  const onAcceptClick = () => { router.push('/'); };
  const onRejectClick = () => { router.push('/'); };

  useEffect(() => {
    if (status === 'connected') {
      const handleFinally = () => { router.push('/'); };

      let data;
      try {
        data = Swap2pInterface.encodeFunctionData('createEscrow', [TokenX, 0, TokenY, 0, YAddress]);
      } catch (error) {
        enqueueSnackbar('Wrong arguments :(', { variant: 'error' });
        setShowTradeControl(false);
        return;
      }
      setShowTradeControl(true);
      console.log(data);
      // const sendObj = ethereum.request({
      //   method: 'eth_sendTransaction',
      //   params: [{
      //     to: swap2p,
      //     from: ethereum.selectedAddress,
      //     value: '0x00',
      //     chainId: chainId,
      //     data,
      //   }],
      // }).then(handleFinally).catch(handleFinally);
    }
  }, [status]);

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MetaMaskConnectCard />

      <Container style={{ display: showTradeControl ? 'flex' : 'none' }}>
        <Button onClick={onAcceptClick}>
          <Typography>
            Accept
          </Typography>
        </Button>
        <Button onClick={onRejectClick}>
          <Typography>
            Reject
          </Typography>
        </Button>
      </Container>
    </Container>
  );
};

export default TradePage;