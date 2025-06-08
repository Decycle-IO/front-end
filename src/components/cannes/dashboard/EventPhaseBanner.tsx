import React from 'react';
import { motion } from 'framer-motion';
import type { GameStats } from '../../../hooks/cannes/useCannesGame';
import EmailSignup from '../../ui/EmailSignup';

interface EventPhaseBannerProps {
  gameStats: GameStats;
  foundersCount: number;
  formatEth: (amount: number) => string;
}

const EventPhaseBanner: React.FC<EventPhaseBannerProps> = ({ 
  gameStats,
  foundersCount,
  formatEth 
}) => {
  // Calculate progress percentage for donations and other metrics
  const donationGoal = 20; // ETH
  const itemsRecycledGoal = 1000; // Items
  const binsCollectedGoal = 25; // Bins
  const greenGuardiansGoal = 50; // Guardians
  
  const donationProgress = Math.min(100, (gameStats.totalDonations / donationGoal) * 100);
  const itemsRecycledProgress = Math.min(100, (gameStats.totalItems / itemsRecycledGoal) * 100);
  const binsCollectedProgress = Math.min(100, (gameStats.totalParticipants / binsCollectedGoal) * 100);
  const greenGuardiansProgress = Math.min(100, (foundersCount / greenGuardiansGoal) * 100);
  
  // Calculate progress percentage for event timeline
  const getTimelineProgress = () => {
    const now = Date.now();
    
    if (gameStats.eventPhase === 'PRE_EVENT') {
      // For pre-event, assume we're halfway through (since we don't have preEventStart)
      // Or calculate based on a fixed duration before eventStart (e.g., 30 days)
      const assumedPreEventDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
      const timeUntilEvent = gameStats.eventStart - now;
      return Math.min(100, Math.max(0, 50 - (timeUntilEvent / assumedPreEventDuration) * 50));
    } else if (gameStats.eventPhase === 'LIVE_EVENT') {
      const totalDuration = gameStats.eventEnd - gameStats.eventStart;
      const elapsed = now - gameStats.eventStart;
      return Math.min(100, (elapsed / totalDuration) * 100);
    } else {
      return 100;
    }
  };
  
  // Format time remaining until next phase
  const formatTimeRemaining = () => {
    const now = Date.now();
    
    if (gameStats.eventPhase === 'LIVE_EVENT') {
      const timeLeft = gameStats.eventEnd - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `${days}d ${hours}h ${minutes}m`;
    } else if (gameStats.eventPhase === 'PRE_EVENT') {
      const timeLeft = gameStats.eventStart - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return `${days}d ${hours}h ${minutes}m`;
    } else {
      return 'Event has ended';
    }
  };
  
  // Animation variants for stats
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  // Get phase-specific colors
  const getPhaseColors = () => {
    switch(gameStats.eventPhase) {
      case 'PRE_EVENT':
        return {
          gradient: 'from-forest-dark via-forest to-forest-light',
          accent: 'forest-light',
          highlight: 'white'
        };
      case 'LIVE_EVENT':
        return {
          gradient: 'from-forest via-forest-light to-forest-light',
          accent: 'forest-light',
          highlight: 'white'
        };
      case 'POST_EVENT':
        return {
          gradient: 'from-forest-dark via-forest to-forest-light',
          accent: 'forest-light',
          highlight: 'white'
        };
      default:
        return {
          gradient: 'from-forest-dark via-forest to-forest-light',
          accent: 'forest-light',
          highlight: 'white'
        };
    }
  };
  
  const colors = getPhaseColors();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl overflow-hidden shadow-xl bg-gradient-to-r from-forest-dark via-forest to-forest-light"
    >
      <div className="p-4 md:p-8 relative overflow-hidden backdrop-blur-sm border-t border-white/5">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Modern abstract shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-forest-light/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-forest-light/10 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-forest-dark/10 blur-2xl"></div>
          
          {/* Subtle dot pattern */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-5">
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10">
          {/* Header Section - Mobile Optimized */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
            {/* Mobile Header Layout */}
            <div className="w-full flex flex-col md:flex-row md:items-start">
              {/* Title and Description + Mobile Timeline */}
              <div className="md:max-w-xs lg:max-w-md">
                {/* Mobile Phase Indicator with Progress Bar */}
                <div className="md:hidden mb-3">
                  <div className="flex items-center mb-1">
                    <div className="h-2 w-2 rounded-full bg-electric mr-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-white/80">
                      {gameStats.eventPhase === 'PRE_EVENT' && `Event starts in ${formatTimeRemaining()}`}
                      {gameStats.eventPhase === 'LIVE_EVENT' && `Event ends in ${formatTimeRemaining()}`}
                      {gameStats.eventPhase === 'POST_EVENT' && 'Event has ended'}
                    </span>
                  </div>
                  
                  {/* Mobile Timeline Progress Bar */}
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${getTimelineProgress()}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-electric-dark to-electric"
                    />
                  </div>
                </div>
                
                <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-tight uppercase">
                  {gameStats.eventPhase === 'PRE_EVENT' && 'Trash-Cannes Pre-Event'}
                  {gameStats.eventPhase === 'LIVE_EVENT' && 'Trash-Cannes Live Event'}
                  {gameStats.eventPhase === 'POST_EVENT' && 'Trash-Cannes Event Recap'}
                </h1>
                <p className="text-white/80 text-sm md:text-lg font-light">
                  {gameStats.eventPhase === 'PRE_EVENT' && 'Become a Green Guardian by donating ETH'}
                  {gameStats.eventPhase === 'LIVE_EVENT' && 'Recycle, earn points, and compete on the leaderboard'}
                  {gameStats.eventPhase === 'POST_EVENT' && 'Event has ended. Thank you for participating!'}
                </p>
              </div>
              
              {/* Email Signup - Mobile Optimized, Desktop Centered */}
              <div className="mt-3 md:mt-0 md:mx-auto email-signup-dark flex-1 max-w-full md:max-w-sm">
                <EmailSignup 
                  buttonText="Join" 
                  placeholder="Signup for Updates" 
                  tagline="" 
                  className="text-white mobile-optimized"
                />
                <style>
                  {`
                    .email-signup-dark input {
                      background-color: rgba(255, 255, 255, 0.1);
                      border-color: rgba(255, 255, 255, 0.2);
                      color: white;
                    }
                    .email-signup-dark input::placeholder {
                      color: rgba(255, 255, 255, 0.6);
                    }
                    .email-signup-dark p {
                      color: rgba(255, 255, 255, 0.7);
                    }
                    @media (max-width: 640px) {
                      .mobile-optimized form {
                        flex-direction: row !important;
                      }
                      .mobile-optimized input {
                        height: 40px;
                        padding-top: 0.5rem;
                        padding-bottom: 0.5rem;
                      }
                      .mobile-optimized button {
                        height: 40px;
                        padding-top: 0.5rem;
                        padding-bottom: 0.5rem;
                      }
                    }
                  `}
                </style>
              </div>
            </div>
            
            {/* Timeline Visualization - Full version only on desktop */}
            <div className="hidden md:block mt-6 md:mt-0 bg-forest-dark/50 backdrop-blur-md rounded-xl p-4 text-white shadow-lg border border-white/5 flex-shrink-0">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={gameStats.eventPhase === 'PRE_EVENT' ? `text-${colors.highlight}` : 'text-white/70'}>Pre-Event</span>
                  <span className={gameStats.eventPhase === 'LIVE_EVENT' ? `text-${colors.highlight}` : 'text-white/70'}>Live Event</span>
                  <span className={gameStats.eventPhase === 'POST_EVENT' ? `text-${colors.highlight}` : 'text-white/70'}>End</span>
                </div>
                
                {/* Timeline Progress Bar */}
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${getTimelineProgress()}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-electric-dark to-electric"
                  />
                </div>
                
                {/* Time Remaining */}
                <div className="flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-white">
                    {gameStats.eventPhase === 'PRE_EVENT' && `Event starts in ${formatTimeRemaining()}`}
                    {gameStats.eventPhase === 'LIVE_EVENT' && `Event ends in ${formatTimeRemaining()}`}
                    {gameStats.eventPhase === 'POST_EVENT' && 'Event has ended'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards - Mobile Optimized to 2 columns */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4"
          >
            {/* Donations Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-forest-dark/50 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/5 shadow-lg overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-forest-light/10 to-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <div className="text-xs md:text-sm text-white/70">Total Donations</div>
                  <div className="bg-electric/20 rounded-full p-0.5 md:p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-electric" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline h-6 md:h-8"> {/* Fixed height for stat value */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-2xl font-bold text-white"
                  >
                    {formatEth(gameStats.totalDonations)}
                  </motion.div>
                  <div className="ml-1 text-xs md:text-sm text-white/70">ETH</div>
                </div>
                
                {/* Progress Bar - Mobile Optimized */}
                <div className="mt-2 md:mt-3 h-8 md:h-12"> {/* Fixed height container */}
                  <div className="flex justify-between text-[10px] md:text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white/90">{Math.round(donationProgress)}%</span>
                  </div>
                  <div className="h-1 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${donationProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-electric-dark to-electric"
                    />
                  </div>
                  <div className="mt-0.5 md:mt-1 text-[10px] md:text-xs text-white/50 text-right">Goal: {donationGoal} ETH</div>
                </div>
              </div>
            </motion.div>
            
            {/* Green Guardians Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-forest-dark/50 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-lg overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-forest-light/10 to-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <div className="text-xs md:text-sm text-white/70">Green Guardians</div>
                  <div className="bg-electric/20 rounded-full p-0.5 md:p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-electric" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline h-6 md:h-8"> {/* Fixed height for stat value */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg md:text-2xl font-bold text-white"
                  >
                    {foundersCount}
                  </motion.div>
                  <div className="ml-1 text-xs md:text-sm text-white/70">supporters</div>
                </div>
                
                {/* Progress Bar - Mobile Optimized */}
                <div className="mt-2 md:mt-3 h-8 md:h-12"> {/* Fixed height container */}
                  <div className="flex justify-between text-[10px] md:text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white/90">{Math.round(greenGuardiansProgress)}%</span>
                  </div>
                  <div className="h-1 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${greenGuardiansProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-electric-dark to-electric"
                    />
                  </div>
                  <div className="mt-0.5 md:mt-1 text-[10px] md:text-xs text-white/50 text-right">Goal: {greenGuardiansGoal} guardians</div>
                </div>
              </div>
            </motion.div>
            
            {/* Total Items Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-forest-dark/50 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-lg overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-forest-light/10 to-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <div className="text-xs md:text-sm text-white/70">Items Recycled</div>
                  <div className="bg-electric/20 rounded-full p-0.5 md:p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-electric" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline h-6 md:h-8"> {/* Fixed height for stat value */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg md:text-2xl font-bold text-white"
                  >
                    {gameStats.totalItems}
                  </motion.div>
                  <div className="ml-1 text-xs md:text-sm text-white/70">items</div>
                </div>
                
                {/* Progress Bar - Mobile Optimized */}
                <div className="mt-2 md:mt-3 h-8 md:h-12"> {/* Fixed height container */}
                  <div className="flex justify-between text-[10px] md:text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white/90">{Math.round(itemsRecycledProgress)}%</span>
                  </div>
                  <div className="h-1 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${itemsRecycledProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-electric-dark to-electric"
                    />
                  </div>
                  <div className="mt-0.5 md:mt-1 text-[10px] md:text-xs text-white/50 text-right">Goal: {itemsRecycledGoal} items</div>
                </div>
              </div>
            </motion.div>
            
            {/* Participants Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-forest-dark/50 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-lg overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-forest-light/10 to-forest/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <div className="text-xs md:text-sm text-white/70">Bins Collected</div>
                  <div className="bg-electric/20 rounded-full p-0.5 md:p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-electric" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline h-6 md:h-8"> {/* Fixed height for stat value */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-lg md:text-2xl font-bold text-white"
                  >
                    {gameStats.totalParticipants}
                  </motion.div>
                  <div className="ml-1 text-xs md:text-sm text-white/70">bins</div>
                </div>
                
                {/* Progress Bar - Mobile Optimized */}
                <div className="mt-2 md:mt-3 h-8 md:h-12"> {/* Fixed height container */}
                  <div className="flex justify-between text-[10px] md:text-xs mb-1">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white/90">{Math.round(binsCollectedProgress)}%</span>
                  </div>
                  <div className="h-1 md:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${binsCollectedProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-electric-dark to-electric"
                    />
                  </div>
                  <div className="mt-0.5 md:mt-1 text-[10px] md:text-xs text-white/50 text-right">Goal: {binsCollectedGoal} bins</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventPhaseBanner;
