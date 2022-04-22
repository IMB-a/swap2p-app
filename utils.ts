import abi from './abi-swap2p.json';
import abiERC20 from './abi-erc20.json';
import { BigNumber, ethers } from 'ethers';
import { AssetData, EscrowData } from '@components';

const Swap2pInterface = new ethers.utils.Interface(abi);
const ERC20Interface = new ethers.utils.Interface(abiERC20);

export { Swap2pInterface, ERC20Interface };

export const addressRegexp = /^0x[a-fA-F0-9]{40}$/;

export const swap2pAddress = '0xa63Dc8A11402AAeE75d1e3A4A316868F56a951Dd';

export const truncateAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(38)}`;

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
export const mapApiEscrowToEscrow = (dto: ApiEscrow): EscrowData => ({
    escrowIndex: BigNumber.from(dto.id),
    XOwner: dto.xAddress,
    XAssetAddress: dto.xAsset,
    XAmount: BigNumber.from(dto.xAmount),
    YOwner: dto.xAddress,
    YAssetAddress: dto.xAsset,
    YAmount: BigNumber.from(dto.xAmount),
    closed: dto.closed,
});

export interface ApiAsset {
    address: string;
    amount: string;
    asset: string;
    decimals: number;
}
export const mapApiAssetToAsset = (dto: ApiAsset): AssetData => ({
    shortName: '',
    displayName: dto.asset,
    price: 0,
    count: BigNumber.from(dto.amount),
    address: dto.address,
    decimals: dto.decimals,
});
