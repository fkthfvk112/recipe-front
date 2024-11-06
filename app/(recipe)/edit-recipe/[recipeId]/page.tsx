"use client";

import { useEffect, useState } from "react";
import { CookingMethod, CookingSteps_create, Recipe, RecipeSelection } from "../../types/recipeType";
import { Modal, Typography, Box, CircularProgress } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import withReactContent from 'sweetalert2-react-content'
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import ScrollToTopButton from "@/app/(commom)/Component/GoToTopBtx";
import RecipeName from "../../create-recipe/RecipeName";
import Description from "../../create-recipe/Description";
import Categori from "../../create-recipe/Categori";
import Serving from "../../create-recipe/Serving";
import CookMethod from "../../create-recipe/CookMethod";
import Ingredient from "../../create-recipe/Ingredient";
import RepriPic from "../../create-recipe/RepriPic";
import ErrorText from "../../create-recipe/ErrorText";
import CookStep from "../../create-recipe/(cookStepDnd)/CookStep";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";

export type RecipeCreate = Omit<Recipe, 'createdAt' | 'views' | 'recipeId'>;

export default function CreateRecipePage({
  params
}: {
  params:{recipeId:string};
}) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<RecipeCreate>();
  const [recipe, setRecipe] = useState<RecipeCreate>({//viewCnt는 서버에서 DB타서 새로 세팅
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

  const setInitialRecipeData = (fetchData:RecipeCreate)=>{
    setInitialData(fetchData);

    const data = {...recipe};
    if(fetchData.recipeName !== undefined && fetchData.recipeName.length > 0){
      data.recipeName = fetchData.recipeName;
    }
    if(fetchData.repriPhotos !== undefined && fetchData.repriPhotos.length > 0){
      data.repriPhotos = fetchData.repriPhotos;
    }
    if(fetchData.categorie !== undefined && fetchData.categorie.length > 0){
      data.categorie = fetchData.categorie;
    }
    if(fetchData.servings !== undefined && fetchData.servings){
      data.servings = fetchData.servings;
    }
    if(fetchData.cookMethod !== undefined && fetchData.cookMethod){
      data.cookMethod = fetchData.cookMethod;
    }
    if(fetchData.ingredients !== undefined && fetchData.ingredients){
      data.ingredients = fetchData.ingredients;
    }
    if(fetchData.description !== undefined && fetchData.description.length > 0){
      data.description = fetchData.description;
    }
    if(fetchData.steps !== undefined && fetchData.steps.length > 0){
      data.steps = fetchData.steps as CookingSteps_create[];
    }
    setRecipe(data);
  }

  useEffect(() => {
    if (!isSignIn) {
      router.push("/signin");
    }
    axiosAuthInstacne.get(`recipe/get-recipe?recipeId=${params.recipeId}`)
    .then((res)=>{
      setInitialRecipeData(res.data.recipeDTO);
      setLoading(false);
    })
  }, [isSignIn, router]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorCnt, setErrorCnt] = useState<number>(0);
  const checkingDone = useChkLoginToken("refreshNeed");

  if(!checkingDone){
    return <></>
  }
  const saveRecipeToDb = () => {
    withReactContent(Swal).fire({
      title:"레시피를 공개하는 중...",
      showConfirmButton:false,
      allowOutsideClick:false,
      html:<div className="overflow-y-hidden"><CircularProgress /></div>
    })

    axiosAuthInstacne
      .put("recipe/update", {...recipe, recipeId:params.recipeId})
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "게시가 완료되었습니다!",
            icon: "success",
          }).then(() => {
            revalidateByTagName(`recipeDetail-${params.recipeId}`);
            router.push(`/recipe-detail/${params.recipeId}`);
          });
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

  if(isLoading){
    return(
      <div className="p-5 max-w-xl w-dvw h-[600px] m-3 mt-12 mb-16 bg-[white] px-4 flex flex-col justify-center items-center shadow-xl border border-[#1e1e1]">
          <CircularProgress/>
      </div>
    )
  }

  return (
    <div className="p-5 max-w-xl w-dvw m-3 mt-12 mb-16 bg-[white] px-4 flex flex-col justify-center items-center shadow-xl border border-[#1e1e1]">
      <RecipeName recipe={recipe} setRecipe={setRecipe}></RecipeName>
      <Description recipe={recipe} setRecipe={setRecipe}></Description>
      <Categori recipe={recipe} setRecipe={setRecipe}></Categori>
      <Serving recipe={recipe} setRecipe={setRecipe}></Serving>
      <CookMethod recipe={recipe} setRecipe={setRecipe}></CookMethod>
      <RepriPic  recipe={recipe} setRecipe={setRecipe}></RepriPic>
      <Ingredient recipe={recipe} setRecipe={setRecipe}></Ingredient>
      <CookStep
        recipe={recipe}
        setRecipe={setRecipe}
      ></CookStep>
      <button
        className="saveBtn"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        레시피 수정
      </button>

      <ScrollToTopButton/>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-center text-xl font-bold text-[#3d3d3d]">
            <div className="text-center">
              {errorCnt !== 0 && <WarningIcon color="error"></WarningIcon>}
            </div>
            <ErrorText recipe={recipe} setErrorCnt={setErrorCnt}></ErrorText>
            {errorCnt === 0 && "레시피를 수정하시겠습니까?"}
          </div>
          <div className="w-full text-center mt-6">
            {
              errorCnt===0 &&
            <button
              onClick={() => {
                saveRecipeToDb();
              }}
              className={`me-1 ${errorCnt !== 0 ? "grayBtn" : "greenBtn"}`}
              disabled={errorCnt === 0 ? false : true}
            >
              수정하기
            </button>
            }
            <button className="cancelBtn ms-1" onClick={() => setIsModalOpen(false)}>
              취소
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
