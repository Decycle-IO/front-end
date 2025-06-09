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
          const headerHeight = 100;
          
          // Calculate the element's position relative to the viewport
          const elementPosition = element.getBoundingClientRect().top;
          
          // Calculate the offset position
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          
          // Scroll to the element with the offset
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location]);
};
