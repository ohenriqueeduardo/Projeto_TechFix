import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  
  // Keep track of scroll positions for keys (unique per history entry)
  const scrollPositions = useRef<Record<string, number>>({});

  // 1. Save scroll position of the current page before navigating away
  useEffect(() => {
    const handleScroll = () => {
      // Save both window scroll and main container scroll if applicable
      scrollPositions.current[key] = window.scrollY;
      
      const mainContainer = document.querySelector('main, .overflow-y-auto');
      if (mainContainer) {
        scrollPositions.current[`container_${key}`] = mainContainer.scrollTop;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // We also listen to scroll events on inner containers
    const mainContainer = document.querySelector('main, .overflow-y-auto');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [key]);

  // 2. Restore or reset scroll position on navigation
  useEffect(() => {
    if (navigationType === 'POP') {
      // Navigated via BACK/FORWARD button: restore previous scroll position
      const savedWindowScroll = scrollPositions.current[key];
      const savedContainerScroll = scrollPositions.current[`container_${key}`];

      // Restore window scroll
      if (savedWindowScroll !== undefined) {
        window.scrollTo(0, savedWindowScroll);
      } else {
        window.scrollTo(0, 0);
      }

      // Restore inner container scroll
      const mainContainer = document.querySelector('main, .overflow-y-auto');
      if (mainContainer) {
        if (savedContainerScroll !== undefined) {
          mainContainer.scrollTop = savedContainerScroll;
        } else {
          mainContainer.scrollTop = 0;
        }
      }
    } else {
      // Navigated via standard PUSH/REPLACE (forward navigation): scroll to top
      window.scrollTo(0, 0);
      
      const mainContainer = document.querySelector('main, .overflow-y-auto');
      if (mainContainer) {
        mainContainer.scrollTop = 0;
      }
    }
  }, [pathname, key, navigationType]);

  return null;
}
