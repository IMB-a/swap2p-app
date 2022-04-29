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

  const handleGetXToken = () => faucetERC20('0x470ba85505958C8fEA795cB60A0c1AF142D1C55b');
  const handleGetYToken = () => faucetERC20('0x54fAB9FF580cF971f63734934a01059685cCB2B2');
  const handleGetSPPToken = () => faucetERC20('0x034Dac9EAC0ea14f39B146973f38F37EaDbB0415');
  const handleGetXNFT = () => faucetERC721('0xf58138fe9fA259827FB186E75C42A45B8195be41');
  const handleGetYNFT = () => faucetERC721('0xd95059A768f71e2b6b4Edd58968122B926e46552');

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

  const handleAddXToken = () => addTokenToMetamask('0x470ba85505958C8fEA795cB60A0c1AF142D1C55b', 'X');
  const handleAddYToken = () => addTokenToMetamask('0x54fAB9FF580cF971f63734934a01059685cCB2B2', 'Y');
  const handleAddSPPToken = () => addTokenToMetamask('0x034Dac9EAC0ea14f39B146973f38F37EaDbB0415', 'SPP');

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
