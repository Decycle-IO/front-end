import React from 'react';
import { motion } from 'framer-motion';
import type { ActivityItem } from '../../../hooks/cannes/useCannesGame';

interface RecentActivityFeedProps {
  activities: ActivityItem[];
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  // Generate a random avatar URL for users
  const getAvatarUrl = (address: string) => {
    // Use the address as a seed to get a consistent avatar for the same user
    const seed = parseInt(address.substring(2, 10), 16) % 70 || 1;
    return `https://i.pravatar.cc/150?img=${seed}`;
  };

  // Format time ago
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Get activity description
  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'DEPOSIT':
        return `deposited a ${activity.details.itemType?.toLowerCase()} item`;
      case 'PURCHASE':
        return `purchased bin #${activity.details.binId}`;
      case 'VERIFICATION':
        return `verified bin #${activity.details.binId} at recycling center`;
      case 'ACHIEVEMENT':
        return `unlocked the ${activity.details.achievementName} achievement`;
      case 'DONATION':
        return `donated ${activity.details.donationAmount?.toFixed(2)} ETH`;
      default:
        return 'performed an action';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-forest mb-4">Recent Activity</h2>
        
        <div className="space-y-3 h-[400px] overflow-y-scroll pr-2 custom-scrollbar">
          {activities.length === 0 ? (
            <p className="text-slate italic">No activity yet.</p>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={getAvatarUrl(activity.address)} 
                    alt={activity.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-charcoal">
                      {activity.displayName}
                    </p>
                    <p className="text-xs text-slate ml-2">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                  <p className="text-xs text-slate truncate">
                    {getActivityDescription(activity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RecentActivityFeed;
