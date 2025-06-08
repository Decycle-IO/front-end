import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ConnectWallet } from '../dapp/wallet/ConnectWallet';
import type { GameStats } from '../../hooks/cannes/useCannesGame';

interface CannesHeaderProps {
  gameStats: GameStats;
}

const navItems = [
  { path: '/cannes', label: 'Home' },
  { path: '/cannes/leaderboard', label: 'Leaderboard' },
  { path: '/cannes/founders', label: 'Green Guardians' },
  { path: '/cannes/profile', label: 'Profile' },
];

const CannesHeader: React.FC<CannesHeaderProps> = ({ gameStats }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Format time remaining until event
  const formatTimeRemaining = () => {
    const now = Date.now();
    
    if (gameStats.eventPhase === 'LIVE_EVENT') {
      const timeLeft = gameStats.eventEnd - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `Event ends in ${days}d ${hours}h`;
    } else if (gameStats.eventPhase === 'PRE_EVENT') {
      const timeLeft = gameStats.eventStart - now;
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `Event starts in ${days}d ${hours}h`;
    } else {
      return 'Event has ended';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-forest/95 to-forest-light/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* Combined Logo, Navigation and Wallet */}
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/cannes" className="flex items-center mr-8 group">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <div className="relative mr-2">
                  {/* Trash can icon */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-7 w-7 text-electric" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xl font-bold tracking-tight leading-none">
                    Trash-Cannes
                  </span>
                  <span className="text-electric/80 text-xs tracking-wider leading-none">
                    @ETHGlobal Cannes
                  </span>
                </div>
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    className={`text-sm font-medium transition-colors relative group ${
                      isActive 
                        ? 'text-electric' 
                        : 'text-white hover:text-electric'
                    }`}
                  >
                    {item.label}
                    <span 
                      className={`absolute -bottom-1 left-0 h-0.5 bg-electric transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center space-x-4">
            {/* Event countdown */}
            <div className="hidden md:flex items-center bg-forest-light/50 rounded-full px-3 py-1 text-xs text-electric">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTimeRemaining()}
            </div>
            
            {/* Phase indicator */}
            <div className="hidden md:flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                gameStats.eventPhase === 'PRE_EVENT' 
                  ? 'bg-cyan/20 text-cyan' 
                  : gameStats.eventPhase === 'LIVE_EVENT'
                    ? 'bg-electric/20 text-electric'
                    : 'bg-gray-200 text-gray-800'
              }`}>
                {gameStats.eventPhase === 'PRE_EVENT' && 'Pre-Event'}
                {gameStats.eventPhase === 'LIVE_EVENT' && 'Live Event'}
                {gameStats.eventPhase === 'POST_EVENT' && 'Event Ended'}
              </span>
            </div>
            
            <Link to="/" className="hidden md:inline-block text-white hover:text-electric transition-colors relative group font-medium text-sm">
              Main Site
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
            </Link>
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-forest-light/95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
            {/* Event info for mobile */}
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <div className="flex items-center text-xs text-electric">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTimeRemaining()}
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                gameStats.eventPhase === 'PRE_EVENT' 
                  ? 'bg-cyan/20 text-cyan' 
                  : gameStats.eventPhase === 'LIVE_EVENT'
                    ? 'bg-electric/20 text-electric'
                    : 'bg-gray-200 text-gray-800'
              }`}>
                {gameStats.eventPhase === 'PRE_EVENT' && 'Pre-Event'}
                {gameStats.eventPhase === 'LIVE_EVENT' && 'Live Event'}
                {gameStats.eventPhase === 'POST_EVENT' && 'Event Ended'}
              </span>
            </div>
            
            <Link
              to="/"
              className="text-white hover:text-electric transition-colors py-1.5 border-b border-white/10 pb-1.5 flex items-center font-medium text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Main Site
            </Link>
            
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors py-1.5 border-b border-white/10 pb-1.5 flex items-center font-medium text-sm ${
                    isActive 
                      ? 'text-electric' 
                      : 'text-white hover:text-electric'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                    isActive ? 'bg-electric' : 'bg-white/50'
                  }`}></span>
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-2">
              <ConnectWallet />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default CannesHeader;
