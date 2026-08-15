"use client";

import { Fridge, FridgeIdNameDesc, FridgeItem, FridgeSortingEnum } from "@/app/(type)/fridge";
import { AdditionalBtn } from "../../(commom)/Component/AdditionalBtn";
import { ChangeEventHandler, useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { fridgeModalOpenState, fridgeSortingAtom } from "@/app/(recoil)/fridgeAtom";
import FridgeItemDetailModal from "./(common)/FridgeItemDetailModal";
import ExpBar from "./(common)/ExpBar";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { extractDate } from "@/app/(utils)/DateUtil";
import { truncateString } from "@/app/(utils)/StringUtil";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeDetail } from "@/app/(api)/fridge";
import { CircularProgress } from "@mui/material";

export default function FridgeDetail({
  params
}: {
  params: { fridgeId: number };
}) {
  const [fridgeSort, setFridgeSort] = useRecoilState(fridgeSortingAtom);
  const [modalItem, setModalItem] = useState<FridgeItem>();
  const [fridgeList, setFirdgeList] = useState<FridgeIdNameDesc[]>([]);
  const [, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);

  const { data: fridgeData, isLoading } = useQuery<Fridge>({
    queryKey: ["fridgeDetail", params.fridgeId, fridgeSort],
    queryFn: () => fetchFridgeDetail(params.fridgeId, fridgeSort),
    enabled: !!params.fridgeId,
  });

  useEffect(() => {
    setOpen(false);
    axiosAuthInstacne.get("fridge/my").then((res) => {
      setFirdgeList(res.data);
    });
  }, [setOpen]);

  const fridgeItemProp = fridgeData?.fridgeItems.map((item, inx) => {
    let dateDiff: number = -100_000;
    if (item?.expiredAt) {
      const now: Date = new Date();
      const expDate: Date = new Date(item.expiredAt);
      expDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      dateDiff = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      dateDiff = Math.max(dateDiff, 0);
    }

    return (
      <div
        key={inx}
        onClick={() => {
          setModalItem(item);
          setOpen(true);
        }}
        className="bg-white border border-gray-200/80 hover:border-emerald-500 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer group text-left relative overflow-hidden"
      >
        {/* Left Thumbnail with ExpBar */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
            {item.imgUrl ? (
              <Image
                className="object-cover rounded-2xl"
                src={item.imgUrl}
                alt={item.name}
                fill
                quality={90}
              />
            ) : (
              <span className="text-xl flex items-center justify-center h-full">🍎</span>
            )}
          </div>

          <div className="flex flex-col text-left">
            <h2 className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {item.name}
            </h2>
            {item.description && (
              <p className="text-xs text-gray-500 font-medium line-clamp-1 mt-0.5">
                {truncateString(item.description, 20)}
              </p>
            )}
            <p className="text-[11px] text-gray-400 font-medium mt-1">
              등록일: {extractDate(item.createdAt as string)}
            </p>
          </div>
        </div>

        {/* Right D-Day Indicator */}
        <div className="flex flex-col items-end shrink-0">
          {item.expiredAt && (
            <div className="mb-1">
              <ExpBar expDateStr={item.expiredAt as string} k={2} />
            </div>
          )}
          {dateDiff !== -100_000 ? (
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                dateDiff <= 3
                  ? "bg-red-50 text-red-600 border-red-200/60"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
              }`}
            >
              D-{dateDiff}
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-bold">-</span>
          )}
        </div>
      </div>
    );
  });

  const additionalBtnInfo = [
    { name: "식재료 추가", url: `/fridge/ingre-edit/${params.fridgeId}` },
    { name: "냉장고 수정/삭제", url: `/fridge/${params.fridgeId}/edit` },
  ];

  const handleSortingChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setFridgeSort(Number(e.target.value));
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-left text-gray-800 pb-28">
        
        {/* Header Section */}
        <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KitchenIcon className="text-emerald-500 w-6 h-6" />
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {fridgeData?.name || "냉장고 정보"}
              </h1>
            </div>
            {fridgeData?.description && (
              <p className="text-xs text-gray-500 font-medium mt-1">
                {fridgeData.description}
              </p>
            )}
          </div>

          {/* Sorting Dropdown */}
          <select
            onChange={handleSortingChange}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 bg-white focus:border-emerald-500 outline-none shadow-xs cursor-pointer"
            value={fridgeSort}
          >
            <option value={FridgeSortingEnum.ExpMany}>유통기한 넉넉한순</option>
            <option value={FridgeSortingEnum.ExpFew}>유통기한 급한순</option>
            <option value={FridgeSortingEnum.Latest}>등록 최신순</option>
            <option value={FridgeSortingEnum.Oldest}>등록 오래된순</option>
          </select>
        </div>

        {/* Ingredients Grid / List */}
        {isLoading ? (
          <div className="py-20 text-center">
            <CircularProgress sx={{ color: "#10b981" }} />
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 mb-8">
            {fridgeItemProp}

            {/* Add New Item Dashed Button */}
            <Link
              href={`/fridge/ingre-edit/${params.fridgeId}`}
              className="w-full py-4 border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20 text-emerald-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <AddIcon sx={{ fontSize: 20 }} />
              <span>새 식재료 추가하기</span>
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <AdditionalBtn additionalBtns={additionalBtnInfo} />
      </div>

      {/* Item Detail Modal */}
      {modalItem && (
        <FridgeItemDetailModal
          key={modalItem?.fridgeItemId}
          fridgeItemId={modalItem.fridgeItemId!}
          fridgeList={fridgeList}
          fridgeId={params.fridgeId}
        />
      )}
    </>
  );
}