import React from 'react';
import { useRouter } from 'next/router';
import { TableCell, TableRow } from '@mui/material';

import { useMetaMask } from 'metamask-react';

import { EscrowData } from './Escrow';

import { splitContractType, truncateAddress } from 'utils';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { utils } from 'ethers';

export const EscrowRow = (({ data }: { data: EscrowData }) => {
  const router = useRouter();
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [t1, t2] = splitContractType(data.type);
  const XArg = {
    '20': (() => utils.formatUnits(data.XAmount.toString(), 18)),
    '721': (() => data.XAmount),
  }[t1]();
  const YArg = {
    '20': (() => utils.formatUnits(data.YAmount.toString(), 18)),
    '721': (() => data.YAmount),
  }[t2]();

  const handleClick = () => router.push(`/trade/${data.escrowIndex}?escrowType=${data.type}`);

  return (
    <TableRow hover onClick={handleClick}>
      <TableCell align='right'>{data.closed ? <CheckCircleIcon color='success' /> : <InfoIcon color='info' />}</TableCell>
      <TableCell align='right'>{truncateAddress(data.XOwner)}</TableCell>
      <TableCell align='right'>{`${truncateAddress(data.XAssetAddress)} (ERC${t1})`}</TableCell>
      <TableCell align='right'>{XArg.toString()}</TableCell>

      <TableCell align='right'>{truncateAddress(data.YOwner)}</TableCell>
      <TableCell align='right'>{`${truncateAddress(data.YAssetAddress)} (ERC${t2})`}</TableCell>
      <TableCell align='right'>{YArg.toString()}</TableCell>
    </TableRow>
  )
});
