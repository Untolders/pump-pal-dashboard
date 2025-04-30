
import { useState, useEffect } from "react";

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Tailwind's default breakpoints in pixels
const breakpoints = {
  xs: 0,    // Extra small (mobile phones)
  sm: 640,  // Small (large phones, small tablets)
  md: 768,  // Medium (tablets)
  lg: 1024, // Large (desktops)
  xl: 1280, // Extra large (large desktops)
  '2xl': 1536 // 2X Extra large (very large monitors)
};

/**
 * Hook to check if the viewport matches a specific breakpoint
 * @param breakpoint - Target breakpoint ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 * @param direction - Direction for comparison ('up' means >= breakpoint, 'down' means < breakpoint)
 * @returns Boolean indicating if the viewport matches the condition
 */
export function useBreakpoint(breakpoint: Breakpoint, direction: 'up' | 'down' = 'up'): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Set initial value
    const checkMatches = () => {
      if (direction === 'up') {
        setMatches(window.innerWidth >= breakpoints[breakpoint]);
      } else {
        setMatches(window.innerWidth < breakpoints[breakpoint]);
      }
    };
    
    checkMatches();
    
    // Add event listener
    window.addEventListener('resize', checkMatches);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMatches);
  }, [breakpoint, direction]);
  
  return matches;
}

/**
 * Hook to get the current breakpoint
 * @returns Current breakpoint ('xs', 'sm', 'md', 'lg', 'xl', '2xl')
 */
export function useCurrentBreakpoint(): Breakpoint {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return currentBreakpoint;
}

/**
 * Hook to check if the device is mobile
 * @returns Boolean indicating if the viewport is mobile-sized (< md)
 */
export function useIsMobile(): boolean {
  return useBreakpoint('md', 'down');
}

/**
 * Hook to check if the device is a tablet
 * @returns Boolean indicating if the viewport is tablet-sized (>= md and < lg)
 */
export function useIsTablet(): boolean {
  const isAtLeastMd = useBreakpoint('md', 'up');
  const isBelowLg = useBreakpoint('lg', 'down');
  
  return isAtLeastMd && isBelowLg;
}

/**
 * Hook to check if the device is a desktop
 * @returns Boolean indicating if the viewport is desktop-sized (>= lg)
 */
export function useIsDesktop(): boolean {
  return useBreakpoint('lg', 'up');
}
