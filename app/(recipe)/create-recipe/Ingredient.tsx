import React, { SetStateAction, useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { RecipeCreate } from "./page";
import { Ingredient as ingred } from "../types/recipeType";

// export interface Ingredient {
//   name: string;
//   qqt: string;
//   order: number;
// }

interface IngredientProp {
  recipe: RecipeCreate;
  setRecipe: React.Dispatch<SetStateAction<RecipeCreate>>;
}

export default function Ingredient({ recipe, setRecipe }: IngredientProp) {
  const [ingredients, setIngredients] = useState<ingred[]>([
    { name: "", qqt: "", order: 0 },
    { name: "", qqt: "", order: 1 },
  ]);

  useEffect(() => {
    const ingres: ingred[] = ingredients
      .filter((ingre) => ingre.name.length >= 1 && ingre.qqt.length >= 1)
      .map((ingre, inx) => {
        return {
          ...ingre,
          order: inx,
        };
      });

    setRecipe({
      ...recipe,
      ingredients: ingres,
    });
  }, [ingredients]);

  const ingreItems = ingredients.map((ingre, inx) => {
    return (
      <div
        key={inx}
        className="relative grid grid-flow-col grid-cols-5 w-full mt-5 pe-4 gap-1"
      >
        {inx === 0 ? (
          <>
            <input
              className="col-span-3 rounded-none"
              placeholder="예) 삼겹살"
              name="name"
              type="text"
              value={ingre.name}
              onChange={(evt) => {
                handleInputChange(evt, inx);
              }}
            />
            <input
              className="col-span-2 rounded-none"
              placeholder="예) 200g"
              name="qqt"
              type="text"
              value={ingre.qqt}
              onChange={(evt) => {
                handleInputChange(evt, inx);
              }}
            />
          </>
        ) : (
          <>
            <input
              className="col-span-3 rounded-none"
              name="name"
              type="text"
              placeholder="재료"
              value={ingre.name}
              onChange={(evt) => {
                handleInputChange(evt, inx);
              }}
            />
            <input
              className="col-span-2 rounded-none"
              name="qqt"
              type="text"
              placeholder="양"
              value={ingre.qqt}
              onChange={(evt) => {
                handleInputChange(evt, inx);
              }}
            />
          </>
        )}

        <ClearIcon
          onClick={() => {
            deleteThisIngre(ingre.order);
          }}
          className="absolute -right-1 -top-3 col-span-1 w-4 h-4"
        ></ClearIcon>
      </div>
    );
  });

  const handleInputChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    inx: number
  ) => {
    const { value, name } = evt.target;
    const newIngre = [...ingredients];
    newIngre[inx] = {
      ...newIngre[inx],
      [name]: value,
    };

    setIngredients(newIngre);
  };

  const addIngre = () => {
    const newIngre = [...ingredients];
    newIngre.push({
      name: "",
      qqt: "",
      order: newIngre.length,
    });

    setIngredients(newIngre);
  };

  const deleteThisIngre = (order: number) => {
    const newIngre = ingredients
      .filter((ingre) => ingre.order !== order)
      .map((ingre, inx) => {
        return { ...ingre, order: inx };
      });
    setIngredients(newIngre);
  };
  return (
    <div className="w-full flex flex-col mt-6 mb-6 p-5">
      <h3 className="text-lg">재료</h3>
      <div className="flex flex-col justify-center items-center mt-2">
        {ingreItems}
      </div>
      <div className="text-center mt-4">
        <AddIcon
          className="m-1 w-[45px] h-[45px] border border-slate-500 hover:cursor-pointer"
          onClick={addIngre}
        >
        </AddIcon>
      </div>
    </div>
  );
}
