import { Metadata } from "next";
import IntervalConfig from "./(interval)/intervalConfig";
import "./globals.css";
import MainContainer from "./MainContainer";
import NextTopLoader from 'nextjs-toploader';
import Script from "next/script";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "머그인",
    description:"재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    icons:{
      icon:"/common/favicon.png"
    },
    openGraph:{
      title: "머그인",
      description:"재료를 공유하고 관리하고 소비해요. 낭비없는 삶 머그인",
    }
  }
}
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <body>
      <Script
          src='https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js'
          strategy='beforeInteractive'
        />
      <NextTopLoader color="#FB8500" showSpinner={false} zIndex={50000}/>
        <MainContainer>
          {/* <IntervalConfig/> */}
          {children}
        </MainContainer>
      </body>
    </html>
  );
}
