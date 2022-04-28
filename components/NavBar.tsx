import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';

import { useMetaMask } from 'metamask-react';
import { truncateAddress } from 'utils';

export const NavBar = () => {
  const router = useRouter();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const handleMyAssets = () => {
    router.push('/');
  }
  const handleCreateTrade = () => {
    router.push('/trade/create');
  }
  const handleTradeList = () => {
    router.push('/trade/list');
  }
  const handleTradeHistory = () => {
    router.push('/trade/history');
  }

  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          style={{ padding: '0px 20px' }}
        >
          Swap2p
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button onClick={handleMyAssets}><Typography color='white' gutterBottom variant='body1' component='div'><b>My assets</b></Typography></Button>
          <Button onClick={handleCreateTrade}><Typography color='white' gutterBottom variant='body1' component='div'><b>Create trade</b></Typography></Button>
          <Button onClick={handleTradeList}><Typography color='white' gutterBottom variant='body1' component='div'><b>Trade list</b></Typography></Button>
          <Button onClick={handleTradeHistory}><Typography color='white' gutterBottom variant='body1' component='div'><b>Trade history</b></Typography></Button>
        </Box>
        {
          {
            'initializing': <Box style={{ padding: '0px 20px' }}>
              <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
            </Box>,
            'unavailable': <Box style={{ padding: '0px 20px' }}>
              <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
            </Box>,
            'notConnected': <Box style={{ padding: '0px 20px' }} display='flex'>
              <Button onClick={connect}><Typography variant='h6'>Connect to MetaMask</Typography></Button>
            </Box>,
            'connecting': <Box style={{ padding: '0px 20px' }}>
              <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
            </Box>,
            'connected': <Box style={{ padding: '0px 20px' }}>
              <Typography gutterBottom variant='h5' component='div'>{truncateAddress(account ?? '0x0000000000000000000000000000000000000000')}</Typography>
            </Box>,
          }[status]
        }
      </Toolbar>
    </AppBar>
  );
}
