"use client"

import { RecoilRoot } from "recoil";
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";
import Nav from "./Nav";
import { useEffect } from "react";
import { getCookie } from 'cookies-next';
import { defaultAxios } from "./(customAxios)/authAxios";
import ImgModal from "./(commom)/Component/ImgModal";
import { sendVisitLog } from "./(utils)/siteAccess";

export default function MainContainer({
    children,
  }: {
    children: React.ReactNode;
  }){
    const {layoutPadding} = useResponsiveDesignCss();

    useEffect(()=>{
      sendVisitLog();
    }, [])

    return (
        <RecoilRoot>
          <Nav></Nav> 
            <main className={`min-h-screen flex flex-col justify-start items-center ${layoutPadding} bg-[#f0f0f0]`}>
                {children}
            </main>
        </RecoilRoot>
    )
}