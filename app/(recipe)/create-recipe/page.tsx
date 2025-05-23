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
import { Modal, Typography, Box, CircularProgress } from "@mui/material";
import ErrorText from "./ErrorText";
import WarningIcon from "@mui/icons-material/Warning";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import withReactContent from 'sweetalert2-react-content'
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import RepriPric from "./RepriPic";
import Swal from "sweetalert2";
import ScrollToTopButton from "@/app/(commom)/Component/GoToTopBtx";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { createRecipeImgState } from "@/app/(recoil)/recipeAtom";

export type RecipeCreate = Omit<Recipe, 'createdAt' | 'views' | 'recipeId'>;

export default function CreateRecipePage() {
  const [recipeImgCnt, setRecipeImgCnt] = useRecoilState<number>(createRecipeImgState);
  const [recipe, setRecipe] = useState<RecipeCreate>({
    recipeName: "",
    repriPhotos: ["", "", ""],
    categorie: RecipeSelection.한식,
    servings: 1,
    cookMethod: CookingMethod.굽기,
    ingredients: [],
    description: "",
    steps: [],
    viewCnt:0,
  });
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
  const router = useRouter();
  const isTokenValid = useChkLoginToken("refreshNeed");

  useEffect(() => {
    if(isTokenValid && !isSignIn){
      router.push("/signin");
    }

  }, [isSignIn, router, isTokenValid]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorCnt, setErrorCnt] = useState<number>(0);

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
            revalidateByTagName("reviews-find");
            router.replace(`/recipe-detail/${res.data}`);
          });
          //have to 리발리데이트 
        }
      })
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

  if(!isTokenValid) return <></>
  return (
    <div className="p-5 max-w-xl w-dvw m-3 mt-12 mb-16 bg-[white] px-4 flex flex-col justify-center items-center shadow-xl border border-[#1e1e1]">
      <RecipeName recipe={recipe} setRecipe={setRecipe}></RecipeName>
      <Description recipe={recipe} setRecipe={setRecipe}></Description>
      <Categori recipe={recipe} setRecipe={setRecipe}></Categori>
      <Serving recipe={recipe} setRecipe={setRecipe}></Serving>
      <CookMethod recipe={recipe} setRecipe={setRecipe}></CookMethod>
      <RepriPric recipe={recipe} setRecipe={setRecipe}></RepriPric>
      <Ingredient recipe={recipe} setRecipe={setRecipe}></Ingredient>
      <CookStep
        recipe={recipe}
        setRecipe={setRecipe}
      ></CookStep>
      <button
        className="saveBtn"
        onClick={() => {
          if(recipeImgCnt > 0) return;
          setIsModalOpen(true);
        }}
      >
        {
          recipeImgCnt <= 0?
          <span>
            레시피 쓰기
          </span>
          :
          <span>
            <CircularProgress size={16} />
          </span>
        }
        
      </button>
      <div className="fixed bottom-6 right-6">
        <ScrollToTopButton/>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <div className="text-center">
              {errorCnt !== 0 && <WarningIcon color="error"></WarningIcon>}
            </div>
            <ErrorText recipe={recipe} setErrorCnt={setErrorCnt}></ErrorText>
            {errorCnt === 0 && "레시피를 세상에 내놓겠습니까?"}
          </div>
          <div className="w-full text-center mt-6">
            <button className="cancelBtn me-2" onClick={() => setIsModalOpen(false)}>
              닫기
            </button>
            {
              errorCnt===0 &&
            <button
              onClick={() => {
                saveRecipeToDb();
              }}
              className={`ms-2 ${errorCnt !== 0 ? "grayBtn" : "greenBtn"}`}
              disabled={errorCnt === 0 ? false : true}
            >
              네
            </button>
            }
          </div>
        </Box>
      </Modal>
    </div>
  );
}
