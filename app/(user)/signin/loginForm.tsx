"use client";
import { useRouter } from "next/navigation";
import React, { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { UserLoginDTO } from "@/app/(type)/user";
import Link from "next/link";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { useRecoilState } from "recoil";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [isSignIn, setIsSignIn] = useRecoilState<boolean>(siginInState);

  const router = useRouter();

  if (isSignIn) {
    router.push("/");
    return;
  }

  const signInBtnClick = () => {
    const userData: UserLoginDTO = {//have to::edit
      userId: userId,
      userPassword: userPw,
      role: "USER",
      grantType: "normal",
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/sign-in`, userData, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setIsSignIn(true);
        const storage = globalThis?.sessionStorage;
        let pathToGo = "/";
        const prePath = storage.getItem("prePath");
        if (storage && typeof prePath === "string") {
          pathToGo = storage.getItem("prePath") as string;
          storage.removeItem("prePath");
        }
        location.href = pathToGo;
      })
      .catch((err) => {
        alert("로그인 실패 " + err);
      });
  };

  return (
    <div className="p-5 max-w-sm w-96 bg-white px-4 flex flex-col justify-center items-center">
      <div className="text-center p-3">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <hr />
      <div className="m-1 w-full">
        <input
          name="userId"
          placeholder="아이디"
          type="text"
          value={userId}
          onChange={(e: any) => {
            setUserId(e.target.value);
          }}
        />
      </div>
      <div className="m-2 w-full">
        <input
          name="userPw"
          placeholder="비밀번호"
          type="password"
          value={userPw}
          onChange={(e: any) => {
            setUserPw(e.target.value);
          }}
        />
      </div>

      <button
        className="bg-amber-400 h-8 rounded-md w-1/2"
        type="submit"
        disabled={isLoading}
        onClick={signInBtnClick}
      >
        {isLoading ? "Loading..." : "로그인"}
      </button>
      <div>
        회원이 아니신가요? <Link href="/signup">회원가입</Link>
      </div>
    </div>
  );
}
