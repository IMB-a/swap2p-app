import React from 'react';
import { useRouter } from 'next/router';
import { TableCell, TableRow } from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { EscrowData } from './Escrow';

import { truncateAddress } from 'utils';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { utils } from 'ethers';

export const EscrowRow = (({ data }: { data: EscrowData }) => {
  const router = useRouter();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const handleClick = () => {
    router.push(`/trade/${data.escrowIndex}`);
  };

  return (
    <TableRow hover onClick={handleClick}>
      <TableCell align='right'>{data.closed ? <CheckCircleIcon color='success' /> : <InfoIcon color='info' /> }</TableCell>
      <TableCell align='right'>{truncateAddress(data.XOwner)}</TableCell>
      <TableCell align='right'>{truncateAddress(data.XAssetAddress)}</TableCell>
      <TableCell align='right'>{utils.formatUnits(data.XAmount, 18)}</TableCell>

      <TableCell align='right'>{truncateAddress(data.YOwner)}</TableCell>
      <TableCell align='right'>{truncateAddress(data.YAssetAddress)}</TableCell>
      <TableCell align='right'>{utils.formatUnits(data.YAmount, 18)}</TableCell>
    </TableRow>
  )
});
