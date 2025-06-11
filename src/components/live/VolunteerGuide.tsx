import React from 'react';
import { motion } from 'framer-motion';

interface VolunteerGuideProps {
  gameStats?: any;
  currentBin?: any;
  recentActivity?: any;
  isLoading?: boolean;
}

const VolunteerGuide: React.FC<VolunteerGuideProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Guide</h2>
        
        {/* Roles Overview */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Volunteer Roles & Responsibilities</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booth Operators */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-4">🏢 Booth Operators (2-3 people)</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-green-700 mb-1">Primary Duties:</h5>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• Explain the system to visitors and attendees</li>
                    <li>• Showcase live leaderboards and achievements</li>
                    <li>• Answer questions about blockchain integration</li>
                    <li>• Promote sponsor recognition (VIA Labs, ETHGlobal, Flow)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recycling Center Staff */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h4 className="font-semibold text-orange-800 mb-4">♻️ Recycling Center Staff (2 people)</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-orange-700 mb-1">Primary Duties:</h5>
                  <ul className="text-sm text-orange-600 space-y-1">
                    <li>• Verify bin collections and verification codes</li>
                    <li>• Process USDC payouts to collectors</li>
                    <li>• Handle achievement NFT merchandise redemption</li>
                    <li>• Manage physical recycling bins and sorting</li>
                    <li>• Record verification data for tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Support / Trash Can Monitor */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-4">🔧 Technical Support / Trash Can Monitor (2 people)</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-blue-700 mb-1">Primary Duties:</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Ensure smart trash can is operating properly</li>
                    <li>• Help users with NFC badge tapping</li>
                    <li>• Handle blockchain and app technical issues</li>
                    <li>• Monitor network connectivity and system status</li>
                    <li>• Troubleshoot detection and connectivity issues</li>
                    <li>• Monitor bin fill levels and alert when full</li>
                    <li>• Coordinate with development team if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Scenarios */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Scenarios & Responses</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">❓ "What is this system?"</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Response:</strong> "This is Trash-Cannes, a gamified recycling system that rewards you with points for recycling. 
                Just tap your event badge on the trash can, deposit a metal or plastic item, and earn points instantly!"
              </p>
              <p className="text-xs text-gray-500">
                <strong>Follow-up:</strong> Show them the live leaderboard and explain the achievement system
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🔗 "How do I connect my wallet?"</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Response:</strong> "Your event badge is already linked to a wallet address! Just tap it on the NFC reader and the system 
                will automatically know it's you. No manual wallet connection needed."
              </p>
              <p className="text-xs text-gray-500">
                <strong>Note:</strong> If they want to see their stats, direct them to the dapp on their phone
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🏆 "What can I do with achievements?"</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Response:</strong> "Achievement NFTs can be redeemed for physical merchandise at our recycling center! 
                We have sustainability-focused items like reusable bags, plus event-branded merchandise."
              </p>
              <p className="text-xs text-gray-500">
                <strong>Direction:</strong> Point them toward the recycling center for redemption
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">💰 "How does the bin purchase work?"</h4>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Response:</strong> "When the bin gets full, anyone can pay $10 USDC to purchase the contents. 
                They get a verification code, bring the items to our recycling center, and receive $15 back plus 50 points - that's a $5 bonus and points for helping with recycling!"
              </p>
              <p className="text-xs text-gray-500">
                <strong>Opportunity:</strong> This creates an economic incentive for proper recycling
              </p>
            </div>
          </div>
        </section>

      </motion.div>
    </div>
  );
};

export default VolunteerGuide;
