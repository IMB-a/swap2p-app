import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { EscrowData } from './Escrow';
import { EscrowRow } from './EscrowRow';

export const EscrowTable = ({ escrows }: { escrows: EscrowData[] }) => (
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
  </TableContainer>
)
