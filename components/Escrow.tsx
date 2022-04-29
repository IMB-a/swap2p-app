import { Alert, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { BigNumber, utils } from 'ethers';
import { contractType, splitContractType } from 'utils';

export interface EscrowData {
  escrowIndex: BigNumber;
  type: contractType;
  XOwner: string;
  XAssetAddress: string;
  XAmount: BigNumber;
  YOwner: string;
  YAssetAddress: string;
  YAmount: BigNumber;
  closed: boolean;
}

export const Escrow = ({ data }: { data: EscrowData }) => {
  const [t1, t2] = splitContractType(data.type);

  const XArg = {
    '20': (() => utils.formatUnits(data.XAmount.toString(), 18)),
    '721': (() => data.XAmount),
  }[t1]();
  const YArg = {
    '20': (() => utils.formatUnits(data.YAmount.toString(), 18)),
    '721': (() => data.YAmount),
  }[t2]();

  const XLabel = {
    '20': 'Amount',
    '721': 'ID',
  }[t1];
  const YLabel = {
    '20': 'Amount',
    '721': 'ID',
  }[t2];

  return (
    <Card style={{ marginTop: '80px' }}>
      <CardHeader style={{ backgroundColor: data.closed ? 'green' : 'cyan' }}>
        <Alert severity={ data.closed ? 'success' : 'info' }>
          <Typography>{ data.closed ? 'Closed' : 'Open' }</Typography>
        </Alert>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'grey' }}>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent style={{ padding: '0px' }}>
            <Typography>{data.XOwner}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Owner address</Typography>
            <Typography>{data.XAssetAddress}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Asset address</Typography>
            <Typography>{XArg.toString()}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">{XLabel}</Typography>
          </CardContent>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent style={{ padding: '0px' }}>
            <Typography>{data.YOwner}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Owner address</Typography>
            <Typography>{data.YAssetAddress}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">Asset address</Typography>
            <Typography>{YArg.toString()}</Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">{YLabel}</Typography>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
