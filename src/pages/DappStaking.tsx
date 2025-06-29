import React from 'react';
import { DAppLayout } from '../components/layout/DAppLayout';
import { StakingPositions } from '../components/dapp/staking/StakingPositions';

export const DappStaking: React.FC = () => {
  
  return (
    <DAppLayout>
      <div className="container mx-auto px-4 py-4">
        
        {/* Stats Overview - Compact for Mobile */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-forest/5 rounded-lg p-3">
            <p className="text-xs text-slate mb-1">TVL</p>
            <p className="text-base font-bold text-forest">$245,890</p>
          </div>
          <div className="bg-electric/5 rounded-lg p-3">
            <p className="text-xs text-slate mb-1">Your Stake</p>
            <p className="text-base font-bold text-electric">$350</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-slate mb-1">Earnings</p>
            <p className="text-base font-bold text-yellow-600">$1,245</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex items-center justify-center px-4 py-2 bg-forest text-white font-medium rounded-lg whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            My Stakes
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-forest/10 text-forest font-medium rounded-lg whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            New Stake
          </button>
        </div>
        
        {/* Staking Positions */}
        <StakingPositions />
        
        {/* How It Works - Compact Version */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-4 text-xs">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <span className="text-xs font-medium text-blue-800">How It Works: </span>
              <span className="text-xs text-blue-700">
                Choose location → Stake USDC → Earn TRASH tokens → Withdraw anytime
              </span>
            </div>
          </div>
        </div>
      </div>
    </DAppLayout>
  );
};
