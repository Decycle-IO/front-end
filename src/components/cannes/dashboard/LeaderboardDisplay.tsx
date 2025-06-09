import React from 'react';
import { motion } from 'framer-motion';
import type { LeaderboardEntry, UserStats } from '../../../hooks/cannes/useCannesGame';

interface LeaderboardDisplayProps {
  leaderboard: LeaderboardEntry[];
  currentUser: UserStats | null;
}

const LeaderboardDisplay: React.FC<LeaderboardDisplayProps> = ({ leaderboard, currentUser }) => {
  // Generate a random avatar URL for users
  const getAvatarUrl = (address: string) => {
    // Use the address as a seed to get a consistent avatar for the same user
    const seed = parseInt(address.substring(2, 10), 16) % 70 || 1;
    return `https://i.pravatar.cc/150?img=${seed}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-forest mb-4">Leaderboard</h2>
        
        <div className="space-y-2 h-[400px] overflow-y-scroll pr-2 custom-scrollbar">
          {leaderboard.length === 0 ? (
            <p className="text-slate italic">No participants yet.</p>
          ) : (
            leaderboard.map((entry) => {
              const isCurrentUser = currentUser?.address === entry.address;
              
              return (
                <div 
                  key={entry.address} 
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isCurrentUser 
                      ? 'bg-electric/10 border border-electric/20' 
                      : 'border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 mr-3 relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={getAvatarUrl(entry.address)} 
                        alt={entry.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                      entry.rank === 1 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : entry.rank === 2 
                          ? 'bg-gray-100 text-gray-800' 
                          : entry.rank === 3 
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-50 text-slate'
                    }`}>
                      {entry.rank}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-forest' : 'text-charcoal'}`}>
                      {entry.displayName}
                      {isCurrentUser && <span className="ml-1 text-xs">(You)</span>}
                    </p>
                    <p className="text-xs text-slate truncate">
                      {entry.address}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-sm font-bold text-forest">
                      {entry.points} pts
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardDisplay;
