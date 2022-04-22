import React from 'react';
import { useRouter } from 'next/router';
import { Button, TableCell, TableRow } from '@mui/material';

import { useConnectedMetaMask } from 'metamask-react';

import { EscrowData } from './Escrow';

import { truncateAddress } from 'utils';

export const EscrowRow = (({ data }: { data: EscrowData }) => {
  const router = useRouter();
  const { status, connect, account, chainId, ethereum } = useConnectedMetaMask();

  const handleClick = () => {
    router.push(`/trade?escrowIndex=${data.escrowIndex}`);
  };

  return (
    <TableRow hover onClick={handleClick}>
      <TableCell align='right'>{truncateAddress(data.XOwner)}</TableCell>
      <TableCell align='right'>{truncateAddress(data.XAssetAddress)}</TableCell>
      <TableCell align='right'>{data.XAmount.toString()}</TableCell>

      <TableCell align='right'>{truncateAddress(data.XOwner)}</TableCell>
      <TableCell align='right'>{truncateAddress(data.XAssetAddress)}</TableCell>
      <TableCell align='right'>{data.XAmount.toString()}</TableCell>
    </TableRow>
  )
});
