"use client";

import { Dispatch, SetStateAction } from "react";
import { RecipeSelection } from "../types/recipeType";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { RecipeCreate } from "./page";

interface CategoriProp {
  recipe: RecipeCreate;
  setRecipe: Dispatch<SetStateAction<RecipeCreate>>;
}

export default function Categori({ recipe, setRecipe }: CategoriProp) {
  const recipeCategories: string[] = [
    RecipeSelection.한식,
    RecipeSelection.중식,
    RecipeSelection.양식,
    RecipeSelection.일식,
    RecipeSelection.분식,
    RecipeSelection.후식,
    RecipeSelection.건강식,
    RecipeSelection.기타,
  ].map(
    (category) => RecipeSelection[category as keyof typeof RecipeSelection]
  );

  const clickCategoryItem = (item: string) => {
    const clickedCategory: RecipeSelection =
      RecipeSelection[item as keyof typeof RecipeSelection] ||
      RecipeSelection.한식;
    setRecipe({ ...recipe, categorie: clickedCategory });
  };

  return (
    <div className="w-full mb-6 text-left">
      <h3 className="text-sm font-black text-gray-900 mb-3">요리 카테고리</h3>
      
      {/* 간격을 좁히고 버튼들을 컴팩트하게 배치 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {recipeCategories.map((item) => {
          const isSelected = recipe.categorie === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => clickCategoryItem(item)}
              className={`relative flex items-center justify-start gap-2 px-3 py-2 text-[12px] rounded-xl font-bold cursor-pointer transition-all outline-none min-h-[42px] w-24 ${
                isSelected
                  ? "bg-white border-2 border-emerald-500 text-emerald-600 shadow-sm"
                  : "bg-white border-2 border-transparent bg-gray-50/50 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {isSelected ? (
                <CheckCircleIcon sx={{ fontSize: 15 }} className="absolute -right-1 -top-1 text-emerald-500 bg-white rounded-full z-10" />
              ) : null}
              
              <div className="w-5 h-5 shrink-0 relative flex items-center justify-center">
                {item !== RecipeSelection.기타 ? (
                  <Image 
                    src={`/createRecipe/${item}.png`} 
                    fill 
                    alt={item} 
                    sizes="20px"
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs">🍽️</span>
                )}
              </div>
              
              <span className="truncate text-left flex-1">{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}