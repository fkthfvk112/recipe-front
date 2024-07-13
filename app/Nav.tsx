"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { usePathname } from "next/navigation";
import AccountMenu from "./AccountMenu";
import { deleteAuthToken, isLogin } from "./(user)/signin/utils/authUtil";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const [localSignInState, setLocalSignInState] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
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

  return (
    <>
      <div className="w-full h-20 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/">
              <div className="flex flex-col justify-center items-center">
                <HomeIcon sx={{width:'43px', height:'43px'}}/>
                <p>홈</p>
              </div>
            </Link>
            {/* <ul className="hidden md:flex gap-x-6"> */}
            <ul className="flex gap-x-6">
              <li>
                <Link href="/recipes/1/servingsMin=1&servingsMax=20&sortingCondition=POPULARITY">
                  <div className="flex flex-col justify-center items-center">
                    <RestaurantMenuIcon sx={{width:'43px', height:'43px'}}/>
                    <p>레시피</p>
                  </div>
                </Link>
              </li>
              {/* <li>
                <Link href="/recipe-detail/17">
                  <p>레시피 보기</p>
                </Link>
              </li> */}
              <li>
                <Link href={`/board/${process.env.NEXT_PUBLIC_FREE_BOARD_UUID}`}>
                  <div className="flex flex-col justify-center items-center">
                    <LibraryBooksIcon sx={{width:'43px', height:'43px'}}/>
                    <p>게시판</p>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/diet/mydiet/create">
                  <p>식단</p>
                </Link>
              </li>
              <li>
                {/* <Link href="/board/free">
                  <p>보드</p>
                </Link> */}
              </li>
            </ul>
            {localSignInState ? (
               <AccountMenu />
            ) : (
              <button className="border-none" onClick={goToSiginInPage}>로그인</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Navbar);
