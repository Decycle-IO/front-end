import React from 'react';
import type { 
  GameStats, 
  FounderProfile, 
  LeaderboardEntry, 
  BinState, 
  ActivityItem,
  UserStats
} from '../../hooks/cannes/useCannesGame';
import {
  EventPhaseBanner,
  GreenGuardiansDisplay,
  LeaderboardDisplay,
  LiveEventBinStatus,
  MissionImpactSection,
  PreEventDonationForm,
  RecentActivityFeed
} from './dashboard';

interface GameDashboardProps {
  gameStats: GameStats;
  founders: FounderProfile[];
  leaderboard: LeaderboardEntry[];
  currentBin: BinState;
  recentActivity: ActivityItem[];
  currentUser: UserStats | null;
  isLoading: boolean;
  onDonate: (amount: number, displayName: string, imageUrl: string) => Promise<boolean>;
  onPurchaseBin: () => Promise<boolean>;
}

const GameDashboard: React.FC<GameDashboardProps> = ({
  gameStats,
  founders,
  leaderboard,
  currentBin,
  recentActivity,
  currentUser,
  isLoading,
  onDonate,
  onPurchaseBin,
}) => {
  // Format ETH amount with 2 decimal places
  const formatEth = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Event Phase Banner */}
      <div className="mb-8">
        <EventPhaseBanner 
          gameStats={gameStats} 
          foundersCount={founders.length}
          formatEth={formatEth} 
        />
      </div>

      {/* Main Content - Different based on event phase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Donation Form or Bin Status */}
        <div className="lg:col-span-1">
          {gameStats.eventPhase === 'PRE_EVENT' ? (
            <PreEventDonationForm onDonate={onDonate} isLoading={isLoading} />
          ) : (
            <LiveEventBinStatus 
              currentBin={currentBin} 
              onPurchaseBin={onPurchaseBin} 
              isLoading={isLoading} 
            />
          )}
        </div>
        
        {/* Middle Column - Green Guardians or Leaderboard */}
        <div className="lg:col-span-1">
          {gameStats.eventPhase === 'PRE_EVENT' ? (
            <GreenGuardiansDisplay founders={founders} />
          ) : (
            <LeaderboardDisplay leaderboard={leaderboard} currentUser={currentUser} />
          )}
        </div>
        
        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivityFeed activities={recentActivity} />
        </div>
      </div>
      
      {/* Mission & Impact Section - Only shown during PRE_EVENT phase */}
      {gameStats.eventPhase === 'PRE_EVENT' && (
        <div className="mt-8">
          <MissionImpactSection />
        </div>
      )}
    </div>
  );
};

export default GameDashboard;
