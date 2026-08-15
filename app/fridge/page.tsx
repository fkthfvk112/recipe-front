"use client";

import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import KitchenIcon from '@mui/icons-material/Kitchen';
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

export default function Fridge() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialSetted, setInitialSetted] = useState<boolean>(false);
  const [fridgeDate, setFridgeDate] = useState<MyFridge[]>([]);
  const [recommandRecipe, setRecommandRecipe] = useState<Recipe[]>([]);
  const [containIngre, setContainIngre] = useRecoilState<number>(ingreNSelectAtom);
  const [refetcher, setRefetcher] = useState<number>(0);
  const isTokenValid = useChkLoginToken("refreshNeed");

  const router = useRouter();

  const goToMyFridgeItemTx = () => {
    router.push(`/fridge/tx-history`);
  };

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

  const fridgeCompSkeleton = [1, 2, 3].map((_, inx) => (
    <div key={inx} className="min-h-[150px] bg-gray-100 animate-pulse rounded-3xl" />
  ));

  const fridgeComp = fridgeDate.map((fridge, inx) => (
    <Link
      href={`/fridge/${fridge.fridgeId}`}
      key={inx}
      className="min-h-[150px] bg-white border border-gray-200/90 hover:border-emerald-500 rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-lg cursor-pointer group text-left relative overflow-hidden"
    >
      <div>
        {/* Card Header: Icon & Badge Pills */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
            <KitchenIcon sx={{ fontSize: 22 }} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-extrabold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200/60">
              {fridge.normalIngreCnt}개 보유
            </span>
            {fridge.expIngreCnt >= 1 && (
              <span className="text-[11px] font-extrabold bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-200/60">
                {fridge.expIngreCnt}개 임박
              </span>
            )}
          </div>
        </div>

        {/* Fridge Title */}
        <h2 className="text-base font-black text-gray-900 tracking-tight mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
          {fridge.fridgeName}
        </h2>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
        {fridge.description ? truncateString(fridge.description, 32) : "등록된 설명이 없습니다."}
      </p>
    </Link>
  ));

  if (!isTokenValid) return <></>;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-left text-gray-800 pb-28">
      
      {/* Header Banner */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">나의 냉장고 🧊</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          식재료를 보관하고 유통기한을 체계적으로 관리해보세요.
        </p>
      </div>

      {/* Clean Grid of Fridge Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-10">
        {!initialSetted ? (
          fridgeCompSkeleton
        ) : (
          <>
            {fridgeComp}
            {fridgeDate.length < 6 && (
              <Link
                href={"/fridge/create"}
                className="min-h-[150px] border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/40 hover:bg-emerald-50/20 text-emerald-600 rounded-3xl p-5 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-xs"
              >
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-400 group-hover:text-emerald-500 group-hover:border-emerald-300 flex items-center justify-center mb-2 transition-all shadow-xs">
                  <AddIcon sx={{ fontSize: 24 }} />
                </div>
                <span className="text-xs font-extrabold text-gray-600 group-hover:text-emerald-600 transition-colors">
                  새 냉장고 추가하기
                </span>
              </Link>
            )}
          </>
        )}
      </section>

      {/* Consumption History Banner */}
      <section className="bg-gray-50/70 border border-gray-200/80 rounded-3xl p-6 mb-10 text-left">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <ReceiptLongIcon sx={{ fontSize: 20 }} />
          <h3 className="text-sm font-black text-gray-900">식재료 소비 내역</h3>
        </div>
        <p className="text-xs text-gray-500 font-medium mb-4 leading-relaxed">
          구매한 식재료, 제대로 사용하고 있을까요? 소비 내역을 통해 알뜰하게 낭비 없는 냉장고를 만들어보세요.
        </p>
        <button
          onClick={goToMyFridgeItemTx}
          className="w-full py-3.5 text-xs font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl cursor-pointer transition-all shadow-md border-none"
        >
          내 소비 내역 확인하기
        </button>
      </section>

      {/* Recommended Recipes Section */}
      <section className="mb-8">
        <div className="mb-4">
          <h3 className="text-base font-black text-gray-900 tracking-tight">내 냉장고 기반 레시피 추천 🍳</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            선택한 냉장고의 식재료를 활용할 수 있는 맞춤 레시피입니다.
          </p>
        </div>

        {/* Fridge Selector Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {fridgeDate.map((fridge, inx) => {
            const isSelected = fridge.recommendRecipeFlag;
            return (
              <button
                key={inx}
                type="button"
                onClick={() => updateRecommand(fridge.fridgeId)}
                className={`flex items-center gap-1 px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all outline-none ${
                  isSelected
                    ? "bg-white border-2 border-emerald-500 text-emerald-600 shadow-xs"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {isSelected && <CheckCircleIcon sx={{ fontSize: 15 }} className="text-emerald-500" />}
                <span>{fridge.fridgeName}</span>
              </button>
            );
          })}
        </div>

        {/* Ingredient Count Condition Filter */}
        <div className="flex justify-between items-center mb-4 bg-emerald-50/40 border border-emerald-100/80 rounded-2xl p-3 px-4">
          <span className="text-xs font-bold text-gray-700">최소 보유 식재료 조건</span>
          <div className="flex items-center gap-1.5">
            <select
              className="border border-gray-200 rounded-xl px-3 py-1 text-xs font-medium text-gray-800 bg-white focus:border-emerald-500 outline-none shadow-xs cursor-pointer"
              value={containIngre}
              onChange={(evt) => setContainIngre(Number(evt.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}개 이상
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recommended Recipes Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-3 min-h-[300px]">
          {isLoading ? (
            <div className="w-full flex items-center justify-center py-12">
              <CircularProgress sx={{ color: "#10b981" }} />
            </div>
          ) : (
            recommandRecipes
          )}
        </div>
      </section>

    </div>
  );
}