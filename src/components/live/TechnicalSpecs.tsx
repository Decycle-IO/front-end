import React from 'react';
import { motion } from 'framer-motion';

interface TechnicalSpecsProps {
  gameStats?: any;
  currentBin?: any;
  recentActivity?: any;
  isLoading?: boolean;
}

const TechnicalSpecs: React.FC<TechnicalSpecsProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
        
        {/* System Architecture */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">System Architecture</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-4">🔗 Blockchain Components</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-blue-700 mb-1">Smart Contracts:</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• <strong>CannesGame.sol:</strong> Main game logic and donations</li>
                    <li>• <strong>CannesNFT.sol:</strong> Achievement NFTs</li>
                    <li>• <strong>CannesViews.sol:</strong> Frontend data queries</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-1">Point System:</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Metal items: 10 points</li>
                    <li>• Plastic items: 15 points</li>
                    <li>• Bin purchase: $10 USDC payment</li>
                    <li>• Verification reward: $15 USDC + 50 points</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-800 mb-4">🗑️ Smart Trash Can</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-purple-700 mb-1">Hardware Components:</h5>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>• <strong>NFC Reader:</strong> Compatible with event badges</li>
                    <li>• <strong>Item Detection:</strong> Metal vs plastic sensors</li>
                    <li>• <strong>Processing Unit:</strong> Runs detection logic</li>
                    <li>• <strong>Network Module:</strong> WiFi/cellular connectivity</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-700 mb-1">Software Stack:</h5>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>• Detection algorithm for item classification</li>
                    <li>• Blockchain client for contract calls</li>
                    <li>• NFC ID to wallet address mapping</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NFC Integration */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">NFC Integration Details</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 mb-3">🏷️ Event Wristband Integration</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div><strong>System:</strong> ETHGlobal event NFC wristband system</div>
                  <div><strong>API Service:</strong> Event API provides wallet mapping</div>
                  <div><strong>Process:</strong> Wristband NFC ID → API call → wallet address</div>
                  <div><strong>Authentication:</strong> Handled by event infrastructure</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-800 mb-3">📡 Communication Flow</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>1. NFC wristband tap detected by reader</div>
                  <div>2. NFC ID sent to event API for wallet resolution</div>
                  <div>3. Item detection sensors activate</div>
                  <div>4. Blockchain transaction recorded</div>
                  <div>5. User feedback provided</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Frontend Technology */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Frontend & Display Systems</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📱 Mobile App (React/TypeScript)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time leaderboard updates</li>
                  <li>• User profile and achievement display</li>
                  <li>• Wallet connection and transaction history</li>
                  <li>• Achievement NFT showcase</li>
                  <li>• Green Guardians recognition</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🖥️ Booth Display System</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Large screen live dashboard</li>
                  <li>• Auto-updating leaderboards</li>
                  <li>• Achievement celebration animations</li>
                  <li>• Recent activity feed</li>
                  <li>• Sponsor logo rotation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Data Flow */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Flow & Event Handling</h3>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h4 className="font-semibold text-indigo-800 mb-4">📊 Real-time Event Processing</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                <div>
                  <h5 className="font-medium text-indigo-700">Item Deposit Event</h5>
                  <p className="text-sm text-indigo-600">Smart contract emits event → Frontend listeners update UI → Leaderboard refreshes</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                <div>
                  <h5 className="font-medium text-indigo-700">Achievement Unlock</h5>
                  <p className="text-sm text-indigo-600">Contract checks conditions → NFT minted → Achievement popup displayed</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                <div>
                  <h5 className="font-medium text-indigo-700">Bin Purchase</h5>
                  <p className="text-sm text-indigo-600">USDC payment → Verification code generated → Recycling center notified</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Monitoring & Analytics */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monitoring & Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
              <h4 className="font-semibold text-teal-800 mb-3">📈 Real-time Metrics</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Total participants and active users</li>
                <li>• Items recycled (metal vs plastic)</li>
                <li>• Points awarded and achievements unlocked</li>
                <li>• Bin purchase and verification rates</li>
                <li>• System uptime and error rates</li>
              </ul>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <h4 className="font-semibold text-pink-800 mb-3">🔍 System Health</h4>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>• Network connectivity status</li>
                <li>• Smart contract transaction success</li>
                <li>• NFC reader functionality</li>
                <li>• Frontend application performance</li>
                <li>• Database and API response times</li>
              </ul>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default TechnicalSpecs;
