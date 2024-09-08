"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilState, useResetRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";
import { deleteAuthToken, isLogin } from "./(user)/signin/utils/authUtil";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar } from "@mui/material";
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import GoBoardBtn from "./GoBoardBtn";
const Navbar = () => {
  const [localSignInState, setLocalSignInState] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
  const {navCss} = useResponsiveDesignCss();

  const router = useRouter();

  const pathname = usePathname();

  const goToSiginInPage = () => {
    const storage = globalThis?.sessionStorage;
    if (storage) {
      storage.setItem("prePath", pathname);
    }
    router.push("/signin");
  };

  useEffect(()=>{
    if(isSignIn === false){
      deleteAuthToken();
    }

    isLogin()
      .then((res)=>{
        if(res === false){
          setIsSignIn(false);
        }
      })

      setLocalSignInState(isSignIn);
  }, [isSignIn])


  const goBoard = () => {
      router.push("/board/1");
  };

  return (
    <>
      <div className={navCss}>
        <div className="container mx-auto px-4 h-full">
          <ul className="flex justify-around items-center h-full">
            <li>
            <Link href="/">
              <div className="flex flex-col justify-center items-center">
                <HomeIcon sx={{width:'30px', height:'30px'}}/>
                <p>홈</p>
              </div>
            </Link>
            </li>
              <li>
                <Link href="/recipes/1/servingsMin=1&servingsMax=20&sortingCondition=POPULARITY">
                  <div className="flex flex-col justify-center items-center">
                    <RestaurantMenuIcon sx={{width:'30px', height:'30px'}}/>
                    <p>레시피</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/randomMenu">
                  <div className="flex flex-col justify-center items-center">
                    <QuestionMarkIcon sx={{width:'30px', height:'30px'}}/>
                    <p>뭐먹지?</p>
                  </div>
                </Link>
              </li>
              <li>
                <GoBoardBtn/>
              </li>
              {/* <li>
                <div onClick={goBoard}>
                  <div className="flex flex-col justify-center items-center">
                    <LibraryBooksIcon sx={{width:'30px', height:'30px'}}/>
                    <p>게시판</p>
                  </div>
                </div>
              </li> */}
              <li>
                <div className="flex flex-col justify-center items-center pb-3">
                {localSignInState ? (
                  <AccountMenu />
                ) : (
                  <div className="cursor-pointer" onClick={goToSiginInPage}>
                    <Avatar sx={{ width: 43, height: 43 }}><span className="text-sm font-extrabold">로그인</span></Avatar>
                  </div>
                )}
                </div>
              </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default React.memo(Navbar);
