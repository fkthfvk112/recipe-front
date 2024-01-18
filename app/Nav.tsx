"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCookie, getCookie } from "cookies-next";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import deleteAuthToken from "./(user)/signin/utils/deleteAuthToken";

const Navbar = () => {
  const [isSignInState, setIsSignInState] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);

  useEffect(() => {
    setIsSignInState(isSignIn);
  }, [isSignIn]);

  console.log("겟쿠키", getCookie("Authorization"));

  const logOutBtn = (
    <button
      onClick={() => {
        deleteAuthToken(); //server sid job
        setIsSignIn(false);
      }}
    >
      로그아웃
    </button>
  );
  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <span>로고</span>
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                {isSignInState && (
                  <Link href="/hello">
                    <p>Hello</p>
                  </Link>
                )}
              </li>
              <li>
                <Link href="/create-recipe">
                  <p>레시피 생성</p>
                </Link>
              </li>
              <li>
                <Link href="/recipe-detail/10">
                  <p>레시피 보기</p>
                </Link>
              </li>
              <li>
                <Link href="/hello-test">
                  <p>핼로2</p>
                </Link>
              </li>
            </ul>
            {isSignInState ? logOutBtn : <Link href="/signin">로그인</Link>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
