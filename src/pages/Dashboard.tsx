import React from 'react';
import { DAppLayout } from '../components/layout/DAppLayout';
import { UserStatsCompact } from '../components/dapp/dashboard/UserStatsCompact';
import { SystemOverview } from '../components/dapp/dashboard/SystemOverview';
import { RecentActivity } from '../components/dapp/dashboard/RecentActivity';
import { useAccount } from 'wagmi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <DAppLayout
        title="Dashboard"
        description="View your recycling stats and system overview"
      >
        <div className="max-w-3xl mx-auto text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-lg">
              <div className="py-12 px-6">
                <div className="bg-electric/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-electric" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-forest mb-4">Connect Your Wallet</h2>
                <p className="text-slate text-lg mb-8 max-w-md mx-auto">
                  Please connect your wallet to view your dashboard and interact with the Decycle DApp.
                </p>
                <div className="flex justify-center">
                  <div className="bg-forest/5 rounded-lg p-4 flex items-center text-slate">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-electric" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Use the connect wallet button in the top right corner
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </DAppLayout>
    );
  }

  return (
    <DAppLayout>
      <div className="space-y-8">
        {/* Hero Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-forest/5 to-electric/5 rounded-2xl -z-10"></div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="w-full md:w-auto flex-grow">
                <UserStatsCompact />
              </div>
              <div className="flex space-x-3">
                <Link to="/garbage-cans">
                  <Button 
                    variant="primary" 
                    size="md"
                    leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Start Recycling
                  </Button>
                </Link>
                <Link to="/staking">
                  <Button 
                    variant="outline" 
                    size="md"
                    leftIcon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    }
                  >
                    Stake / Earn
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="flex items-center">
              <div className="w-1.5 h-6 bg-electric rounded-full mr-3"></div>
              <h2 className="text-xl font-bold text-forest">Quick Actions</h2>
            </div>
            
            <div className="space-y-5">
              <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="bg-electric/20 p-3 rounded-xl mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest">Recycle</h3>
                      <p className="text-slate text-sm">
                        Record recycling activity and earn TRASH tokens
                      </p>
                    </div>
                  </div>
                  <Link to="/garbage-cans">
                    <Button variant="primary" fullWidth>
                      Find Garbage Cans
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="bg-electric/20 p-3 rounded-xl mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest">Stake / Earn</h3>
                      <p className="text-slate text-sm">
                        Stake USDC to fund garbage cans and earn rewards
                      </p>
                    </div>
                  </div>
                  <Link to="/staking">
                    <Button variant="primary" fullWidth>
                      Stake Now
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="bg-electric/20 p-3 rounded-xl mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest">Quests</h3>
                      <p className="text-slate text-sm">
                        Complete quests to earn TRASH tokens and NFTs
                      </p>
                    </div>
                  </div>
                  <Link to="/quests">
                    <Button variant="primary" fullWidth>
                      View Quests
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Middle Column - System Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-8 space-y-8"
          >
            {/* System Overview */}
            <div>
              <div className="flex items-center mb-5">
                <div className="w-1.5 h-6 bg-electric rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-forest">System Overview</h2>
              </div>
              <SystemOverview />
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center mb-5">
                <div className="w-1.5 h-6 bg-electric rounded-full mr-3"></div>
                <h2 className="text-xl font-bold text-forest">Recent Activity</h2>
              </div>
              <RecentActivity limit={5} />
            </div>
          </motion.div>
        </div>
      </div>
    </DAppLayout>
  );
};
