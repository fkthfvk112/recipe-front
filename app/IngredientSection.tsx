"use client";

import React from "react";
import Link from "next/link";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getRandomSeasonalFoodInSameCategory } from "@/public/seasonalFoods";
import { postEvents } from "@/app/(commom)/ga4/ga4Events";

export default function IngredientSection() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const seasonalFoods: string[] = getRandomSeasonalFoodInSameCategory(
    currentMonth,
    6
  );

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-6 box-border">
      {/* 하나의 큰 컨테이너: 은은한 초록빛 카드 배경 */}
      <div className="w-full bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-emerald-50/50 border border-emerald-200/60 rounded-3xl p-5 sm:p-8 shadow-xs flex flex-col gap-6 relative overflow-hidden">
        
        {/* 상단: 이달의 제철 식재료 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
                이달의 제철 식재료
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100/90 text-emerald-800 rounded-full border border-emerald-200/60">
              {currentMonth}월 추천
            </span>
          </div>

          {/* 스크롤 가능한 식재료 목록 칩 */}
          <div className="flex overflow-x-auto space-x-3 py-2 px-1 no-scrollbar scroll-smooth">
            {seasonalFoods.map((ele) => (
              <Link
                href={`/recipes/1/ingredientNames=${encodeURIComponent(ele)}&sortingCondition=POPULARITY`}
                key={ele}
                className="min-w-[100px] h-14 bg-white shadow-2xs border border-emerald-100 
                          rounded-2xl flex justify-center items-center text-center 
                          text-gray-700 font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:scale-105 transition-all duration-200 cursor-pointer shrink-0 no-underline"
              >
                <span className="text-sm">{ele}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 위아래 구분을 위한 연한 구분선 */}
        <div className="w-full border-t border-emerald-200/50" />

        {/* 하단: 식재료 백과 안내 배너 */}
        <div className="w-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-5 sm:p-7 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700/40">
          {/* 배경 은은한 데코 패턴 */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-20 -top-10 w-32 h-32 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

          {/* 좌측 텍스트 콘텐츠 */}
          <div className="flex flex-col gap-2.5 max-w-2xl z-10 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30 w-fit">
              <MenuBookOutlinedIcon sx={{ fontSize: 14 }} />
              <span>알아두면 유용한 식재료 이야기</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black tracking-tight leading-snug text-white">
              올바른 식재료 보관법부터 영양성분·효능까지!
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
              식재료를 더 신선하고 오랫동안 보관하는 꿀팁부터 영양성분 정보까지, 머그인 식재료 백과에서 쉽고 재미있게 읽어보세요.
            </p>
          </div>

          {/* 우측 바로가기 버튼 */}
          <div className="shrink-0 z-10 w-full md:w-auto">
            <Link href="/post" className="no-underline">
              <button
                type="button"
                onClick={() => postEvents.clickIngredientEncyclopedia('home_page')}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-900 text-sm font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 border-none outline-none cursor-pointer"
              >
                <span>식재료 백과 읽어보기</span>
                <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
