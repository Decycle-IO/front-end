import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddresses, achievementNFTABI } from '../config/contracts';
import toast from 'react-hot-toast';

export const useAchievementNFT = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Get user's achievements
  const { data: userAchievements, isLoading: isUserAchievementsLoading, refetch: refetchUserAchievements } = useReadContract({
    address: contractAddresses.achievementNFT as `0x${string}`,
    abi: achievementNFTABI,
    functionName: 'getTokensByOwner',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Get achievements by quest data
  const { data: achievementsByQuestData } = useReadContract({
    address: contractAddresses.achievementNFT as `0x${string}`,
    abi: achievementNFTABI,
    functionName: 'getTokensByQuest',
    args: [BigInt(0)], // Default value
  });

  // Get achievement info data
  const { data: achievementInfoData } = useReadContract({
    address: contractAddresses.achievementNFT as `0x${string}`,
    abi: achievementNFTABI,
    functionName: 'getAchievementInfo',
    args: [BigInt(0)], // Default value
  });

  // Get achievements by quest
  const getAchievementsByQuest = useCallback(() => {
    // This is a mock implementation that would need to be replaced with a proper implementation
    // that doesn't call hooks inside a callback
    return { 
      achievements: achievementsByQuestData, 
      isLoading: false 
    };
  }, [achievementsByQuestData]);

  // Get achievement info
  const getAchievementInfo = useCallback(() => {
    // This is a mock implementation that would need to be replaced with a proper implementation
    // that doesn't call hooks inside a callback
    return { 
      achievement: achievementInfoData, 
      isLoading: false 
    };
  }, [achievementInfoData]);

  // Mint an achievement NFT (typically called by the QuestSystem contract)
  const mintAchievement = useCallback(
    async (to: string, questId: number, achievementType: string, metadata: string, tokenURI: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.achievementNFT as `0x${string}`,
          abi: achievementNFTABI,
          functionName: 'mintAchievement',
          args: [to as `0x${string}`, BigInt(questId), achievementType, metadata, tokenURI],
        });

        toast.success('Achievement minted successfully');
        if (refetchUserAchievements) {
          refetchUserAchievements();
        }
      } catch (error) {
        console.error('Mint achievement error:', error);
        toast.error('Failed to mint achievement');
      }
    },
    [address, writeContractAsync, refetchUserAchievements]
  );

  return {
    // Read data
    userAchievements,
    
    // Loading states
    isUserAchievementsLoading,
    isWritePending,
    
    // Helper functions
    getAchievementsByQuest,
    getAchievementInfo,
    
    // Write functions
    mintAchievement,
    
    // Refetch functions
    refetchUserAchievements,
  };
};
