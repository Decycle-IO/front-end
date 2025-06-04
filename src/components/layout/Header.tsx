import { useState } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 to-forest/5 backdrop-blur-sm shadow-sm border-b border-forest/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7 mr-2 text-electric" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className="text-forest text-2xl font-bold tracking-tight">
              Decycle
            </span>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#hero" className="text-charcoal hover:text-forest transition-colors relative group font-medium text-sm tracking-wide">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#how-it-works" className="text-charcoal hover:text-forest transition-colors relative group font-medium text-sm tracking-wide">
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#technology" className="text-charcoal hover:text-forest transition-colors relative group font-medium text-sm tracking-wide">
            Technology
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-electric group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#contact" className="btn btn-primary shadow-sm hover:shadow-md transition-shadow text-sm font-medium">
            Get Started
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
            <a
              href="#hero"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Home
            </a>
            <a
              href="#features"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              How It Works
            </a>
            <a
              href="#technology"
              className="text-charcoal hover:text-forest transition-colors py-2 border-b border-gray-100 pb-2 flex items-center font-medium text-sm tracking-wide"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-electric rounded-full mr-2"></span>
              Technology
            </a>
            <a
              href="#contact"
              className="btn btn-primary text-center shadow-sm mt-2 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
