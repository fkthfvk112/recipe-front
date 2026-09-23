"use client";

import React from "react";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { postEvents } from "@/app/(commom)/ga4/ga4Events";

export default function IngredientStoryCard() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 my-6 box-border">
      <div className="w-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700/40">
        {/* 배경 은은한 데코 패턴 */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-32 h-32 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

        {/* 좌측 텍스트 콘텐츠 */}
        <div className="flex flex-col gap-2.5 max-w-2xl z-10 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30 w-fit">
            <span>알아두면 유용한 식재료 이야기</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white">
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
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-900 text-sm font-extrabold rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 border-none outline-none cursor-pointer"
            >
              <span>식재료 백과 읽어보기</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
