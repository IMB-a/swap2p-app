import { Dispatch, SetStateAction, useState } from 'react';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

import { EscrowData } from './Escrow';
import { EscrowRow } from './EscrowRow';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSnackbar } from 'notistack';
import { mapApiEscrowToEscrow } from 'utils';

interface DataSetters {
  setEscrows: Dispatch<SetStateAction<EscrowData[]>>;
  setOpenBackdrop?: Dispatch<SetStateAction<boolean>>;
}

export const EscrowTable = ({ escrows, setters }: { escrows: EscrowData[], setters: DataSetters }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const prevPageAvailable = page > 0;
  const nextPageAvailable = escrows.length == 10;

  const getEscrows = async (page: number) => {
    try {
      if (setters.setOpenBackdrop) setters.setOpenBackdrop(true);
      const { data } = await axios.get(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/api/trades?offset=${page * 10}&limit=10`);
      setters.setEscrows(data.map(mapApiEscrowToEscrow));
    } catch (error) {
      enqueueSnackbar('Something went wrong :(');
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
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Owner Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Asset Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Amount</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Owner Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Asset Address</TableCell>
            <TableCell align='right' style={{ padding: '16px 16px 0px' }} sx={{ fontSize: '0.75rem', color: '#999' }}>X Amount</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {escrows.map(item => <EscrowRow key={item.escrowIndex._hex} data={item} />)}
        </TableBody>
      </Table>
      <IconButton disabled={!prevPageAvailable} onClick={handlePrevPage}><ArrowBackIosNewIcon /></IconButton>
      <IconButton disabled={!nextPageAvailable} onClick={handleNextPage}><ArrowForwardIosIcon /></IconButton>
    </TableContainer>
  );
}
