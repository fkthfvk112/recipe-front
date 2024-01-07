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
    <div className="min-w-50">
      <input
        onChange={recipeNameChange}
        type="text"
        value={recipe.recipeName}
      />
    </div>
  );
}
