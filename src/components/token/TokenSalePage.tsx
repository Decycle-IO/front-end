import React from 'react';
import Card from '../ui/Card';
import Container from '../ui/Container';
import Section from '../ui/Section';
import TokenDistributionChart from './TokenDistributionChart';
import VestingScheduleChart from './VestingScheduleChart';
import PurchaseForm from './PurchaseForm';
import GameUtilitySection from './GameUtilitySection';
import { useTrashGenesis, SalePhase } from '../../hooks/useTrashGenesis';
import { formatUnits } from 'viem';

const TokenSalePage: React.FC = () => {
  const { phaseInfo, saleStats, isPhaseInfoLoading, isSaleStatsLoading } = useTrashGenesis();
  
  // Format ETH amount
  const formatEth = (amount: bigint | undefined): string => {
    if (!amount) return '0';
    return parseFloat(formatUnits(amount, 18)).toFixed(2);
  };
  
  // Get phase status
  const getPhaseStatus = (phase: number | undefined): string => {
    if (!phaseInfo || phase === undefined) return 'COMING SOON';
    
    const currentPhase = phaseInfo.phase;
    
    if (phase < currentPhase) return 'COMPLETED';
    if (phase === currentPhase) return 'CURRENT';
    return 'COMING SOON';
  };
  
  // Calculate progress percentage
  const getProgressPercentage = (phase: number | undefined): number => {
    if (!phaseInfo || phase === undefined || !phase) return 0;
    
    if (phase < phaseInfo.phase) return 100;
    if (phase > phaseInfo.phase) return 0;
    
    // For current phase
    if (phaseInfo.hardCap === 0n) return 0;
    return Number((phaseInfo.raised * 100n) / phaseInfo.hardCap);
  };
  
  // Get phase-specific token price
  const getPhasePrice = (phase: number): string => {
    switch (phase) {
      case SalePhase.Private:
        return '$0.0010'; // $0.001 per token
      case SalePhase.Whitelist:
        return '$0.0015'; // $0.0015 per token
      case SalePhase.Public:
        return '$0.0020'; // $0.002 per token
      default:
        return '$0.0000';
    }
  };
  
  // Get remaining days
  const getRemainingDays = (): number => {
    if (!phaseInfo || !phaseInfo.endTime) return 0;
    
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (now >= phaseInfo.endTime) return 0;
    
    const secondsRemaining = phaseInfo.endTime - now;
    return Number(secondsRemaining / 86400n); // Convert seconds to days
  };
  
  // Get total contributors
  const getTotalContributors = (): string => {
    if (!saleStats) return '0';
    return saleStats.totalUsers.toString();
  };
  
  // Loading state
  const isLoading = isPhaseInfoLoading || isSaleStatsLoading;
  return (
    <Container>
      <div className="pt-8">
        <h1 className="text-4xl font-bold text-forest mb-2">$TRASH Genesis</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Left column - Contribute Now */}
          <div className="lg:col-span-1">
            <Card className="p-4 h-full flex flex-col bg-gradient-to-br from-forest/10 to-forest/5 border border-forest/30 hover:border-forest/60 transition-all shadow-sm hover:shadow">
              <h3 className="text-xl font-bold text-forest mb-3">Contribute Now</h3>
              <PurchaseForm />
            </Card>
          </div>
          
          {/* Right column - Title and content */}
          <div className="lg:col-span-3">
            {/* Sale Phases and Token Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <Card className="p-4 h-full">
                <h2 className="text-xl font-bold text-forest mb-3">Sale Phases & Progress</h2>
                
                {/* Phase rows with progress bars */}
                <div className="space-y-4">
                  {/* Private Round */}
                  <div className={`${getPhaseStatus(SalePhase.Private) === 'CURRENT' ? 'bg-forest/10 border border-forest' : 'bg-forest/5'} p-3 rounded-lg`}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-forest text-sm">Private Round</h4>
                      <span className={`inline-block ${getPhaseStatus(SalePhase.Private) === 'COMPLETED' ? 'bg-forest text-white' : getPhaseStatus(SalePhase.Private) === 'CURRENT' ? 'bg-forest text-white' : 'bg-slate/20 text-slate'} text-xs px-2 py-0.5 rounded`}>
                        {isLoading ? 'LOADING...' : getPhaseStatus(SalePhase.Private)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>{isLoading ? 'Loading...' : `${formatEth(phaseInfo?.hardCap)} ETH Goal`}</span>
                      <span>{getPhasePrice(SalePhase.Private)} per $TRASH</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className={`${getPhaseStatus(SalePhase.Private) === 'COMPLETED' || getPhaseStatus(SalePhase.Private) === 'CURRENT' ? 'bg-forest' : 'bg-gray-400'} h-2 rounded-full`} 
                        style={{ width: `${getProgressPercentage(SalePhase.Private)}%` }}></div>
                    </div>
                    
                    {getPhaseStatus(SalePhase.Private) === 'CURRENT' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-forest font-medium">
                            {isLoading ? 'Loading...' : `${formatEth(phaseInfo?.raised)} ETH raised (${getProgressPercentage(SalePhase.Private)}%)`}
                          </span>
                          <span className="text-slate">
                            {isLoading ? 'Loading...' : `${getRemainingDays()} days remaining`}
                          </span>
                        </div>
                        
                        {/* Additional stats for current round */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-forest/5 p-2 rounded-lg">
                            <span className="text-xs text-slate block">Contributors</span>
                            <span className="text-sm font-bold text-forest">
                              {isLoading ? 'Loading...' : getTotalContributors()}
                            </span>
                          </div>
                          <div className="bg-forest/5 p-2 rounded-lg">
                            <span className="text-xs text-slate block">Avg. Donation</span>
                            <span className="text-sm font-bold text-forest">
                              {isLoading || !saleStats || saleStats.totalUsers === 0n ? '0.00 ETH' : 
                                `${(Number(formatUnits(saleStats.totalRaised, 18)) / Number(saleStats.totalUsers)).toFixed(2)} ETH`}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Whitelist Round */}
                  <div className={`${getPhaseStatus(SalePhase.Whitelist) === 'CURRENT' ? 'bg-forest/10 border border-forest' : 'bg-forest/5'} p-3 rounded-lg`}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-forest text-sm">Whitelist Round</h4>
                      <span className={`inline-block ${getPhaseStatus(SalePhase.Whitelist) === 'COMPLETED' ? 'bg-forest text-white' : getPhaseStatus(SalePhase.Whitelist) === 'CURRENT' ? 'bg-forest text-white' : 'bg-slate/20 text-slate'} text-xs px-2 py-0.5 rounded`}>
                        {isLoading ? 'LOADING...' : getPhaseStatus(SalePhase.Whitelist)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>{isLoading ? 'Loading...' : `${formatEth(phaseInfo?.hardCap)} ETH Goal`}</span>
                      <span>{getPhasePrice(SalePhase.Whitelist)} per $TRASH</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className={`${getPhaseStatus(SalePhase.Whitelist) === 'COMPLETED' || getPhaseStatus(SalePhase.Whitelist) === 'CURRENT' ? 'bg-forest' : 'bg-gray-400'} h-2 rounded-full`} 
                        style={{ width: `${getProgressPercentage(SalePhase.Whitelist)}%` }}></div>
                    </div>
                    
                    {getPhaseStatus(SalePhase.Whitelist) === 'CURRENT' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-forest font-medium">
                            {isLoading ? 'Loading...' : `${formatEth(phaseInfo?.raised)} ETH raised (${getProgressPercentage(SalePhase.Whitelist)}%)`}
                          </span>
                          <span className="text-slate">
                            {isLoading ? 'Loading...' : `${getRemainingDays()} days remaining`}
                          </span>
                        </div>
                        
                        {/* Additional stats for current round */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-forest/5 p-2 rounded-lg">
                            <span className="text-xs text-slate block">Contributors</span>
                            <span className="text-sm font-bold text-forest">
                              {isLoading ? 'Loading...' : getTotalContributors()}
                            </span>
                          </div>
                          <div className="bg-forest/5 p-2 rounded-lg">
                            <span className="text-xs text-slate block">Avg. Donation</span>
                            <span className="text-sm font-bold text-forest">
                              {isLoading || !saleStats || saleStats.totalUsers === 0n ? '0.00 ETH' : 
                                `${(Number(formatUnits(saleStats.totalRaised, 18)) / Number(saleStats.totalUsers)).toFixed(2)} ETH`}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Public Round */}
                  <div className={`${getPhaseStatus(SalePhase.Public) === 'CURRENT' ? 'bg-forest/10 border border-forest' : 'bg-forest/5'} p-3 rounded-lg`}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-forest text-sm">Public Round</h4>
                      <span className={`inline-block ${getPhaseStatus(SalePhase.Public) === 'COMPLETED' ? 'bg-forest text-white' : getPhaseStatus(SalePhase.Public) === 'CURRENT' ? 'bg-forest text-white' : 'bg-slate/20 text-slate'} text-xs px-2 py-0.5 rounded`}>
                        {isLoading ? 'LOADING...' : getPhaseStatus(SalePhase.Public)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>{isLoading ? 'Loading...' : `${formatEth(phaseInfo?.hardCap)} ETH Goal`}</span>
                      <span>{getPhasePrice(SalePhase.Public)} per $TRASH</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className={`${getPhaseStatus(SalePhase.Public) === 'COMPLETED' || getPhaseStatus(SalePhase.Public) === 'CURRENT' ? 'bg-forest' : 'bg-gray-400'} h-2 rounded-full`} 
                        style={{ width: `${getProgressPercentage(SalePhase.Public)}%` }}></div>
                    </div>
                    
                    {getPhaseStatus(SalePhase.Public) === 'CURRENT' && (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-forest font-medium">
                            {isLoading ? 'Loading...' : `${formatEth(phaseInfo?.raised)} ETH raised (${getProgressPercentage(SalePhase.Public)}%)`}
                          </span>
                          <span className="text-slate">
                            {isLoading ? 'Loading...' : `${getRemainingDays()} days remaining`}
                          </span>
                        </div>
                        
                        {/* Additional stats for current round */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-forest/5 p-2 rounded-lg">
                            <span className="text-xs text-slate block">Contributors</span>
                            <span className="text-sm font-bold text-forest">
                              {isLoading ? 'Loading...' : getTotalContributors()}
                            </span>
                          </div>
                          <div className="bg-forest/5 p-2 rounded-lg">
                            <span className="text-xs text-slate block">Avg. Donation</span>
                            <span className="text-sm font-bold text-forest">
                              {isLoading || !saleStats || saleStats.totalUsers === 0n ? '0.00 ETH' : 
                                `${(Number(formatUnits(saleStats.totalRaised, 18)) / Number(saleStats.totalUsers)).toFixed(2)} ETH`}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 h-full">
                <h2 className="text-xl font-bold text-forest mb-3">Token Allocation</h2>
                <TokenDistributionChart />
                
                {/* Compact token allocation percentages in two columns */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#4ADE80] mr-2"></div>
                    <span className="text-slate w-28">Community:</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] mr-2"></div>
                    <span className="text-slate w-28">Team & Dev:</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#06B6D4] mr-2"></div>
                    <span className="text-slate w-28">Ecosystem:</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#22D3EE] mr-2"></div>
                    <span className="text-slate w-28">Liquidity:</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Section title="$TRASH Token Utility" className="!py-5 mb-4">
          <GameUtilitySection />
        </Section>

        <div className="mb-4">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-forest mb-4">Vesting Schedule</h2>
            <VestingScheduleChart />
          </Card>
        </div>


      </div>
    </Container>
  );
};

export default TokenSalePage;
