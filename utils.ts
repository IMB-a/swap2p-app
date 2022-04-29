import abi20_20 from './swap2p-20-20.abi.json';
import abi20_721 from './swap2p-20-721.abi.json';
import abi721_20 from './swap2p-721-20.abi.json';
import abi721_721 from './swap2p-721-721.abi.json';
import abiERC20 from './erc20.abi.json';
import abiERC721 from './erc721.abi.json';
import { BigNumber, ethers } from 'ethers';
import { AssetData, EscrowData } from '@components';
import { Interface } from 'ethers/lib/utils';

// ----- Contracts -----

export type tokenType = '20' | '721';
export type contractType = `${tokenType}_${tokenType}`;
export const allContractTypes: contractType[] = ['20_20', '20_721', '721_20', '721_721'];
export const tokenTypePlaceholders: Record<tokenType, string> = {
    '20': '0.0',
    '721': '0',
};

export const splitContractType = (contract: contractType): [tokenType, tokenType] => contract.split('_') as [tokenType, tokenType];
export const tokenTypeToString = (type: tokenType): string => `ERC${type}`;
export const contractTypeToString = (contract: contractType): string => {
    const [t1, t2] = splitContractType(contract);
    return `${tokenTypeToString(t1)} to ${tokenTypeToString(t2)}`;
};

export const Swap2p20_20Interface = new ethers.utils.Interface(abi20_20);
export const Swap2p20_721Interface = new ethers.utils.Interface(abi20_721);
export const Swap2p721_20Interface = new ethers.utils.Interface(abi721_20);
export const Swap2p721_721Interface = new ethers.utils.Interface(abi721_721);
export const ERC20Interface = new ethers.utils.Interface(abiERC20);
export const ERC721Interface = new ethers.utils.Interface(abiERC721);

export const swap2pInterfaces: Record<contractType, Interface> = {
    '20_20': Swap2p20_20Interface,
    '20_721': Swap2p20_721Interface,
    '721_20': Swap2p721_20Interface,
    '721_721': Swap2p721_721Interface,
};
export const ercInterfaces: Record<tokenType, Interface> = {
    '20': ERC20Interface,
    '721': ERC721Interface,
};

export const swap2p20_20Address = '0xC4EeBde7F673d1257d4716E9D91B7A7F5F281B89';
export const swap2p20_721Address = '0x736F506BD10A1c67390cb16eDB667e9f2Fdc8479';
export const swap2p721_20Address = '0x43EbbeEeB7D56e2FAA412a0307cF45AcC438d4F3';
export const swap2p721_721Address = '0x7Ce90C750AAB0034ADc7338135912695DA452Ef7';

export const swap2pAddresses: Record<contractType, string> = {
    '20_20': swap2p20_20Address,
    '20_721': swap2p20_721Address,
    '721_20': swap2p721_20Address,
    '721_721': swap2p721_721Address,
};

// ----- Utils -----

export const addressRegexp = /^0x[a-fA-F0-9]{40}$/;
export const addressInputRegexp = /^0x[a-fA-F0-9]{0,40}$/;

export const truncateAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(38)}`;

// ----- API -----

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
