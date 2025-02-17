"use client";

import Image from "next/image";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteDescription() {
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(()=>{
    setIsLoading(false);
  }, [isSignIn])

  const goToSiginInPage = () => {
    router.push("/signin");
  };

  if(isLoading){
    return <></>
  }

  return (
    !isSignIn ? (
      <section className="flex flex-col justify-center items-center w-full text-center bg-white">
        <div className="w-full text-start max-w-[1000px] flex-center text-center-when-600 flex-wrap-when-600 bg-[#f1f1f1] p-10">
          <div>
            <h3 className="text-2xl mb-2">우리는 먹기 위해 살아간다.</h3>
            <p className="me-6 mb-6">
              머그인은 레시피 공유, 게시글, 냉장고 관리 기능을 제공합니다.
              머그인과 함께 낭비되지 않는 삶을 살아가고 그 경험을 공유해 보세요.
            </p>
            <div className="w-full flex-center">
              <button onClick={goToSiginInPage} className="greenBtn w-48">회원가입/로그인</button>
            </div>
          </div>
          <div>
            <Image
              className="min-w-[200px] m-6"
              src={"/common/logo.png"}
              width={350}
              height={300}
              alt=""
            />
          </div>
        </div>
      </section>
    ) : (
      <section className="flex flex-col justify-center items-center w-full text-center bg-white p-3">
        {/* <ul className="grid grid-cols-5 w-full gap-1 p-2  max-w-[1000px]">
          <li className="aspect-square bg-red-300">하하</li>
          <li className="aspect-square bg-red-300">하하</li>
          <li className="aspect-square bg-red-300">하하</li>
          <li className="aspect-square bg-red-300">하하</li>
          <li className="aspect-square bg-red-300">하하</li>
        </ul> */}
      </section>
    )
  );
}
