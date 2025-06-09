import React, { useEffect } from 'react';
import { useScrollToAnchor } from '../../hooks/useScrollToAnchor';

/**
 * Component that handles scroll restoration and anchor navigation
 * This component doesn't render anything, it just uses the useScrollToAnchor hook
 * and ensures the page is scrolled to the top when it mounts
 */
const ScrollToTop: React.FC = () => {
  useScrollToAnchor();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return null;
};

export default ScrollToTop;
