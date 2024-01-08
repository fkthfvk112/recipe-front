import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { ContainerDnd } from "./ContainerDnd";
import { Recipe } from "../../types/recipeType";
import { Dispatch, SetStateAction } from "react";

export interface CookStepProp {
  recipe: Recipe;
  setRecipe: Dispatch<SetStateAction<Recipe>>;
  letsSetRecipe: number;
}
export default function CookStep({
  recipe,
  setRecipe,
  letsSetRecipe,
}: CookStepProp) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ContainerDnd
        recipe={recipe}
        setRecipe={setRecipe}
        letsSetRecipe={letsSetRecipe}
      />
    </DndProvider>
  );
}
