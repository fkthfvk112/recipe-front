"use client";

import { Dispatch, SetStateAction } from "react";
import { Recipe } from "../types/recipeType";

interface RecipeNameProp {
  recipe: Recipe;
  setRecipe: Dispatch<SetStateAction<Recipe>>;
}
export default function RecipeName({ recipe, setRecipe }: RecipeNameProp) {
  const recipeNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRecipe({ ...recipe, recipeName: e.target.value });
  };
  return (
    <div className="w-full mt-6 mb-6 p-5">
      <h3 className="text-lg">요리 이름</h3>
      <input
        className="min-w-32 border-slate-500"
        onChange={recipeNameChange}
        type="text"
        value={recipe.recipeName}
      />
    </div>
  );
}
