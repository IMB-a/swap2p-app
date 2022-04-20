import { Avatar, Card, CardContent, Typography } from '@mui/material';

export interface AssetCardData {
  shortName: string;
  displayName: string;
  network: string;
  price: number;
  count: number;
}

export const AssetCard = ({ index, data }: { index: number, data: AssetCardData }) => {
  return (
    <Card id={`assets_${index}`}>
      <CardContent sx={{ display: 'grid', 'grid-template-columns': '60px 2fr 1fr 1fr 1fr' }}>
        <Avatar>{data.shortName}</Avatar>
        <Typography>{data.displayName}</Typography>
        <Typography>{data.network}</Typography>
        <Typography>{data.price} $</Typography>
        <Typography>{data.count} {data.shortName}</Typography>
      </CardContent>
    </Card>
  );
}
