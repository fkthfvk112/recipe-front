import FileUploadIcon from "@mui/icons-material/FileUpload";
import Image from "next/image";
import React, { SetStateAction, useState } from "react";
import { RecipeCreate } from "./page";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import ClearIcon from '@mui/icons-material/Clear';
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { createRecipeImgState } from "@/app/(recoil)/recipeAtom";

interface RepriPhoto {
  urlString: string | null;
  urlFile: File | null;
}

interface RepriProp {
  recipe: RecipeCreate;
  setRecipe: React.Dispatch<SetStateAction<RecipeCreate>>;
}

function RepriPric({ recipe, setRecipe }: RepriProp) {
  const [recipeImgCnt, setRecipeImgCnt] = useRecoilState<number>(createRecipeImgState);
  const [repriPhotos, setRepriPhotos] = useState<RepriPhoto[]>([
    {
      urlString: null,
      urlFile: null,
    },
    {
      urlString: null,
      urlFile: null,
    },
    {
      urlString: null,
      urlFile: null,
    },
  ]);


  const tempSaveImg = (imgStr:string, inx:number)=>{
    setRecipeImgCnt(prev=>prev+1);
    axiosAuthInstacne.post("recipe/img", {img:imgStr}).then((res)=>{
      const existRecipe = {...recipe};
      existRecipe.repriPhotos[inx] = res.data;
      setRecipe(existRecipe);
    })
    .catch(()=>{
      Swal.fire({
        title: "이미지를 다시 등록해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: '#d33',
        allowEnterKey:false
      });    
    })
    .finally(()=>{
      setRecipeImgCnt(prev => Math.max(prev - 1, 0));
    })
  }

  const handleFileChange = async(event: any, inx: number) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64StrImg = await resizeFileToBase64(file, 1200, 1200) as string;
        const existRecipe = {...recipe};
        existRecipe.repriPhotos[inx] = base64StrImg;
        setRecipe(existRecipe);
        tempSaveImg(base64StrImg, inx)
      } catch (error) {
        alert("파일 변환 오류 발생 " + error);
      }
    }
  };

  const deleteRepriPhoto = (inx:number)=>{
    const existRecipe = {...recipe};
    existRecipe.repriPhotos[inx] = "";
    setRecipe(existRecipe);
  }

  return (
    <div className="flex flex-col justify-center items-center w-full mt-6 mb-6 p-5">
      <div className="text-start w-full">
        <h3 className="text-lg">대표 사진</h3>
        <p>1개 이상의 사진을 등록해주세요.</p>
      </div>
      <div className="flex justify-around w-full mt-3">
        <div className="flex justify-center items-center bg-slate-50 border border-slate-400 m-2 w-24 h-24">
          <input
            onChange={(evt) => {
              handleFileChange(evt, 0);
            }}
            id="repriPhotoOne"
            className="border border-slate-500"
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            hidden
          />
          {recipe?.repriPhotos[0] === null || recipe?.repriPhotos[0] === undefined || recipe?.repriPhotos[0] === ""? (
            <label className="cursor-pointer w-full h-full flex flex-center" htmlFor="repriPhotoOne">
              <FileUploadIcon className="text-gray-500 w-16 h-16" />
            </label>
          ) : (
            <div className="relative w-[100px] h-[100px] img-wrapper-square">
                <button onClick={()=>deleteRepriPhoto(0)} className="border-none w-5 h-5 absolute -top-3 right-1 z-10">
                      <ClearIcon className="bg-white"/>
                </button>
              <Image
                className="inner-img"
                src={recipe.repriPhotos[0]}
                alt="no img"
                fill
              />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center bg-slate-50 border border-slate-400 m-2 w-24 h-24 ">
          <input
            onChange={(evt) => {
              handleFileChange(evt, 1);
            }}
            id="repriPhotoTwo"
            className="border border-slate-500"
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            hidden
          />
          {recipe?.repriPhotos[1] === null || recipe?.repriPhotos[1] === undefined || recipe?.repriPhotos[1] === ""? (
            <label className="cursor-pointer w-full h-full flex flex-center" htmlFor="repriPhotoTwo">
              <FileUploadIcon className="text-gray-500 w-16 h-16" />
            </label>
          ) : (
            <div className="w-[100px] h-[100px] img-wrapper-square">
                <button onClick={()=>deleteRepriPhoto(1)} className="border-none w-5 h-5 absolute -top-3 right-1 z-10">
                      <ClearIcon className="bg-white"/>
                </button>
              <Image
                className="inner-img"
                src={recipe.repriPhotos[1]}
                alt="no img"
                fill
              />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center bg-slate-50 border border-slate-400 m-2 w-24 h-24">
        <input
            onChange={(evt) => {
              handleFileChange(evt, 2);
            }}
            id="repriPhotoThree"
            className="border border-slate-500"
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            hidden
          />
          {recipe?.repriPhotos[2] === null || recipe?.repriPhotos[2] === undefined || recipe?.repriPhotos[2] === ""? (
            <label className="cursor-pointer w-full h-full flex flex-center" htmlFor="repriPhotoThree">
              <FileUploadIcon className="text-gray-500 w-16 h-16" />
            </label>
          ) : (
            <div className="w-[100px] h-[100px] img-wrapper-square">
                <button onClick={()=>deleteRepriPhoto(2)} className="border-none w-5 h-5 absolute -top-3 right-1 z-10">
                      <ClearIcon className="bg-white"/>
                </button>
              <Image
                className="inner-img"
                src={recipe.repriPhotos[2]}
                alt="no img"
                fill
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RepriPric)