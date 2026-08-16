"use client";

import Image from "next/image";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./(commom)/Component/Buttons";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

export default function SiteDescription() {
  const [isSignIn] = useRecoilState(siginInState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, [isSignIn]);

  const goToSiginInPage = () => {
    router.push("/signin");
  };

  if (isLoading) {
    return null;
  }

  if (isSignIn) {
    return null;
  }

  return (
    <section className="flex flex-col justify-center items-center w-full bg-white px-4 py-6 sm:py-10">
      <div className="w-full max-w-5xl rounded-3xl p-6 sm:p-10 shadow-xs border border-emerald-100/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* 좌측 텍스트 & 액션 */}
        <div className="flex-1 flex flex-col items-start text-left gap-3.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-100/70 text-emerald-800 text-xs font-black rounded-full border border-emerald-200/60">
            더 건강한 내일을 위해
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
            맛있는 일상부터<br className="hidden sm:block" /> 낭비 없는 식재료 관리까지
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed max-w-xl">
            머그인과 함께 신선한 레시피를 공유하고, 스마트한 냉장고 관리와 식재료 가계부로 더 산뜻한 내일을 살아봐요.
          </p>

          {/* 주요 키워드 태그 */}
          <div className="flex flex-wrap gap-2 my-1">
            <span className="px-2.5 py-1 bg-white text-gray-600 text-xs font-bold rounded-xl border border-gray-200/70 shadow-2xs">
              #레시피공유
            </span>
            <span className="px-2.5 py-1 bg-white text-gray-600 text-xs font-bold rounded-xl border border-gray-200/70 shadow-2xs">
              #스마트냉장고
            </span>
            <span className="px-2.5 py-1 bg-white text-gray-600 text-xs font-bold rounded-xl border border-gray-200/70 shadow-2xs">
              #식재료 가계부
            </span>
          </div>

          {/* 회원가입 / 로그인 CTA 버튼 */}
          <div className="mt-2 w-full sm:w-auto">
            <PrimaryButton
              type="button"
              onClick={goToSiginInPage}
              size="lg"
              className="w-full sm:w-auto px-7 py-3.5 flex items-center justify-center gap-2 text-sm sm:text-base font-extrabold shadow-md hover:shadow-lg"
            >
              <span>회원가입 / 로그인하기</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 18 }} />
            </PrimaryButton>
          </div>
        </div>

        {/* 우측 브랜딩 우측 일러스트/로고 */}
        <div className="shrink-0 flex items-center justify-center p-4">
          <Image
            className="w-44 sm:w-60 h-auto object-contain"
            src={"/common/logo.png"}
            width={240}
            height={80}
            alt="머그인 브랜드 로고"
            priority
          />
        </div>
      </div>
    </section>
  );
}
