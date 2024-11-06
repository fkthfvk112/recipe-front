"use client";
import { useEffect } from "react";
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";
import "./globals.css";
import Nav from "./Nav";
import { RecoilRoot } from "recoil";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {layoutPadding} = useResponsiveDesignCss();
  
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <Nav></Nav>
          <main className={`min-h-screen flex flex-col justify-start items-center ${layoutPadding} bg-[#f0f0f0]`}>
            {children}
          </main>
        </RecoilRoot>
      </body>
    </html>
  );
}
