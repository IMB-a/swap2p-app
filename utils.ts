import abi from './abi-swap2p.json';
import abiERC20 from './abi-erc20.json';
import { ethers } from 'ethers';

const Swap2pInterface = new ethers.utils.Interface(abi);
const ERC20Interface = new ethers.utils.Interface(abiERC20);

export { Swap2pInterface, ERC20Interface };

export const addressRegexp = /^0x[a-fA-F0-9]{40}$/;

export const swap2pAddress = '0x2512444b85715F383eE3a17bCB40eCE0C9723ea6';
