import abi from './abi-swap2p.json';
import abiERC20 from './abi-erc20.json';
import { BigNumber, ethers } from 'ethers';
import { EscrowData } from '@components';

const Swap2pInterface = new ethers.utils.Interface(abi);
const ERC20Interface = new ethers.utils.Interface(abiERC20);

export { Swap2pInterface, ERC20Interface };

export const addressRegexp = /^0x[a-fA-F0-9]{40}$/;

export const swap2pAddress = '0x2512444b85715F383eE3a17bCB40eCE0C9723ea6';

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
