"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import AccountMenu from "./AccountMenu";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";
import GoBoardBtn from "./GoBoardBtn";
import useSyncLogin from "./(commom)/Hook/useSyncLogin";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSignIn] = useRecoilState(siginInState);
  const { navCss } = useResponsiveDesignCss();
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

  useEffect(() => {
    setIsLoading(false);
  }, [isSignIn]);

  const containInRoute = (text: string): boolean => {
    if (text === "home" && pathname === "/") return true;
    if (text !== "home" && pathname.includes(text)) return true;
    return false;
  };

  // Standard Green (#1c7c54) matching RecipeFilterPopovers design standard
  const activeColor = "#1c7c54";
  const inactiveColor = "#9CA3AF";

  return (
    <>
      {!isLoading && (
        <nav 
          className={`${navCss} font-pyeojin md:fixed md:top-0 md:bottom-auto w-full md:h-[70px] bg-white/90 md:bg-white backdrop-blur-md border-t border-gray-200/60 md:border-t-0 md:border-b shadow-sm z-50 transition-all`}
        >
          {/* ================================================================= */}
          {/* 1. 데스크탑 뷰 */}
          {/* ================================================================= */}
          <div className="hidden md:flex justify-between items-center w-full max-w-[1200px] mx-auto h-full px-6">
            
            {/* Left: Logo */}
            <Link href="/">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <div className="relative w-20 h-20">
                  <Image 
                    src="/common/logo.png" 
                    alt="mugin logo" 
                    fill 
                    sizes="50px"
                    className="object-contain" 
                  />
                </div>
                <span className="text-[19px] font-black text-gray-900 tracking-tight">
                  머그인 레시피
                </span>
              </div>
            </Link>

            {/* Center: Text Menus */}
            <ul className="flex items-center gap-10">
              <li>
                <Link href="/">
                  <span className={`text-[15px] transition-colors cursor-pointer hover:text-gray-900 ${containInRoute("home") ? "text-gray-900 font-extrabold" : "text-gray-600 font-bold"}`}>
                    홈
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/recipes/1/sortingCondition=POPULARITY">
                  <span className={`text-[15px] transition-colors cursor-pointer hover:text-gray-900 ${containInRoute("recipe") ? "text-gray-900 font-extrabold" : "text-gray-600 font-bold"}`}>
                    레시피 검색
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/randomMenu">
                  <span className={`text-[15px] transition-colors cursor-pointer hover:text-gray-900 ${containInRoute("randomMenu") ? "text-gray-900 font-extrabold" : "text-gray-600 font-bold"}`}>
                    뭐먹지?
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/post">
                  <span className={`text-[15px] transition-colors cursor-pointer hover:text-gray-900 ${containInRoute("post") ? "text-gray-900 font-extrabold" : "text-gray-600 font-bold"}`}>
                    식재료 백과
                  </span>
                </Link>
              </li>
            </ul>

            {/* Right: Login Button / Account */}
            <div className="flex items-center gap-4">
              {isSignIn ? (
                <AccountMenu />
              ) : (
                <button 
                  onClick={goToSiginInPage} 
                  className="px-5 py-2 text-[14px] font-bold text-gray-700 bg-white border border-gray-300 rounded-[14px] hover:bg-gray-50 transition-colors shadow-sm outline-none"
                >
                  로그인
                </button>
              )}
            </div>
          </div>


          {/* ================================================================= */}
          {/* 2. 모바일 뷰 */}
          {/* ================================================================= */}
          <div className="flex md:hidden justify-around items-center h-full w-full px-2">
            
            {/* Home Tab */}
            <Link href="/" className="flex-1">
              <div className="flex flex-col justify-center items-center cursor-pointer transition-colors group">
                <HomeOutlinedIcon 
                  sx={{ 
                    width: '26px', 
                    height: '26px', 
                    color: containInRoute("home") ? activeColor : inactiveColor 
                  }}
                  className="transition-colors group-hover:text-[#1c7c54]"
                />
                <p className={`text-[11px] mt-1 transition-colors ${
                  containInRoute("home") 
                    ? "text-[#1c7c54] font-extrabold" 
                    : "text-gray-400 font-medium group-hover:text-gray-600"
                }`}>
                  홈
                </p>
              </div>
            </Link>          

            {/* Recipe Search Tab */}
            <Link href="/recipes/1/sortingCondition=POPULARITY" className="flex-1">
              <div className="flex flex-col justify-center items-center cursor-pointer transition-colors group">
                <RestaurantMenuOutlinedIcon 
                  sx={{ 
                    width: '26px', 
                    height: '26px', 
                    color: containInRoute("recipe") ? activeColor : inactiveColor 
                  }}
                  className="transition-colors group-hover:text-[#1c7c54]"
                />
                <p className={`text-[11px] mt-1 transition-colors ${
                  containInRoute("recipe") 
                    ? "text-[#1c7c54] font-extrabold" 
                    : "text-gray-400 font-medium group-hover:text-gray-600"
                }`}>
                  레시피
                </p>
              </div>
            </Link>

            {/* Random Menu Tab */}
            <Link href="/randomMenu" className="flex-1">
              <div className="flex flex-col justify-center items-center cursor-pointer transition-colors group">
                <HelpOutlineIcon 
                  sx={{ 
                    width: '26px', 
                    height: '26px', 
                    color: containInRoute("randomMenu") ? activeColor : inactiveColor 
                  }}
                  className="transition-colors group-hover:text-[#1c7c54]"
                />
                <p className={`text-[11px] mt-1 transition-colors ${
                  containInRoute("randomMenu") 
                    ? "text-[#1c7c54] font-extrabold" 
                    : "text-gray-400 font-medium group-hover:text-gray-600"
                }`}>
                  뭐먹지?
                </p>
              </div>
            </Link>

            {/* 식재료 백과 Tab */}
            <Link href="/post" className="flex-1">
              <div className="flex flex-col justify-center items-center cursor-pointer transition-colors group">
                <MenuBookOutlinedIcon 
                  sx={{ 
                    width: '26px', 
                    height: '26px', 
                    color: containInRoute("post") ? activeColor : inactiveColor 
                  }}
                  className="transition-colors group-hover:text-[#1c7c54]"
                />
                <p className={`text-[11px] mt-1 transition-colors ${
                  containInRoute("post") 
                    ? "text-[#1c7c54] font-extrabold" 
                    : "text-gray-400 font-medium group-hover:text-gray-600"
                }`}>
                  식재료
                </p>
              </div>
            </Link>

            {/* Account / Login Tab */}
            <div className="flex-1 flex flex-col justify-center items-center">
              {isSignIn ? (
                <AccountMenu />
              ) : (
                <div className="cursor-pointer flex flex-col items-center group" onClick={goToSiginInPage}>
                  {/* 상반신 사람 아이콘으로 교체 완료 */}
                  <PersonOutlineOutlinedIcon 
                    sx={{ 
                      width: '28px', 
                      height: '28px', 
                      color: containInRoute("signin") ? activeColor : inactiveColor 
                    }}
                    className="transition-colors group-hover:text-[#1c7c54]"
                  />
                  <p className={`text-[11px] mt-0.5 transition-colors ${
                    containInRoute("signin") 
                      ? "text-[#1c7c54] font-extrabold" 
                      : "text-gray-400 font-medium group-hover:text-gray-600"
                  }`}>
                    MY
                  </p>
                </div>
              )}
            </div>

          </div>
        </nav>
      )}
    </>
  );
};

export default React.memo(Navbar);