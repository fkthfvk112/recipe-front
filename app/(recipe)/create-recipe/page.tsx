"use client";

import { useEffect, useState } from "react";
import { CookingMethod, Recipe, RecipeSelection } from "../types/recipeType";
import RecipeName from "./RecipeName";
import Serving from "./Serving";
import Categori from "./Categori";
import CookMethod from "./CookMethod";
import Description from "./Description";
import CookStep from "./(cookStepDnd)/CookStep";

export default function CreateRecipePage() {
  const [recipe, setRecipe] = useState<Recipe>({
    recipeName: "",
    categories: RecipeSelection.한식,
    servings: 1,
    cookMethod: CookingMethod.굽기,
    description: "",
    steps: [],
  });

  useEffect(() => {
    console.log("이이잉", recipe);
  }, [recipe]);

  return (
    <div className="p-5 max-w-xl m-3 bg-white px-4 flex flex-col justify-center items-center">
      <RecipeName recipe={recipe} setRecipe={setRecipe}></RecipeName>
      <Categori recipe={recipe} setRecipe={setRecipe}></Categori>
      <Serving></Serving>
      <CookMethod recipe={recipe} setRecipe={setRecipe}></CookMethod>
      <Description recipe={recipe} setRecipe={setRecipe}></Description>
      <CookStep recipe={recipe} setRecipe={setRecipe}></CookStep>
    </div>
  );
}
