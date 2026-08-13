"use client";

import { Dispatch, SetStateAction } from "react";
import { RecipeCreate } from "./page";

interface RecipeNameProp {
  recipe: RecipeCreate;
  setRecipe: Dispatch<SetStateAction<RecipeCreate>>;
}

export default function RecipeName({ recipe, setRecipe }: RecipeNameProp) {
  const recipeNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRecipe({ ...recipe, recipeName: e.target.value });
  };

  return (
    <div className="w-full mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-2">레시피 제목 <span className="text-red-500">*</span></h3>
      <input
        className="w-full h-11 px-4 text-sm font-medium text-gray-900 bg-gray-50/50 border border-gray-200 rounded-2xl placeholder-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none"
        placeholder="맛있는 요리의 이름을 입력해주세요 (예: 백종원 김치찌개)"
        onChange={recipeNameChange}
        type="text"
        value={recipe.recipeName}
        maxLength={60}
      />
    </div>
  );
}
