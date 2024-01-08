"use client";

import { useEffect, useState } from "react";
import { CookingMethod, Recipe, RecipeSelection } from "../types/recipeType";
import RecipeName from "./RecipeName";
import Serving from "./Serving";
import Categori from "./Categori";
import CookMethod from "./CookMethod";
import Description from "./Description";
import CookStep from "./(cookStepDnd)/CookStep";
import Ingredient from "./Ingredient";
import { Button, Modal, Typography, Box } from "@mui/material";

export default function CreateRecipePage() {
  const [recipe, setRecipe] = useState<Recipe>({
    recipeName: "",
    categories: RecipeSelection.한식,
    servings: 1,
    cookMethod: CookingMethod.굽기,
    ingredients: [],
    description: "",
    steps: [],
  });

  const [letsSetRecipe, setLetsSetRecipe] = useState<number>(0); //값 세팅을 위한 트리거

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log("이이잉", recipe);
  }, [recipe]);

  const clickPostHandler = () => {
    setLetsSetRecipe(letsSetRecipe + 1);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="p-5 max-w-xl w-dvw m-3 bg-white px-4 flex flex-col justify-center items-center">
      <RecipeName recipe={recipe} setRecipe={setRecipe}></RecipeName>
      <Categori recipe={recipe} setRecipe={setRecipe}></Categori>
      <Serving recipe={recipe} setRecipe={setRecipe}></Serving>
      <CookMethod recipe={recipe} setRecipe={setRecipe}></CookMethod>
      <Ingredient
        recipe={recipe}
        setRecipe={setRecipe}
        letsSetRecipe={letsSetRecipe}
      ></Ingredient>
      <Description recipe={recipe} setRecipe={setRecipe}></Description>
      <CookStep
        recipe={recipe}
        setRecipe={setRecipe}
        letsSetRecipe={letsSetRecipe}
      ></CookStep>
      <Button
        onClick={() => {
          setIsModalOpen(true);
          clickPostHandler();
        }}
      >
        Open modal
      </Button>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
