import { SetStateAction, useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Ingredient, Recipe } from "../types/recipeType";

// export interface Ingredient {
//   name: string;
//   qqt: string;
//   order: number;
// }

interface CookMethodProp {
  recipe: Recipe;
  setRecipe: React.Dispatch<SetStateAction<Recipe>>;
  letsSetRecipe: number;
}

export default function Ingredient({
  recipe,
  setRecipe,
  letsSetRecipe,
}: CookMethodProp) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", qqt: "", order: 0 },
    { name: "", qqt: "", order: 1 },
  ]);

  useEffect(() => {
    const addIngre = ingredients
      .filter((ingre) => ingre.name.length >= 1 && ingre.qqt.length >= 1)
      .map((ingre, inx) => {
        return {
          ...ingre,
          order: inx,
        };
      });
    setRecipe({
      ...recipe,
      ingredients: addIngre,
    });
  }, [letsSetRecipe]);

  const ingreItems = ingredients.map((ingre, inx) => {
    return (
      <div
        key={inx}
        className="grid grid-flow-col grid-cols-5 w-56 border border-slate-500 m-0.5"
      >
        {inx === 0 ? (
          <>
            <input
              className="col-span-3 border-none rounded-none"
              placeholder="예)삼겹살"
              name="name"
              type="text"
              value={ingre.name}
              onChange={(evt) => {
                handleInputChange(evt, inx);
              }}
            />
            <input
              className="col-span-2 border-none rounded-none"
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
              className="col-span-3 border-none rounded-none"
              name="name"
              type="text"
              placeholder="재료"
              value={ingre.name}
              onChange={(evt) => {
                handleInputChange(evt, inx);
              }}
            />
            <input
              className="col-span-2 border-none rounded-none"
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
          className="col-span-1 w-4 h-4"
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
    console.log(newIngre);
    setIngredients(newIngre);
  };
  return (
    <div className="w-full flex flex-col mt-6 mb-6 p-5">
      <h3 className="text-lg">재료</h3>
      <div className="flex flex-row flex-wrap justify-center items-center">
        {ingreItems}
      </div>
      <div className="text-center">
        <button className="m-1" onClick={addIngre}>
          추가
        </button>
      </div>
    </div>
  );
}
