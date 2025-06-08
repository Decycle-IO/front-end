import { useState, useEffect } from 'react';

// Types for the Cannes game
export type RecyclableType = 'METAL' | 'PLASTIC';

export interface FounderProfile {
  address: string;
  displayName: string;
  imageUrl: string;
  donationAmount: number; // in ETH
  donationTime: number; // timestamp
  hasGuardianAchievement: boolean;
}

export interface UserStats {
  address: string;
  totalPoints: number;
  metalCount: number;
  plasticCount: number;
  tokensEarned: number;
  binsPurchased: number;
  lastActivity: number; // timestamp
  achievements: string[]; // achievement IDs
}

export interface BinState {
  id: number;
  metalCount: number;
  plasticCount: number;
  totalValue: number;
  isPurchased: boolean;
  buyer: string | null;
  isVerified: boolean;
  purchaseTime: number | null; // timestamp
  verificationTime: number | null; // timestamp
  verificationCode: string | null;
}

export interface LeaderboardEntry {
  address: string;
  displayName: string;
  points: number;
  rank: number;
}

export interface ActivityItem {
  id: string;
  type: 'DEPOSIT' | 'PURCHASE' | 'VERIFICATION' | 'ACHIEVEMENT' | 'DONATION';
  address: string;
  displayName: string;
  timestamp: number;
  details: {
    itemType?: RecyclableType;
    binId?: number;
    achievementName?: string;
    donationAmount?: number;
  };
}

export interface GameStats {
  totalItems: number;
  totalMetal: number;
  totalPlastic: number;
  totalBins: number;
  totalParticipants: number;
  totalDonations: number; // in ETH
  eventPhase: 'PRE_EVENT' | 'LIVE_EVENT' | 'POST_EVENT';
  eventStart: number; // timestamp
  eventEnd: number; // timestamp
}

// Mock data
const MOCK_FOUNDERS: FounderProfile[] = [
  {
    address: '0x1234...5678',
    displayName: 'Alex Thompson',
    imageUrl: 'https://i.pravatar.cc/150?img=33',
    donationAmount: 5.5,
    donationTime: Date.now() - 86400000 * 5, // 5 days ago
    hasGuardianAchievement: true,
  },
  {
    address: '0xabcd...efgh',
    displayName: 'Sophia Chen',
    imageUrl: 'https://i.pravatar.cc/150?img=47',
    donationAmount: 3.2,
    donationTime: Date.now() - 86400000 * 3, // 3 days ago
    hasGuardianAchievement: true,
  },
  {
    address: '0x7890...1234',
    displayName: 'Marcus Johnson',
    imageUrl: 'https://i.pravatar.cc/150?img=15',
    donationAmount: 2.1,
    donationTime: Date.now() - 86400000 * 2, // 2 days ago
    hasGuardianAchievement: true,
  },
  {
    address: '0xdef0...5678',
    displayName: 'Elena Rodriguez',
    imageUrl: 'https://i.pravatar.cc/150?img=25',
    donationAmount: 1.8,
    donationTime: Date.now() - 86400000 * 1, // 1 day ago
    hasGuardianAchievement: true,
  },
  {
    address: '0x5678...9abc',
    displayName: 'David Park',
    imageUrl: 'https://i.pravatar.cc/150?img=11',
    donationAmount: 0.8,
    donationTime: Date.now() - 3600000 * 12, // 12 hours ago
    hasGuardianAchievement: false,
  },
  {
    address: '0x9abc...def0',
    displayName: 'Jamie Wilson',
    imageUrl: 'https://i.pravatar.cc/150?img=12',
    donationAmount: 0.5,
    donationTime: Date.now() - 3600000 * 6, // 6 hours ago
    hasGuardianAchievement: false,
  },
];

