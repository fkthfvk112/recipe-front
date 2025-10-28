"use client"

import { RecoilRoot } from "recoil";
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";
import Nav from "./Nav";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { sendVisitLog } from "./(utils)/siteAccess";
import RNDefaultEmptyComp from "./(RN)/RNDefaultEmptyComp";

export default function MainContainer({
    children,
  }: {
    children: React.ReactNode;
  }){
    const {layoutPadding} = useResponsiveDesignCss();
    const [queryClient] = useState(() => new QueryClient())

    useEffect(()=>{
      sendVisitLog();
    }, [])

    return (
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Nav></Nav> 
          <main className={`min-h-screen flex flex-col justify-start items-center ${layoutPadding} bg-[#f0f0f0]`}>
              {children}
          </main>
          <RNDefaultEmptyComp/>
        </RecoilRoot>
      </QueryClientProvider>
    )
}