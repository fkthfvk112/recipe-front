import React, { SetStateAction } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { RecipeCreate } from "./page";
import { Ingredient as Ingred } from "../types/recipeType";
import IngreRecommandInput from "@/app/admin/ingredient/IngreRecommandInput";

interface IngredientProp {
  recipe: RecipeCreate;
  setRecipe: React.Dispatch<SetStateAction<RecipeCreate>>;
}

export default function Ingredient({ recipe, setRecipe }: IngredientProp) {
  const ingredients: Ingred[] = recipe.ingredients ?? [];

  /** 업데이트 함수 */
  const updateIngredients = (next: Ingred[]) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: next.map((i, idx) => ({ ...i, order: idx })),
    }));
  };

  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = evt.target;
    const next = [...ingredients];
    next[index] = { ...next[index], [name]: value };
    updateIngredients(next);
  };

  const handleNameChange = (value: string, index: number) => {
    const next = [...ingredients];
    next[index] = { ...next[index], name: value };
    updateIngredients(next);
  };

  const addIngre = () => {
    updateIngredients([
      ...ingredients,
      { name: "", qqt: "", order: ingredients.length },
    ]);
  };

  const deleteThisIngre = (order: number) => {
    if (ingredients.length <= 1) return;
    updateIngredients(ingredients.filter(i => i.order !== order));
  };

  return (
    <div className="w-full flex flex-col mt-6 mb-6 p-5">
      <h3 className="text-lg">재료</h3>

      <div className="flex flex-col justify-center items-center mt-2">
        {ingredients.map((ingre, inx) => (
          <div
            key={ingre.order}
            className="relative grid grid-flow-col grid-cols-5 w-full mt-5 pe-4 gap-1"
          >
            <IngreRecommandInput
              dataSettingCallback={(value: string) =>
                handleNameChange(value, inx)
              }
              defaultVal={ingre.name}
              placeholderStr={inx === 0 ? "예) 삼겹살" : "재료"}
              inputStyleStr="col-span-3 rounded-none"
              containerStyleStr="col-span-3"
            />

            <input
              className="col-span-2 rounded-none"
              name="qqt"
              type="text"
              placeholder={inx === 0 ? "예) 200g" : "양"}
              maxLength={10}
              value={ingre.qqt}
              onChange={(evt) => handleInputChange(evt, inx)}
            />

            <ClearIcon
              onClick={() => deleteThisIngre(ingre.order)}
              className="absolute -right-1 -top-3 w-4 h-4 cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <AddIcon
          sx={{ width: "45px", height: "45px" }}
          className="m-1 border border-slate-500 cursor-pointer"
          onClick={addIngre}
        />
      </div>
    </div>
  );
}
