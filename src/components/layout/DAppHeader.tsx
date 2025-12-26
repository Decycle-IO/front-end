import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ConnectWallet } from '../dapp/wallet/ConnectWallet';
import decycleLogo from '../../assets/Decycle Logo (1)_transparent.png';

const navItems = [
  { path: '/dapp', label: 'Dashboard' },
  { path: '/dapp/collection', label: 'Collection' },
  { path: '/dapp/stake', label: 'Staking' },
  { path: '/dapp/achievements', label: 'Achievements' },
  { path: '/dapp/profile', label: 'Profile' },
];

const DAppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-forest/10">
      <div className="container mx-auto px-4 py-2">
        {/* Combined Logo, Navigation and Wallet */}
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/dapp" className="flex items-center mr-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <img 
                  src={decycleLogo} 
                  alt="Decycle" 
                  className="h-10 w-auto"
                />
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
                        ? 'text-forest' 
                        : 'text-charcoal hover:text-forest'
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
            <Link to="/" className="hidden md:inline-block text-charcoal hover:text-forest transition-colors relative group font-medium text-sm">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
            </Link>
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-charcoal focus:outline-none"
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
          className="md:hidden bg-white/95 backdrop-blur-sm border-t border-forest/10"
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
            <Link
              to="/"
              className="text-charcoal hover:text-forest transition-colors py-1.5 border-b border-gray-100 pb-1.5 flex items-center font-medium text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Home
            </Link>
            
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors py-1.5 border-b border-gray-100 pb-1.5 flex items-center font-medium text-sm ${
                    isActive 
                      ? 'text-forest' 
                      : 'text-charcoal hover:text-forest'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                    isActive ? 'bg-electric' : 'bg-gray-300'
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

export default DAppHeader;
