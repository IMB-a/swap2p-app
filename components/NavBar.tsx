import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import { AppBar, Button, Menu, MenuItem, Paper, Select, Toolbar, Typography } from '@mui/material';

import { useMetaMask } from 'metamask-react';
import { truncateAddress } from 'utils';
import { useState } from 'react';

export const NavBar = () => {
  const router = useRouter();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMyAssets = () => router.push('/');
  const handleFaucet = () => router.push('/faucet');
  const handleCreateTrade = () => router.push('/trade/create');
  const handleTradeList = () => router.push('/trade/list');
  const handleTradeHistory = () => router.push('/trade/history');

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
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <Typography>Menu</Typography>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem><Button onClick={handleMyAssets}><Typography color='white' gutterBottom variant='body1' component='div'><b>My assets</b></Typography></Button></MenuItem>
          <MenuItem><Button onClick={handleCreateTrade}><Typography color='white' gutterBottom variant='body1' component='div'><b>Create trade</b></Typography></Button></MenuItem>
          <MenuItem><Button onClick={handleTradeList}><Typography color='white' gutterBottom variant='body1' component='div'><b>Trade list</b></Typography></Button></MenuItem>
          <MenuItem><Button onClick={handleTradeHistory}><Typography color='white' gutterBottom variant='body1' component='div'><b>Trade history</b></Typography></Button></MenuItem>
          <MenuItem><Button onClick={handleFaucet}><Typography color='white' gutterBottom variant='body1' component='div'><b>Faucet</b></Typography></Button></MenuItem>
        </Menu>
        {
          {
            'initializing': <Box style={{ padding: '0px 20px', marginRight: 'auto' }}>
              <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
            </Box>,
            'unavailable': <Box style={{ padding: '0px 20px', marginRight: 'auto' }}>
              <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
            </Box>,
            'notConnected': <Box style={{ padding: '0px 20px', marginRight: 'auto' }} display='flex'>
              <Button onClick={connect}><Typography variant='h6'>Connect to MetaMask</Typography></Button>
            </Box>,
            'connecting': <Box style={{ padding: '0px 20px', marginRight: 'auto' }}>
              <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
            </Box>,
            'connected': <Box style={{ padding: '0px 20px', marginLeft: 'auto' }}>
              <Typography gutterBottom variant='h5' component='div'>{truncateAddress(account ?? '0x0000000000000000000000000000000000000000')}</Typography>
            </Box>,
          }[status]
        }
      </Toolbar >
    </AppBar >
  );
}
