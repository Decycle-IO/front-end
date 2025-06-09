import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddresses, recyclingSystemABI } from '../config/contracts';
import { parseUnits } from 'viem';
import toast from 'react-hot-toast';

export const useRecyclingSystem = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Get all active garbage cans
  const { data: activeGarbageCans, isLoading: isActiveGarbageCansLoading, refetch: refetchActiveGarbageCans } = useReadContract({
    address: contractAddresses.recyclingSystem as `0x${string}`,
    abi: recyclingSystemABI,
    functionName: 'getAllActiveGarbageCans',
  });

  // Get all pending garbage cans
  const { data: pendingGarbageCans, isLoading: isPendingGarbageCansLoading, refetch: refetchPendingGarbageCans } = useReadContract({
    address: contractAddresses.recyclingSystem as `0x${string}`,
    abi: recyclingSystemABI,
    functionName: 'getAllPendingGarbageCans',
  });

  // Get system stats
  const { data: systemStats, isLoading: isSystemStatsLoading, refetch: refetchSystemStats } = useReadContract({
    address: contractAddresses.recyclingSystem as `0x${string}`,
    abi: recyclingSystemABI,
    functionName: 'getSystemStats',
  });

  // Get user recycled weight
  const { data: userRecycledWeight, isLoading: isUserRecycledWeightLoading } = useReadContract({
    address: contractAddresses.recyclingSystem as `0x${string}`,
    abi: recyclingSystemABI,
    functionName: 'getUserRecycledWeight',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Get user recycling count
  const { data: userRecyclingCount, isLoading: isUserRecyclingCountLoading } = useReadContract({
    address: contractAddresses.recyclingSystem as `0x${string}`,
    abi: recyclingSystemABI,
    functionName: 'getUserRecyclingCount',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Get user staked amount
  const { data: userStakedAmount, isLoading: isUserStakedAmountLoading } = useReadContract({
    address: contractAddresses.recyclingSystem as `0x${string}`,
    abi: recyclingSystemABI,
    functionName: 'getUserStakedAmount',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Create a pending garbage can
  const createPendingGarbageCan = useCallback(
    async (location: string, targetAmount: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(targetAmount, 6); // USDC has 6 decimals
        
        await writeContractAsync({
          address: contractAddresses.recyclingSystem as `0x${string}`,
          abi: recyclingSystemABI,
          functionName: 'createPendingGarbageCan',
          args: [location, parsedAmount],
        });

        toast.success('Pending garbage can created successfully');
        if (refetchPendingGarbageCans) {
          refetchPendingGarbageCans();
        }
      } catch (error) {
        console.error('Create pending garbage can error:', error);
        toast.error('Failed to create pending garbage can');
      }
    },
    [address, writeContractAsync, refetchPendingGarbageCans]
  );

  // Deposit stake to a pending garbage can
  const depositStake = useCallback(
    async (pendingGarbageCanId: number, amount: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(amount, 6); // USDC has 6 decimals
        
        await writeContractAsync({
          address: contractAddresses.recyclingSystem as `0x${string}`,
          abi: recyclingSystemABI,
          functionName: 'depositStake',
          args: [BigInt(pendingGarbageCanId), parsedAmount],
        });

        toast.success('Stake deposited successfully');
        if (refetchPendingGarbageCans) {
          refetchPendingGarbageCans();
        }
        if (refetchSystemStats) {
          refetchSystemStats();
        }
      } catch (error) {
        console.error('Deposit stake error:', error);
        toast.error('Failed to deposit stake');
      }
    },
    [address, writeContractAsync, refetchPendingGarbageCans, refetchSystemStats]
  );

  // Deploy a garbage can
  const deployGarbageCan = useCallback(
    async (pendingGarbageCanId: number) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.recyclingSystem as `0x${string}`,
          abi: recyclingSystemABI,
          functionName: 'deployGarbageCan',
          args: [BigInt(pendingGarbageCanId)],
        });

        toast.success('Garbage can deployed successfully');
        if (refetchActiveGarbageCans) {
          refetchActiveGarbageCans();
        }
        if (refetchPendingGarbageCans) {
          refetchPendingGarbageCans();
        }
        if (refetchSystemStats) {
          refetchSystemStats();
        }
      } catch (error) {
        console.error('Deploy garbage can error:', error);
        toast.error('Failed to deploy garbage can');
      }
    },
    [address, writeContractAsync, refetchActiveGarbageCans, refetchPendingGarbageCans, refetchSystemStats]
  );

  // Update fill level of a garbage can
  const updateFillLevel = useCallback(
    async (garbageCanId: number, recyclableType: number, amount: string, value: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(amount, 18); // Weight in kg with 18 decimals
        const parsedValue = parseUnits(value, 6); // USDC value with 6 decimals
        
        await writeContractAsync({
          address: contractAddresses.recyclingSystem as `0x${string}`,
          abi: recyclingSystemABI,
          functionName: 'updateFillLevel',
          args: [BigInt(garbageCanId), recyclableType, parsedAmount, parsedValue],
        });

        toast.success('Fill level updated successfully');
        if (refetchActiveGarbageCans) {
          refetchActiveGarbageCans();
        }
        if (refetchSystemStats) {
          refetchSystemStats();
        }
      } catch (error) {
        console.error('Update fill level error:', error);
        toast.error('Failed to update fill level');
      }
    },
    [address, writeContractAsync, refetchActiveGarbageCans, refetchSystemStats]
  );

  // Buy contents of a garbage can
  const buyContents = useCallback(
    async (garbageCanId: number) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.recyclingSystem as `0x${string}`,
          abi: recyclingSystemABI,
          functionName: 'buyContents',
          args: [BigInt(garbageCanId)],
        });

        toast.success('Contents purchased successfully');
        if (refetchActiveGarbageCans) {
          refetchActiveGarbageCans();
        }
        if (refetchSystemStats) {
          refetchSystemStats();
        }
      } catch (error) {
        console.error('Buy contents error:', error);
        toast.error('Failed to buy contents');
      }
    },
    [address, writeContractAsync, refetchActiveGarbageCans, refetchSystemStats]
  );

  return {
    // Read data
    activeGarbageCans,
    pendingGarbageCans,
    systemStats,
    userRecycledWeight,
    userRecyclingCount,
    userStakedAmount,
    
    // Loading states
    isActiveGarbageCansLoading,
    isPendingGarbageCansLoading,
    isSystemStatsLoading,
    isUserRecycledWeightLoading,
    isUserRecyclingCountLoading,
    isUserStakedAmountLoading,
    isWritePending,
    
    // Write functions
    createPendingGarbageCan,
    depositStake,
    deployGarbageCan,
    updateFillLevel,
    buyContents,
    
    // Refetch functions
    refetchActiveGarbageCans,
    refetchPendingGarbageCans,
    refetchSystemStats,
  };
};