const MOCK_USERS: UserStats[] = [
  {
    address: '0x1234...5678',
    totalPoints: 450,
    metalCount: 25,
    plasticCount: 20,
    tokensEarned: 225,
    binsPurchased: 2,
    lastActivity: Date.now() - 3600000, // 1 hour ago
    achievements: ['FIRST_DROP', 'METAL_RECYCLER', 'REGULAR', 'COMMITTED'],
  },
  {
    address: '0xabcd...efgh',
    totalPoints: 380,
    metalCount: 18,
    plasticCount: 22,
    tokensEarned: 190,
    binsPurchased: 1,
    lastActivity: Date.now() - 7200000, // 2 hours ago
    achievements: ['FIRST_DROP', 'PLASTIC_RECYCLER', 'REGULAR'],
  },
  {
    address: '0x7890...1234',
    totalPoints: 320,
    metalCount: 15,
    plasticCount: 17,
    tokensEarned: 160,
    binsPurchased: 1,
    lastActivity: Date.now() - 10800000, // 3 hours ago
    achievements: ['FIRST_DROP', 'METAL_RECYCLER', 'PLASTIC_RECYCLER'],
  },
  {
    address: '0xdef0...5678',
    totalPoints: 280,
    metalCount: 12,
    plasticCount: 16,
    tokensEarned: 140,
    binsPurchased: 0,
    lastActivity: Date.now() - 14400000, // 4 hours ago
    achievements: ['FIRST_DROP', 'PLASTIC_RECYCLER'],
  },
  {
    address: '0x5678...9abc',
    totalPoints: 220,
    metalCount: 10,
    plasticCount: 12,
    tokensEarned: 110,
    binsPurchased: 0,
    lastActivity: Date.now() - 18000000, // 5 hours ago
    achievements: ['FIRST_DROP'],
  },
];

const MOCK_CURRENT_BIN: BinState = {
  id: 5,
  metalCount: 8,
  plasticCount: 12,
  totalValue: 20,
  isPurchased: false,
  buyer: null,
  isVerified: false,
  purchaseTime: null,
  verificationTime: null,
  verificationCode: null,
};

const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    type: 'DEPOSIT',
    address: '0x1234...5678',
    displayName: 'Alex Thompson',
    timestamp: Date.now() - 300000, // 5 minutes ago
    details: {
      itemType: 'METAL',
    },
  },
  {
    id: '2',
    type: 'DEPOSIT',
    address: '0xabcd...efgh',
    displayName: 'Sophia Chen',
    timestamp: Date.now() - 600000, // 10 minutes ago
    details: {
      itemType: 'PLASTIC',
    },
  },
  {
    id: '3',
    type: 'ACHIEVEMENT',
    address: '0x1234...5678',
    displayName: 'Alex Thompson',
    timestamp: Date.now() - 900000, // 15 minutes ago
    details: {
      achievementName: 'COMMITTED',
    },
  },
  {
    id: '4',
    type: 'PURCHASE',
    address: '0x7890...1234',
    displayName: 'Marcus Johnson',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    details: {
      binId: 4,
    },
  },
  {
    id: '5',
    type: 'VERIFICATION',
    address: '0x7890...1234',
    displayName: 'Marcus Johnson',
    timestamp: Date.now() - 2700000, // 45 minutes ago
    details: {
      binId: 4,
    },
  },
  {
    id: '6',
    type: 'DONATION',
    address: '0x9abc...def0',
    displayName: 'Jamie Wilson',
    timestamp: Date.now() - 3600000 * 6, // 6 hours ago
    details: {
      donationAmount: 0.5,
    },
  },
];

const MOCK_GAME_STATS: GameStats = {
  totalItems: 155,
  totalMetal: 80,
  totalPlastic: 75,
  totalBins: 4,
  totalParticipants: 12,
  totalDonations: 13.9, // in ETH
  eventPhase: 'PRE_EVENT',
  eventStart: new Date(2025, 6, 4, 10, 0, 0).getTime(), // July 4th, 2025 at 10:00 AM
  eventEnd: new Date(2025, 6, 6, 19, 0, 0).getTime(), // July 6th, 2025 at 7:00 PM
};

