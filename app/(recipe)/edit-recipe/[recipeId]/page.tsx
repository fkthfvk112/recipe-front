"use client";

import { useEffect, useState } from "react";
import RecipeName from "../../create-recipe/RecipeName";
import Serving from "../../create-recipe/Serving";
import Categori from "../../create-recipe/Categori";
import CookMethod from "../../create-recipe/CookMethod";
import Description from "../../create-recipe/Description";
import CookStep from "../../create-recipe/(cookStepDnd)/CookStep";
import Ingredient from "../../create-recipe/Ingredient";
import { Modal, Box, CircularProgress } from "@mui/material";
import ErrorText from "../../create-recipe/ErrorText";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import withReactContent from "sweetalert2-react-content";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import RepriPic from "../../create-recipe/RepriPic";
import Swal from "sweetalert2";
import ScrollToTopButton from "@/app/(commom)/Component/GoToTopBtx";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { Recipe } from "../../types/recipeType";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import { PrimaryButton, CancelButton } from "@/app/(commom)/Component/Buttons";

export default function EditRecipePage({
  params,
}: {
  params: { recipeId: number };
}) {
  const [initialRecipeData, setInitialRecipeData] = useState<Recipe>();
  const [recipe, setRecipe] = useState<Recipe>({
    recipeId: params.recipeId,
    recipeName: "",
    repriPhotos: ["", "", ""],
    categorie: "default" as any,
    servings: 1,
    cookMethod: "default" as any,
    ingredients: [],
    description: "",
    steps: [],
    viewCnt: 0,
    createdAt: "",
  } as any);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSignIn] = useRecoilState(siginInState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorCnt, setErrorCnt] = useState<number>(0);
  const { layoutBottomMargin } = useResponsiveDesignCss();

  const router = useRouter();
  const isTokenValid = useChkLoginToken("refreshNeed");

  useEffect(() => {
    if (initialRecipeData) {
      setRecipe({ ...initialRecipeData });
    }
  }, [initialRecipeData]);

  useEffect(() => {
    if (isTokenValid && !isSignIn) {
      router.push("/signin");
    }
    axiosAuthInstacne
      .get(`recipe/detail-upd?recipeId=${params.recipeId}`)
      .then((res) => {
        setInitialRecipeData(res.data.recipeDTO);
        setLoading(false);
      });
  }, [isSignIn, router, isTokenValid, params.recipeId]);

  /** 레시피 수정 제출 */
  const saveRecipeToDb = () => {
    // Confirmation Modal 즉시 닫기
    setIsModalOpen(false);
    setIsSubmitting(true);

    // 네트워크 지연 처리 - 이탈 방지용 락 로딩 팝업
    withReactContent(Swal).fire({
      title: "레시피를 수정하는 중...",
      text: "잠시만 기다려주세요.",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      html: (
        <div className="overflow-y-hidden py-3">
          <CircularProgress sx={{ color: "#10b981" }} size={32} />
        </div>
      ),
    });

    axiosAuthInstacne
      .put("recipe/update", { ...recipe, recipeId: params.recipeId })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "수정이 완료되었습니다! 🎉",
            text: "변경된 레시피 정보가 저장되었습니다.",
            icon: "success",
            confirmButtonColor: "#10b981",
          }).then(() => {
            revalidateByTagName(`recipeDetail-${params.recipeId}`);
            router.replace(`/recipe-detail/${params.recipeId}`);
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: "수정에 실패했습니다.",
          text: "네트워크 상태를 확인하고 다시 시도해주세요.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
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
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    p: 4,
    outline: "none",
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
        <CircularProgress sx={{ color: "#10b981" }} />
      </div>
    );
  }

  if (!isTokenValid) return <></>;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-gray-800 pb-28 text-left">
      {/* Page Header */}
      <div className="mb-7 border-b border-gray-100 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer border border-gray-200/80 outline-none shrink-0"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              레시피 정보 수정 📝
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              기존 레시피의 내용이나 순서를 변경할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <RecipeName recipe={recipe} setRecipe={setRecipe as any} />
      <Description recipe={recipe} setRecipe={setRecipe as any} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <Categori recipe={recipe} setRecipe={setRecipe as any} />
      <div className="w-full h-[1px] bg-gray-100 my-6" />
      <Serving recipe={recipe} setRecipe={setRecipe as any} />
      <div className="w-full h-[1px] bg-gray-100 my-6" />
      <CookMethod recipe={recipe} setRecipe={setRecipe as any} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <RepriPic recipe={recipe} setRecipe={setRecipe as any} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <Ingredient recipe={recipe} setRecipe={setRecipe as any} />

      <div className="w-full h-[1px] bg-gray-100 my-6" />

      <CookStep recipe={recipe} setRecipe={setRecipe as any} />

      {/* Floating Scroll Top Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <ScrollToTopButton marginBottom={12} />
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
              {errorCnt !== 0 && (
                <WarningIcon color="error" sx={{ fontSize: 36 }} />
              )}
            </div>
            <ErrorText recipe={recipe} setErrorCnt={setErrorCnt} />
            {errorCnt === 0 && (
              <div className="text-center">
                <h2 className="text-base font-black text-gray-900">
                  레시피 수정 완료
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  변경하신 내용으로 레시피를 수정하시겠습니까?
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <CancelButton
              fullWidth
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </CancelButton>
            {errorCnt === 0 && (
              <PrimaryButton
                fullWidth
                onClick={saveRecipeToDb}
                loading={isSubmitting}
              >
                수정 완료
              </PrimaryButton>
            )}
          </div>
        </Box>
      </Modal>

      {/* Bottom Sticky Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200/60 p-3.5 shadow-lg ${layoutBottomMargin}`}
      >
        <div className="max-w-2xl mx-auto flex justify-between items-center gap-3 px-4">
          <CancelButton onClick={() => router.back()} disabled={isSubmitting}>
            취소
          </CancelButton>

          <PrimaryButton
            onClick={() => setIsModalOpen(true)}
            loading={isSubmitting}
            className="min-w-[120px]"
          >
            <CheckIcon sx={{ fontSize: 16 }} />
            <span>수정 완료</span>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
