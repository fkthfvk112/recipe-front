import { Dispatch, SetStateAction } from "react";
import { CookingMethod, Recipe } from "../types/recipeType";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface CookMethodProp {
  recipe: Recipe;
  setRecipe: Dispatch<SetStateAction<Recipe>>;
}
export default function CookMethod({ recipe, setRecipe }: CookMethodProp) {
  const methodClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setRecipe({
      ...recipe,
      cookMethod: e.currentTarget.id as CookingMethod,
    });
  };

  const cookMethods = [
    CookingMethod.굽기,
    CookingMethod.볶기,
    CookingMethod.삶기,
    CookingMethod.찌기,
    CookingMethod.튀기기,
  ].map((method) => {
    const cookMethod: string =
      CookingMethod[method as keyof typeof CookingMethod];

    return (
      <div
        className={`bg-red-400 p-3 rounded-md m-2 w-20 relative ${
          recipe.cookMethod === cookMethod
            ? "outline outline-2 outline-slate-950"
            : ""
        }`}
        key={cookMethod}
        id={cookMethod}
        onMouseDown={methodClick}
      >
        {recipe.cookMethod === cookMethod ? (
          <CheckCircleIcon className="absolute -right-2 -top-2.5 w-8 h-8"></CheckCircleIcon>
        ) : (
          <></>
        )}
        {cookMethod}
      </div>
    );
  });

  return (
    <div className="flex flex-col justify-between items-center w-full mt-6 mb-6 p-5">
      <h3 className="text-lg text-start w-full">요리법</h3>
      <div className="flex flex-row flex-wrap">{cookMethods}</div>
    </div>
  );
}
