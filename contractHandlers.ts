import { BigNumber, providers } from 'ethers';
import { contractType, ercInterfaces, swap2pAddresses, splitContractType, swap2pInterfaces, sppTokenAddress } from 'utils';

export type ContractArgs = [string, BigNumber, string, BigNumber, string];
export type Handler = (contract: contractType, ethereum: any, chainId: string, args: ContractArgs) => void;

export const handle: Handler = async (contract, ethereum, chainId, [XAssetAddress, XAmountOrId, YAssetAddress, YAmountOrId, YOwner]) => {
    let tx;
    const provider = new providers.Web3Provider(ethereum);

    const [t1, t2] = splitContractType(contract);
    const ercInterface = ercInterfaces[t1];
    const swap2pAddress = swap2pAddresses[contract];
    const swap2pInterface = swap2pInterfaces[contract];

    // get fee
    const getFeeData = swap2pInterface.encodeFunctionData('fee', []);
    const feeData = await ethereum.request({
        method: 'eth_call',
        params: [{
            to: swap2pAddress,
            from: ethereum.selectedAddress,
            chainId: chainId,
            data: getFeeData,
        }, 'latest'],
    });
    const [fee] = swap2pInterface.decodeFunctionResult('fee', feeData);

    console.log(fee);
    const approveSPPData = ercInterface.encodeFunctionData('approve', [swap2pAddress, fee]);
    tx = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
            to: sppTokenAddress,
            from: ethereum.selectedAddress,
            chainId: chainId,
            data: approveSPPData,
        }],
    });

    await provider.waitForTransaction(tx);

    const approveXData = ercInterface.encodeFunctionData('approve', [swap2pAddress, XAmountOrId]);
    tx = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
            to: XAssetAddress,
            from: ethereum.selectedAddress,
            chainId: chainId,
            data: approveXData,
        }],
    });

    await provider.waitForTransaction(tx);

    const escrowData = swap2pInterface.encodeFunctionData(
        'createEscrow',
        [XAssetAddress, XAmountOrId, YAssetAddress, YAmountOrId, YOwner],
    );
    tx = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
            to: swap2pAddress,
            from: ethereum.selectedAddress,
            chainId: chainId,
            data: escrowData,
        }],
    });

    await provider.waitForTransaction(tx);
}
