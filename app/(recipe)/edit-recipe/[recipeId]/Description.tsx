import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Recipe } from "../../types/recipeType";
import { Dispatch, SetStateAction } from "react";
import { RecipeCreate } from "./page";
interface DescProp {
  recipe: RecipeCreate;
  setRecipe: Dispatch<SetStateAction<RecipeCreate>>;
}
export default function Description({ recipe, setRecipe }: DescProp) {
  const handleDescText: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setRecipe({
      ...recipe,
      description: e.target.value,
    });
  };
  return (
    <div className="flex flex-col justify-center items-center w-full mt-6 mb-6 p-5">
      <div className="text-start w-full">
        <h3 className="text-lg">레시피 설명</h3>
      </div>
      <textarea
        placeholder="3자 이상 200자 이하"
        value={recipe.description}
        onChange={handleDescText}
        className="border border-slate-500 rounded-2xl w-full h-24 p-3 resize-none"
        maxLength={200}
        name=""
        id=""
      ></textarea>
    </div>
  );
}
