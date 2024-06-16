"use server"

import serverFetch from "@/app/(commom)/serverFetch";
import Link from "next/link";

interface FetchData{
    userNickName:string
}
export default async function SignUpConfirm({
    params,
  }: {
    params: { uuid: string };
  }){
    const fetchData:FetchData = await serverFetch({
        url:`sign-api/confirm/${params.uuid}`,
        option:{
            cache:"no-cache",
        }
    }).catch((e)=>{
        console.log("익셈", e);
    });

    
    return (
        <div className="max-w-2xl h-[600px] w-full mt-12 p-5 m-3 shadow-md border border-gray-[#a1a1a1]">
            <div className="w-full">
                <h1 className="mt-10 mb-14 text-3xl text-center">🎉회원가입 완료!</h1>
                <h1 className="text-2xl">안녕하세요!</h1>
                <h1 className="text-2xl">기다리고 있었어요.</h1>
            </div>
            <div className="bottom-line"/>
            <p className="font-bold mt-12">지금 바로 머그인의 다양한 서비스를 이용할 수 있어요.</p>
            <div className="mt-[200px] text-center">
                <Link href={"/signin"} className="saveBtn w-[150px] p-3 ps-8 pe-8">로그인 페이지로</Link>
            </div>
        </div>
    )
}