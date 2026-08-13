"use client";

import { Dispatch, SetStateAction } from "react";
import { CookingMethod } from "../types/recipeType";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { RecipeCreate } from "./page";

interface CookMethodProp {
  recipe: RecipeCreate;
  setRecipe: Dispatch<SetStateAction<RecipeCreate>>;
}

export default function CookMethod({ recipe, setRecipe }: CookMethodProp) {
  const methodClick = (methodName: string) => {
    setRecipe({
      ...recipe,
      cookMethod: methodName as CookingMethod,
    });
  };

  const cookMethods = [
    CookingMethod.굽기,
    CookingMethod.볶기,
    CookingMethod.삶기,
    CookingMethod.찌기,
    CookingMethod.튀기기,
    CookingMethod.기타,
  ];

  return (
    <div className="w-full mb-6 text-left">
      <h3 className="text-sm font-black text-gray-900 mb-3">조리 방법</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {cookMethods.map((method) => {
          const isSelected = recipe.cookMethod === method;
          return (
            <button
              key={method}
              type="button"
              onClick={() => methodClick(method)}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 text-[12px] w-24 rounded-xl font-bold cursor-pointer transition-all outline-none ${
                isSelected
                  ? "bg-white border-2 border-emerald-500 text-emerald-600 shadow-sm"
                  : "bg-white border-2 border-transparent bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {isSelected && 
                <CheckCircleIcon sx={{ fontSize: 15 }} className="absolute -right-1 -top-1 text-emerald-500 bg-white rounded-full z-10" />
              }
              <span>{method}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
