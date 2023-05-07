import { useState, useEffect } from 'react';

type Breakpoints = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const useResponsive = (): Breakpoints => {
  const [breakpoint, setBreakpoint] = useState<Breakpoints>('sm');

  const updateBreakpoint = (): void => {
    const windowWidth = window.innerWidth;

    if (windowWidth < 640) {
      setBreakpoint('sm');
    } else if (windowWidth >= 640 && windowWidth < 768) {
      setBreakpoint('md');
    } else if (windowWidth >= 768 && windowWidth < 1024) {
      setBreakpoint('lg');
    } else if (windowWidth >= 1024 && windowWidth < 1280) {
      setBreakpoint('xl');
    } else {
      setBreakpoint('2xl');
    }
  };

  useEffect(() => {
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return breakpoint;
};

export default useResponsive;
