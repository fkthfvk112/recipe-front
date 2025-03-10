"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar } from "@mui/material";
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import GoBoardBtn from "./GoBoardBtn";
import useSyncLogin from "./(commom)/Hook/useSyncLogin";
const Navbar = () => {
  //const [localSignInState, setLocalSignInState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
  const {navCss} = useResponsiveDesignCss();
  const syncTrigger = useSyncLogin();

  const router = useRouter();

  const pathname = usePathname();

  const goToSiginInPage = () => {
    const storage = globalThis?.sessionStorage;
    if (storage && !pathname.includes("signin") && !pathname.includes("signup") && !pathname.includes("callback")) {
      storage.setItem("prePath", pathname);
    }
    router.push("/signin");
  };

  useEffect(()=>{
    setIsLoading(false);
  }, [isSignIn])


  const containInRoute = (text:string):boolean=>{
    if(text === "home" && pathname === "/") return true;
    if(pathname.includes(text)) return true;
    return false;
  }

  return (
    <>
    {
      !isLoading&&
      <nav className={navCss}>
        <div className="container mx-auto px-4 h-full">
          <ul className="flex justify-around items-center h-full">
            <li>
            <Link href="/">
              <div className="flex flex-col justify-center items-center">
                <HomeIcon sx={{width:'30px', height:'30px', fill:containInRoute("home")?"black":"gray"}}/>
                <p>홈</p>
              </div>
            </Link>
            </li>
              <li>
                <Link href="/recipes/1/sortingCondition=POPULARITY">
                  <div className="flex flex-col justify-center items-center">
                    <RestaurantMenuIcon sx={{width:'30px', height:'30px', fill:containInRoute("recipe")?"black":"gray"}}/>
                    <p>레시피</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/randomMenu">
                  <div className="flex flex-col justify-center items-center">
                    <QuestionMarkIcon sx={{width:'30px', height:'30px', fill:containInRoute("randomMenu")?"black":"gray"}}/>
                    <p>뭐먹지?</p>
                  </div>
                </Link>
              </li>
              <li>
                <GoBoardBtn />
              </li>
              <li>
                <div className="flex flex-col justify-center items-center pb-3">
                {isSignIn ? (
                  <AccountMenu />
                ) : (
                  <div className="cursor-pointer" onClick={goToSiginInPage}>
                    <Avatar sx={{ width: 43, height: 43, fill:containInRoute("recipe")?"black":"gray"}}><span className="text-sm font-extrabold">로그인</span></Avatar>
                  </div>
                )}
                </div>
              </li>
          </ul>
        </div>
      </nav>
    }
    </>
  );
};

export default React.memo(Navbar);
