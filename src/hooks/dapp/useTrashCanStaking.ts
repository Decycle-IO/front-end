import { useState, useEffect } from 'react';

// Types for staking position
export interface StakingPosition {
  id: number;
  canId: number;
  location: string;
  amount: number; // in USDC
  startDate: string; // ISO date string
  endDate: string | null; // ISO date string, null if still active
  apr: number; // percentage
  rewards: number; // in TRASH tokens
}

// Types for staking opportunity
export interface StakingOpportunity {
  canId: number;
  location: string;
  minStake: number; // in USDC
  maxStake: number; // in USDC
  apr: number; // percentage
  duration: number; // in days
  totalStaked: number; // in USDC
  stakersCount: number;
}

// Return type for the hook
interface UseTrashCanStakingReturn {
  stakingPositions: StakingPosition[];
  stakingOpportunities: StakingOpportunity[];
  isLoading: boolean;
  createStake: (canId: number, amount: number) => Promise<boolean>;
  withdrawStake: (positionId: number) => Promise<boolean>;
}

// Mock data for staking positions
const mockStakingPositions: StakingPosition[] = [
  {
    id: 1,
    canId: 2,
    location: 'Times Square, NYC',
    amount: 100,
    startDate: '2025-05-20T14:30:00Z',
    endDate: null,
    apr: 12.5,
    rewards: 5.2
  },
  {
    id: 2,
    canId: 5,
    location: 'High Line, NYC',
    amount: 250,
    startDate: '2025-06-01T09:15:00Z',
    endDate: null,
    apr: 10.8,
    rewards: 7.8
  },
  {
    id: 3,
    canId: 8,
    location: 'Madison Square Park, NYC',
    amount: 150,
    startDate: '2025-04-15T11:45:00Z',
    endDate: '2025-06-15T11:45:00Z',
    apr: 11.2,
    rewards: 25.6
  }
];

// Mock data for staking opportunities
const mockStakingOpportunities: StakingOpportunity[] = [
  {
    canId: 1,
    location: 'Central Park, NYC',
    minStake: 50,
    maxStake: 500,
    apr: 14.2,
    duration: 30,
    totalStaked: 2500,
    stakersCount: 8
  },
  {
    canId: 3,
    location: 'Brooklyn Bridge, NYC',
    minStake: 100,
    maxStake: 1000,
    apr: 12.8,
    duration: 60,
    totalStaked: 5800,
    stakersCount: 12
  },
  {
    canId: 4,
    location: 'Battery Park, NYC',
    minStake: 75,
    maxStake: 750,
    apr: 11.5,
    duration: 45,
    totalStaked: 3200,
    stakersCount: 6
  },
  {
    canId: 6,
    location: 'Washington Square Park, NYC',
    minStake: 50,
    maxStake: 500,
    apr: 13.5,
    duration: 30,
    totalStaked: 1800,
    stakersCount: 5
  },
  {
    canId: 7,
    location: 'Union Square, NYC',
    minStake: 100,
    maxStake: 800,
    apr: 12.0,
    duration: 60,
    totalStaked: 4200,
    stakersCount: 9
  }
];

/**
 * Hook for fetching and interacting with staking positions and opportunities
 */
export const useTrashCanStaking = (): UseTrashCanStakingReturn => {
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
  const [stakingOpportunities, setStakingOpportunities] = useState<StakingOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    const fetchStakingData = async (): Promise<void> => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStakingPositions(mockStakingPositions);
        setStakingOpportunities(mockStakingOpportunities);
      } catch (error) {
        console.error('Error fetching staking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStakingData();
  }, []);

  /**
   * Create a new stake for a specific trash can
   * @param canId The ID of the trash can to stake on
   * @param amount The amount of USDC to stake
   * @returns Promise resolving to a boolean indicating success
   */
  const createStake = async (canId: number, amount: number): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find the opportunity
      const opportunity = stakingOpportunities.find(opp => opp.canId === canId);
      if (!opportunity) return false;
      
      // Create a new staking position
      const newPosition: StakingPosition = {
        id: stakingPositions.length + 1,
        canId,
        location: opportunity.location,
        amount,
        startDate: new Date().toISOString(),
        endDate: null,
        apr: opportunity.apr,
        rewards: 0
      };
      
      // Update the local state
      setStakingPositions(prev => [...prev, newPosition]);
      
      // Update the opportunity
      setStakingOpportunities(prev => 
        prev.map(opp => 
          opp.canId === canId 
            ? { 
                ...opp, 
                totalStaked: opp.totalStaked + amount,
                stakersCount: opp.stakersCount + 1
              } 
            : opp
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error creating stake:', error);
      return false;
    }
  };

  /**
   * Withdraw a stake
   * @param positionId The ID of the staking position to withdraw
   * @returns Promise resolving to a boolean indicating success
   */
  const withdrawStake = async (positionId: number): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find the position
      const position = stakingPositions.find(pos => pos.id === positionId);
      if (!position || position.endDate) return false;
      
      // Update the position
      setStakingPositions(prev => 
        prev.map(pos => 
          pos.id === positionId 
            ? { 
                ...pos, 
                endDate: new Date().toISOString() 
              } 
            : pos
        )
      );
      
      // Update the opportunity
      setStakingOpportunities(prev => 
        prev.map(opp => 
          opp.canId === position.canId 
            ? { 
                ...opp, 
                totalStaked: Math.max(0, opp.totalStaked - position.amount),
                stakersCount: Math.max(0, opp.stakersCount - 1)
              } 
            : opp
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error withdrawing stake:', error);
      return false;
    }
  };

  return {
    stakingPositions,
    stakingOpportunities,
    isLoading,
    createStake,
    withdrawStake
  };
};
