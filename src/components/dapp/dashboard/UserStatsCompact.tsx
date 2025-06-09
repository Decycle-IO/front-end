import React from 'react';
import { useContracts } from '../../../hooks/useContracts';
import { motion } from 'framer-motion';

export const UserStatsCompact: React.FC = () => {
  const { userStats, isLoading } = useContracts();
  
  // Use the real contract data from useContracts hook
  const stats = userStats;
  const error = !stats && !isLoading;

  if (isLoading || error || !stats) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-forest/5 h-8 w-24 rounded"></div>
        <div className="animate-pulse bg-forest/5 h-8 w-24 rounded"></div>
        <div className="animate-pulse bg-forest/5 h-8 w-24 rounded"></div>
        <div className="animate-pulse bg-forest/5 h-8 w-24 rounded"></div>
      </div>
    );
  }

  const formatAmount = (amount: bigint, decimals: number) => {
    return (Number(amount) / 10 ** decimals).toFixed(2);
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-wrap items-center gap-4 md:gap-6"
    >
      {/* TRASH Balance */}
      <motion.div variants={itemVariants} className="flex items-center">
        <div className="bg-electric/20 p-1.5 rounded-lg mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate">TRASH</p>
          <p className="text-lg font-bold text-forest leading-tight">
            {formatAmount(stats.trashTokenBalance, 18)}
          </p>
        </div>
      </motion.div>

      {/* Total Recycled */}
      <motion.div variants={itemVariants} className="flex items-center">
        <div className="bg-electric/20 p-1.5 rounded-lg mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate">Recycled</p>
          <p className="text-lg font-bold text-forest leading-tight">
            {formatAmount(stats.totalRecycled, 18)} kg
          </p>
        </div>
      </motion.div>

      {/* Recycling Count */}
      <motion.div variants={itemVariants} className="flex items-center">
        <div className="bg-electric/20 p-1.5 rounded-lg mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate">Cans Staked</p>
          <p className="text-lg font-bold text-forest leading-tight">
            {stats.recyclingCount}
          </p>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div variants={itemVariants} className="flex items-center">
        <div className="bg-electric/20 p-1.5 rounded-lg mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-electric" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate">Achievements</p>
          <p className="text-lg font-bold text-forest leading-tight">
            {stats.achievements}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};
