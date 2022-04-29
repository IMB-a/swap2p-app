import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as material from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { Escrow, EscrowData, NavBar } from '@components';

import { allContractTypes, contractType, ERC20Interface, swap2p20_20Address, Swap2p20_20Interface, swap2pAddresses, swap2pInterfaces } from 'utils';
import { Box, Button, Container, Skeleton, Typography } from '@mui/material';
import { BigNumber, providers } from 'ethers';
import { useSnackbar } from 'notistack';

const TradePage: NextPage = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { 'escrow-index': escrowIndex, escrowType } = router.query;
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
  const addressAllowed = escrowData
    ? escrowData.YOwner === account?.toLowerCase() || escrowData.YOwner === '0x0000000000000000000000000000000000000000'
    : false;
  const isOwner = escrowData
    ? escrowData.XOwner === account?.toLowerCase()
    : false;

  useEffect(() => {
    if (!router.isReady || status !== 'connected') {
      return;
    }

    if (!allContractTypes.includes(escrowType as contractType)) {
      enqueueSnackbar('Wrong contractType :(');
      return;
    }

    const swap2pInterface = swap2pInterfaces[escrowType as contractType];
    const swap2pAddress = swap2pAddresses[escrowType as contractType];
    const escrowGetData = swap2pInterface.encodeFunctionData('getEscrow', [escrowIndex]);
    const getEscrowPromise = ethereum.request({
      method: 'eth_call',
      params: [{
        to: swap2pAddress,
        from: ethereum.selectedAddress,
        chainId: chainId,
        data: escrowGetData,
      }, 'latest'],
    }).then((data: string) => {
      const [XOwner, XAssetAddress, XAmount, YOwner, YAssetAddress, YAmount, closed] = swap2pInterface.decodeFunctionResult('getEscrow', data)[0];
      setEscrowData({ escrowIndex: BigNumber.from(escrowIndex), type: escrowType as contractType, XOwner, XAssetAddress, XAmount, YOwner, YAssetAddress, YAmount, closed });
    });
  }, [router.isReady, status]);

  const onAcceptClick = async () => {
    const provider = new providers.Web3Provider(ethereum)

    let tx;
    const approveData = ERC20Interface.encodeFunctionData('approve', [swap2p20_20Address, escrowData!.YAmount]);
    tx = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        to: escrowData!.YAssetAddress,
        from: ethereum.selectedAddress,
        chainId: chainId,
        data: approveData,
      }],
    });

    await provider.waitForTransaction(tx);

    const acceptData = Swap2p20_20Interface.encodeFunctionData('acceptEscrow', [escrowIndex]);
    tx = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        to: swap2p20_20Address,
        from: ethereum.selectedAddress,
        chainId: chainId,
        data: acceptData,
      }],
    });

    await provider.waitForTransaction(tx);

    router.reload();
  };
  const onCancelClick = async () => {
    const cancelData = Swap2p20_20Interface.encodeFunctionData('cancelEscrow', [escrowIndex]);
    await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        to: swap2p20_20Address,
        from: ethereum.selectedAddress,
        chainId: chainId,
        data: cancelData,
      }],
    });
  };

  return (
    <Container>
      <Head>
        <title>Swap2p - Escrow</title>
        <meta name="description" content="Swap2p escrow service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      {
        escrowData
          ? <Escrow data={escrowData} />
          : <Skeleton variant='rectangular' width={200} height={80} />
      }

      {
        escrowData
          ?
          <Box>
            <Button disabled={escrowData.closed || !addressAllowed} onClick={onAcceptClick}>
              <Typography>
                Accept
              </Typography>
            </Button>
            <Button disabled={escrowData.closed || !addressAllowed || !isOwner} onClick={onCancelClick}>
              <Typography>
                Reject
              </Typography>
            </Button>
          </Box>
          : null
      }
    </Container>
  );
};

export default TradePage;
