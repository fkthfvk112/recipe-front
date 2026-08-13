"use client";

import React, { SetStateAction } from "react";
import Image from "next/image";
import { RecipeCreate } from "./page";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import ClearIcon from '@mui/icons-material/Clear';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { createRecipeImgState } from "@/app/(recoil)/recipeAtom";

interface RepriProp {
  recipe: RecipeCreate;
  setRecipe: React.Dispatch<SetStateAction<RecipeCreate>>;
}

function RepriPric({ recipe, setRecipe }: RepriProp) {
  const [, setRecipeImgCnt] = useRecoilState<number>(createRecipeImgState);

  const tempSaveImg = (imgStr: string, inx: number) => {
    setRecipeImgCnt((prev) => prev + 1);
    axiosAuthInstacne
      .post("recipe/img", { img: imgStr })
      .then((res) => {
        const existRecipe = { ...recipe };
        existRecipe.repriPhotos[inx] = res.data;
        setRecipe(existRecipe);
      })
      .catch(() => {
        Swal.fire({
          title: "이미지를 다시 등록해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#10b981",
          allowEnterKey: false,
        });
      })
      .finally(() => {
        setRecipeImgCnt((prev) => Math.max(prev - 1, 0));
      });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, inx: number) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64StrImg = (await resizeFileToBase64(file, 1200, 1200)) as string;
        const existRecipe = { ...recipe };
        existRecipe.repriPhotos[inx] = base64StrImg;
        setRecipe(existRecipe);
        tempSaveImg(base64StrImg, inx);
      } catch (error) {
        alert("파일 변환 오류 발생: " + error);
      }
    }
  };

  const deleteRepriPhoto = (inx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const existRecipe = { ...recipe };
    existRecipe.repriPhotos[inx] = "";
    setRecipe(existRecipe);
  };

  const slots = [0, 1, 2];

  return (
    <div className="w-full mb-6 text-left">
      <div className="mb-3">
        <h3 className="text-sm font-black text-gray-900">대표 사진 등록</h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          레시피를 상징하는 요리 사진을 최소 1장 이상 등록해주세요.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {slots.map((inx) => {
          const photoUrl = recipe?.repriPhotos?.[inx];
          const hasPhoto = Boolean(photoUrl && photoUrl !== "");
          const inputId = `repriPhotoSlot_${inx}`;

          return (
            <div
              key={inx}
              className={`relative aspect-square w-full rounded-2xl transition-all overflow-hidden ${
                hasPhoto
                  ? "border border-gray-200 shadow-xs bg-black/5"
                  : "border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20"
              }`}
            >
              <input
                onChange={(evt) => handleFileChange(evt, inx)}
                id={inputId}
                type="file"
                accept=".jpg, .jpeg, .png, .gif, .webp"
                hidden
              />

              {!hasPhoto ? (
                <label
                  htmlFor={inputId}
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-2 group transition-colors"
                >
                  <AddPhotoAlternateOutlinedIcon
                    sx={{ fontSize: 28 }}
                    className="text-gray-400 group-hover:text-emerald-500 transition-colors mb-1"
                  />
                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-emerald-600 transition-colors">
                    {inx === 0 ? "메인 사진 *" : `사진 ${inx + 1}`}
                  </span>
                </label>
              ) : (
                <div className="relative w-full h-full group">
                  <Image
                    src={photoUrl}
                    alt={`대표 사진 ${inx + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 200px"
                    className="object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => deleteRepriPhoto(inx, e)}
                    className="w-6 h-6 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-all absolute top-2 right-2 z-20 cursor-pointer border-none shadow-sm"
                    title="사진 삭제"
                  >
                    <ClearIcon sx={{ fontSize: 14 }} />
                  </button>
                  {inx === 0 && (
                    <span className="absolute bottom-2 left-2 z-10 text-[10px] font-extrabold text-white bg-emerald-600/90 px-2 py-0.5 rounded-full shadow-xs">
                      대표
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(RepriPric);