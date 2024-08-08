"use client"

import React, { useState, useEffect } from 'react';
import useResponsiveDesignCss from '../Hook/useResponsiveDesignCss';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ScrollToTopButton(){
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
    <div className={`fixed bottom-3 right-2 ${layoutBottomMargin}`}>
      {isVisible && (
        <button onClick={scrollToTop} className="rounded-full w-14 h-14 flex-center-col border-none bg-[#a1a1a1] opacity-55">
          <KeyboardArrowUpIcon sx={{width:"50px", height:"50px", fill:"white"}}/>
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
