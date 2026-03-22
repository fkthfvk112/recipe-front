"use client";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { UserLoginDTO } from "@/app/(type)/user";
import Link from "next/link";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { defaultAxios } from "@/app/(customAxios)/authAxios";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import NaverLogin from "./naver/NaverLogin";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [isSignIn, setIsSignIn] = useRecoilState<boolean>(siginInState);
  const isTokenValid = useChkLoginToken('refreshNoNeed');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  if(!isTokenValid) return <></>
  if (isSignIn) {
    const redirect = searchParams.get("redirect");
    router.push(redirect ?? "/");
    return;
  }

  const signInBtnClick = () => {
    setIsLoading(true);
    const userData: UserLoginDTO = {//have to::edit
      userId: userId,
      userPassword: userPw,
      role: "USER",
      grantType: "normal",
    };
    
    defaultAxios
      .post('sign-api/sign-in', userData)
      .then((res)=>{
        setIsSignIn(true);
        const storage = globalThis?.sessionStorage;
        let pathToGo = "/";

        //1. 로그인 필요한 페이지에 바로 접근 시
        const redirect = searchParams.get("redirect");

        // 2. prePath 직접 설정해서 온 경우
        const prePath = storage?.getItem("prePath");

        // 3. 첫 로그인인 경우
        const firstSignin = storage?.getItem("firstSignUp");

        if (redirect) {
          pathToGo = redirect;
        }
        else if (prePath) {
          pathToGo = prePath;
          storage?.removeItem("prePath");
        }
        else if (firstSignin === "true") {
          pathToGo = "/board/3";
          storage?.removeItem("firstSignUp");
        }

        location.href = pathToGo;
      })
      .catch((err)=>{
        Swal.fire({
          title: "로그인 실패",
          text: err.response.data.message,
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: '#d33',
          allowEnterKey:false
        });
      })
      .finally(()=>{
        setIsLoading(false);
      })
  };

  return (
    <div className="p-5 max-w-sm w-96 border border-gray-[#a1a1a1] px-4 flex flex-col justify-center items-center m-10 mt-28 shadow-md bg-white">
      <div className="w-full text-center bottom-line p-2 m-2">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <div className="m-1 w-full mt-8 m">
        <input
          name="userId"
          placeholder="아이디"
          type="text"
          value={userId}
          onChange={(e: any) => {
            setUserId(e.target.value);
          }}
          onKeyDown={(evt)=>{
            if(evt.key === 'Enter'){
              signInBtnClick();
            }
          }}
        />
      </div>
      <div className="m-2 w-full mb-3">
        <input
          name="userPw"
          placeholder="비밀번호"
          type="password"
          value={userPw}
          onChange={(e: any) => {
            setUserPw(e.target.value);
          }}
          onKeyDown={(evt)=>{
            if(evt.key === 'Enter'){
              signInBtnClick();
            }
          }}
        />
      </div>

      <button
        className="bg-[#fb8500] text-white h-8 rounded-md w-full py-6 flex justify-center items-center border-none mt-3 font-bold"
        type="submit"
        disabled={isLoading}
        onClick={signInBtnClick}
      >
        {isLoading ? "Loading..." : "로그인"}
      </button>
      <div className="w-full mt-3 text-center">
        회원이 아니신가요? 
        <Link
          className="text-blue-500 ms-1"
          href={
            redirect
              ? `/signup?redirect=${encodeURIComponent(redirect)}`
              : "/signup"
          }
        >
          회원가입
        </Link>
      </div>
      <div className="flex text-gray-500 text-sm">
        <Link href="/findid">아이디 찾기</Link>
        <p className="mx-1">·</p>
        <Link href="/findpw">비밀번호 찾기</Link>
      </div>
      <div className="flex flex-col justify-center items-center mt-6">
        <span className="border-t-2 border-gray-200 w-20"/>
        <p className="text-xs text-gray-500 pt-3">SNS계정으로 간편 로그인/회원가입</p>
        <div className="flex justify-around">
          <NaverLogin/>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/welcome"
          className="text-sm text-gray-500 hover:text-[#fb8500]"
        >
          서비스 소개 보기
        </Link>
      </div>
    </div>
  );
}
