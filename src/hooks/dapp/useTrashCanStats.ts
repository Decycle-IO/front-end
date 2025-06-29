import { useState, useEffect } from 'react';

// Types for system stats
interface SystemStats {
  totalCans: number;
  totalWaste: number; // in grams
  activeCollectors: number;
  totalStaked: number; // in USD cents
}

// Types for user stats
interface UserStats {
  totalCollected: number;
  totalEarned: number;
  activeCans: number;
  achievements: number;
}

// Return type for the hook
interface UseTrashCanStatsReturn {
  systemStats: SystemStats;
  userStats: UserStats;
  isLoading: boolean;
}

// Mock data for system stats
const mockSystemStats: SystemStats = {
  totalCans: 1245,
  totalWaste: 3750000, // 3,750 kg
  activeCollectors: 328,
  totalStaked: 24589000, // $245,890
};

// Mock data for user stats
const mockUserStats: UserStats = {
  totalCollected: 37,
  totalEarned: 1245,
  activeCans: 2,
  achievements: 8,
};

/**
 * Hook for fetching trash can system and user statistics
 */
export const useTrashCanStats = (): UseTrashCanStatsReturn => {
  const [systemStats, setSystemStats] = useState<SystemStats>(mockSystemStats);
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async (): Promise<void> => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setSystemStats(mockSystemStats);
        setUserStats(mockUserStats);
      } catch (error) {
        console.error('Error fetching trash can stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStats();
  }, []);

  return {
    systemStats,
    userStats,
    isLoading
  };
};
