import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Recipe, RecipeSelection } from "../types/recipeType";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
interface CategoriProp {
  recipe: Recipe;
  setRecipe: Dispatch<SetStateAction<Recipe>>;
}

export default function Categori({ recipe, setRecipe }: CategoriProp) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number | null>(null);
  const categoriSliderRef = useRef<HTMLDivElement | null>(null);
  const recipeCategories: string[] = [
    RecipeSelection.한식,
    RecipeSelection.중식,
    RecipeSelection.양식,
    RecipeSelection.일식,
    RecipeSelection.분식,
    RecipeSelection.후식,
    RecipeSelection.건강식,
  ].map(
    (category) => RecipeSelection[category as keyof typeof RecipeSelection]
  );

  const onDragStart: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (categoriSliderRef?.current !== null) {
      const scrollLeftValue = categoriSliderRef.current.scrollLeft;
      console.log("scrollLeft:", scrollLeftValue);
    }
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const onDragEnd: React.MouseEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(false);
  };

  const onDragMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (isDragging && startX !== null && categoriSliderRef.current) {
      const offsetX = e.clientX - startX;
      categoriSliderRef.current.scrollLeft -= offsetX;
      setStartX(e.clientX);
    }
  };

  const clickCategoryItem: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const clickedCategoryString = e.currentTarget.id;
    const clickedCategory: RecipeSelection =
      RecipeSelection[clickedCategoryString as keyof typeof RecipeSelection] ||
      RecipeSelection.한식;
    setRecipe({ ...recipe, categorie: clickedCategory });
  };

  const categoriComp = recipeCategories.map((item) => (
    <div
      onMouseDown={clickCategoryItem}
      className={`bg-red-400 p-3 rounded-md m-2 w-28 relative ${
        recipe.categorie === item ? "outline outline-2 outline-slate-950" : ""
      }}`}
      key={item}
      id={item}
    >
      {recipe.categorie === item ? (
        <CheckCircleIcon className="absolute right-0 top-0 w-8 h-8"></CheckCircleIcon>
      ) : (
        <></>
      )}

      <Image src="" width={500} height={500} alt="ex" />
      <div className="text-xs">{item}</div>
    </div>
  ));
  return (
    <div className="w-full flex flex-col justify-between items-center mt-6 mb-6 p-5">
      <div className="w-full text-left">
        <h3 className="text-lg">카테고리</h3>
      </div>
      <div
        ref={categoriSliderRef}
        className="flex flex-row justify-between items-center w-full m-3 overflow-auto"
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {categoriComp}
      </div>
    </div>
  );
}