// Main hook for Cannes game
export const useCannesGame = () => {
  const [founders, setFounders] = useState<FounderProfile[]>(MOCK_FOUNDERS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentBin, setCurrentBin] = useState<BinState>(MOCK_CURRENT_BIN);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>(MOCK_RECENT_ACTIVITY);
  const [gameStats, setGameStats] = useState<GameStats>(MOCK_GAME_STATS);
  const [currentUser, setCurrentUser] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize leaderboard from users
  useEffect(() => {
    const sortedUsers = [...MOCK_USERS].sort((a, b) => b.totalPoints - a.totalPoints);
    const leaderboardData = sortedUsers.map((user, index) => {
      const founder = MOCK_FOUNDERS.find(f => f.address === user.address);
      return {
        address: user.address,
        displayName: founder?.displayName || `User ${user.address.substring(0, 6)}`,
        points: user.totalPoints,
        rank: index + 1,
      };
    });
    setLeaderboard(leaderboardData);
  }, []);

  // Simulate getting current user
  useEffect(() => {
    // For demo, just use the first user
    setCurrentUser(MOCK_USERS[0]);
  }, []);

  // Helper function to get a random avatar URL
  const getRandomAvatarUrl = () => {
    // Use Pravatar for random avatars
    const randomId = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${randomId}`;
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new activity item occasionally
      if (Math.random() > 0.7) {
        // Generate a random name
        const firstNames = ['Emma', 'Noah', 'Olivia', 'Liam', 'Ava', 'William', 'Sophia', 'Mason', 'Isabella', 'James', 'Mia', 'Benjamin', 'Charlotte', 'Jacob', 'Amelia'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
        
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomName = `${randomFirstName} ${randomLastName}`;
        
        const newActivity: ActivityItem = {
          id: `new-${Date.now()}`,
          type: Math.random() > 0.5 ? 'DEPOSIT' : 'ACHIEVEMENT',
          address: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].address,
          displayName: randomName,
          timestamp: Date.now(),
          details: {
            itemType: Math.random() > 0.5 ? 'METAL' : 'PLASTIC',
            achievementName: Math.random() > 0.5 ? 'REGULAR' : 'METAL_SPECIALIST',
          },
        };
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
        
        // Update bin count if it's a deposit
        if (newActivity.type === 'DEPOSIT') {
          setCurrentBin(prev => ({
            ...prev,
            metalCount: newActivity.details.itemType === 'METAL' ? prev.metalCount + 1 : prev.metalCount,
            plasticCount: newActivity.details.itemType === 'PLASTIC' ? prev.plasticCount + 1 : prev.plasticCount,
            totalValue: prev.totalValue + 1,
          }));
          
          // Update game stats
          setGameStats(prev => ({
            ...prev,
            totalItems: prev.totalItems + 1,
            totalMetal: newActivity.details.itemType === 'METAL' ? prev.totalMetal + 1 : prev.totalMetal,
            totalPlastic: newActivity.details.itemType === 'PLASTIC' ? prev.totalPlastic + 1 : prev.totalPlastic,
          }));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mock functions for interacting with the game

  const donate = async (amount: number, displayName: string, imageUrl: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFounder: FounderProfile = {
        address: '0xYOUR_ADDRESS',
        displayName,
        imageUrl: imageUrl || getRandomAvatarUrl(),
        donationAmount: amount,
        donationTime: Date.now(),
        hasGuardianAchievement: false,
      };
      
      setFounders(prev => [...prev, newFounder]);
      setGameStats(prev => ({
        ...prev,
        totalDonations: prev.totalDonations + amount,
      }));
      
      const newActivity: ActivityItem = {
        id: `donation-${Date.now()}`,
        type: 'DONATION',
        address: '0xYOUR_ADDRESS',
        displayName,
        timestamp: Date.now(),
        details: {
          donationAmount: amount,
        },
      };
      
      setRecentActivity(prev => [newActivity, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error donating:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseBin = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentBin(prev => ({
        ...prev,
        isPurchased: true,
        buyer: '0xYOUR_ADDRESS',
        purchaseTime: Date.now(),
        verificationCode: 'CANNES' + Math.floor(Math.random() * 10000),
      }));
      
      if (currentUser) {
        setCurrentUser(prev => prev ? {
          ...prev,
          binsPurchased: prev.binsPurchased + 1,
        } : null);
      }
      
      const newActivity: ActivityItem = {
        id: `purchase-${Date.now()}`,
        type: 'PURCHASE',
        address: '0xYOUR_ADDRESS',
        displayName: currentUser?.address.substring(0, 8) || 'You',
        timestamp: Date.now(),
        details: {
          binId: currentBin.id,
        },
      };
      
      setRecentActivity(prev => [newActivity, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error purchasing bin:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyRecycling = async (binId: number, verificationCode: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentBin.id === binId && currentBin.verificationCode === verificationCode) {
        setCurrentBin(prev => ({
          ...prev,
          isVerified: true,
          verificationTime: Date.now(),
        }));
        
        // Create a new bin
        const newBin: BinState = {
          id: currentBin.id + 1,
          metalCount: 0,
          plasticCount: 0,
          totalValue: 0,
          isPurchased: false,
          buyer: null,
          isVerified: false,
          purchaseTime: null,
          verificationTime: null,
          verificationCode: null,
        };
        
        setCurrentBin(newBin);
        
        const newActivity: ActivityItem = {
          id: `verify-${Date.now()}`,
          type: 'VERIFICATION',
          address: '0xYOUR_ADDRESS',
          displayName: currentUser?.address.substring(0, 8) || 'You',
          timestamp: Date.now(),
          details: {
            binId,
          },
        };
        
        setRecentActivity(prev => [newActivity, ...prev]);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying recycling:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    founders,
    leaderboard,
    currentBin,
    recentActivity,
    gameStats,
    currentUser,
    isLoading,
    donate,
    purchaseBin,
    verifyRecycling,
  };
};

export default useCannesGame;
