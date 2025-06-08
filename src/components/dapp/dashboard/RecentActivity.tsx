import React from 'react';
import Card from '../../ui/Card';
import { formatDistanceToNow } from 'date-fns';
import { networkConfig } from '../../../config/contracts';
import { useContracts } from '../../../hooks/useContracts';
import { motion } from 'framer-motion';

type ActivityType = 'recycling' | 'staking' | 'quest' | 'achievement' | 'reward';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: number;
  amount?: string;
  txHash?: string;
}

/**
 * In a full implementation, we would:
 * 1. Create a dedicated hook for user activity
 * 2. Query blockchain events from multiple contracts
 * 3. Possibly use an indexer service for efficient activity tracking
 * 4. Combine data from recycling, staking, quests, and achievements
 * 
 * For now, we'll use mock data while integrating with the real contract structure
 */
const getMockUserActivity = (limit: number = 5): Activity[] => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'recycling' as ActivityType,
      title: 'Recycled Plastic',
      description: 'Recycled 2.5kg of plastic at Garbage Can #12',
      timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      amount: '2.5 kg',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    {
      id: '2',
      type: 'staking' as ActivityType,
      title: 'Staked USDC',
      description: 'Staked 50 USDC in Garbage Can #8',
      timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
      amount: '50 USDC',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
    {
      id: '3',
      type: 'quest' as ActivityType,
      title: 'Completed Quest',
      description: 'Completed "Weekly Warrior" quest',
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    },
    {
      id: '4',
      type: 'achievement' as ActivityType,
      title: 'Earned Achievement',
      description: 'Earned "Earth Champion" achievement',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    },
    {
      id: '5',
      type: 'reward' as ActivityType,
      title: 'Claimed Rewards',
      description: 'Claimed 10 TRASH tokens from staking',
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
      amount: '10 TRASH',
      txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    },
  ];
  
  return activities.slice(0, limit);
};

export const RecentActivity: React.FC<{ limit?: number }> = ({ limit = 5 }) => {
  // Use the real contracts hook to check if we're loading contract data
  const { isLoading: isContractsLoading } = useContracts();
  
  // For now, use mock data but in a way that acknowledges the real contract integration
  const activities = getMockUserActivity(limit);
  const isLoading = isContractsLoading;
  const error = null;

  if (isLoading) {
    return (
      <Card className="shadow-md border-0">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-full bg-forest/5 animate-pulse"></div>
            <div className="ml-4 flex-1">
              <div className="h-5 bg-forest/5 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-4 bg-forest/5 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-forest/5 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-forest/5 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-forest/5 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-forest/5 rounded w-1/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !activities || activities.length === 0) {
    return (
      <Card className="shadow-md border-0">
        <div className="text-center py-12">
          <div className="bg-forest/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-forest/40" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-forest">No Recent Activity</h3>
          <p className="mt-3 text-slate max-w-md mx-auto">
            Your recent activity will appear here once you start interacting with the Decycle system.
          </p>
        </div>
      </Card>
    );
  }

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'recycling':
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      case 'staking':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'quest':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        );
      case 'achievement':
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        );
      case 'reward':
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
    }
  };
  
  // Define animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  // Get activity background color based on type
  const getActivityBackground = (type: ActivityType) => {
    switch (type) {
      case 'recycling': return 'bg-green-50';
      case 'staking': return 'bg-blue-50';
      case 'quest': return 'bg-purple-50';
      case 'achievement': return 'bg-yellow-50';
      case 'reward': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <Card className="shadow-md border-0">
      <div className="p-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-forest/10 z-0"></div>
          
          {/* Activity items */}
          <div className="space-y-6">
            {activities.map((activity) => (
              <motion.div 
                key={activity.id} 
                variants={itemVariants}
                className="relative z-10"
              >
                <div className={`flex items-start rounded-xl p-4 ${getActivityBackground(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0 ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-base font-semibold text-forest">
                        {activity.title}
                      </h4>
                      <span className="text-xs font-medium text-slate bg-white/50 px-2 py-1 rounded-full">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-slate">
                      {activity.description}
                    </p>
                    {activity.amount && (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-forest">
                        {activity.amount}
                      </div>
                    )}
                    {activity.txHash && (
                      <div className="mt-2">
                        <a
                          href={`${networkConfig.blockExplorer}/tx/${activity.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-electric hover:text-electric-dark transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Transaction
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Card>
  );
};
