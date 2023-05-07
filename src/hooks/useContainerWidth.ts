// hooks/useContainerWidth.ts
import { useState, useEffect, RefObject } from 'react';

const useContainerWidth = (containerRef: RefObject<HTMLElement>): number | undefined => {
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, [containerRef]);

  return containerWidth;
};

export default useContainerWidth;
