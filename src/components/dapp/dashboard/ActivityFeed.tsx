import React from 'react';

// Types for activity items
interface ActivityItem {
  id: number;
  type: 'collection' | 'stake' | 'reward' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  location?: string;
}

// Mock data for activity feed
const mockActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'collection',
    title: 'Trash Collected',
    description: 'You collected trash from a garbage can',
    timestamp: '2025-06-20T10:30:00Z',
    amount: 15,
    location: 'Central Park'
  },
  {
    id: 2,
    type: 'reward',
    title: 'Reward Earned',
    description: 'You earned TRASH tokens for recycling',
    timestamp: '2025-06-19T14:45:00Z',
    amount: 25
  },
  {
    id: 3,
    type: 'stake',
    title: 'New Stake Created',
    description: 'You staked USDC to fund a garbage can',
    timestamp: '2025-06-18T09:15:00Z',
    amount: 100,
    location: 'Times Square'
  },
  {
    id: 4,
    type: 'achievement',
    title: 'Achievement Unlocked',
    description: 'First-time Collector',
    timestamp: '2025-06-17T16:20:00Z'
  },
  {
    id: 5,
    type: 'collection',
    title: 'Trash Collected',
    description: 'You collected trash from a garbage can',
    timestamp: '2025-06-16T11:10:00Z',
    amount: 8,
    location: 'Brooklyn Bridge'
  }
];

interface ActivityFeedProps {
  limit?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 5 }) => {
  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get icon based on activity type
  const getActivityIcon = (type: ActivityItem['type']): React.ReactNode => {
    switch (type) {
      case 'collection':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'stake':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'reward':
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
        );
      case 'achievement':
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-forest/10 overflow-hidden">
      <div className="p-4 border-b border-forest/10">
        <h3 className="text-lg font-semibold text-forest">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-forest/10">
        {mockActivities.slice(0, limit).map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-forest/5 transition-colors">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h4 className="text-forest font-medium">{activity.title}</h4>
                  <span className="text-xs text-slate">{formatDate(activity.timestamp)}</span>
                </div>
                
                <p className="text-sm text-slate mt-1">{activity.description}</p>
                
                {(activity.amount !== undefined || activity.location) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activity.amount !== undefined && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-electric/10 text-electric">
                        {activity.type === 'collection' ? `${activity.amount} kg` : 
                         activity.type === 'stake' ? `${activity.amount} USDC` : 
                         `${activity.amount} TRASH`}
                      </span>
                    )}
                    
                    {activity.location && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forest/10 text-forest">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {activity.location}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {mockActivities.length > limit && (
        <div className="p-4 border-t border-forest/10 text-center">
          <button className="text-electric font-medium text-sm hover:underline">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};
