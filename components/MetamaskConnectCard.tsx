import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useMetaMask } from 'metamask-react';

const MetamaskConnectCard = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  return {
    'initializing': <Card sx={{ maxWidth: 360 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
        <Typography variant='body2' color='text.secondary'>
          Synchronization with MetaMask ongoing...
        </Typography>
      </CardContent>
    </Card>,
    'unavailable': <Card sx={{ maxWidth: 360 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
        <Typography variant='body2' color='text.secondary'>
          MetaMask not available :(
        </Typography>
      </CardContent>
    </Card>,
    'notConnected': <Card sx={{ maxWidth: 360 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
        <Typography variant='body2' color='text.secondary'>
          Not connected
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={connect}>Connect to MetaMask</Button>
      </CardActions>
    </Card>,
    'connecting': <Card sx={{ maxWidth: 360 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
        <Typography variant='body2' color='text.secondary'>
          Connecting...
        </Typography>
      </CardContent>
    </Card>,
    'connected': <Card sx={{ maxWidth: 360 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>{status}</Typography>
        <Typography variant='body2' color='text.secondary'>
          Connected account {account} on chain ID {chainId}
        </Typography>
      </CardContent>
    </Card>,
  }[status];
}

export default MetamaskConnectCard;
