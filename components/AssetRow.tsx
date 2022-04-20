import { Avatar, Button as IconButton, Menu, MenuItem, TableCell, TableRow } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AssetCardData } from './AssetCard';
import React from 'react';

export const AssetRow = (({ data }: { data: AssetCardData }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleCreateTrade = () => {
    setAnchorEl(null);
  };
  const handleViewAbout = () => {
    setAnchorEl(null);
  }

  return (
    <TableRow key={data.displayName}>
      <TableCell align='right'>
        <Avatar>{data.shortName}</Avatar>
      </TableCell>
      <TableCell align='right'>{data.displayName}</TableCell>
      <TableCell align='right'>{data.network}</TableCell>
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
