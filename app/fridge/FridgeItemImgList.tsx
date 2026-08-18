"use client";

import { useEffect, useState } from "react";
import { FridgeItem } from "../(type)/fridge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeImages } from "../(api)/fridge";

interface FridgeItemImgListInterface {
  initialImgId?: number;
  imgClickCallback: (prop?: any) => any;
  autoMatchName?: string;
}

export default function FridgeItemImgList({
  initialImgId,
  imgClickCallback,
  autoMatchName,
}: FridgeItemImgListInterface) {
  const [imgSort, setImgSort] = useState<string>("전체");
  const [selectedFridgeImg, setSelectedFridgeImg] = useState<FridgeItem>();

  const { data: fridgeImgs = [] } = useQuery({
    queryKey: ["fridgeImages"],
    queryFn: fetchFridgeImages,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (fridgeImgs.length === 0) return;
    const picked =
      (typeof initialImgId === "number" &&
        fridgeImgs.find((x) => x.fridgeImgId === initialImgId)) ||
      fridgeImgs.find((x) => x.fridgeImgId === 0) ||
      fridgeImgs[0];
    setSelectedFridgeImg(picked);
  }, [fridgeImgs, initialImgId]);

  // 사용자가 식재료 이름을 입력/확정했을 때(autoMatchName), 동일한 name을 가진 아이콘 자동 선택
  useEffect(() => {
    if (!autoMatchName || autoMatchName.trim().length === 0 || fridgeImgs.length === 0) return;
    const query = autoMatchName.trim().toLowerCase();
    const matched = fridgeImgs.find((img) => {
      const imgName = (img.name || (img as any).imgName || "").trim().toLowerCase();
      return imgName.length > 0 && imgName === query;
    });

    if (matched) {
      setSelectedFridgeImg(matched);
      imgClickCallback(matched);
      if (matched.imgSort) {
        setImgSort(matched.imgSort);
      }
    }
  }, [autoMatchName, fridgeImgs, imgClickCallback]);

  const categories = [
    "전체",
    "채소",
    "과일",
    "육류",
    "수산물",
    "달걀/유제품",
    "곡류",
    "빵/과자",
    "냉동식품",
    "조미료/소스",
    "음료",
    "기타",
  ];

  const sortBtns = categories.map((sort, inx) => {
    const isSelected = imgSort === sort;
    return (
      <button
        key={inx}
        type="button"
        onClick={() => setImgSort(sort)}
        className={`px-3 py-1.5 w-24 text-xs font-extrabold rounded-xl transition-all cursor-pointer outline-none border shadow-xs ${
          isSelected
            ? "bg-gray-900 text-white border-gray-900 shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100/80 hover:text-gray-900"
        }`}
      >
        {sort}
      </button>
    );
  });

  const imageComps = fridgeImgs
    .filter((img) => {
      if (imgSort === "전체") return true;
      return imgSort === img.imgSort;
    })
    .map((img, inx) => {
      const isSelected = img.imgUrl === selectedFridgeImg?.imgUrl;
      return (
        <div
          key={inx}
          onMouseDown={() => {
            setSelectedFridgeImg(img);
            imgClickCallback(img);
          }}
          className={`relative aspect-square rounded-2xl bg-white border cursor-pointer flex items-center justify-center p-1.5 transition-all overflow-hidden group ${
            isSelected
              ? "border-emerald-500 ring-2 ring-emerald-500/80 shadow-md bg-emerald-50/20"
              : "border-gray-200 hover:border-emerald-300 hover:shadow-xs"
          }`}
        >
          {isSelected && (
            <div className="absolute top-1 right-1 z-10 text-emerald-500">
              <CheckCircleIcon sx={{ fontSize: 18 }} />
            </div>
          )}
          <div className="relative w-10 h-10">
            <Image
              src={img.imgUrl}
              alt={img.name || "icon"}
              fill
              sizes="40px"
              className="object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </div>
      );
    });

  return (
    <div className="w-full flex flex-col gap-3">
      <span className="text-[11px] font-black text-gray-700">아이콘 이미지 선택</span>

      {/* Category Chips Horizontal Scroll / Wrap */}
      <div className="flex flex-wrap gap-1.5">{sortBtns}</div>

      {/* Grid of Icon Cards */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-[220px] overflow-y-auto no-scrollbar p-1 bg-white border border-gray-200/80 rounded-2xl">
        {imageComps}
      </div>
    </div>
  );
}