"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserLoginDTO } from "@/app/(type)/user";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { defaultAxios } from "@/app/(customAxios)/authAxios";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import NaverLogin from "./naver/NaverLogin";
import { PrimaryButton } from "@/app/(commom)/Component/Buttons";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [isSignIn, setIsSignIn] = useRecoilState<boolean>(siginInState);
  const isTokenValid = useChkLoginToken("refreshNoNeed");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  if (!isTokenValid) return <></>;
  if (isSignIn) {
    router.push(redirect ?? "/");
    return null;
  }

  const signInBtnClick = () => {
    if (!userId.trim()) {
      Swal.fire({ title: "아이디를 입력해주세요.", icon: "warning" });
      return;
    }
    if (!userPw.trim()) {
      Swal.fire({ title: "비밀번호를 입력해주세요.", icon: "warning" });
      return;
    }

    setIsLoading(true);
    const userData: UserLoginDTO = {
      userId: userId,
      userPassword: userPw,
      role: "USER",
      grantType: "normal",
    };

    defaultAxios
      .post("sign-api/sign-in", userData)
      .then((res) => {
        setIsSignIn(true);
        const storage = globalThis?.sessionStorage;
        let pathToGo = "/";

        const prePath = storage?.getItem("prePath");
        const firstSignin = storage?.getItem("firstSignUp");

        if (redirect) {
          pathToGo = redirect;
        } else if (prePath) {
          pathToGo = prePath;
          storage?.removeItem("prePath");
        } else if (firstSignin === "true") {
          pathToGo = "/board/3";
          storage?.removeItem("firstSignUp");
        }

        router.replace(pathToGo);
        router.refresh();
      })
      .catch((err) => {
        Swal.fire({
          title: "로그인 실패",
          text: err.response?.data?.message || "아이디 또는 비밀번호를 확인해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#10b981",
          allowEnterKey: false,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-gray-50/60 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xs flex flex-col gap-6">
        
        {/* 상단 브랜딩 & 로고 헤더 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/common/logo.png"
            alt="머그인 로고"
            width={160}
            height={50}
            className="h-auto object-contain"
            priority
          />
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            낭비 없는 삶, 머그인에 오신 것을 환영합니다.
          </p>
        </div>

        {/* 폼 영역 */}
        <div className="flex flex-col gap-3.5 mt-1">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400 pointer-events-none flex items-center">
              <PersonOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <input
              name="userId"
              placeholder="아이디 입력"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(evt) => {
                if (evt.key === "Enter") signInBtnClick();
              }}
              className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400 pointer-events-none flex items-center">
              <LockOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <input
              name="userPw"
              placeholder="비밀번호 입력"
              type="password"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              onKeyDown={(evt) => {
                if (evt.key === "Enter") signInBtnClick();
              }}
              className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
          </div>

          <PrimaryButton
            size="lg"
            fullWidth
            loading={isLoading}
            onClick={signInBtnClick}
            className="mt-2 py-3.5 text-base font-extrabold shadow-md hover:shadow-lg"
          >
            로그인
          </PrimaryButton>
        </div>

        {/* 계정 찾기 & 회원가입 서소한 보조 링크 */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Link href="/findid" className="hover:text-emerald-600 transition-colors">
              아이디 찾기
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/findpw" className="hover:text-emerald-600 transition-colors">
              비밀번호 찾기
            </Link>
          </div>

          <Link
            href={
              redirect
                ? `/signup?redirect=${encodeURIComponent(redirect)}`
                : "/signup"
            }
            className="font-bold text-[#FF7043] hover:underline"
          >
            회원가입
          </Link>
        </div>

        {/* 소셜 간편 로그인 */}
        <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-100">
          <span className="text-[11px] font-bold text-gray-400">
            SNS 계정으로 간편 로그인
          </span>
          <div className="flex justify-center">
            <NaverLogin />
          </div>
        </div>

        {/* 하단 서비스 소개 텍스트 */}
        <div className="text-center pt-2">
          <Link
            href="/welcome"
            className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
          >
            머그인 서비스 소개 보기 &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
