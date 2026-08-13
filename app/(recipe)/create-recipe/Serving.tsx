"use client";

import { ChangeEventHandler, SetStateAction } from "react";
import { RecipeCreate } from "./page";

interface ServingProp {
  recipe: RecipeCreate;
  setRecipe: React.Dispatch<SetStateAction<RecipeCreate>>;
}

export default function Serving({ recipe, setRecipe }: ServingProp) {
  const servingOptions = [1, 2, 3, 4, 5, 6];

  const handleServingChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setRecipe({
      ...recipe,
      servings: Number(e.target.value),
    });
  };

  return (
    <div className="w-full mb-6 flex items-center justify-between ">
      <h3 className="text-sm font-black text-gray-900">요리 양 (인분)</h3>
      <div className="flex items-center gap-2">
        <select
          onChange={handleServingChange}
          className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 bg-white focus:border-darkGreen outline-none shadow-xs cursor-pointer"
          value={recipe.servings}
        >
          {servingOptions.map((ele) => (
            <option key={ele} value={ele}>
              {ele} 인분
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
