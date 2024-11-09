"use client"

import { RecoilRoot } from "recoil";
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";
import Nav from "./Nav";

export default function MainContainer({
    children,
  }: {
    children: React.ReactNode;
  }){
    const {layoutPadding} = useResponsiveDesignCss();

    return (
        <RecoilRoot>
          <Nav></Nav> 
            <main className={`min-h-screen flex flex-col justify-start items-center ${layoutPadding} bg-[#f0f0f0]`}>
                {children}
            </main>
        </RecoilRoot>
    )
}