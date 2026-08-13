"use client";

import { Dispatch, SetStateAction } from "react";
import { RecipeCreate } from "./page";

interface DescProp {
  recipe: RecipeCreate;
  setRecipe: Dispatch<SetStateAction<RecipeCreate>>;
}

export default function Description({ recipe, setRecipe }: DescProp) {
  const handleDescText: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setRecipe({
      ...recipe,
      description: e.target.value,
    });
  };

  return (
    <div className="w-full mb-6">
      <h3 className="text-sm font-black text-gray-900 mb-2">레시피 한 줄 소개</h3>
      <textarea
        placeholder="이 요리의 특징이나 특별한 노하우를 간단히 소개해 주세요."
        value={recipe.description}
        onChange={handleDescText}
        className="w-full h-28 p-4 text-xs text-gray-900 bg-gray-50/50 border border-gray-200 rounded-2xl placeholder-gray-400 focus:bg-white focus:border-darkGreen focus:ring-2 focus:ring-darkGreen/10 transition-all outline-none resize-none"
        maxLength={200}
      />
    </div>
  );
}
