// Contract types for the Gamified Recycling System

export interface GarbageCan {
  id: number;
  location: string;
  currentValue: bigint;
  isActive: boolean;
  isLocked: boolean;
  deploymentTimestamp: number;
  lastEmptiedTimestamp: number;
  totalStaked: bigint;
  fillLevels: {
    plastic: bigint;
    metal: bigint;
    other: bigint;
  };
}

export interface PendingGarbageCan {
  id: number;
  location: string;
  targetAmount: bigint;
  currentAmount: bigint;
  isDeployed: boolean;
}

export interface StakeNFT {
  tokenId: number;
  garbageCanId: number;
  stakedAmount: bigint;
  sharePercentage: number;
  stakingTimestamp: number;
  pendingRewards: bigint;
  owner: string;
}

export interface Quest {
  id: number;
  type: QuestType;
  name: string;
  description: string;
  requiredAmount: bigint;
  rewardAmount: bigint;
  nftReward: boolean;
  nftURI: string;
  isActive: boolean;
  creationTimestamp: number;
}

export interface QuestProgress {
  questId: number;
  currentAmount: bigint;
  requiredAmount: bigint;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface Achievement {
  tokenId: number;
  questId: number;
  achievementType: string;
  metadata: string;
  earnedTimestamp: number;
  owner: string;
}

export const QuestType = {
  FIRST_RECYCLER: 0,
  WEEKLY_WARRIOR: 1,
  EARTH_CHAMPION: 2,
  MATERIAL_MASTER: 3,
  CUSTOM: 4
} as const;

export type QuestType = typeof QuestType[keyof typeof QuestType];

export const RecyclableType = {
  PLASTIC: 0,
  METAL: 1,
  OTHER: 2
} as const;

export type RecyclableType = typeof RecyclableType[keyof typeof RecyclableType];

export interface UserStats {
  totalRecycled: bigint;
  recyclingCount: number;
  totalStaked: bigint;
  stakeDuration: number;
  completedQuests: number;
  achievements: number;
  trashTokenBalance: bigint;
}

export interface SystemStats {
  totalGarbageCans: number;
  totalPendingGarbageCans: number;
  totalRecycled: bigint;
  totalStaked: bigint;
  totalUsers: number;
  totalQuests: number;
}
