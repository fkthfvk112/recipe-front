"use client"
import { inView, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function InViewContainer({
    children,
    defaultHeight
  }: {
    children: React.ReactNode;
    defaultHeight:number;
  }) {
    const [viewRef, inview] = useInView();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(()=>{
        if(inview === true){
            setIsLoading(false);
        }
    }, [inview])

    return (
        <>
        <div className='w-full' ref={viewRef}></div>
        {
        isLoading?
        <div style={{height:defaultHeight}}></div>:
        <motion.div className="w-full flex justify-center items-center" 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            >
            {children}
        </motion.div>
        }
        </>
    )
}