import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to handle scrolling to anchors and resetting scroll position on navigation
 */
export const useScrollToAnchor = () => {
  const location = useLocation();
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    // Check if the path has changed (not just the hash)
    const currentPath = location.pathname;
    const hasPathChanged = currentPath !== lastPathRef.current;
    
    // Update the last path
    lastPathRef.current = currentPath;

    // If the path has changed or there's no hash, scroll to top
    if (hasPathChanged || !location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Handle hash/anchor navigation
    if (location.hash) {
      // Remove the # character
      const elementId = location.hash.substring(1);
      
      // Find the element with the matching ID
      const element = document.getElementById(elementId);
      
      if (element) {
        // Use setTimeout to ensure the DOM has fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
};
