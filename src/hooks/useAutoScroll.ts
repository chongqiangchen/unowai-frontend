import { useState, useEffect, useRef } from "react";

const useAutoScroll = (content: any) => {
  const [lockScroll, setLockScroll] = useState(false);
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (!lockScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content, lockScroll]);

  const handleScroll = (e: any) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    setLockScroll(!(scrollTop + clientHeight >= scrollHeight));
  };

  return { containerRef, lockScroll, handleScroll };
};

export default useAutoScroll;
