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
import { Button, Modal, Typography, Box, CircularProgress } from "@mui/material";
import ErrorText from "./ErrorText";
import WarningIcon from "@mui/icons-material/Warning";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import withReactContent from 'sweetalert2-react-content'
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import RepriPric from "./RepriPic";
import Swal from "sweetalert2";

export type RecipeCreate = Omit<Recipe, 'createdAt' | 'views' | 'recipeId'>;

export default function CreateRecipePage() {
  const [recipe, setRecipe] = useState<RecipeCreate>({
    recipeName: "",
    repriPhotos: [],
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
    console.log("레시피", recipe);
  };



  const saveRecipeToDb = () => {
    withReactContent(Swal).fire({
      title:"레시피를 공개하는 중...",
      showConfirmButton:false,
      allowOutsideClick:false,
      html:<div className="overflow-y-hidden"><CircularProgress /></div>
    })

    axiosAuthInstacne
      .post("recipe/create", recipe)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "게시가 완료되었습니다!",
            icon: "success",
          }).then(() => {
            router.push(`/`);
          });
          //have to 리발리데이트 
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "에러가 발생하였습니다.",
          icon: "error",
        });
      });
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

  useEffect(() => {
    console.log("레시피", recipe);
  }, [recipe]);

  return (
    <div className="p-5 max-w-xl w-dvw m-3 bg-white px-4 flex flex-col justify-center items-center">
      <RecipeName recipe={recipe} setRecipe={setRecipe}></RecipeName>
      <Categori recipe={recipe} setRecipe={setRecipe}></Categori>
      <Serving recipe={recipe} setRecipe={setRecipe}></Serving>
      <CookMethod recipe={recipe} setRecipe={setRecipe}></CookMethod>
      <RepriPric recipe={recipe} setRecipe={setRecipe}></RepriPric>
      <Description recipe={recipe} setRecipe={setRecipe}></Description>
      <Ingredient recipe={recipe} setRecipe={setRecipe}></Ingredient>
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
          <div className="w-full text-center mt-6">
            <button className="cancelBtn me-2" onClick={() => setIsModalOpen(false)}>
              닫기
            </button>
            <button
              onClick={() => {
                saveRecipeToDb();
              }}
              className={`ms-2 ${errorCnt !== 0 ? "grayBtn" : "greenBtn"}`}
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
