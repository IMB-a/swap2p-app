import abi from './abi-swap2p.json';
import abiERC20 from './abi-erc20.json';
import { BigNumber, ethers } from 'ethers';
import { AssetData, EscrowData } from '@components';

const Swap2pInterface = new ethers.utils.Interface(abi);
const ERC20Interface = new ethers.utils.Interface(abiERC20);

export { Swap2pInterface, ERC20Interface };

export const addressRegexp = /^0x[a-fA-F0-9]{40}$/;

export const swap2pAddress = '0xa63dc8a11402aaee75d1e3a4a316868f56a951dd';

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
