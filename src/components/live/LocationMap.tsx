import React from 'react';
import { motion } from 'framer-motion';

interface LocationMapProps {
  gameStats?: any;
  currentBin?: any;
  recentActivity?: any;
  isLoading?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Locations & Setup</h2>
        
        {/* Physical Layout */}
        <section className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-2">🏢 Main Booth</h5>
                <p className="text-sm text-gray-600 mb-2">Central display area with sponsor logos and live leaderboards</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Large display screen with HDMI connection</li>
                  <li>• 2 booth staff positions with power outlets for devices</li>
                  <li>• Table space for promotional materials and NFC scanner</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-2">🗑️ Smart Trash Can</h5>
                <p className="text-sm text-gray-600 mb-2">High-traffic location for maximum visibility and participation</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Requires power outlet and stable internet connection</li>
                  <li>• Clear signage space for instructions and NFC tap zone</li>
                  <li>• 1 staff monitor position nearby for assistance</li>
                  <li>• Easy access for emptying when full (bin purchase cycle)</li>
                  <li>• Away from food areas but in main attendee flow</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-2">♻️ Recycling Center</h5>
                <p className="text-sm text-gray-600 mb-2">Located away from main booth, possibly outside the venue or near the entrance for visibility</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• 2 staff positions with table space for verification process</li>
                  <li>• NFC scanner for verification codes and USDC payouts</li>
                  <li>• Storage area for collected recyclables and merchandise</li>
                  <li>• Separate from main booth to avoid confusion</li>
                  <li>• Near entrance/exit for easy access but not blocking traffic</li>
                </ul>
              </div>
            </div>
          </div>
        </section>


        {/* Setup Requirements */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Setup Requirements</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-800 mb-3">🔌 Power & Network</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Reliable power supply for all stations</li>
                  <li>• Strong WiFi/cellular connectivity</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-yellow-800 mb-3">📱 Equipment</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Large display screen for booth</li>
                  <li>• NFC scanners for recycling center</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-yellow-800 mb-3">👥 Staffing</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 2-3 booth operators</li>
                  <li>• 1 trash can monitor</li>
                  <li>• 1-2 recycling center staff</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default LocationMap;
