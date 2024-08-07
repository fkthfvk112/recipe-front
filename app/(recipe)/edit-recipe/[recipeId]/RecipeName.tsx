"use client";

import { Dispatch, SetStateAction } from "react";
import { Recipe } from "../../types/recipeType";
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
    <div className="w-full mt-6 mb-6 p-5">
      <h3 className="text-lg">레시피 이름</h3>
      <input
        className="min-w-32 border-slate-500 mt-2"
        placeholder="1자 이상 20자 이하"
        onChange={recipeNameChange}
        type="text"
        value={recipe.recipeName}
        maxLength={20}
      />
    </div>
  );
}
