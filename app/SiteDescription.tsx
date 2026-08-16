"use client";

import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryButton } from "./(commom)/Component/Buttons";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";

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

  if (isLoading || isSignIn) {
    return null;
  }

  const features = [
      {
      title: "냉장고 관리",
      iconUrl: "/welcom/frigo_mgmt.png",
      },
      {
      title: "소비 관리",
      iconUrl: "/welcom/settle.png",
      },
      {
      title: "레시피 추천",
      iconUrl: "/welcom/recommend_recipe.png",
      },
      {
      title: "레시피 공유",
      iconUrl: "/welcom/food.png",
      },
  ];

  return (
    <section className="flex flex-col justify-center items-center w-full bg-white px-4 py-6 sm:py-10">
      <div className="w-full max-w-5xl rounded-3xl p-6 sm:p-12 shadow-xs border border-emerald-100/80 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/50 flex flex-col items-center text-center">
        
        {/* 상단 파스텔 뱃지 */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100/80 text-emerald-800 text-xs font-black rounded-full border border-emerald-200/60 mb-4 shadow-2xs">
          더 건강한 내일을 위해
        </div>

        {/* 메인 타이틀 & 서브 설명 */}
        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight max-w-2xl mb-3">
          건강한 일상부터<br className="hidden sm:block" /> 낭비 없는 식재료 관리까지
        </h2>

        <p className="text-xs sm:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mb-8">
          머그인과 함께 레시피를 공유하고, 냉장고 식재료 관리를 통해 더 산뜻한 내일을 살아봐요.
        </p>

        {/* 핵심 서비스 피처 3열 카드 */}
      <div
        className="
          grid gap-3
          grid-cols-3
          mb-3
          [@media(max-width:600px)]:grid-cols-2
          [@media(max-width:300px)]:grid-cols-1
        "
      > 
        {features.map((feature, index) => (
          <div
            key={index}
            className="
              h-full w-full
              p-6 bg-gray-50 
              flex flex-col justify-center items-center 
              rounded-xl transition
            "
          >
            <div className="flex justify-center mb-4 shrink-0">
              <img
                src={feature.iconUrl}
                alt={feature.title}
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-md mb-2 text-gray-800 break-keep text-center">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
        {/* 회원가입 / 로그인 CTA 버튼 */}
        <PrimaryButton
          type="button"
          onClick={goToSiginInPage}
          size="lg"
          className="w-full sm:w-auto px-9 py-4 flex items-center justify-center gap-2.5 text-sm sm:text-base font-black shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>회원가입 / 로그인하기</span>
          <ArrowForwardOutlinedIcon sx={{ fontSize: 20 }} />
        </PrimaryButton>

      </div>
    </section>
  );
}
