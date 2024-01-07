import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Recipe } from "../types/recipeType";
import { Dispatch, SetStateAction } from "react";
interface DescProp {
  recipe: Recipe;
  setRecipe: Dispatch<SetStateAction<Recipe>>;
}
export default function Description({ recipe, setRecipe }: DescProp) {
  const handleDescText: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setRecipe({
      ...recipe,
      description: e.target.value,
    });
  };
  return (
    <div className="flex flex-col justify-center items-center w-full m-3">
      <div className="text-start w-full">
        <h3>음식 설명</h3>
      </div>
      <textarea
        onChange={handleDescText}
        className="bg-slate-100 rounded-2xl w-full h-24 p-3 resize-none"
        name=""
        id=""
      ></textarea>
    </div>
  );
}
