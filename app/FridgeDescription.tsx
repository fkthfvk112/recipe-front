"use client";

import Image from "next/image";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "./(customAxios)/authAxios";
import { FridgeCntInfo } from "./(type)/fridge";
import Swal from "sweetalert2";

export default function FridgeDescription() {
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fridgeInfo, setFridgeInfo] = useState<FridgeCntInfo>({
    fridgeCnt:0,
    fridgeItemCnt:0
  })
  const router = useRouter();

  useEffect(()=>{
    setIsLoading(false);
    if(isSignIn === true){
        axiosAuthInstacne.get(`fridge/my/info-cnt`).then((res)=>{
            setFridgeInfo(res.data);
        })
    }

  }, [isSignIn])

  const goToFridgePage = () => {
    if(isSignIn === false){
        Swal.fire({
            title: "로그인",
            text:"로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?.",
            icon: "warning",
            showCancelButton:true,
            cancelButtonText:"취소",
            confirmButtonText: "확인",
            allowOutsideClick:false,
        }).then((result) => {
            if(result.isConfirmed){
                const storage = globalThis?.sessionStorage;
                storage.setItem("prePath", "/fridge");
                router.push("/signin")
            }
        })
    }else{
        router.push("/fridge");  
    }
  };

  if(isLoading){
    return <></>
  }

  return (
      <section className="flex flex-col justify-center items-center w-full text-center bg-white">
        <div className="w-full text-start max-w-[1000px]  bg-[#1c7c54] p-10 text-[#fcfcfc]">
            <div className="w-full text-center">
                <h3 className="text-2xl mb-2">냉장고 관리</h3>
                <p>유통기한을 관리하고 냉장고 속 식재료로 레시피를 추천받아 낭비없이 소비해요.</p>
            </div>
            <div className="w-full mb-5 flex-center flex-col">
                <div className="me-6">
                    <Image
                    className="min-w-[220px]"
                    src={"/common/fridge.png"}
                    width={220}
                    height={220}
                    alt=""
                    />
                </div>
                <div className="flex justify-around w-full max-w-[300px] font-bold">
                    <div className="flex flex-col justify-center items-center">
                        <p>내 냉장고</p>
                         <div><span className="text-3xl">{fridgeInfo.fridgeCnt}</span>개</div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p>식재료</p>
                         <div><span className="text-3xl">{fridgeInfo.fridgeItemCnt}</span>개</div>
                    </div>
                </div>
            </div>
            <div className="w-full flex-center mt-6">
                <button onClick={goToFridgePage} className="bg-[#196143] rounded-full border-none w-48">냉장고 보기</button>
            </div>
        </div>
      </section>
  );
}
