import React from 'react';
import { motion } from 'framer-motion';
import type { BinState } from '../../../hooks/cannes/useCannesGame';

interface LiveEventBinStatusProps {
  currentBin: BinState;
  onPurchaseBin: () => Promise<boolean>;
  isLoading: boolean;
}

const LiveEventBinStatus: React.FC<LiveEventBinStatusProps> = ({ 
  currentBin, 
  onPurchaseBin, 
  isLoading 
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  
  const handlePurchase = async () => {
    setError(null);
    const result = await onPurchaseBin();
    
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      setError('Failed to purchase bin. Please try again.');
    }
  };
  
  // Calculate fill percentage
  const totalItems = currentBin.metalCount + currentBin.plasticCount;
  const fillPercentage = Math.min(100, Math.max(5, (totalItems / 30) * 100));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-forest mb-4">Current Bin Status</h2>
        
        {success && (
          <div className="mb-4 p-3 bg-electric/10 border border-electric/20 rounded-lg text-forest">
            Bin purchased successfully! Take it to the recycling center to verify.
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-charcoal">Bin #{currentBin.id}</span>
            <span className="text-sm font-medium text-charcoal">{totalItems} items</span>
          </div>
          
          {/* Bin visualization */}
          <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden mb-4">
            {/* Bin outline */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full text-gray-300"
              preserveAspectRatio="none"
            >
              <path 
                d="M20,20 L80,20 L90,40 L90,90 L10,90 L10,40 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              />
              <line x1="20" y1="20" x2="10" y2="40" stroke="currentColor" strokeWidth="2" />
              <line x1="80" y1="20" x2="90" y2="40" stroke="currentColor" strokeWidth="2" />
            </svg>
            
            {/* Fill level */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest to-forest-light transition-all duration-500 ease-out"
              style={{ height: `${fillPercentage}%` }}
            ></div>
            
            {/* Content icons */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-white font-bold text-lg">{currentBin.metalCount}</span>
                  <span className="text-white text-xs">Metal</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-white font-bold text-lg">{currentBin.plasticCount}</span>
                  <span className="text-white text-xs">Plastic</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-slate mb-1">Metal Items</div>
              <div className="text-lg font-bold text-forest">{currentBin.metalCount}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-slate mb-1">Plastic Items</div>
              <div className="text-lg font-bold text-forest">{currentBin.plasticCount}</div>
            </div>
          </div>
          
          <button
            onClick={handlePurchase}
            disabled={isLoading || currentBin.isPurchased || totalItems === 0}
            className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
              isLoading || currentBin.isPurchased || totalItems === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-forest hover:bg-forest-light'
            }`}
          >
            {isLoading 
              ? 'Processing...' 
              : currentBin.isPurchased 
                ? 'Bin Already Purchased' 
                : totalItems === 0 
                  ? 'Bin Empty' 
                  : 'Purchase Bin for $10 USDC'}
          </button>
          
          {currentBin.isPurchased && currentBin.verificationCode && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-slate mb-1">Verification Code</div>
              <div className="text-lg font-mono font-bold text-forest">{currentBin.verificationCode}</div>
              <div className="text-xs text-slate mt-1">
                Take this code to the recycling center to verify your drop-off
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveEventBinStatus;
