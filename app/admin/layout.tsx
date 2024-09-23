"use client"

import { useEffect, useState } from "react";
import TitleDescription from "../(commom)/Component/TitleDescription";
import AdminNav from "./AdminNav";
import { isAdmin } from "../(user)/signin/utils/authUtil";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }){
    const [isAdminChk, setIsAdmin] = useState<boolean>(false);
    const router = useRouter();

    useEffect(()=>{
      isAdmin().then((res)=>{
          if(res === true){
              setIsAdmin(true);
          }
          else{
            router.push("/");
          }
      })
    }, [])

    return (
      <div className={`bg-red-400 defaultOuterContainer flex pb-20`}>
        <AdminNav/>
        <TitleDescription title="어드민 페이지" desc={"어드민이 아닌 경우 사용을 금함"}/>
        <main className="defaultInnerContainer">
            {isAdminChk&&children}
        </main>
      </div>
)
}