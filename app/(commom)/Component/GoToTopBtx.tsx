"use client"

import React, { useState, useEffect } from 'react';
import useResponsiveDesignCss from '../Hook/useResponsiveDesignCss';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ScrollToTopButton({marginBottom}:{marginBottom?:number}){
  if(marginBottom === undefined || marginBottom === null){
    marginBottom = 0
  };
  
  const [isVisible, setIsVisible] = useState(false);
  const {layoutBottomMargin} = useResponsiveDesignCss();

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className={`relative mb-${marginBottom} ${layoutBottomMargin}`}>
      {isVisible && (
        <button onClick={scrollToTop} className="rounded-full w-[60px] h-[60px] flex-center-col border-none bg-[#a1a1a1] opacity-55">
          <KeyboardArrowUpIcon sx={{width:"50px", height:"50px", fill:"white"}}/>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
