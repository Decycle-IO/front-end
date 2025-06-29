import React from 'react';
import type { TrashCan } from '../../../hooks/dapp/useTrashCanCollection';

interface TrashCanCardProps {
  trashCan: TrashCan;
  onCollect: (id: number) => void;
  isCollecting?: boolean;
}

export const TrashCanCard: React.FC<TrashCanCardProps> = ({
  trashCan,
  onCollect,
  isCollecting = false
}) => {
  const { id, location, fillLevel, costToCollect, lastEmptied, isActive } = trashCan;
  
  // Format the last emptied date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Determine fill level color
  const getFillLevelColor = (level: number): string => {
    if (level < 30) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${isActive ? 'border-forest/10' : 'border-gray-200'} overflow-hidden ${!isActive ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-forest">{location}</h3>
          {!isActive && (
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">Inactive</span>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate">Fill Level</span>
            <span className="text-sm font-medium text-forest">{fillLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getFillLevelColor(fillLevel)}`} 
              style={{ width: `${fillLevel}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-xs text-slate">Cost to Collect</p>
            <p className="text-sm font-medium text-forest">${costToCollect.toFixed(2)} USDC</p>
          </div>
          <div>
            <p className="text-xs text-slate">Last Emptied</p>
            <p className="text-sm font-medium text-forest">{formatDate(lastEmptied)}</p>
          </div>
        </div>
        
        <button
          onClick={() => onCollect(id)}
          disabled={!isActive || isCollecting || fillLevel < 10}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors
            ${isActive && fillLevel >= 10 && !isCollecting
              ? 'bg-forest text-white hover:bg-forest/90'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isCollecting 
            ? 'Collecting...' 
            : fillLevel < 10 
              ? 'Not Enough Waste' 
              : `Collect for $${costToCollect.toFixed(2)}`
          }
        </button>
      </div>
    </div>
  );
};
