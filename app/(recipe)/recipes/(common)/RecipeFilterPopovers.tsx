"use client";

import React from "react";
import { Slider } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { RecipeSearchingCondition, sortingCondition } from "@/app/(type)/search";

interface RecipeFilterPopoversProps {
  activePopover: "filter" | "category" | "sort" | "tag" | null;
  recipeSearchingData: RecipeSearchingCondition;
  setRecipeSearchingData: React.Dispatch<React.SetStateAction<RecipeSearchingCondition>>;
  servingsRange: number[];
  setServingsRange: React.Dispatch<React.SetStateAction<number[]>>;
  sortingCon: sortingCondition;
  setSortingCon: React.Dispatch<React.SetStateAction<sortingCondition>>;
  clearFilters: () => void;
  handleDetailedFilterSubmit: () => void;
  applyQuery: (updatedData?: RecipeSearchingCondition, updatedSort?: sortingCondition) => void;
}

export default function RecipeFilterPopovers({
  activePopover,
  recipeSearchingData,
  setRecipeSearchingData,
  servingsRange,
  setServingsRange,
  sortingCon,
  setSortingCon,
  clearFilters,
  handleDetailedFilterSubmit,
  applyQuery,
}: RecipeFilterPopoversProps) {
  if (!activePopover) return null;

  return (
    <>
      {/* 1. Detailed Filter Popover */}
      {activePopover === "filter" && (
        <div className="absolute top-full left-0 mt-2 z-[100] bg-background border border-gray-200 shadow-2xl rounded-3xl p-5 w-[300px] sm:w-[340px] text-left text-gray-800">
          <h3 className="text-[14px] font-black text-gray-900 mb-4">상세</h3>
          
          <div className="mb-4">
            <h4 className="text-[12px] font-bold text-gray-500 mb-2">레시피 이름</h4>
            <input
              type="text"
              placeholder="요리명 입력..."
              className="w-full h-10 px-3 text-[13px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen/10 transition-all shadow-sm"
              value={recipeSearchingData.recipeName || ""}
              onChange={(e) => setRecipeSearchingData(prev => ({ ...prev, recipeName: e.target.value }))}
            />
          </div>

          <div className="mb-4">
            <h4 className="text-[12px] font-bold text-gray-500 mb-2">생성일 (입력일 이후)</h4>
            <input
              type="date"
              className="w-full h-10 px-3 text-[13px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-darkGreen focus:ring-2 focus:ring-darkGreen/10 transition-all shadow-sm"
              value={recipeSearchingData.createdDate ? String(recipeSearchingData.createdDate) : ""}
              onChange={(e) => setRecipeSearchingData(prev => ({ ...prev, createdDate: e.target.value as any }))}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[12px] font-bold text-gray-500">요리양 (인분)</h4>
              <span className="text-[12px] text-darkGreen font-extrabold">{servingsRange[0]} - {servingsRange[1]} 인분</span>
            </div>
            <div className="px-2">
              <Slider
                value={servingsRange}
                onChange={(e, val) => setServingsRange(val as number[])}
                min={1}
                max={20}
                sx={{ color: "#1c7c54" }} // darkGreen HEX
                valueLabelDisplay="auto"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200/60">
            <button onClick={clearFilters} className="flex-1 py-3 text-[13px] font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer transition-all shadow-sm outline-none">초기화</button>
            <button onClick={handleDetailedFilterSubmit} className="flex-[1.5] py-3 text-[13px] font-bold text-white bg-darkGreen hover:bg-deepDarkGreen rounded-2xl cursor-pointer transition-all shadow-md flex items-center justify-center border border-transparent outline-none focus:outline-none">완료</button>
          </div>
        </div>
      )}

      {/* 2. Category Popover - 3 Grid Layout for Perfect Spacing */}
      {activePopover === "category" && (
        <div className="absolute top-full left-0 mt-2 z-[100] bg-background border border-gray-200 shadow-2xl rounded-3xl p-5 w-[320px] sm:w-[340px] text-left text-gray-800">
          <h3 className="text-[14px] font-black text-gray-900 mb-1">요리 카테고리 선택</h3>
          <p className="text-[12px] text-gray-400 font-medium mb-4">원하는 레시피 카테고리를 선택하세요.</p>
          
          {/* 겹침 방지: grid-cols-3 로 변경하여 공간 확보, overflow-x-hidden 으로 가로 스크롤 차단 */}
          <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
            {[
              { id: "default", label: "전체" },
              { id: "한식", label: "한식" },
              { id: "중식", label: "중식" },
              { id: "양식", label: "양식" },
              { id: "일식", label: "일식" },
              { id: "분식", label: "분식" },
              { id: "후식", label: "후식" },
              { id: "건강식", label: "건강식" },
              { id: "기타", label: "기타" }
            ].map((item) => {
              const isSelected = recipeSearchingData.cookCategory === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    const updated = { ...recipeSearchingData, cookCategory: item.id as RecipeSearchingCondition["cookCategory"] };
                    setRecipeSearchingData(updated);
                    applyQuery(updated);
                  }}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer outline-none w-full min-w-0 ${
                    isSelected
                      ? "border-2 border-darkGreen bg-green/10 shadow-sm"
                      : "border-gray-200 bg-white hover:border-darkGreen/40 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <CheckCircleIcon className="absolute right-1 top-1 text-darkGreen w-4 h-4 z-10 bg-white rounded-full" />
                  )}
                  
                  <div className="relative w-10 h-10 mb-2 flex items-center justify-center">
                    {item.id === "default" || item.id === "기타" ? (
                      <span className="text-2xl">🍽️</span>
                    ) : (
                      <Image 
                        src={`/createRecipe/${item.id}.png`} 
                        fill 
                        alt={item.label} 
                        sizes="40px"
                        className={`object-contain transition-transform ${isSelected ? 'scale-110' : ''}`}
                      />
                    )}
                  </div>
                  <span className={`text-[11px] truncate w-full text-center ${isSelected ? 'font-extrabold text-darkGreen' : 'font-bold text-gray-600'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. Sorting Popover */}
      {activePopover === "sort" && (
        <div className="absolute top-full left-0 mt-2 z-[100] bg-background border border-gray-200 shadow-2xl rounded-3xl p-5 w-64 text-left text-gray-800">
          <h3 className="text-[14px] font-black text-gray-900 mb-4">정렬 방식 선택</h3>
          
          <div className="flex flex-col gap-4 mb-6">
            {[
              { id: "POPULARITY", label: "인기순" },
              { id: "LATEST", label: "최신순" },
              { id: "LIKE_FEW", label: "오래된순" }
            ].map((sortItem) => (
              <label key={sortItem.id} className="flex items-center gap-3 cursor-pointer text-[13px] font-bold text-gray-700 hover:text-darkGreen transition-colors">
                <input
                  type="radio"
                  name="sorting-radio-popover"
                  checked={sortingCon === sortItem.id}
                  onChange={() => setSortingCon(sortItem.id as sortingCondition)}
                  className="w-4 h-4 text-darkGreen border-gray-300 focus:ring-darkGreen accent-darkGreen cursor-pointer"
                />
                <span>{sortItem.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => { setSortingCon("POPULARITY"); applyQuery(recipeSearchingData, "POPULARITY"); }}
              className="flex-1 py-3 text-[13px] font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer transition-all shadow-sm outline-none"
            >
              초기화
            </button>
            <button 
              onClick={() => applyQuery(recipeSearchingData, sortingCon)}
              className="flex-[1.5] py-3 text-[13px] font-bold text-white bg-darkGreen hover:bg-deepDarkGreen rounded-2xl cursor-pointer transition-all shadow-md flex items-center justify-center border border-transparent outline-none focus:outline-none"
            >
              완료
            </button>
          </div>
        </div>
      )}

      {/* 4. Cooking Method Tag Popover */}
      {activePopover === "tag" && (
        <div className="absolute top-full left-0 mt-2 z-[100] bg-background border border-gray-200 shadow-2xl rounded-3xl p-5 w-[200px] text-left text-gray-800">
          <h3 className="text-[14px] font-black text-gray-900 mb-3">조리 방법 태그</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "default", label: "전체" },
              { id: "굽기", label: "굽기" },
              { id: "볶기", label: "볶기" },
              { id: "삶기", label: "삶기" },
              { id: "찌기", label: "찌기" },
              { id: "튀기기", label: "튀기기" }
            ].map((method) => {
              const isSelected = recipeSearchingData.cookMethod === method.id;
              
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    const updated = { ...recipeSearchingData, cookMethod: method.id as RecipeSearchingCondition["cookMethod"] };
                    setRecipeSearchingData(updated);
                    applyQuery(updated);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border cursor-pointer transition-colors ${
                    recipeSearchingData.cookMethod === method.id
                      ? "border-[#8FBC8F] bg-emerald-50 text-[#8FBC8F]"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {method.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  );
}