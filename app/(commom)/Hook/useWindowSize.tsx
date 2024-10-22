"use client"

import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<number | null>(null);

    useEffect(()=>{
        const handleResize = () => {
          if (typeof window !== 'undefined') {
            setWindowSize(window.innerWidth);
          }
        };
          
        setWindowSize(window.innerWidth);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
          };
    }, [])

    return windowSize;
  };
  
  export default useWindowSize;