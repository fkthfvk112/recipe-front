"use client";

import React, { SetStateAction } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { RecipeCreate } from "./page";
import { Ingredient as Ingred } from "../types/recipeType";
import IngreRecommandInput from "@/app/admin/ingredient/IngreRecommandInput";

interface IngredientProp {
  recipe: RecipeCreate;
  setRecipe: React.Dispatch<SetStateAction<RecipeCreate>>;
}

export default function Ingredient({ recipe, setRecipe }: IngredientProp) {
  const ingredients: Ingred[] = recipe.ingredients ?? [];

  /** 업데이트 함수 */
  const updateIngredients = (next: Ingred[]) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: next.map((i, idx) => ({ ...i, order: idx })),
    }));
  };

  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = evt.target;
    const next = [...ingredients];
    next[index] = { ...next[index], [name]: value };
    updateIngredients(next);
  };

  const handleNameChange = (value: string, index: number) => {
    const next = [...ingredients];
    next[index] = { ...next[index], name: value };
    updateIngredients(next);
  };

  const addIngre = () => {
    updateIngredients([
      ...ingredients,
      { name: "", qqt: "", order: ingredients.length },
    ]);
  };

  const deleteThisIngre = (order: number) => {
    if (ingredients.length <= 1) return;
    updateIngredients(ingredients.filter((i) => i.order !== order));
  };

  return (
    <div className="w-full mb-6 text-left">
      <div className="mb-3">
        <h3 className="text-sm font-black text-gray-900">재료 정보 등록</h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          요리에 필요한 주요 재료명과 정량(예: 300g, 1큰술)을 입력해주세요.
        </p>
      </div>

      {/* Flat List of Ingredients */}
      <div className="flex flex-col gap-2.5">
        {ingredients.map((ingre, inx) => (
          <div
            key={ingre.order || inx}
            className="flex items-center gap-2 w-full"
          >
            {/* Ingredient Auto-recommend Input (flex-1 유지하여 넓은 공간 확보) */}
            <div className="flex-1 min-w-0">
              <IngreRecommandInput
                dataSettingCallback={(value: string) =>
                  handleNameChange(value, inx)
                }
                defaultVal={ingre.name}
                placeholderStr={inx === 0 ? "예) 삼겹살" : "재료명 입력"}
                inputStyleStr="w-full h-11 px-4 text-xs font-medium text-gray-900 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                containerStyleStr="w-full"
              />
            </div>

            {/* Quantity Input (너비를 w-24 sm:w-28로 축소하여 식재료명 입력창을 더 넓게 보장) */}
            <div className="w-24 sm:w-28 shrink-0">
              <input
                className="w-full h-11 px-4 text-xs font-medium text-gray-900 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all placeholder-gray-400"
                name="qqt"
                type="text"
                placeholder={inx === 0 ? "예) 300g" : "수량/양"}
                maxLength={15}
                value={ingre.qqt}
                onChange={(evt) => handleInputChange(evt, inx)}
              />
            </div>

            {/* Delete Row Button */}
            <button
              type="button"
              onClick={() => deleteThisIngre(ingre.order)}
              disabled={ingredients.length <= 1}
              className="w-11 h-11 shrink-0 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center cursor-pointer transition-all border border-gray-200 border-none disabled:opacity-30 disabled:cursor-not-allowed outline-none"
              title="재료 삭제"
            >
              <ClearIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Ingredient Button */}
      <button
        type="button"
        onClick={addIngre}
        className="w-full py-3.5 mt-3 border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/40 hover:bg-emerald-50/20 text-emerald-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer outline-none shadow-xs"
      >
        <AddIcon sx={{ fontSize: 18 }} />
        <span>재료 항목 추가하기</span>
      </button>
    </div>
  );
}