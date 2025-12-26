import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import decycleLogo from '../../assets/Decycle Logo (1)_transparent.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-6 md:px-8 py-5 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link to="/" onClick={() => window.scrollTo(0, 0)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <img 
              src={decycleLogo} 
              alt="Decycle" 
              className="h-12 w-auto"
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link 
            to="/" 
            className="text-charcoal hover:text-forest transition-colors relative group font-semibold text-sm tracking-wide"
            onClick={() => window.scrollTo(0, 0)}
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
          </Link>
          <a href="/#how-it-works" className="text-charcoal hover:text-forest transition-colors relative group font-semibold text-sm tracking-wide">
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="/#technology" className="text-charcoal hover:text-forest transition-colors relative group font-semibold text-sm tracking-wide">
            Technology
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="https://linktr.ee/decycle_io"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-forest text-white font-semibold rounded-lg hover:bg-forest-light transition-all duration-200 text-sm"
          >
            Join Community
          </a>
        </nav>

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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-sm border-t border-forest/10"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => {
                setIsMenuOpen(false);
                window.scrollTo(0, 0);
              }}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Home
            </Link>
            <a
              href="/#impact"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Impact
            </a>
            <a
              href="/#how-it-works"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              How It Works
            </a>
            <a
              href="/#technology"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Technology
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
