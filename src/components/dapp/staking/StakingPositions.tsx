import React, { useState } from 'react';
import { type StakingPosition, type StakingOpportunity } from '../../../hooks/dapp/useTrashCanStaking';
import { StakingPositionCard, StakingOpportunityCard } from '../ui/StakingCard';
import { ActionSheet } from '../ui/ActionSheet';
import { ActionButton } from '../ui/ActionButton';

// Static data for marketing screenshots
const staticStakingPositions: StakingPosition[] = [
  {
    id: 1,
    canId: 2,
    location: 'Alexanderplatz, Berlin',
    amount: 100,
    startDate: '2025-05-20T14:30:00Z',
    endDate: null,
    apr: 12.5,
    rewards: 5.2
  },
  {
    id: 2,
    canId: 5,
    location: 'Promenade des Anglais, Nice',
    amount: 250,
    startDate: '2025-06-01T09:15:00Z',
    endDate: null,
    apr: 10.8,
    rewards: 7.8
  }
];

// Static data for staking opportunities
const staticStakingOpportunities: StakingOpportunity[] = [
  {
    canId: 1,
    location: 'Champs-Élysées, Paris',
    minStake: 50,
    maxStake: 500,
    apr: 14.2,
    duration: 30,
    totalStaked: 2500,
    stakersCount: 8
  },
  {
    canId: 3,
    location: 'Marienplatz, Munich',
    minStake: 100,
    maxStake: 1000,
    apr: 12.8,
    duration: 60,
    totalStaked: 5800,
    stakersCount: 12
  },
  {
    canId: 4,
    location: 'Place de la Bastille, Paris',
    minStake: 75,
    maxStake: 750,
    apr: 11.5,
    duration: 45,
    totalStaked: 3200,
    stakersCount: 6
  },
  {
    canId: 6,
    location: 'Kurfürstendamm, Berlin',
    minStake: 50,
    maxStake: 500,
    apr: 13.5,
    duration: 30,
    totalStaked: 1800,
    stakersCount: 5
  }
];

