import { Box } from '@mui/system';
import { AppBar, Button, Toolbar } from '@mui/material';
import { useRouter } from 'next/router';

export const NavBar = () => {
  const router = useRouter();

  const handleMyAssets = () => {
    router.push('/');
  }
  const handleCreateTrade = () => {
    router.push('/trade/create');
  }
  const handleTradeList = () => {
    router.push('/trade/list');
  }

  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button onClick={handleMyAssets}>Мои активы</Button>
          <Button onClick={handleCreateTrade}>Создать трейд</Button>
          <Button onClick={handleTradeList}>Список трейдов</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
