import { NextPage } from 'next';
import Head from 'next/head';
import { Button, Container, Paper, Stack } from '@mui/material';

import { NavBar } from '@components';

import { useMetaMask } from 'metamask-react';
import { BigNumber, providers, utils } from 'ethers';
import { ERC20Interface, ERC721Interface } from 'utils';

const Faucet: NextPage = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const provider = ethereum ? new providers.Web3Provider(ethereum) : null;

  const faucet = async (data: string, addr: string) => {
    const tx = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        to: addr,
        from: ethereum.selectedAddress,
        chainId: chainId,
        data: data,
      }],
    });

    await provider!.waitForTransaction(tx);
  };
  const faucetERC20 = async (addr: string) => {
    const approveData = ERC20Interface.encodeFunctionData('mint', [account, utils.parseUnits('1', 18)]);
    await faucet(approveData, addr);
  };
  const faucetERC721 = async (addr: string) => {
    const approveData = ERC721Interface.encodeFunctionData('mint', [account]);
    await faucet(approveData, addr);
  }

  const handleGetXToken = () => faucetERC20('0x5a87f76aB89916aC92056E646cA93c25bbbb6D88');
  const handleGetYToken = () => faucetERC20('0x82e2379179Ba2583B8D2d21FdaDd852Ca8Fa1Be1');
  const handleGetSPPToken = () => faucetERC20('0x57a5ac17906491be6609cee8eab5730f67790717');
  const handleGetXNFT = () => faucetERC721('0x6ebD878E96093c6E881DA212720aD5Ca4F3172b5');
  const handleGetYNFT = () => faucetERC721('0x7Ce90C750AAB0034ADc7338135912695DA452Ef7');

  const addTokenToMetamask = (address: string, symbol: string) => {
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals: 18,
        },
      },
    }).then((success: any) => {
      if (success) {
        console.log(`${symbol} successfully added to wallet!`)
      } else {
        throw new Error('Something went wrong.')
      }
    }).catch(console.error);
  };

  const handleAddXToken = () => addTokenToMetamask('0x5a87f76aB89916aC92056E646cA93c25bbbb6D88', 'X');
  const handleAddYToken = () => addTokenToMetamask('0x82e2379179Ba2583B8D2d21FdaDd852Ca8Fa1Be1', 'Y');
  const handleAddSPPToken = () => addTokenToMetamask('0x57a5ac17906491be6609cee8eab5730f67790717', 'SPP');

  return (
    <Container>
      <Head>
        <title>Swap2p - Faucet</title>
        <meta name="description" content="Swap2p escrow service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <Paper style={{ marginTop: '80px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Stack direction='column'>
          <Paper elevation={3}>
            <Stack direction='column'>
              <Button onClick={handleGetXToken}>Get 1 X Token</Button>
              <Button onClick={handleAddXToken}>Add X Token to MetaMask</Button>
            </Stack>
          </Paper>
          <Paper elevation={3}>
            <Stack direction='column'>
              <Button onClick={handleGetYToken}>Get 1 Y Token</Button>
              <Button onClick={handleAddYToken}>Add Y Token to MetaMask</Button>
            </Stack>
          </Paper>
          <Paper elevation={3}>
            <Stack direction='column'>
              <Button onClick={handleGetSPPToken}>Get 1 SPP Token</Button>
              <Button onClick={handleAddSPPToken}>Add SPP Token to MetaMask</Button>
            </Stack>
          </Paper>
          <Paper elevation={3} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleGetXNFT}>Get X NFT</Button>
          </Paper>
          <Paper elevation={3} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleGetYNFT}>Get Y NFT</Button>
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Faucet;
