import React from 'react';
import { motion } from 'framer-motion';

interface SystemOverviewProps {}

const SystemOverview: React.FC<SystemOverviewProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
        
        {/* What We're Demonstrating */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What We're Demonstrating</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="text-gray-700 leading-relaxed">
              <strong>Trash-Cannes</strong> demonstrates how blockchain technology can create transparent, automated 
              incentive systems for environmental action. This proof-of-concept shows real-world integration of 
              smart contracts, NFC technology, and gamification to drive sustainable behavior through economic 
              rewards and social competition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">🎮 Gamification Elements</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Point-based leaderboard competition</li>
                <li>• Achievement NFTs with physical rewards</li>
                <li>• Real-time progress tracking</li>
                <li>• Social recognition systems</li>
                <li>• Economic incentives for participation</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">🔧 Technologies & Integrations</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Smart contracts for automated logic</li>
                <li>• NFC wristband integration via event API</li>
                <li>• Hardware oracles for item detection</li>
                <li>• Real-time blockchain event processing</li>
                <li>• Cross-platform data synchronization</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Components */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key System Components</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">🗑️ Smart Trash Can</h4>
                <p className="text-sm text-gray-600">
                  Hardware oracle with NFC reader and item detection sensors. 
                  Automatically records deposits on blockchain.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">📱 NFC Integration</h4>
                <p className="text-sm text-gray-600">
                  Event badges linked to wallet addresses. Tap to deposit - 
                  no manual wallet connection required.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">♻️ Recycling Center</h4>
                <p className="text-sm text-gray-600">
                  Physical verification point where collectors bring full bins 
                  and receive USDC payouts.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-808 mb-2">📊 Live Dashboard</h4>
                <p className="text-sm text-gray-600">
                  Real-time leaderboards, achievements, and system status 
                  displayed at the booth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Target Audience</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-semibold text-gray-800">Event Attendees</h4>
              <p className="text-sm text-gray-600 mt-1">
                Developers and blockchain enthusiasts experiencing gamified recycling
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🏢</div>
              <h4 className="font-semibold text-gray-800">Sponsors & Partners</h4>
              <p className="text-sm text-gray-600 mt-1">
                Companies interested in sustainability and blockchain solutions
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-800">Event Organizers</h4>
              <p className="text-sm text-gray-600 mt-1">
                Demonstrating innovative applications of blockchain technology
              </p>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Success Metrics (KPIs)</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-yellow-800">Participation</div>
                <div className="text-sm text-yellow-600">Active users</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-800">Items Recycled</div>
                <div className="text-sm text-yellow-600">Total deposits</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-800">Engagement</div>
                <div className="text-sm text-yellow-600">Return visits</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-800">Interest</div>
                <div className="text-sm text-yellow-600">Booth visitors</div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default SystemOverview;