export const StakingPositions: React.FC = () => {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<number | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isStakeOpen, setIsStakeOpen] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState<string>('100');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Using static data for marketing screenshots
  const stakingPositions = staticStakingPositions;
  const stakingOpportunities = staticStakingOpportunities;
  const isLoading = false;

  // Handle confirming new stake
  const handleStake = (canId: number): void => {
    setSelectedOpportunityId(canId);
    setIsStakeOpen(true);
  };

  // Handle confirming new stake
  const handleStakeConfirm = (): void => {
    if (selectedOpportunityId === null) return;

    const amount = parseInt(stakeAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);

    // Simulate success for marketing screenshots
    setTimeout(() => {
      setIsSuccess(true);

      // Close stake modal after success
      setTimeout(() => {
        setIsStakeOpen(false);
        setIsSuccess(false);
        setIsProcessing(false);
        setSelectedOpportunityId(null);
        setStakeAmount('100');
      }, 2000);
    }, 1000);
  };

  // Get selected position/opportunity details
  const selectedPosition = stakingPositions.find(pos => pos.id === 1); // Assuming a default or first position for withdrawal

  const selectedOpportunity = selectedOpportunityId !== null
    ? stakingOpportunities.find(opp => opp.canId === selectedOpportunityId)
    : null;

  return (
    <div className="space-y-8">
      {/* Your Staking Positions Section */}
      <div>
        <h2 className="text-xl font-bold text-forest mb-4">Your Staking Positions</h2>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-forest/10 p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && stakingPositions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-forest/10 p-8 text-center">
            <div className="bg-forest/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-forest" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-forest mb-2">No Active Stakes</h3>
            <p className="text-slate mb-6">
              You don't have any active staking positions. Start staking to earn rewards!
            </p>
            <button
              className="inline-flex items-center px-4 py-2 bg-electric text-white font-medium rounded-lg hover:bg-electric/90 transition-colors"
              onClick={() => window.scrollTo({ top: document.getElementById('staking-opportunities')?.offsetTop, behavior: 'smooth' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              View Staking Opportunities
            </button>
          </div>
        )}

        {/* Staking Positions Grid */}
        {!isLoading && stakingPositions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingPositions.map((position) => (
              <StakingPositionCard
                key={position.id}
                position={position}
              />
            ))}
          </div>
        )}
      </div>

      {/* Staking Opportunities Section */}
      <div id="staking-opportunities">
        <h2 className="text-xl font-bold text-forest mb-4">Staking Opportunities</h2>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-forest/10 p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staking Opportunities Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingOpportunities.map((opportunity) => (
              <StakingOpportunityCard
                key={opportunity.canId}
                opportunity={opportunity}
                onStake={handleStake}
              />
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Action Sheet */}
      <ActionSheet
        isOpen={isWithdrawOpen}
        onClose={() => !isProcessing && setIsWithdrawOpen(false)}
        title={isSuccess ? "Withdrawal Successful!" : "Confirm Withdrawal"}
      >
        {selectedPosition && (
          <div className="space-y-6">
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">Withdrawal Successful!</h3>
                <p className="text-slate mb-2">
                  Your stake of {selectedPosition.amount} USDC has been withdrawn.
                </p>
                <p className="text-sm text-forest font-medium">
                  You earned {selectedPosition.rewards.toFixed(2)} TRASH tokens in rewards.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-forest/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">Location</span>
                    <span className="text-forest font-medium">{selectedPosition.location}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">Amount Staked</span>
                    <span className="text-forest font-medium">{selectedPosition.amount} USDC</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">Rewards Earned</span>
                    <span className="text-forest font-medium">{selectedPosition.rewards.toFixed(2)} TRASH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate">APR</span>
                    <span className="text-forest font-medium">{selectedPosition.apr}%</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Withdrawing will return your staked USDC and any earned TRASH tokens. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </ActionSheet>

      {/* Stake Action Sheet */}
      <ActionSheet
        isOpen={isStakeOpen}
        onClose={() => !isProcessing && setIsStakeOpen(false)}
        title={isSuccess ? "Stake Created Successfully!" : "Create New Stake"}
      >
        {selectedOpportunity && (
          <div className="space-y-6">
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">Stake Created Successfully!</h3>
                <p className="text-slate mb-2">
                  You have staked {stakeAmount} USDC in {selectedOpportunity.location}.
                </p>
                <p className="text-sm text-forest font-medium">
                  You will earn approximately {(parseInt(stakeAmount) * selectedOpportunity.apr / 100).toFixed(2)} TRASH tokens per year at {selectedOpportunity.apr}% APR.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-forest/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">Location</span>
                    <span className="text-forest font-medium">{selectedOpportunity.location}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">APR</span>
                    <span className="text-forest font-medium">{selectedOpportunity.apr}%</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">Min Stake</span>
                    <span className="text-forest font-medium">{selectedOpportunity.minStake} USDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate">Max Stake</span>
                    <span className="text-forest font-medium">{selectedOpportunity.maxStake} USDC</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="stakeAmount" className="block text-sm font-medium text-forest mb-2">
                    Amount to Stake (USDC)
                  </label>
                  <input
                    type="number"
                    id="stakeAmount"
                    min={selectedOpportunity.minStake}
                    max={selectedOpportunity.maxStake}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="block w-full px-3 py-3 border border-forest/10 rounded-lg focus:ring-electric focus:border-electric"
                    placeholder="Enter amount"
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-slate">Min: {selectedOpportunity.minStake} USDC</span>
                    <span className="text-slate">Max: {selectedOpportunity.maxStake} USDC</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Estimated Rewards</h4>
                  <p className="text-blue-700 text-sm">
                    {(parseInt(stakeAmount || '0') * selectedOpportunity.apr / 100).toFixed(2)} TRASH tokens per year
                  </p>
                </div>

                <ActionButton
                  label="Stake USDC"
                  onClick={handleStakeConfirm}
                  isLoading={isProcessing}
                  disabled={
                    parseInt(stakeAmount) < selectedOpportunity.minStake ||
                    parseInt(stakeAmount) > selectedOpportunity.maxStake
                  }
                  fullWidth
                  variant="primary"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  }
                />
              </>
            )}
          </div>
        )}
      </ActionSheet>
    </div>
  );
};
