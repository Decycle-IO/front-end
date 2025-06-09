import React from 'react';
import Card from '../../ui/Card';
import { useContracts } from '../../../hooks/useContracts';
import { motion } from 'framer-motion';

export const UserStats: React.FC = () => {
  const { userStats, isLoading } = useContracts();
  
  // Use the real contract data from useContracts hook
  const stats = userStats;
  const error = !stats && !isLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main stat skeleton */}
        <div className="md:col-span-4 lg:col-span-1">
          <Card className="border-0 shadow h-full" padding="none">
            <div className="p-6 animate-pulse h-full">
              <div className="flex items-center mb-4">
                <div className="bg-forest/5 w-14 h-14 rounded-xl mr-3"></div>
                <div className="h-6 bg-forest/5 rounded w-1/4"></div>
              </div>
              <div className="h-8 bg-forest/5 rounded w-2/3 mb-3"></div>
              <div className="h-4 bg-forest/5 rounded w-1/2"></div>
            </div>
          </Card>
        </div>
        
        {/* Secondary stats skeletons */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="md:col-span-1">
            <Card className="border-0 shadow h-full" padding="none">
              <div className="p-5 animate-pulse h-full">
                <div className="flex items-center mb-3">
                  <div className="bg-forest/5 w-12 h-12 rounded-xl mr-2"></div>
                </div>
                <div className="h-6 bg-forest/5 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-forest/5 rounded w-1/2"></div>
              </div>
            </Card>
          </div>
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
          <p className="text-lg font-medium">Error loading user stats</p>
        </div>
      </Card>
    );
  }

  const formatAmount = (amount: bigint, decimals: number) => {
    return (Number(amount) / 10 ** decimals).toFixed(2);
  };

  // Icons for each stat with enhanced styling
  const icons = {
    trash: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
      </svg>
    ),
    recycled: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
    ),
    staked: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    count: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
    quests: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
    ),
    achievements: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-electric" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
    <>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* TRASH Balance - Primary Stat (Larger Card) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="md:col-span-4"
        >
          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-forest/10 to-electric/10 border-0 shadow-lg h-full" hover>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-electric/30 p-3 rounded-xl mr-3 shadow-sm">
                    {icons.trash}
                  </div>
                  <div className="ml-2 bg-electric/20 px-2.5 py-1 rounded-full text-xs text-forest font-semibold">
                    Token
                  </div>
                </div>
                <p className="text-4xl font-bold text-forest mb-2">
                  {formatAmount(stats.trashTokenBalance, 18)}
                </p>
                <p className="text-sm font-medium text-slate">TRASH Balance</p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Secondary Stats - 2 Column Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Recycled */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md h-full" hover>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className="bg-electric/20 p-3 rounded-xl mr-2">
                    {icons.recycled}
                  </div>
                </div>
                <p className="text-2xl font-bold text-forest">
                  {formatAmount(stats.totalRecycled, 18)}
                </p>
                <p className="text-sm text-slate mt-1">Total Recycled (kg)</p>
              </div>
            </Card>
          </motion.div>

          {/* Total Staked */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md h-full" hover>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className="bg-electric/20 p-3 rounded-xl mr-2">
                    {icons.staked}
                  </div>
                </div>
                <p className="text-2xl font-bold text-forest">
                  {formatAmount(stats.totalStaked, 6)}
                </p>
                <p className="text-sm text-slate mt-1">Total Staked (USDC)</p>
              </div>
            </Card>
          </motion.div>

          {/* Recycling Count */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md h-full" hover>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className="bg-electric/20 p-3 rounded-xl mr-2">
                    {icons.count}
                  </div>
                </div>
                <p className="text-2xl font-bold text-forest">
                  {stats.recyclingCount}
                </p>
                <p className="text-sm text-slate mt-1">Recycling Count</p>
              </div>
            </Card>
          </motion.div>

          {/* Achievements & Quests Combined */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-white to-forest/5 border-0 shadow-md h-full" hover>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className="bg-electric/20 p-3 rounded-xl mr-2">
                    {icons.achievements}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-forest">
                      {stats.achievements}
                    </p>
                    <p className="text-sm text-slate mt-1">Achievements</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-forest">
                      {stats.completedQuests}
                    </p>
                    <p className="text-sm text-slate mt-1">Quests</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};
