import abi from './abi.json';
import { ethers } from 'ethers';

const abiInterface = new ethers.utils.Interface(abi);

export default abiInterface;
