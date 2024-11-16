import { Metadata } from "next";
import IntervalConfig from "./(interval)/intervalConfig";
import "./globals.css";
import MainContainer from "./MainContainer";

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
        <MainContainer>
          <IntervalConfig/>
          {children}
        </MainContainer>
      </body>
    </html>
  );
}
