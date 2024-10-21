import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Children, ReactNode, useEffect, useState } from "react";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import useWindowSize from "../Hook/useWindowSize";

interface BottomFixedAccordionProps {
    title: string; // 아코디언 제목
    children: ReactNode; // 자식 컴포넌트
    setStaticComponent?:boolean;//아코디언이 아닌 스태틱한 컴포넌트로 전환
}
export default function BottomFixedAccordion({ title, children, setStaticComponent=false }: BottomFixedAccordionProps) {
    const [isOpen, setOpen] = useState<boolean>(true);
    const {layoutMargin} = useResponsiveDesignCss();
    const [containerClass, setContainerClass] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        if (setStaticComponent) {
            setOpen(true);
            setContainerClass(`bg-white p-6 w-full ${layoutMargin} rounded-t-3xl max-w-[700px] mx-auto z-40`);
        } else {
            setContainerClass(`bg-white p-6 fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full ${layoutMargin} rounded-t-3xl max-w-[700px] mx-auto z-40`);
        }
        setLoading(false)
    }, [setStaticComponent])

    return (
        <>
        {!setStaticComponent&&isOpen&&<div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={()=>setOpen(false)} />}
        {!loading&&
        <section className={containerClass}>
            <div className="w-full" onClick={()=>setOpen(!isOpen)}>
                <h2 className="text-xl">{title}</h2>
            </div>
            <div className={`transition-all duration-150 ease-in-out ${isOpen?'max-h-500':'max-h-0'} overflow-y-hidden`}>
                {children}
            </div>
        </section>
        }
        </>
    )
}