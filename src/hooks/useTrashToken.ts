import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddresses, trashTokenABI } from '../config/contracts';
import { parseUnits } from 'viem';
import toast from 'react-hot-toast';

export const useTrashToken = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Read balance
  const { data: balance, isLoading: isBalanceLoading, refetch: refetchBalance } = useReadContract({
    address: contractAddresses.trashToken as `0x${string}`,
    abi: trashTokenABI,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Read total supply
  const { data: totalSupply, isLoading: isTotalSupplyLoading } = useReadContract({
    address: contractAddresses.trashToken as `0x${string}`,
    abi: trashTokenABI,
    functionName: 'totalSupply',
  });

  // Transfer tokens
  const transfer = useCallback(
    async (to: string, amount: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(amount, 18);
        
        await writeContractAsync({
          address: contractAddresses.trashToken as `0x${string}`,
          abi: trashTokenABI,
          functionName: 'transfer',
          args: [to as `0x${string}`, parsedAmount],
        });

        toast.success('Transfer successful');
        if (refetchBalance) {
          refetchBalance();
        }
      } catch (error) {
        console.error('Transfer error:', error);
        toast.error('Transfer failed');
      }
    },
    [address, writeContractAsync, refetchBalance]
  );

  // Approve tokens
  const approve = useCallback(
    async (spender: string, amount: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(amount, 18);
        
        await writeContractAsync({
          address: contractAddresses.trashToken as `0x${string}`,
          abi: trashTokenABI,
          functionName: 'approve',
          args: [spender as `0x${string}`, parsedAmount],
        });

        toast.success('Approval successful');
      } catch (error) {
        console.error('Approval error:', error);
        toast.error('Approval failed');
      }
    },
    [address, writeContractAsync]
  );

  return {
    balance,
    totalSupply,
    transfer,
    approve,
    isBalanceLoading,
    isTotalSupplyLoading,
    isWritePending,
  };
};
