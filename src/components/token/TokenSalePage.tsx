import React from 'react';
import Card from '../ui/Card';
import Container from '../ui/Container';
import Section from '../ui/Section';
import TokenDistributionChart from './TokenDistributionChart';
import VestingScheduleChart from './VestingScheduleChart';
import PurchaseForm from './PurchaseForm';
import GameUtilitySection from './GameUtilitySection';
import RealWorldImpact from './RealWorldImpact';

const TokenSalePage: React.FC = () => {
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
                  {/* Private Round - Completed */}
                  <div className="bg-forest/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-forest text-sm">Private Round</h4>
                      <span className="inline-block bg-forest text-white text-xs px-2 py-0.5 rounded">COMPLETED</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>50 ETH Goal</span>
                      <span>$0.001 per $TRASH</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-forest h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  {/* Whitelist Round - Current */}
                  <div className="bg-forest/10 p-3 rounded-lg border border-forest">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-forest text-sm">Whitelist Round</h4>
                      <span className="inline-block bg-forest text-white text-xs px-2 py-0.5 rounded">CURRENT</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>75 ETH Goal</span>
                      <span>$0.0015 per $TRASH</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className="bg-forest h-2 rounded-full" style={{ width: '56%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-forest font-medium">42 ETH raised (56%)</span>
                      <span className="text-slate">14 days remaining</span>
                    </div>
                    
                    {/* Additional stats for current round */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-forest/5 p-2 rounded-lg">
                        <span className="text-xs text-slate block">Contributors</span>
                        <span className="text-sm font-bold text-forest">127</span>
                      </div>
                      <div className="bg-forest/5 p-2 rounded-lg">
                        <span className="text-xs text-slate block">Avg. Donation</span>
                        <span className="text-sm font-bold text-forest">0.33 ETH</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Public Round - Coming Soon */}
                  <div className="bg-forest/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-forest text-sm">Public Round</h4>
                      <span className="inline-block bg-slate/20 text-slate text-xs px-2 py-0.5 rounded">COMING SOON</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate mb-1">
                      <span>75 ETH Goal</span>
                      <span>$0.002 per $TRASH</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
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
                    <span className="font-medium">34.375%</span>
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
                    <span className="font-medium">12.5%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#0F4C3A] mr-2"></div>
                    <span className="text-slate w-28">Operations:</span>
                    <span className="font-medium">3.125%</span>
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

        <Section title="Real-World Environmental Impact" className="!py-0 mb-4">
          <RealWorldImpact />
        </Section>

        <Section title="Token Sale Details" className="!py-0 mb-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-forest mb-4">Sale Structure</h3>
            <p className="text-slate mb-6">
              The $TRASH token sale is structured in three phases to ensure fair distribution and community participation.
              Your contribution directly supports our mission to revolutionize recycling and create measurable environmental impact.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-forest/5 p-4 rounded-lg">
                <h4 className="font-bold text-forest mb-2">Private Round</h4>
                <p className="text-sm text-slate mb-1">Goal: 50 ETH ($125,000)</p>
                <p className="text-sm text-slate mb-1">Rate: $0.001 per $TRASH</p>
                <p className="text-sm text-slate mb-1">Tokens: 125M (12.5%)</p>
                <p className="text-sm text-slate">Vesting: 2-month cliff, 6-month unlock</p>
                <div className="mt-3">
                  <span className="inline-block bg-forest text-white text-xs px-2 py-1 rounded">COMPLETED</span>
                </div>
              </div>
              
              <div className="bg-forest/10 p-4 rounded-lg border border-forest">
                <h4 className="font-bold text-forest mb-2">Whitelist Round</h4>
                <p className="text-sm text-slate mb-1">Goal: 75 ETH ($187,500)</p>
                <p className="text-sm text-slate mb-1">Rate: $0.0015 per $TRASH</p>
                <p className="text-sm text-slate mb-1">Tokens: 125M (12.5%)</p>
                <p className="text-sm text-slate">Vesting: 1-month cliff, 6-month unlock</p>
                <div className="mt-3">
                  <span className="inline-block bg-forest text-white text-xs px-2 py-1 rounded">CURRENT</span>
                </div>
              </div>
              
              <div className="bg-forest/5 p-4 rounded-lg">
                <h4 className="font-bold text-forest mb-2">Public Round</h4>
                <p className="text-sm text-slate mb-1">Goal: 75 ETH ($187,500)</p>
                <p className="text-sm text-slate mb-1">Rate: $0.002 per $TRASH</p>
                <p className="text-sm text-slate mb-1">Tokens: 93.75M (9.375%)</p>
                <p className="text-sm text-slate">Vesting: No cliff, 3-month unlock</p>
                <div className="mt-3">
                  <span className="inline-block bg-slate/20 text-slate text-xs px-2 py-1 rounded">COMING SOON</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-bold text-forest mb-2">Funds Allocation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-1 h-6 bg-forest mr-3 rounded"></div>
                      <div>
                        <span className="font-medium text-forest">Liquidity Provision</span>
                        <p className="text-sm text-slate">50% - 100 ETH ($250,000)</p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-6 bg-forest/80 mr-3 rounded"></div>
                      <div>
                        <span className="font-medium text-forest">Device Manufacturing</span>
                        <p className="text-sm text-slate">25% - 50 ETH ($125,000)</p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-6 bg-forest/60 mr-3 rounded"></div>
                      <div>
                        <span className="font-medium text-forest">Technology Development</span>
                        <p className="text-sm text-slate">15% - 30 ETH ($75,000)</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-1 h-6 bg-forest/40 mr-3 rounded"></div>
                      <div>
                        <span className="font-medium text-forest">Marketing/Partnerships</span>
                        <p className="text-sm text-slate">7% - 14 ETH ($35,000)</p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="w-1 h-6 bg-forest/20 mr-3 rounded"></div>
                      <div>
                        <span className="font-medium text-forest">Operations/Legal</span>
                        <p className="text-sm text-slate">3% - 6 ETH ($15,000)</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </Container>
  );
};

export default TokenSalePage;
