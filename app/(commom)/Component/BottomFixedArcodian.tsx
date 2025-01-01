"use client"

import { ReactNode, useEffect, useState } from "react";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion } from 'framer-motion';

interface BottomFixedAccordionProps {
    title: string; // 아코디언 제목
    children: ReactNode; // 자식 컴포넌트
    setStaticComponent?:boolean;//아코디언이 아닌 스태틱한 컴포넌트로 전환
    scrollLock?:boolean;
}
export default function BottomFixedAccordion({ title, children, setStaticComponent=false, scrollLock=true}: BottomFixedAccordionProps) {
    const [initialBottom, setInitialBottom] = useState(0); // 초기 bottom 값
    const [startY, setStartY] = useState(0); // 마우스 누르기 시작한 Y 위치
    const [currentBottom, setCurrentBottom] = useState(initialBottom); // 현재 bottom 값
  
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const [isOpen, setOpen] = useState<boolean>(true);
    const {layoutBottomMargin} = useResponsiveDesignCss();
    const [containerClass, setContainerClass] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if (setStaticComponent === true) {
            setOpen(true);
            setContainerClass(`bg-white p-6 w-full rounded-t-3xl max-w-[700px] mx-auto z-40 ${layoutBottomMargin}`);
        } else {
            setContainerClass(`bg-white p-6 fixed bottom-0 left-1/2 shadow-top transform -translate-x-1/2 w-full ${layoutBottomMargin} rounded-t-3xl max-w-[700px] mx-auto z-40`);
        }
        setLoading(false)
    }, [setStaticComponent, layoutBottomMargin])

    useEffect(() => {
        if (isDragging) {
            const handleMouseMoveWindow = (e: MouseEvent | TouchEvent) => handleMouseMove(e);

            window.addEventListener("mousemove", handleMouseMoveWindow);
            window.addEventListener("mouseup", handleMouseUp);

            window.addEventListener("touchmove", handleMouseMoveWindow, { passive: false });
            window.addEventListener("touchend", handleMouseUp);

            return () => {
                window.removeEventListener("mousemove", handleMouseMoveWindow);
                window.removeEventListener("mouseup", handleMouseUp);

                window.removeEventListener("touchmove", handleMouseMoveWindow);
                window.removeEventListener("touchend", handleMouseUp);
            };
        }
    }, [isDragging]); // isDragging이 true일 때만 이벤트 리스너를 추가 

    const handelOpenClose = ()=>{
        setOpen(!isOpen);
        setInitialBottom(0);
        setStartY(0);
        setCurrentBottom(0);
        setIsDragging(false);
    }

    const handleClose = ()=>{
        setOpen(false);
        setInitialBottom(0);
        setStartY(0);
        setCurrentBottom(0);
        setIsDragging(false);
    }

    const handleOpen = ()=>{
        setOpen(true);
        setInitialBottom(0);
        setStartY(0);
        setCurrentBottom(0);
        setIsDragging(false);
    }

    const handleMouseDown = (e:any) => {
        if(scrollLock === true) return;
        if(!isOpen){
            setOpen(true);
            return;
        };
        setIsDragging(true);
        setStartY(e.clientY || e.touches[0].clientY);
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if(scrollLock === true) return;

        if(!isOpen || !isDragging) return;
        e.preventDefault();
        const clientY = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
        const deltaY = clientY - startY; // 현재 Y 위치와 시작 Y 위치의 차이 계산
        const newBottomPosition = initialBottom - deltaY > 0? 0 : initialBottom - deltaY;
        setCurrentBottom(newBottomPosition); // bottom을 업데이트
        if(newBottomPosition < -150){
            handleClose();
        }
    };

    const handleMouseUp = (e: any) => {
        if(!isOpen) return;
        setIsDragging(false);
        setInitialBottom(currentBottom); // 드래그 종료 시 현재 bottom 값을 초기화
    };


    return (
        <>
        {!setStaticComponent&&isOpen&&<div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={()=>setOpen(false)} />}
        {!loading&&
        <motion.section 
            className={`${containerClass} overscroll-none overflow-y-hidden touch-none pb-10`} 
            onMouseDown={(e)=>{handleMouseDown(e)}}
            onTouchStart={(e)=>{handleMouseDown(e)}}
            onMouseUp={(e)=>{handleMouseUp(e)}}
            onTouchEnd={(e)=>handleMouseUp(e)}
            style={{bottom:currentBottom}}
            animate={{ height: isOpen ? 'auto' : 0 }}
            transition={{
                ease:"easeIn",
                duration:0.3
            }}
            >
            <div className="w-full flex justify-between items-center select-none">
                <h2 className="text-xl">{title}</h2>
                {
                    !setStaticComponent&&isOpen&&
                    <KeyboardArrowDownIcon sx={{width:"35px", height:"35px"}}/>
                }
                {
                    !setStaticComponent&&!isOpen&&
                    <KeyboardArrowUpIcon sx={{width:"35px", height:"35px"}}/>
                }
                
            </div>
            <div className={`${isOpen?'max-h-500':'max-h-0'} overflow-y-hidden `}>
                {children}
            </div>
        </motion.section>
        }
        </>
    )
}