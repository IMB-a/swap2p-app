import { Alert, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { BigNumber } from 'ethers';

export interface EscrowData {
  escrowIndex: BigNumber;
  XOwner: string;
  XAssetAddress: string;
  XAmount: BigNumber;
  YOwner: string;
  YAssetAddress: string;
  YAmount: BigNumber;
  closed: boolean;
}

export const Escrow = ({ data }: { data: EscrowData }) => {
  return (
    <Card>
      <CardHeader style={{ backgroundColor: data.closed ? 'green' : 'cyan' }}>
        <Alert severity={ data.closed ? 'success' : 'info' }>
          <Typography>{ data.closed ? 'Closed' : 'Open' }</Typography>
        </Alert>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'grey' }}>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Typography>{data.XOwner}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Owner address</Typography>
            <Typography>{data.XAssetAddress}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Asset address</Typography>
            <Typography>{data.XAmount.toString()}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Amount</Typography>
          </CardContent>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Typography>{data.YOwner}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Owner address</Typography>
            <Typography>{data.YAssetAddress}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Asset address</Typography>
            <Typography>{data.YAmount.toString()}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Amount</Typography>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
