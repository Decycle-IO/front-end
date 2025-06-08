import { useTrashToken } from './useTrashToken';
import { useRecyclingSystem } from './useRecyclingSystem';
import { useQuestSystem } from './useQuestSystem';
import { useStakeNFT } from './useStakeNFT';
import { useAchievementNFT } from './useAchievementNFT';
import { useEmailVerifier } from './useEmailVerifier';
import { useAccount } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import type { UserStats, SystemStats } from '../types/contracts';

// Mock data for development
const MOCK_USER_STATS: UserStats = {
  totalRecycled: BigInt(1250000000000000000000), // 1,250 kg (with 18 decimals)
  recyclingCount: 47,
  totalStaked: BigInt(500000000), // 500 USDC (with 6 decimals)
  stakeDuration: 30, // 30 days
  completedQuests: 8,
  achievements: 5,
  trashTokenBalance: BigInt(7500000000000000000000), // 7,500 TRASH tokens (with 18 decimals)
};

const MOCK_SYSTEM_STATS: SystemStats = {
  totalGarbageCans: 24,
  totalPendingGarbageCans: 7,
  totalRecycled: BigInt(75000000000000000000000), // 75,000 kg (with 18 decimals)
  totalStaked: BigInt(125000000000), // 125,000 USDC (with 6 decimals)
  totalUsers: 352,
  totalQuests: 12,
};

// Flag to use mock data (set to true for development)
const USE_MOCK_DATA = true;

export const useContracts = () => {
  const { address, isConnected } = useAccount();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize all contract hooks
  const trashToken = useTrashToken();
  const recyclingSystem = useRecyclingSystem();
  const questSystem = useQuestSystem();
  const stakeNFT = useStakeNFT();
  const achievementNFT = useAchievementNFT();
  const emailVerifier = useEmailVerifier();

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    if (!address || !isConnected) return;

    setIsLoading(true);
    try {
      // Use mock data if flag is set
      if (USE_MOCK_DATA) {
        // Add a small delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        setUserStats(MOCK_USER_STATS);
        return;
      }
      
      // Fetch data from various contracts
      const trashTokenBalance = trashToken.balance;
      const userRecycledWeight = recyclingSystem.userRecycledWeight;
      const userRecyclingCount = recyclingSystem.userRecyclingCount;
      const userStakedAmount = recyclingSystem.userStakedAmount;
      
      // Combine data into user stats
      if (trashTokenBalance && userRecycledWeight && userRecyclingCount && userStakedAmount) {
        const stats: UserStats = {
          totalRecycled: userRecycledWeight as bigint,
          recyclingCount: Number(userRecyclingCount),
          totalStaked: userStakedAmount as bigint,
          stakeDuration: 0, // This would need to be calculated from stake timestamps
          completedQuests: 0, // This would need to be fetched from quest system
          achievements: 0, // This would need to be calculated from achievements
          trashTokenBalance: trashTokenBalance as bigint,
        };
        
        setUserStats(stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [
    address,
    isConnected,
    trashToken.balance,
    recyclingSystem.userRecycledWeight,
    recyclingSystem.userRecyclingCount,
    recyclingSystem.userStakedAmount,
  ]);

  // Fetch system stats
  const fetchSystemStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use mock data if flag is set
      if (USE_MOCK_DATA) {
        // Add a small delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        setSystemStats(MOCK_SYSTEM_STATS);
        return;
      }
      
      const stats = recyclingSystem.systemStats;
      if (stats) {
        setSystemStats(stats as SystemStats);
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recyclingSystem.systemStats]);

  // Fetch all stats when address changes or when refetch is triggered
  useEffect(() => {
    if (isConnected) {
      fetchUserStats();
      fetchSystemStats();
    } else {
      setUserStats(null);
    }
  }, [isConnected, fetchUserStats, fetchSystemStats]);

  // Refetch all data
  const refetchAll = useCallback(() => {
    if (isConnected) {
      // When using mock data, we only need to call these two functions
      // The individual refetch methods are commented out to avoid TypeScript errors
      // since we're using mock data and don't need to call the actual contract methods
      /*
      trashToken.refetchBalance?.();
      recyclingSystem.refetchActiveGarbageCans?.();
      recyclingSystem.refetchPendingGarbageCans?.();
      recyclingSystem.refetchSystemStats?.();
      questSystem.refetchActiveQuests?.();
      stakeNFT.refetchUserStakeNFTs?.();
      achievementNFT.refetchUserAchievements?.();
      */
      fetchUserStats();
      fetchSystemStats();
    }
  }, [
    isConnected,
    trashToken,
    recyclingSystem,
    questSystem,
    stakeNFT,
    achievementNFT,
    fetchUserStats,
    fetchSystemStats,
  ]);

  return {
    // Combined stats
    userStats,
    systemStats,
    isLoading,
    
    // Individual contract hooks
    trashToken,
    recyclingSystem,
    questSystem,
    stakeNFT,
    achievementNFT,
    emailVerifier,
    
    // Refetch function
    refetchAll,
  };
};
