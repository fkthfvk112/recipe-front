"use client"

import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { debounce } from "../Function/debounc";

interface BottomFixedAccordionProps {
    title: string; // 아코디언 제목
    children: ReactNode; // 자식 컴포넌트
    setStaticComponent?:boolean;//아코디언이 아닌 스태틱한 컴포넌트로 전환
}
export default function BottomFixedAccordion({ title, children, setStaticComponent=false}: BottomFixedAccordionProps) {
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
            const handleMouseMoveWindow = (e: MouseEvent) => handleMouseMove(e);
            window.addEventListener("mousemove", handleMouseMoveWindow);
            window.addEventListener("mouseup", handleMouseUp);

            return () => {
                window.removeEventListener("mousemove", handleMouseMoveWindow);
                window.removeEventListener("mouseup", handleMouseUp);
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
        if(!isOpen) return;
        setIsDragging(true);
        setStartY(e.clientY || e.touches[0].clientY);
    };

    const handleMouseMove = (e:any) => {
        if(!isOpen || !isDragging) return;
        e.preventDefault();
        const clientY = e.clientY || e.touches[0].clientY;
        const deltaY = clientY - startY; // 현재 Y 위치와 시작 Y 위치의 차이 계산
        const newBottomPosition = initialBottom - deltaY > 0? 0 : initialBottom - deltaY;
        setCurrentBottom(newBottomPosition); // bottom을 업데이트
        if(newBottomPosition < -500){
            handleClose();
        }
    };

    const handleMouseUp = () => {
        if(!isOpen) return;
        setIsDragging(false);
        setInitialBottom(currentBottom); // 드래그 종료 시 현재 bottom 값을 초기화
    };


    return (
        <>
        {!setStaticComponent&&isOpen&&<div className="fixed inset-0 bg-black bg-opacity-50 z-30" />}
        {!loading&&
        <section className={containerClass} 
            onMouseDown={(e)=>{handleMouseDown(e)}}
            onTouchStart={(e)=>{handleMouseDown(e)}}
            onMouseUp={(e)=>{handleMouseUp()}}
            onTouchEnd={(e)=>handleMouseUp()}
            style={{bottom:currentBottom}}
            >
            <div className="w-full flex justify-between items-center">
                <h2 className="text-xl">{title}</h2>
                {
                    !setStaticComponent&&isOpen&&
                    <KeyboardArrowDownIcon sx={{width:"35px", height:"35px"}}  onClick={()=>handleClose()}/>
                }
                {
                    !setStaticComponent&&!isOpen&&
                    <KeyboardArrowUpIcon sx={{width:"35px", height:"35px"}}  onClick={()=>handleOpen()}/>
                }
                
            </div>
            <div className={`transition-all duration-150 ease-in-out ${isOpen?'max-h-500':'max-h-0'} overflow-y-hidden`}>
                {children}
            </div>
        </section>
        }
        </>
    )
}