import React from 'react';
import { motion } from 'framer-motion';

interface DemoScriptsProps {
  gameStats?: any;
  currentBin?: any;
  recentActivity?: any;
  isLoading?: boolean;
}

const DemoScripts: React.FC<DemoScriptsProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo Scripts</h2>
        
        {/* Elevator Pitch */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">30-Second Elevator Pitch</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 For Passersby & Quick Interest</h4>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-gray-700 leading-relaxed mb-3">
                  "Hey! This is <strong>Trash-Cannes</strong> - we're turning recycling into a game using blockchain technology. 
                  Just tap your event badge on our smart trash can, drop in a metal or plastic item, and you'll instantly 
                  earn points that can be exchanged for prizes!"
                </p>
                <p className="text-gray-700 leading-relaxed">
                  "You can see the live leaderboard here, unlock achievement NFTs, and even redeem them for physical merchandise. 
                  It's a fun way to make recycling rewarding and transparent using Web3 technology."
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-blue-700 mb-2">Key Points to Emphasize:</h5>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Instant points for recycling</li>
                  <li>• No wallet setup needed (NFC badge)</li>
                  <li>• Real-time leaderboard competition</li>
                  <li>• Physical rewards for achievements</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-blue-700 mb-2">Call to Action:</h5>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• "Want to try it? Just tap your badge here!"</li>
                  <li>• "Check out the leaderboard - can you make top 10?"</li>
                  <li>• "Scan this QR code to see your stats on your phone"</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Demo */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">5-Minute Detailed Walkthrough</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-4">🎮 For Engaged Visitors & Developers</h4>
            <div className="space-y-6">
              {/* Introduction */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">1. Introduction (30 seconds)</h5>
                <p className="text-sm text-green-600 mb-2">
                  "Welcome to Trash-Cannes! We're demonstrating how blockchain technology can gamify environmental action. 
                  This isn't just about recycling - it's about creating sustainable incentive systems using smart contracts, 
                  NFTs, and real-world integration."
                </p>
                <p className="text-xs text-green-500">
                  <strong>Show:</strong> Point to the booth display, smart trash can, and recycling center
                </p>
              </div>

              {/* System Demo */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">2. Live System Demo (2 minutes)</h5>
                <div className="space-y-2 text-sm text-green-600">
                  <p><strong>Step 1:</strong> "Your event badge is already linked to a wallet address. Watch what happens when I tap it here..."</p>
                  <p><strong>Step 2:</strong> "Now I'll deposit this [metal/plastic] item. The sensors automatically detect the material type..."</p>
                  <p><strong>Step 3:</strong> "Instantly, the smart contract records this on the blockchain and awards points. See the leaderboard update in real-time!"</p>
                  <p><strong>Step 4:</strong> "If I unlock an achievement, I get an NFT that can be redeemed for physical merchandise at our recycling center."</p>
                </div>
                <p className="text-xs text-green-500 mt-2">
                  <strong>Show:</strong> Actual deposit process, point to leaderboard changes, show achievement popup if triggered
                </p>
              </div>

              {/* Technical Deep Dive */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">3. Technical Architecture (1.5 minutes)</h5>
                <div className="space-y-2 text-sm text-green-600">
                  <p>"Behind the scenes, we have smart contracts handling the game logic, points tracking, and NFT minting. 
                  The trash can acts as a hardware oracle, automatically calling contract functions when items are deposited."</p>
                  <p>"We're using a two-phase system: pre-event donations create 'Green Guardians' who get special recognition, 
                  then during the live event, we have the full recycling game with economic incentives."</p>
                  <p>"The bin purchase mechanism creates a circular economy - someone pays $10 USDC for the contents, 
                  brings them to verification, and gets $15 back as a reward for completing the recycling loop."</p>
                </div>
              </div>

              {/* Impact & Vision */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h5 className="font-medium text-green-700 mb-2">4. Impact & Future Vision (1 minute)</h5>
                <p className="text-sm text-green-600">
                  "This demonstrates how blockchain can create transparent, automated incentive systems for environmental action. 
                  Imagine scaling this to cities, universities, or corporate campuses - creating sustainable behavior through 
                  gamification and economic rewards, all tracked immutably on the blockchain."
                </p>
                <p className="text-xs text-green-500 mt-2">
                  <strong>Mention:</strong> Potential for broader applications in cities, universities, corporate campuses
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Deep Dive */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Technical Deep Dive Script</h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-800 mb-4">⚡ For Developers & Technical Audience</h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Smart Contract Architecture</h5>
                <p className="text-sm text-purple-600 mb-2">
                  "We have three main contracts: CannesGame.sol handles the core logic and donations, 
                  CannesNFT.sol manages achievement NFTs with redemption tracking, and CannesViews.sol provides optimized data queries for the frontend."
                </p>
                <p className="text-xs text-purple-500">
                  <strong>Technical details:</strong> OpenZeppelin base contracts, gas optimization through packed structs, event-driven updates
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Hardware Oracle Integration</h5>
                <p className="text-sm text-purple-600 mb-2">
                  "The smart trash can runs detection algorithms to classify items as metal or plastic, then automatically calls 
                  recordDeposit() on the smart contract. NFC integration resolves badge IDs to wallet addresses through a secure mapping system."
                </p>
                <p className="text-xs text-purple-500">
                  <strong>Security:</strong> Rate limiting, encrypted NFC mapping, hardware wallet for trash can private keys
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Real-time Frontend</h5>
                <p className="text-sm text-purple-600 mb-2">
                  "React/TypeScript frontend with Web3 integration listens for contract events to update the UI in real-time. 
                  We use view functions for efficient data queries and maintain local state for smooth UX."
                </p>
                <p className="text-xs text-purple-500">
                  <strong>Performance:</strong> Event listeners, optimistic updates, batch queries for leaderboard data
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Common Questions & Answers */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Questions & Answers</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "Is this actually helping the environment?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Absolutely! We're collecting real recyclable materials and ensuring they reach proper recycling facilities. 
                  The blockchain layer adds transparency and incentives, but the environmental impact is genuine. Plus, we're 
                  demonstrating how technology can scale sustainable behaviors."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "Why use blockchain for this?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Blockchain provides transparency, immutable tracking, and enables programmable incentives through smart contracts. 
                  Users can verify their impact, achievements are permanently recorded, and the system can operate autonomously without 
                  central authority. It's perfect for creating trust in environmental claims."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "Can this scale beyond events?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Definitely! Imagine this in office buildings, universities, or public spaces. The same principles apply: 
                  automated detection, transparent tracking, and economic incentives. We could integrate with existing waste 
                  management systems and create city-wide recycling competitions."
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Q: "What happens to my points after the event?"</h5>
                <p className="text-sm text-gray-600">
                  A: "Your points and achievement NFTs remain in your wallet permanently as a record of your participation. 
                  They could potentially be used in future events or integrated into a broader ecosystem of environmental action rewards."
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default DemoScripts;
