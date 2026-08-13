"use client";

import Image from "next/image";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "./(customAxios)/authAxios";
import { FridgeCntInfo } from "./(type)/fridge";
import Swal from "sweetalert2";

export default function FridgeDescription() {
  const [isSignIn] = useRecoilState(siginInState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fridgeInfo, setFridgeInfo] = useState<FridgeCntInfo>({
    fridgeCnt: 0,
    fridgeItemCnt: 0
  });
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
    if (isSignIn === true) {
      axiosAuthInstacne.get(`fridge/my/info-cnt`).then((res) => {
        setFridgeInfo(res.data);
      });
    }
  }, [isSignIn]);

  const goToFridgePage = () => {
    if (isSignIn === false) {
      Swal.fire({
        title: "로그인",
        text: "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "확인",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          const storage = globalThis?.sessionStorage;
          storage.setItem("prePath", "/fridge");
          router.push("/signin");
        }
      });
    } else {
      router.push("/fridge");
    }
  };

  if (isLoading || !isSignIn) {
    return <></>;
  }

  const isEmpty = fridgeInfo.fridgeCnt === 0 && fridgeInfo.fridgeItemCnt === 0;

  return (
    <section className="flex flex-col justify-center items-center w-full bg-white px-5 py-8">
      <div className="w-full max-w-5xl bg-[#1c7c54] border-none rounded-3xl p-8 sm:p-12 shadow-sm text-white">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Value Proposition & CTA */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-widest mb-2.5">
              MY SMART FRIDGE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 leading-tight">
              식재료 낭비 없는 편리한<br className="hidden sm:inline" /> 스마트 냉장고 관리
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base font-medium leading-relaxed mb-6">
              머그인 냉장고 관리 도구로 보관 중인 식재료들의 신선함을 지키고, 남은 식재료를 최대로 활용하는 최적의 레시피 제안을 받아보세요.
            </p>

            {/* Benefit List (No Emoji, styled for dark background) */}
            <ul className="space-y-3.5 text-[13px] sm:text-[14px] text-emerald-50 font-semibold mb-8 w-full">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-800/40 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>스마트 유통기한 디데이 알림으로 선입선출 소비</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-800/40 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>보관 중인 식재료 기반의 맞춤형 자동 요리 매칭</span>
              </li>
            </ul>

            <button
              onClick={goToFridgePage}
              className="bg-deepDarkGreen hover:bg-emerald-950 text-white font-extrabold transition-colors duration-200 border-none rounded-full w-full sm:w-52 h-11 flex items-center justify-center cursor-pointer shadow-sm text-sm"
            >
              {isEmpty ? "첫 냉장고 채우기" : "내 냉장고 관리하기"}
            </button>
          </div>

          {/* Right Column: Fridge graphic & mini dashboard cards */}
          <div className="md:col-span-5 flex flex-col items-center justify-center gap-6 w-full">
            <div className="relative flex items-center justify-center w-full">
              {/* Soft decorative background glow ring (dark mode friendly) */}
              <div className="absolute w-48 h-48 sm:w-56 sm:h-56 bg-emerald-950/50 rounded-full filter blur-xl -z-10" />
              <Image
                className="drop-shadow-xl hover:scale-105 transition-transform duration-300"
                src="/common/fridge.png"
                width={190}
                height={190}
                alt="smart fridge illustration"
              />
            </div>

            {isEmpty ? (
              /* Empty State Action Card */
              <div 
                className="flex flex-col justify-center items-center bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-white backdrop-blur-sm cursor-pointer hover:bg-white/15 transition-all w-full max-w-[340px]" 
                onClick={goToFridgePage}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm font-extrabold mb-1">아직 보관 중인 식재료가 없어요</p>
                <p className="text-[11px] text-emerald-200">클릭 한 번으로 냉장고를 채워보세요</p>
              </div>
            ) : (
              /* Dashboard Cards */
              <div className="flex gap-4 w-full max-w-[340px]">
                <div className="flex-1 flex flex-col justify-center items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-gray-400 mb-1">내 냉장고</p>
                  <div className="text-gray-800 text-sm font-semibold">
                    <span className="text-3xl font-black text-[#1c7c54]">{fridgeInfo.fridgeCnt}</span>개
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[11px] font-bold text-gray-400 mb-1">보관 식재료</p>
                  <div className="text-gray-800 text-sm font-semibold">
                    <span className="text-3xl font-black text-[#1c7c54]">{fridgeInfo.fridgeItemCnt}</span>개
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}