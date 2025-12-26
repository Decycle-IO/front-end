import React from 'react';
import { motion } from 'framer-motion';

interface ProcessFlowProps {}

const ProcessFlow: React.FC<ProcessFlowProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works - Complete Process Flow</h2>
        
        {/* Phase Overview */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Two-Phase System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-3">🟡 Phase 1: Pre-Event (Green Guardians)</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Open donation period before July 4th</li>
                <li>• Anyone can donate ETH to support the project</li>
                <li>• Donors become "Green Guardians" with recognition</li>
                <li>• Custom display names and logos on booth display</li>
                <li>• Special achievements and status in the game</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">🔴 Phase 2: Live Event (July 4-6)</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Smart trash can with NFC reader active</li>
                <li>• Real-time recycling game with rewards</li>
                <li>• Bin purchase and recycling verification cycle</li>
                <li>• Live leaderboards and achievement unlocks</li>
                <li>• Physical merchandise redemption</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Event Process (Step-by-Step)</h3>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">🏷️ NFC Badge Tap</h4>
                <p className="text-gray-600 mb-2">Attendee approaches smart trash can and taps their event badge on the NFC reader</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <strong>System Action:</strong> NFC ID is resolved to wallet address via event API
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">🗑️ Item Deposit</h4>
                <p className="text-gray-600 mb-2">User deposits metal or plastic item into the smart trash can</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <strong>System Action:</strong> Sensors detect item type (metal/plastic) and record on blockchain
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">🎁 Instant Rewards</h4>
                <p className="text-gray-600 mb-2">User immediately receives points and potential achievements</p>
                <div className="bg-green-50 rounded-lg p-3 text-sm">
                  <strong>Rewards:</strong> Metal = 10 points | Plastic = 15 points
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">📊 Live Updates</h4>
                <p className="text-gray-600 mb-2">Leaderboards update in real-time, achievements may unlock and display</p>
                <div className="bg-purple-50 rounded-lg p-3 text-sm">
                  <strong>Display:</strong> Booth screen shows updated rankings and celebrates achievements
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">💰 Bin Purchase</h4>
                <p className="text-gray-600 mb-2">When bin is full, someone pays $10 USDC to purchase contents</p>
                <div className="bg-orange-50 rounded-lg p-3 text-sm">
                  <strong>Process:</strong> Buyer gets verification code and takes contents to recycling center
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2">♻️ Verification & Payout</h4>
                <p className="text-gray-600 mb-2">Collector brings items to recycling center for verification</p>
                <div className="bg-red-50 rounded-lg p-3 text-sm">
                  <strong>Reward:</strong> $10 USDC refund + $5 USDC bonus + 50 points = $15 total payout + points
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement System */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Achievement & Reward System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-4">🏆 Achievement Categories</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm"><strong>First Drop:</strong> Complete your first recycling action</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm"><strong>Eco Warrior:</strong> Reach 50 points through recycling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm"><strong>Sustainability Champion:</strong> Top 10 on leaderboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm"><strong>Green Guardian:</strong> Pre-event donor recognition</span>
                </div>
              </div>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <h4 className="font-semibold text-pink-800 mb-4">🎁 Physical Rewards</h4>
              <div className="space-y-2 text-sm text-pink-700">
                <div>• <strong>Sustainability Items:</strong> Reusable bags, recycled materials</div>
                <div>• <strong>Event Merchandise:</strong> T-shirts, stickers, memorabilia</div>
                <div>• <strong>Recognition Items:</strong> Special badges for achievements</div>
              </div>
              <div className="mt-4 p-3 bg-white rounded border border-pink-200">
                <p className="text-xs text-pink-600">
                  <strong>Redemption:</strong> Visit recycling center with achievement NFTs to claim physical rewards
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Continuous Cycle */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Continuous Operation</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-gray-800">♻️ The Recycling Loop</h4>
            </div>
            <div className="flex flex-wrap justify-center items-center space-x-4 text-sm text-gray-600">
              <span className="bg-white px-3 py-1 rounded-full border">Deposit Items</span>
              <span>→</span>
              <span className="bg-white px-3 py-1 rounded-full border">Earn Rewards</span>
              <span>→</span>
              <span className="bg-white px-3 py-1 rounded-full border">Bin Fills Up</span>
              <span>→</span>
              <span className="bg-white px-3 py-1 rounded-full border">Purchase & Verify</span>
              <span>→</span>
              <span className="bg-white px-3 py-1 rounded-full border">New Bin Ready</span>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">
              This cycle continues throughout the entire event, creating ongoing engagement and environmental impact
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default ProcessFlow;
