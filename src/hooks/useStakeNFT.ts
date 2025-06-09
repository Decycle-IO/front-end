import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddresses, stakeNFTABI } from '../config/contracts';
import { parseUnits } from 'viem';
import toast from 'react-hot-toast';

export const useStakeNFT = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Get user's stake NFTs
  const { data: userStakeNFTs, isLoading: isUserStakeNFTsLoading, refetch: refetchUserStakeNFTs } = useReadContract({
    address: contractAddresses.stakeNFT as `0x${string}`,
    abi: stakeNFTABI,
    functionName: 'getTokensByOwner',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Get stake NFTs by garbage can data
  const { data: stakeNFTsByGarbageCanData } = useReadContract({
    address: contractAddresses.stakeNFT as `0x${string}`,
    abi: stakeNFTABI,
    functionName: 'getTokensByGarbageCan',
    args: [BigInt(0)], // Default value
  });

  // Get stake info data
  const { data: stakeInfoData } = useReadContract({
    address: contractAddresses.stakeNFT as `0x${string}`,
    abi: stakeNFTABI,
    functionName: 'getStakeInfo',
    args: [BigInt(0)], // Default value
  });

  // Get stake NFTs by garbage can
  const getStakeNFTsByGarbageCan = useCallback(() => {
    // This is a mock implementation that would need to be replaced with a proper implementation
    // that doesn't call hooks inside a callback
    return { 
      data: stakeNFTsByGarbageCanData, 
      isLoading: false 
    };
  }, [stakeNFTsByGarbageCanData]);

  // Get stake info
  const getStakeInfo = useCallback(() => {
    // This is a mock implementation that would need to be replaced with a proper implementation
    // that doesn't call hooks inside a callback
    return { 
      data: stakeInfoData, 
      isLoading: false 
    };
  }, [stakeInfoData]);

  // Mint a stake NFT
  const mintStake = useCallback(
    async (garbageCanId: number, amount: string, sharePercentage: number) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(amount, 6); // USDC has 6 decimals
        
        await writeContractAsync({
          address: contractAddresses.stakeNFT as `0x${string}`,
          abi: stakeNFTABI,
          functionName: 'mintStake',
          args: [address as `0x${string}`, BigInt(garbageCanId), parsedAmount, sharePercentage],
        });

        toast.success('Stake minted successfully');
        if (refetchUserStakeNFTs) {
          refetchUserStakeNFTs();
        }
      } catch (error) {
        console.error('Mint stake error:', error);
        toast.error('Failed to mint stake');
      }
    },
    [address, writeContractAsync, refetchUserStakeNFTs]
  );

  // Add rewards to a stake NFT
  const addRewards = useCallback(
    async (tokenId: number, amount: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(amount, 18); // TRASH token has 18 decimals
        
        await writeContractAsync({
          address: contractAddresses.stakeNFT as `0x${string}`,
          abi: stakeNFTABI,
          functionName: 'addRewards',
          args: [BigInt(tokenId), parsedAmount],
        });

        toast.success('Rewards added successfully');
      } catch (error) {
        console.error('Add rewards error:', error);
        toast.error('Failed to add rewards');
      }
    },
    [address, writeContractAsync]
  );

  // Claim rewards from a stake NFT
  const claimRewards = useCallback(
    async (tokenId: number) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.stakeNFT as `0x${string}`,
          abi: stakeNFTABI,
          functionName: 'claimRewards',
          args: [BigInt(tokenId)],
        });

        toast.success('Rewards claimed successfully');
        if (refetchUserStakeNFTs) {
          refetchUserStakeNFTs();
        }
      } catch (error) {
        console.error('Claim rewards error:', error);
        toast.error('Failed to claim rewards');
      }
    },
    [address, writeContractAsync, refetchUserStakeNFTs]
  );

  // Split a stake NFT into multiple NFTs
  const splitStake = useCallback(
    async (tokenId: number, amounts: string[]) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmounts = amounts.map(amount => parseUnits(amount, 6));
        
        await writeContractAsync({
          address: contractAddresses.stakeNFT as `0x${string}`,
          abi: stakeNFTABI,
          functionName: 'splitStake',
          args: [BigInt(tokenId), parsedAmounts],
        });

        toast.success('Stake split successfully');
        if (refetchUserStakeNFTs) {
          refetchUserStakeNFTs();
        }
      } catch (error) {
        console.error('Split stake error:', error);
        toast.error('Failed to split stake');
      }
    },
    [address, writeContractAsync, refetchUserStakeNFTs]
  );

  // Merge multiple stake NFTs into one
  const mergeStakes = useCallback(
    async (tokenIds: number[]) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedTokenIds = tokenIds.map(id => BigInt(id));
        
        await writeContractAsync({
          address: contractAddresses.stakeNFT as `0x${string}`,
          abi: stakeNFTABI,
          functionName: 'mergeStakes',
          args: [parsedTokenIds],
        });

        toast.success('Stakes merged successfully');
        if (refetchUserStakeNFTs) {
          refetchUserStakeNFTs();
        }
      } catch (error) {
        console.error('Merge stakes error:', error);
        toast.error('Failed to merge stakes');
      }
    },
    [address, writeContractAsync, refetchUserStakeNFTs]
  );

  return {
    // Read data
    userStakeNFTs,
    
    // Loading states
    isUserStakeNFTsLoading,
    isWritePending,
    
    // Helper functions
    getStakeNFTsByGarbageCan,
    getStakeInfo,
    
    // Write functions
    mintStake,
    addRewards,
    claimRewards,
    splitStake,
    mergeStakes,
    
    // Refetch functions
    refetchUserStakeNFTs,
  };
};
