import { useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { contractAddresses, questSystemABI } from '../config/contracts';
import { parseUnits } from 'viem';
import toast from 'react-hot-toast';
import type { QuestType } from '../types/contracts';

export const useQuestSystem = () => {
  const { address } = useAccount();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Get all active quests
  const { data: activeQuests, isLoading: isActiveQuestsLoading, refetch: refetchActiveQuests } = useReadContract({
    address: contractAddresses.questSystem as `0x${string}`,
    abi: questSystemABI,
    functionName: 'getAllActiveQuests',
  });

  // Get quests by type data
  const { data: questsByTypeData } = useReadContract({
    address: contractAddresses.questSystem as `0x${string}`,
    abi: questSystemABI,
    functionName: 'getQuestsByType',
    args: [0], // Default value
  });

  // Check if a quest is completed data
  const { data: questCompletedData } = useReadContract({
    address: contractAddresses.questSystem as `0x${string}`,
    abi: questSystemABI,
    functionName: 'isQuestCompleted',
    args: address ? [address as `0x${string}`, BigInt(0)] : undefined, // Default value
  });

  // Get quests by type
  const getQuestsByType = useCallback(() => {
    // This is a mock implementation that would need to be replaced with a proper implementation
    // that doesn't call hooks inside a callback
    return { 
      quests: questsByTypeData, 
      isLoading: false 
    };
  }, [questsByTypeData]);

  // Check if a quest is completed
  const isQuestCompleted = useCallback(() => {
    // This is a mock implementation that would need to be replaced with a proper implementation
    // that doesn't call hooks inside a callback
    return { 
      isCompleted: questCompletedData, 
      isLoading: false 
    };
  }, [questCompletedData]);

  // Get verified email hash
  const { data: verifiedEmail, isLoading: isVerifiedEmailLoading } = useReadContract({
    address: contractAddresses.questSystem as `0x${string}`,
    abi: questSystemABI,
    functionName: 'getVerifiedEmail',
    args: address ? [] : undefined,
  });

  // Create a new quest
  const createQuest = useCallback(
    async (
      questType: QuestType,
      name: string,
      description: string,
      requiredAmount: string,
      rewardAmount: string,
      nftReward: boolean,
      nftURI: string
    ) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedRequiredAmount = parseUnits(requiredAmount, 18);
        const parsedRewardAmount = parseUnits(rewardAmount, 18);
        
        await writeContractAsync({
          address: contractAddresses.questSystem as `0x${string}`,
          abi: questSystemABI,
          functionName: 'createQuest',
          args: [
            questType,
            name,
            description,
            parsedRequiredAmount,
            parsedRewardAmount,
            nftReward,
            nftURI,
          ],
        });

        toast.success('Quest created successfully');
        if (refetchActiveQuests) {
          refetchActiveQuests();
        }
      } catch (error) {
        console.error('Create quest error:', error);
        toast.error('Failed to create quest');
      }
    },
    [address, writeContractAsync, refetchActiveQuests]
  );

  // Record recycling activity
  const recordRecycling = useCallback(
    async (emailHash: string, materialType: number, amount: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        const parsedAmount = parseUnits(amount, 18);
        
        await writeContractAsync({
          address: contractAddresses.questSystem as `0x${string}`,
          abi: questSystemABI,
          functionName: 'recordRecycling',
          args: [emailHash as `0x${string}`, materialType, parsedAmount],
        });

        toast.success('Recycling recorded successfully');
      } catch (error) {
        console.error('Record recycling error:', error);
        toast.error('Failed to record recycling');
      }
    },
    [address, writeContractAsync]
  );

  // Verify email
  const verifyEmail = useCallback(
    async (emailHash: string, proof: string) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.questSystem as `0x${string}`,
          abi: questSystemABI,
          functionName: 'verifyEmail',
          args: [emailHash as `0x${string}`, proof as `0x${string}`],
        });

        toast.success('Email verified successfully');
      } catch (error) {
        console.error('Verify email error:', error);
        toast.error('Failed to verify email');
      }
    },
    [address, writeContractAsync]
  );

  // Claim rewards for a completed quest
  const claimRewards = useCallback(
    async (questType: QuestType, questId: number) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      try {
        await writeContractAsync({
          address: contractAddresses.questSystem as `0x${string}`,
          abi: questSystemABI,
          functionName: 'claimRewards',
          args: [questType, BigInt(questId)],
        });

        toast.success('Rewards claimed successfully');
      } catch (error) {
        console.error('Claim rewards error:', error);
        toast.error('Failed to claim rewards');
      }
    },
    [address, writeContractAsync]
  );

  return {
    // Read data
    activeQuests,
    verifiedEmail,
    
    // Loading states
    isActiveQuestsLoading,
    isVerifiedEmailLoading,
    isWritePending,
    
    // Helper functions
    getQuestsByType,
    isQuestCompleted,
    
    // Write functions
    createQuest,
    recordRecycling,
    verifyEmail,
    claimRewards,
    
    // Refetch functions
    refetchActiveQuests,
  };
};
