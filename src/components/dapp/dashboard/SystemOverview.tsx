import React from 'react';
import Card from '../../ui/Card';
import { useContracts } from '../../../hooks/useContracts';
import { motion } from 'framer-motion';

export const SystemOverview: React.FC = () => {
  const { systemStats, isLoading } = useContracts();
  
  // Use the real contract data from useContracts hook
  const stats = systemStats;
  const error = !stats && !isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-0 shadow h-full" padding="none">
            <div className="p-5 animate-pulse h-full">
              <div className="flex items-center mb-3">
                <div className="bg-forest/5 w-12 h-12 rounded-xl mr-2"></div>
              </div>
              <div className="h-6 bg-forest/5 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-forest/5 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="border-red-200 bg-red-50 shadow-md">
        <div className="flex items-center justify-center p-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">Error loading system stats</p>
        </div>
      </Card>
    );
  }

  const formatAmount = (amount: bigint, decimals: number) => {
    return (Number(amount) / 10 ** decimals).toFixed(2);
  };

  // Icons for each stat with enhanced styling
  const icons = {
    activeCans: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
    pendingCans: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
    recycled: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
    ),
    staked: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    users: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
      </svg>
    ),
    quests: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    ),
  };

  // Define animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {/* Active Garbage Cans */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-electric/20 p-3 rounded-xl mr-4">
                {icons.activeCans}
              </div>
              <div>
                <p className="text-sm font-medium text-slate">Active Cans</p>
                <p className="text-2xl font-bold text-forest leading-tight">
                  {stats.totalGarbageCans}
                </p>
              </div>
              {stats.totalGarbageCans > 0 && (
                <div className="ml-auto bg-green-100 px-2.5 py-1 rounded-full text-xs text-green-600 font-medium">
                  Active
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Pending Garbage Cans */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-electric/20 p-3 rounded-xl mr-4">
                {icons.pendingCans}
              </div>
              <div>
                <p className="text-sm font-medium text-slate">Pending Cans</p>
                <p className="text-2xl font-bold text-forest leading-tight">
                  {stats.totalPendingGarbageCans}
                </p>
              </div>
              {stats.totalPendingGarbageCans > 0 && (
                <div className="ml-auto bg-yellow-100 px-2.5 py-1 rounded-full text-xs text-yellow-600 font-medium">
                  Pending
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Total Recycled */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-electric/20 p-3 rounded-xl mr-4">
                {icons.recycled}
              </div>
              <div>
                <p className="text-sm font-medium text-slate">Total Recycled</p>
                <p className="text-2xl font-bold text-forest leading-tight">
                  {formatAmount(stats.totalRecycled, 18)} kg
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Total Staked */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-electric/20 p-3 rounded-xl mr-4">
                {icons.staked}
              </div>
              <div>
                <p className="text-sm font-medium text-slate">Total Staked</p>
                <p className="text-2xl font-bold text-forest leading-tight">
                  {formatAmount(stats.totalStaked, 6)} USDC
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Total Users */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-electric/20 p-3 rounded-xl mr-4">
                {icons.users}
              </div>
              <div>
                <p className="text-sm font-medium text-slate">Total Users</p>
                <p className="text-2xl font-bold text-forest leading-tight">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Active Quests */}
      <motion.div variants={itemVariants} className="h-full">
        <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full" hover>
          <div className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-electric/20 p-3 rounded-xl mr-4">
                {icons.quests}
              </div>
              <div>
                <p className="text-sm font-medium text-slate">Active Quests</p>
                <p className="text-2xl font-bold text-forest leading-tight">
                  {stats.totalQuests}
                </p>
              </div>
              {stats.totalQuests > 0 && (
                <div className="ml-auto bg-blue-100 px-2.5 py-1 rounded-full text-xs text-blue-600 font-medium">
                  Available
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
