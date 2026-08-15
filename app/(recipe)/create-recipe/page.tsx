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
import { Modal, Box, CircularProgress } from "@mui/material";
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
import RecipeDraft from "./RecipeDraft";
import { useQueryClient } from "@tanstack/react-query";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";

export type RecipeCreate = Omit<Recipe, 'createdAt' | 'views' | 'recipeId'>;

export default function CreateRecipePage() {
  const [recipeImgCnt] = useRecoilState<number>(createRecipeImgState);
  const [recipe, setRecipe] = useState<RecipeCreate>({
    recipeName: "",
    repriPhotos: ["", "", ""],
    categorie: RecipeSelection.한식,
    servings: 1,
    cookMethod: CookingMethod.굽기,
    ingredients: [        
      { name: "", qqt: "", order: 0 },
      { name: "", qqt: "", order: 1 }],
    description: "",
    steps: [],
    viewCnt: 0,
  });

  const [isSignIn] = useRecoilState(siginInState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorCnt, setErrorCnt] = useState<number>(0);
  const { layoutBottomMargin } = useResponsiveDesignCss(); 

  const [draftId, setDraftId] = useState<number>(-1);

  const router = useRouter();
  const isTokenValid = useChkLoginToken("refreshNeed");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isTokenValid && !isSignIn) {
      router.push("/signin");
    }
  }, [isSignIn, router, isTokenValid]);

  /** 레시피 저장 */ 
  const saveRecipeToDb = () => {
    withReactContent(Swal).fire({
      title: "레시피를 공개하는 중...",
      showConfirmButton: false,
      allowOutsideClick: false,
      html: <div className="overflow-y-hidden"><CircularProgress sx={{ color: "#10b981" }} /></div>
    });

    axiosAuthInstacne
      .post("recipe/create", recipe)
      .then((res) => {
        if (res.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['draftRecipe'] });
          Swal.fire({
            title: "게시가 완료되었습니다!",
            icon: "success",
            confirmButtonColor: "#10b981",
          }).then(() => {
            revalidateByTagName("reviews-find");
            router.replace(`/recipe-detail/${res.data}`);
          });
        }
      });
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 420,
    bgcolor: "background.paper",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    p: 4,
    outline: "none",
  };

  if (!isTokenValid) return <></>;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-gray-800 pb-28 text-left">
      
      {/* Page Title Header */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">새 레시피 작성</h1>
        <p className="text-xs text-gray-500 font-medium mt-1">나만의 특별한 요리 노하우와 레시피를 공유해보세요.</p>
      </div>

      {/* Flat Form Sections */}
      <RecipeName recipe={recipe} setRecipe={setRecipe} />
      <Description recipe={recipe} setRecipe={setRecipe} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <Categori recipe={recipe} setRecipe={setRecipe} />
      <div className="w-full h-[1px] bg-gray-100 my-6" />
      <Serving recipe={recipe} setRecipe={setRecipe} />
      <div className="w-full h-[1px] bg-gray-100 my-6" />
      <CookMethod recipe={recipe} setRecipe={setRecipe} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <RepriPric recipe={recipe} setRecipe={setRecipe} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <Ingredient key={draftId} recipe={recipe} setRecipe={setRecipe} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <CookStep recipe={recipe} setRecipe={setRecipe} />

      {/* Floating Scroll Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <ScrollToTopButton />
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
      >
        <Box sx={modalStyle}>
          <div>
            <div className="text-center mb-3">
              {errorCnt !== 0 && <WarningIcon color="error" sx={{ fontSize: 36 }} />}
            </div>
            <ErrorText recipe={recipe} setErrorCnt={setErrorCnt} />
            {errorCnt === 0 && (
              <div className="text-center">
                <h2 className="text-base font-black text-gray-900">레시피 게시</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">작성하신 레시피를 세상에 내놓으시겠습니까?</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <button 
              className="flex-1 py-3 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer transition-all shadow-xs" 
              onClick={() => setIsModalOpen(false)}
            >
              취소
            </button>
            {errorCnt === 0 && (
              <button
                onClick={saveRecipeToDb}
                className="flex-1 py-3 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl cursor-pointer transition-all shadow-md border-none"
              >
                게시하기
              </button>
            )}
          </div>
        </Box>
      </Modal>

      {/* Bottom Sticky Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/60 p-3.5 shadow-lg ${layoutBottomMargin}`}>
        <div className="max-w-2xl mx-auto flex justify-end items-center gap-3 px-4">
          <RecipeDraft recipe={recipe} setRecipe={setRecipe} draftId={draftId} setDraftId={setDraftId} />
          
          <button
            className="px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl cursor-pointer transition-all shadow-md border-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
            onClick={() => {
              if (recipeImgCnt > 0) return;
              setIsModalOpen(true);
            }}
          >
            {recipeImgCnt <= 0 ? (
              <span>완료</span>
            ) : (
              <CircularProgress size={16} sx={{ color: "white" }} />
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
