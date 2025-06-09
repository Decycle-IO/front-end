import React from 'react';
import { motion } from 'framer-motion';
import type { FounderProfile } from '../../../hooks/cannes/useCannesGame';

interface GreenGuardiansDisplayProps {
  founders: FounderProfile[];
}

const GreenGuardiansDisplay: React.FC<GreenGuardiansDisplayProps> = ({ founders }) => {
  const sortedFounders = [...founders].sort((a, b) => b.donationAmount - a.donationAmount);
  
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
        <h2 className="text-xl font-bold text-forest mb-4">Green Guardians</h2>
        
        <div className="space-y-4 h-[400px] overflow-y-scroll pr-2 custom-scrollbar">
          {sortedFounders.length === 0 ? (
            <p className="text-slate italic">No Green Guardians yet. Be the first to donate!</p>
          ) : (
            sortedFounders.map((founder, index) => (
              <div 
                key={founder.address} 
                className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src={founder.imageUrl || getAvatarUrl(founder.address)} 
                    alt={founder.displayName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {founder.displayName}
                  </p>
                  <p className="text-xs text-slate truncate">
                    {founder.address}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-forest">
                    {founder.donationAmount.toFixed(2)} ETH
                  </p>
                  <p className="text-xs text-slate">
                    {new Date(founder.donationTime).toLocaleDateString()}
                  </p>
                </div>
                {index < 3 && (
                  <div className="ml-2 flex-shrink-0">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                      index === 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : index === 1 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-amber-100 text-amber-800'
                    } text-xs font-bold`}>
                      {index + 1}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GreenGuardiansDisplay;
