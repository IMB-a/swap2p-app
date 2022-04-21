import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Button as IconButton, Link, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useConnectedMetaMask } from 'metamask-react';

import etherscanLink from '@metamask/etherscan-link';

export interface AssetCardData {
  shortName: string;
  displayName: string;
  price: number;
  count: number;

  address: string;
}

export const AssetRow = (({ data }: { data: AssetCardData }) => {
  const router = useRouter();
  const { status, connect, account, chainId, ethereum } = useConnectedMetaMask();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleCreateTrade = () => {
    router.push(`/trade/create?XAsset=${data.address}`);
    setAnchorEl(null);
  };
  const handleViewAbout = () => {
    setAnchorEl(null);
  }

  return (
    <TableRow>
      <TableCell align='right'>
        <Link href={etherscanLink.createAccountLinkForChain(data.address, chainId)}><Avatar>{data.shortName}</Avatar></Link>
      </TableCell>
      <TableCell align='right'>{data.displayName}</TableCell>
      <TableCell align='right'>{data.price}</TableCell>
      <TableCell align='right'>{data.count}</TableCell>
      <TableCell align='right'>
        <IconButton
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleViewAbout}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleCreateTrade}>Создать трейд</MenuItem>
          <MenuItem onClick={handleViewAbout}>Посмотреть сводку</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  )
});
