import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Recipe, RecipeSelection } from "../types/recipeType";
import Image from "next/image";

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
    setRecipe({ ...recipe, categories: clickedCategory });
  };

  const categoriComp = recipeCategories.map((item) => (
    <div
      onMouseDown={clickCategoryItem}
      className="bg-red-400 p-3 rounded-md m-2 w-28"
      key={item}
      id={item}
    >
      <Image src="" width={500} height={500} alt="ex" />
      <div className="text-xs">{item}</div>
    </div>
  ));
  return (
    <div
      ref={categoriSliderRef}
      className="flex flex-row justify-between items-center w-full m-3 overflow-auto"
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
    >
      {categoriComp}
    </div>
  );
}
