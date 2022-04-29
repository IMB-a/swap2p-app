import { Dispatch, SetStateAction, useState } from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

import { EscrowData } from './Escrow';
import { EscrowRow } from './EscrowRow';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSnackbar } from 'notistack';
import { ApiTradesResponse, mapApiEscrowToEscrow } from 'utils';

interface DataSetters {
  setEscrows: Dispatch<SetStateAction<EscrowData[]>>;
  setOpenBackdrop?: Dispatch<SetStateAction<boolean>>;
}

export const EscrowTable = ({ maxEscrows, tradeClosed, escrows, setters }: { maxEscrows: number, tradeClosed: boolean, escrows: EscrowData[], setters: DataSetters }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const prevPageAvailable = page > 0;
  const nextPageAvailable = (page + 1) * 10 < maxEscrows;

  const getEscrows = async (page: number) => {
    try {
      if (setters.setOpenBackdrop) setters.setOpenBackdrop(true);
      const { data }: { data: ApiTradesResponse } = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/api/trades?offset=${page * 10}&limit=10&tradeClosed=${tradeClosed}`
      );
      setters.setEscrows(data.trades.map(mapApiEscrowToEscrow));
    } catch (error) {
      enqueueSnackbar('Something went wrong :(', { variant: 'error' });
    } finally {
      if (setters.setOpenBackdrop) setters.setOpenBackdrop(false);
    }
  };

  const handlePrevPage = async () => {
    if (prevPageAvailable) {
      await getEscrows(page - 1);
      setPage(page - 1);
    }
  };
  const handleNextPage = async () => {
    if (nextPageAvailable) {
      await getEscrows(page + 1);
      setPage(page + 1);
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>Status</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Owner Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Asset Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Amount or ID</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>Y Owner Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>Y Asset Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>Y Amount or ID</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {escrows.map(item => <EscrowRow key={item.escrowIndex._hex} data={item} />)}
        </TableBody>
      </Table>
      {
        escrows.length
          ? <IconButton disabled={!prevPageAvailable} onClick={handlePrevPage}><ArrowBackIosNewIcon /></IconButton>
          : null
      }
      {
        escrows.length
          ? <IconButton disabled={!nextPageAvailable} onClick={handleNextPage}><ArrowForwardIosIcon /></IconButton>
          : null
      }
    </TableContainer>
  );
}
