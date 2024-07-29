import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { ContainerDnd } from "./ContainerDnd";
import { Recipe } from "../../types/recipeType";
import { Dispatch, SetStateAction } from "react";
import { RecipeCreate } from "../page";

export interface CookStepProp {
  recipe: RecipeCreate;
  setRecipe: Dispatch<SetStateAction<RecipeCreate>>;
}
export default function CookStep({
  recipe,
  setRecipe,
}: CookStepProp) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ContainerDnd
        recipe={recipe}
        setRecipe={setRecipe}
      />
    </DndProvider>
  );
}
