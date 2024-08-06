"use client"

import { DndProvider } from "react-dnd";
import { ContainerDnd } from "./ContainerDnd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RecipeCreate } from "../page";

export interface CookStepProp {
  recipe: RecipeCreate;
  setRecipe: Dispatch<SetStateAction<RecipeCreate>>;
}
function CookStep({
  recipe,
  setRecipe,
}: CookStepProp) {
  const [Backend, setBackend] = useState<any>(null);

  useEffect(() => {
    const loadBackend = async () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const { TouchBackend } = await import("react-dnd-touch-backend");
        setBackend(() => TouchBackend);
      } else {
        const { HTML5Backend } = await import("react-dnd-html5-backend");
        setBackend(() => HTML5Backend);
      }
    };

    loadBackend();
  }, []);

  if (!Backend) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={Backend}>
      <ContainerDnd
        recipe={recipe}
        setRecipe={setRecipe}
      />
    </DndProvider>
  );
}

export default React.memo(CookStep);
