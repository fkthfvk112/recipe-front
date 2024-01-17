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
import ErrorText from "./ErrorText";
import WarningIcon from "@mui/icons-material/Warning";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import axios from "axios";
import { log } from "console";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";

export default function CreateRecipePage() {
  const [recipe, setRecipe] = useState<Recipe>({
    recipeName: "",
    categorie: RecipeSelection.한식,
    servings: 1,
    cookMethod: CookingMethod.굽기,
    ingredients: [],
    description: "",
    steps: [],
  });
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
  const router = useRouter();

  useEffect(() => {
    if (!isSignIn) {
      router.push("/signin");
    }
  }, [isSignIn, router]);

  const [letsSetRecipe, setLetsSetRecipe] = useState<number>(0); //값 세팅을 위한 트리거

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorCnt, setErrorCnt] = useState<number>(0);

  // useEffect(() => {
  //   console.log("이이잉", recipe);
  // }, [recipe]);

  const clickPostHandler = () => {
    setLetsSetRecipe(letsSetRecipe + 1);
  };

  const saveRecipeToDb = () => {
    axiosAuthInstacne
      .post("recipe/create", recipe)
      .then((res) => {
        if (res.status === 200) {
          alert("발행되었씀!"); //수정
        }
      })
      .catch((err) => {
        console.log("에러", err);
      });
    // axios
    //   .post(`${process.env.NEXT_PUBLIC_API_URL}recipe/create`, recipe, {
    //     withCredentials: true,
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //   });
    //sign - api / hello2;
    // axiosAuthInstacne
    //   .post("auth-test/hello2", {})
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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
      <Ingredient recipe={recipe} setRecipe={setRecipe}></Ingredient>
      <Description recipe={recipe} setRecipe={setRecipe}></Description>
      <CookStep
        recipe={recipe}
        setRecipe={setRecipe}
        letsSetRecipe={letsSetRecipe}
      ></CookStep>
      <button
        onClick={() => {
          setIsModalOpen(true);
          clickPostHandler();
        }}
      >
        공개하기
      </button>
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
            <div className="text-center">
              {errorCnt !== 0 && <WarningIcon color="error"></WarningIcon>}
            </div>
            <ErrorText recipe={recipe} setErrorCnt={setErrorCnt}></ErrorText>
            {errorCnt === 0 && "레시피를 세상에 내놓겠습니까?"}
          </Typography>
          <div className="text-center">
            <button onClick={() => setIsModalOpen(false)}>아니요</button>
            <button
              onClick={() => {
                saveRecipeToDb();
              }}
              className={errorCnt !== 0 ? "bg-gray-200" : ""}
              disabled={errorCnt === 0 ? false : true}
            >
              네
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
