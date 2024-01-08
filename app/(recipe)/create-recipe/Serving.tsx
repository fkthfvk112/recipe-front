"use client";

import { ChangeEventHandler, SetStateAction, useRef } from "react";
import { Recipe } from "../types/recipeType";

interface ServingProp {
  recipe: Recipe;
  setRecipe: React.Dispatch<SetStateAction<Recipe>>;
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
    <div className="flex flex-row justify-between items-center w-full mt-6 mb-6 p-5">
      <div>
        <h2 className="text-lg">음식양</h2>
      </div>
      <div>
        <select
          onChange={handleServingChange}
          className="border border-slate-300 rounded-2xl mr-2 text-center w-32 h-10 bg-zinc-100"
          name=""
          id=""
        >
          {servingOptions.map((ele) => (
            <option className="p-2 m-3" key={ele} value={ele}>
              {ele}
            </option>
          ))}
        </select>
        <span>인분</span>
      </div>
    </div>
  );
}
