import FileUploadIcon from "@mui/icons-material/FileUpload";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Recipe } from "../types/recipeType";
import fileToBase64 from "@/app/(utils)/fileToBase64";

interface RepriPhoto {
  urlString: string | null;
  urlFile: File | null;
}

interface RepriProp {
  recipe: Recipe;
  setRecipe: React.Dispatch<SetStateAction<Recipe>>;
}

export default function RepriPric({ recipe, setRecipe }: RepriProp) {
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

  useEffect(() => {
    const photos = repriPhotos
      .filter((photo) => photo.urlFile instanceof File)
      .map((photo) => photo.urlFile)
      .filter((photo) => photo !== null) as File[];

    if (photos.length >= 1) {
      console.log("새 값", {
        ...recipe,
        repriPhotos: photos,
      });

      const convetAndSet = async () => {
        const base64Files = await Promise.all(
          photos.map((file) => fileToBase64(file))
        );
        setRecipe({
          ...recipe,
          repriPhotos: base64Files,
        });
      };

      convetAndSet();
    }
  }, [repriPhotos]);

  const handleFileChange = (event: any, inx: number) => {
    const file = event.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      const newRepriPhotos = [...repriPhotos];
      newRepriPhotos[inx] = {
        urlString: imageURL,
        urlFile: file,
      };

      setRepriPhotos(newRepriPhotos);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full mt-6 mb-6 p-5">
      <div className="text-start w-full">
        <h3 className="text-lg">대표 사진</h3>
        <p>1개 이상의 사진을 등록해주세요.</p>
      </div>
      <div className="flex justify-around w-full mt-3">
        <div className="flex justify-center items-center bg-slate-50 border border-slate-400 m-2 w-24 h-24 ">
          <label htmlFor="repriPhotoOne">
            <input
              onChange={(evt) => {
                handleFileChange(evt, 0);
              }}
              id="repriPhotoOne"
              className="border border-slate-500"
              type="file"
              hidden
            />
            {repriPhotos[0].urlString === null ? (
              <FileUploadIcon className="text-gray-500 w-16 h-16" />
            ) : (
              <Image
                width={300}
                height={300}
                className="w-full h-full"
                style={{ objectFit: "cover" }}
                src={repriPhotos[0].urlString}
                alt="no img"
              />
            )}
          </label>
        </div>
        <div className="flex justify-center items-center bg-slate-50 border border-slate-400 m-2 w-24 h-24 ">
          <label htmlFor="repriPhotoTwo">
            <input
              onChange={(evt) => {
                handleFileChange(evt, 1);
              }}
              id="repriPhotoTwo"
              className="border border-slate-500"
              type="file"
              hidden
            />
            {repriPhotos[1].urlString === null ? (
              <FileUploadIcon className="text-gray-500 w-16 h-16" />
            ) : (
              <Image
                width={300}
                height={300}
                className="w-full h-full"
                style={{ objectFit: "cover" }}
                src={repriPhotos[1].urlString}
                alt="no img"
              />
            )}
          </label>
        </div>
        <div className="flex justify-center items-center bg-slate-50 border border-slate-400 m-2 w-24 h-24 ">
          <label htmlFor="repriPhotoThree">
            <input
              onChange={(evt) => {
                handleFileChange(evt, 2);
              }}
              id="repriPhotoThree"
              className="border border-slate-500"
              type="file"
              hidden
            />
            {repriPhotos[2].urlString === null ? (
              <FileUploadIcon className="text-gray-500 w-16 h-16" />
            ) : (
              <Image
                width={300}
                height={300}
                className="w-full h-full"
                style={{ objectFit: "cover" }}
                src={repriPhotos[2].urlString}
                alt="no img"
              />
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
