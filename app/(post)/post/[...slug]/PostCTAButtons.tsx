"use client";

import Link from "next/link";
import { sendGA4Event } from "@/app/(commom)/ga4/ga4Events";

interface PostCTAButtonsProps {
  fridgeLink: string;
  recipeSearchLink: string;
  postTitle: string;
  mainIngredient: string;
}

export default function PostCTAButtons({
  fridgeLink,
  recipeSearchLink,
  postTitle,
  mainIngredient,
}: PostCTAButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* 냉장고 추가 CTA */}
      <Link
        href={fridgeLink}
        className="flex items-center justify-center gap-2 flex-1 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md"
        onClick={() =>
          sendGA4Event("post_fridge_cta_click", {
            post_title: postTitle,
            main_ingredient: mainIngredient,
            source: "post_page_cta",
          })
        }
      >
        내 냉장고에 추가
      </Link>

      {/* 레시피 검색 CTA */}
      <Link
        href={recipeSearchLink}
        className="flex items-center justify-center gap-2 flex-1 px-5 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-extrabold text-xs sm:text-sm rounded-2xl border border-gray-200/80 transition-all"
        onClick={() =>
          sendGA4Event("post_recipe_search_cta_click", {
            post_title: postTitle,
            main_ingredient: mainIngredient,
            source: "post_page_cta",
          })
        }
      >
        관련 레시피 구경하기
      </Link>
    </div>
  );
}
