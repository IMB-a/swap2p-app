import abi20_20 from './swap2p-20-20.abi.json';
import abi20_721 from './swap2p-20-721.abi.json';
import abi721_20 from './swap2p-721-20.abi.json';
import abi721_721 from './swap2p-721-721.abi.json';
import abiERC20 from './erc20.abi.json';
import { BigNumber, ethers } from 'ethers';
import { AssetData, EscrowData } from '@components';

export const Swap2p20_20Interface = new ethers.utils.Interface(abi20_20);
export const Swap2p20_721Interface = new ethers.utils.Interface(abi20_721);
export const Swap2p721_20Interface = new ethers.utils.Interface(abi721_20);
export const Swap2p721_721Interface = new ethers.utils.Interface(abi721_721);
export const ERC20Interface = new ethers.utils.Interface(abiERC20);

export const addressRegexp = /^0x[a-fA-F0-9]{40}$/;

export const swap2p20_20Address = '0x536946E1E15f88fdE268293c728a0057517cb32b';
export const swap2p20_721Address = '0xA8a6e2AD3492E92467a389a04ACCb216D2b80a1e';
export const swap2p721_20Address = '0xa015B299Feb098FBa566F4304Bb33C55b4A7a2e0';
export const swap2p721_721Address = '0x726B1315e9d2418d488D685DEbbf5797428194e3';

export const truncateAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(38)}`;

export interface ApiPagination {
    limit: number;
    offset: number;
    total: number;
}
export interface ApiEscrow {
    id: number;
    xAddress: string;
    xAsset: string;
    xAmount: string;
    xDecimals: number;
    yAddress: string;
    yAsset: string;
    yAmount: string;
    yDecimals: number;
    closed: boolean;
}
export interface ApiAsset {
    address: string;
    amount: string;
    assetFullName: string;
    assetShortName: string;
    decimals: number;
}
export interface ApiTradesResponse {
    pagination: ApiPagination;
    trades: ApiEscrow[];
}

export const mapApiEscrowToEscrow = (dto: ApiEscrow): EscrowData => ({
    escrowIndex: BigNumber.from(dto.id),
    XOwner: dto.xAddress.toLowerCase(),
    XAssetAddress: dto.xAsset,
    XAmount: BigNumber.from(dto.xAmount),
    YOwner: dto.yAddress.toLowerCase(),
    YAssetAddress: dto.yAsset.toLowerCase(),
    YAmount: BigNumber.from(dto.yAmount),
    closed: dto.closed,
});

export const mapApiAssetToAsset = (dto: ApiAsset): AssetData => ({
    shortName: dto.assetShortName,
    displayName: dto.assetFullName,
    price: 0,
    count: BigNumber.from(dto.amount),
    address: dto.address.toLowerCase(),
    decimals: dto.decimals,
});
