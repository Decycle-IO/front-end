import React from 'react';
import type { StakingPosition, StakingOpportunity } from '../../../hooks/dapp/useTrashCanStaking';
import { ActionButton } from './ActionButton';

interface StakingPositionCardProps {
  position: StakingPosition;
  // onWithdraw and isLoading removed
}

interface StakingOpportunityCardProps {
  opportunity: StakingOpportunity;
  onStake: (canId: number) => void;
  // isLoading removed
}

// Card for displaying an existing staking position
export const StakingPositionCard: React.FC<StakingPositionCardProps> = ({
  position
}) => {
  // Calculate days staked
  const getDaysStaked = (): number => {
    const startDate = new Date(position.startDate);
    const endDate = position.endDate ? new Date(position.endDate) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-forest/10 overflow-hidden">
      {/* Header with location */}
      <div className="p-4 border-b border-forest/10">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-forest">{position.location}</h3>
          <div className="bg-electric/10 text-electric text-xs font-medium px-2.5 py-1 rounded-full">
            {position.endDate ? 'Completed' : 'Active'}
          </div>
        </div>
      </div>

      {/* Body with details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate mb-1">Amount Staked</p>
            <p className="text-forest font-semibold">{position.amount} USDC</p>
          </div>
          <div>
            <p className="text-xs text-slate mb-1">Rewards Earned</p>
            <p className="text-forest font-semibold">{position.rewards.toFixed(2)} TRASH</p>
          </div>
          <div>
            <p className="text-xs text-slate mb-1">APR</p>
            <p className="text-forest font-semibold">{position.apr}%</p>
          </div>
          <div>
            <p className="text-xs text-slate mb-1">Days Staked</p>
            <p className="text-forest font-semibold">{getDaysStaked()} days</p>
          </div>
        </div>

        {/* Action button - only show if position is active */}
      </div>
    </div>
  );
};

// Card for displaying a staking opportunity
export const StakingOpportunityCard: React.FC<StakingOpportunityCardProps> = ({
  opportunity,
  onStake
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-forest/10 overflow-hidden">
      {/* Header with location */}
      <div className="p-4 border-b border-forest/10">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-forest">{opportunity.location}</h3>
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
            {opportunity.apr}% APR
          </div>
        </div>
      </div>

      {/* Body with details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-slate mb-1">Min Stake</p>
            <p className="text-forest font-semibold">{opportunity.minStake} USDC</p>
          </div>
          <div>
            <p className="text-xs text-slate mb-1">Max Stake</p>
            <p className="text-forest font-semibold">{opportunity.maxStake} USDC</p>
          </div>
          <div>
            <p className="text-xs text-slate mb-1">Duration</p>
            <p className="text-forest font-semibold">{opportunity.duration} days</p>
          </div>
          <div>
            <p className="text-xs text-slate mb-1">Total Staked</p>
            <p className="text-forest font-semibold">{opportunity.totalStaked} USDC</p>
          </div>
        </div>

        {/* Progress bar for staking capacity */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-slate mb-1">
            <span>Stakers: {opportunity.stakersCount}</span>
            <span>Capacity: {Math.round((opportunity.totalStaked / (opportunity.maxStake * 20)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="h-2.5 rounded-full bg-electric"
              style={{ width: `${Math.min(100, (opportunity.totalStaked / (opportunity.maxStake * 20)) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Action button */}
        <ActionButton
          label="Stake USDC"
          onClick={() => onStake(opportunity.canId)}
          fullWidth
          variant="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>
    </div>
  );
};
