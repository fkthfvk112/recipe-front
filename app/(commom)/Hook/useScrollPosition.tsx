"use client"

import { useState, useEffect } from 'react';

const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
0
  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrollY(window.scrollY);
      setScrollX(window.scrollX);
    }, 300);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollX, scrollY };
};

export default useScrollPosition;


const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timerId: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => func(...args), delay);
  };
};
