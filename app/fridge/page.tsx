"use client";

import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import KitchenIcon from "@mui/icons-material/Kitchen";
import { MyFridge } from "../(type)/fridge";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import { truncateString } from "../(utils)/StringUtil";
import Link from "next/link";
import RecipeVerticalItem from "../(board)/board/[boardMenuId]/create/(Recipe)/RecipeVerticalItem";
import { Recipe } from "../(recipe)/types/recipeType";
import { CircularProgress } from "@mui/material";
import useChkLoginToken from "../(commom)/Hook/useChkLoginToken";
import { useRecoilState } from "recoil";
import { ingreNSelectAtom } from "../(recoil)/userFeedAtom";
import { useRouter } from "next/navigation";
import FridgeSlidePanel from "./FridgeSlidePanel";

interface SelectedFridge {
  id: number;
  name: string;
}

export default function Fridge() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialSetted, setInitialSetted] = useState<boolean>(false);
  const [fridgeDate, setFridgeDate] = useState<MyFridge[]>([]);
  const [recommandRecipe, setRecommandRecipe] = useState<Recipe[]>([]);
  const [containIngre, setContainIngre] = useRecoilState<number>(ingreNSelectAtom);
  const [refetcher, setRefetcher] = useState<number>(0);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [selectedFridge, setSelectedFridge] = useState<SelectedFridge | null>(null);
  const isTokenValid = useChkLoginToken("refreshNeed");

  const router = useRouter();

  useEffect(() => {
    if (isTokenValid) {
      setIsLoading(true);
      Promise.all([
        axiosAuthInstacne.get("fridge/my"),
        axiosAuthInstacne.get(`recipe/my-fridge/ingres?ingreSize=${containIngre}`),
      ])
        .then(([fridgeRes, recipeRes]) => {
          setFridgeDate(fridgeRes.data);
          setRecommandRecipe(recipeRes.data);
          setInitialSetted(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [refetcher, containIngre, isTokenValid]);

  const updateRecommand = (fridId: number) => {
    axiosAuthInstacne.put(`fridge/recommendable/${fridId}`).then(() => {
      setRefetcher((prev) => prev + 1);
    });
  };

  const recommandRecipes = recommandRecipe?.map((recipe, inx) => (
    <Link className="inline-block shrink-0" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
      <RecipeVerticalItem recipe={recipe} />
    </Link>
  ));

  // ── Skeleton ──────────────────────────────────────────────────────────────
  const fridgeCompSkeleton = [1, 2, 3].map((_, inx) => (
    <div key={inx} className="min-h-[140px] bg-gray-100 animate-pulse rounded-3xl" />
  ));

  // ── Fridge Cards ──────────────────────────────────────────────────────────
  const fridgeComp = fridgeDate.map((fridge, inx) => (
    <button
      key={inx}
      type="button"
      onClick={() => setSelectedFridge({ id: fridge.fridgeId, name: fridge.fridgeName })}
      className="w-full min-h-[148px] bg-white border border-gray-200/90 hover:border-emerald-500 rounded-3xl p-4.5 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer group text-left relative overflow-hidden outline-none"
    >
      <div className="w-full">
        {/* Icon & Badge Row */}
        <div className="flex items-center justify-between mb-3 w-full">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <KitchenIcon sx={{ fontSize: 20 }} />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {fridge.normalIngreCnt}개 보유
            </span>
            {fridge.expIngreCnt >= 1 && (
              <span className="text-[11px] font-extrabold bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full border border-red-200/60">
                {fridge.expIngreCnt}개 임박
              </span>
            )}
          </div>
        </div>
        <h2 className="text-sm font-black text-gray-900 tracking-tight mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {fridge.fridgeName}
        </h2>
      </div>
      <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed w-full">
        {fridge.description ? truncateString(fridge.description, 28) : "등록된 설명이 없습니다."}
      </p>
    </button>
  ));

  if (!isTokenValid) return <></>;

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-left text-gray-800 pb-28">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-7 border-b border-gray-100 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">나의 냉장고 🧊</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              식재료를 보관하고 유통기한을 체계적으로 관리해보세요.
            </p>
          </div>
          {/* 소비 내역 — 헤더 퀵 칩 */}
          <button
            type="button"
            onClick={() => router.push("/fridge/tx-history")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white hover:border-emerald-500 hover:text-emerald-600 text-gray-500 rounded-xl text-[11px] font-bold transition-all cursor-pointer outline-none shrink-0 mt-1 shadow-xs"
          >
            <ReceiptLongOutlinedIcon sx={{ fontSize: 14 }} />
            <span>소비 내역</span>
          </button>
        </div>

        {/* ── Fridge Card Grid ─────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10">
          {!initialSetted ? (
            fridgeCompSkeleton
          ) : (
            <>
              {fridgeComp}
              {fridgeDate.length < 6 && (
                <Link
                  href={"/fridge/create"}
                  className="w-full min-h-[148px] border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/40 hover:bg-emerald-50/20 rounded-3xl p-5 flex flex-col items-center justify-center transition-all cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-2xl bg-white border border-gray-200 text-gray-400 group-hover:text-emerald-500 group-hover:border-emerald-300 flex items-center justify-center mb-2 transition-all shadow-xs">
                    <AddIcon sx={{ fontSize: 20 }} />
                  </div>
                  <span className="text-xs font-extrabold text-gray-600 group-hover:text-emerald-600 transition-colors">
                    새 냉장고 추가하기
                  </span>
                </Link>
              )}
            </>
          )}
        </section>

        {/* ── Recipe Recommendation Section ─────────────────────────── */}
        <section className="mb-8">

          {/* Section Header + Filter Toggle */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">맞춤 레시피 추천 🍳</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                내 냉장고 식재료로 바로 만들 수 있는 요리예요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer outline-none shadow-xs ${
                filterOpen
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-500 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              <TuneIcon sx={{ fontSize: 13 }} />
              <span>필터</span>
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {filterOpen && (
            <div className="mb-4 p-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl flex flex-col gap-3">

              {/* Fridge Selector Chips */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 mb-2">추천에 포함할 냉장고 선택</p>
                <div className="flex flex-wrap gap-2">
                  {fridgeDate.map((fridge, inx) => {
                    const isSelected = fridge.recommendRecipeFlag;
                    return (
                      <button
                        key={inx}
                        type="button"
                        onClick={() => updateRecommand(fridge.fridgeId)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl font-medium cursor-pointer transition-all outline-none ${
                          isSelected
                            ? "bg-white border-2 border-emerald-500 text-emerald-600 shadow-sm"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {isSelected && <CheckCircleIcon sx={{ fontSize: 14 }} className="text-emerald-500" />}
                        <span>{fridge.fridgeName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ingredient Count Condition */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500">최소 보유 식재료 개수</span>
                <select
                  className="border border-gray-200 rounded-xl px-3 py-1 text-xs font-medium text-gray-700 bg-white focus:border-emerald-500 outline-none shadow-xs cursor-pointer"
                  value={containIngre}
                  onChange={(evt) => setContainIngre(Number(evt.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>{num}개 이상</option>
                  ))}
                </select>
              </div>

            </div>
          )}

          {/* Horizontal Recipe Swiper */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 min-h-[260px]">
            {isLoading ? (
              <div className="w-full flex items-center justify-center py-10">
                <CircularProgress sx={{ color: "#10b981" }} size={26} />
              </div>
            ) : recommandRecipe.length > 0 ? (
              recommandRecipes
            ) : (
              /* ── Enhanced Empty State ─── */
              <div className="w-full flex flex-col items-center justify-center py-10 text-center gap-2">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center mb-1">
                  <span className="text-3xl">🥗</span>
                </div>
                <p className="text-sm font-extrabold text-gray-700">추천 레시피가 없어요</p>
                <p className="text-xs font-medium text-gray-400 max-w-[200px] leading-relaxed">
                  필터에서 냉장고를 선택하면<br />맞춤 레시피가 표시돼요.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ── Slide Panel (in-page, no hard routing) ───────────────── */}
      {selectedFridge && (
        <FridgeSlidePanel
          fridgeId={selectedFridge.id}
          fridgeName={selectedFridge.name}
          fridgeList={fridgeDate}
          onClose={() => setSelectedFridge(null)}
        />
      )}
    </>
  );
}