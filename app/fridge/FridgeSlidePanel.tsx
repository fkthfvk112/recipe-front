"use client";

import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { fridgeModalOpenState, fridgeSortingAtom } from "@/app/(recoil)/fridgeAtom";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeDetail } from "@/app/(api)/fridge";
import { Fridge, FridgeIdNameDesc, FridgeItem } from "@/app/(type)/fridge";
import Image from "next/image";
import Link from "next/link";
import ExpBar from "./[fridgeId]/(common)/ExpBar";
import FridgeItemDetailModal from "./[fridgeId]/(common)/FridgeItemDetailModal";
import { truncateString } from "@/app/(utils)/StringUtil";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KitchenIcon from "@mui/icons-material/Kitchen";
import SortIcon from "@mui/icons-material/Sort";
import { CircularProgress } from "@mui/material";
import { FridgeSortingEnum } from "@/app/(type)/fridge";
import { PrimaryButton, CancelButton } from "@/app/(commom)/Component/Buttons";

interface Props {
  fridgeId: number;
  fridgeName: string;
  fridgeList: FridgeIdNameDesc[];
  onClose: () => void;
}

export default function FridgeSlidePanel({ fridgeId, fridgeName, fridgeList, onClose }: Props) {
  const [fridgeSort, setFridgeSort] = useRecoilState(fridgeSortingAtom);
  const [modalItem, setModalItem] = useState<FridgeItem>();
  const [, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const { data: fridgeData, isLoading } = useQuery<Fridge>({
    queryKey: ["fridgeDetail", fridgeId, fridgeSort],
    queryFn: () => fetchFridgeDetail(fridgeId, fridgeSort),
    enabled: !!fridgeId,
  });

  const handleItemClick = (item: FridgeItem) => {
    setModalItem(item);
    setOpen(true);
  };

  const sortOptions = [
    { label: "유통기한 넉넉한순", value: FridgeSortingEnum.ExpMany },
    { label: "유통기한 급한순",   value: FridgeSortingEnum.ExpFew  },
    { label: "등록 최신순",      value: FridgeSortingEnum.Latest  },
    { label: "등록 오래된순",    value: FridgeSortingEnum.Oldest  },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, right drawer on md+ */}
      <div
        className={`fixed z-50 bg-white flex flex-col
          /* mobile: full-width bottom sheet */
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[88vh]
          /* desktop: right drawer */
          md:bottom-0 md:top-0 md:left-auto md:right-0 md:w-[420px] md:max-h-none md:rounded-none md:rounded-l-3xl md:shadow-2xl
          shadow-[0_-4px_40px_rgba(0,0,0,0.12)]
          transition-transform duration-300 ease-out
          ${mounted
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-x-full"
          }`}
      >
        {/* Handle bar — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <KitchenIcon sx={{ fontSize: 18 }} />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 tracking-tight leading-tight">{fridgeName}</h2>
              {fridgeData?.description && (
                <p className="text-[11px] text-gray-400 font-medium leading-tight mt-0.5 line-clamp-1">
                  {fridgeData.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort select */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-2 py-1 bg-white shadow-xs">
              <SortIcon sx={{ fontSize: 13 }} className="text-gray-400" />
              <select
                className="text-[11px] font-medium text-gray-700 bg-transparent outline-none cursor-pointer"
                value={fridgeSort}
                onChange={(e) => setFridgeSort(Number(e.target.value))}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer border-none"
            >
              <CloseIcon sx={{ fontSize: 17 }} />
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <CircularProgress sx={{ color: "#10b981" }} size={26} />
            </div>
          ) : (fridgeData?.fridgeItems?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center gap-2">
              <p className="text-sm font-extrabold text-gray-800 mt-1">아직 식재료가 없어요</p>
              <p className="text-xs font-medium text-gray-400">아래 버튼을 눌러 첫 식재료를 등록해보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {fridgeData!.fridgeItems.map((item, inx) => {
                let dateDiff: number = -100_000;
                if (item?.expiredAt) {
                  const now = new Date();
                  const expDate = new Date(item.expiredAt);
                  expDate.setHours(0, 0, 0, 0);
                  now.setHours(0, 0, 0, 0);
                  dateDiff = Math.max(
                    (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                    0
                  );
                }
                return (
                  <div
                    key={inx}
                    onClick={() => handleItemClick(item)}
                    className="bg-white border border-gray-200/80 hover:border-emerald-500 rounded-2xl p-3 flex items-center justify-between gap-2.5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        {item.imgUrl ? (
                          <Image
                            src={item.imgUrl}
                            alt={item.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex items-center justify-center h-full text-base">🍎</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-[11px] font-medium text-gray-400 mt-0.5 line-clamp-1">
                            {truncateString(item.description, 18)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      {item.expiredAt && (
                        <div className="mb-1">
                          <ExpBar expDateStr={item.expiredAt as string} k={2} />
                        </div>
                      )}
                      {dateDiff !== -100_000 ? (
                        <span
                          className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                            dateDiff <= 3
                              ? "bg-red-50 text-red-600 border-red-200/60"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                          }`}
                        >
                          D-{dateDiff}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-gray-300">-</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="px-4 py-4 border-t border-gray-100 flex gap-2 shrink-0">
          <Link href={`/fridge/ingre-edit/${fridgeId}`} className="flex-[1.5]">
            <PrimaryButton fullWidth size="md">
              <AddIcon sx={{ fontSize: 16 }} />
              <span>식재료 추가</span>
            </PrimaryButton>
          </Link>
          <Link href={`/fridge/${fridgeId}/edit`} className="flex-1">
            <CancelButton fullWidth size="md">
              <EditOutlinedIcon sx={{ fontSize: 16 }} />
              <span>냉장고 수정</span>
            </CancelButton>
          </Link>
        </div>
      </div>

      {/* Item Detail Modal */}
      {modalItem && (
        <FridgeItemDetailModal
          key={modalItem.fridgeItemId}
          fridgeItemId={modalItem.fridgeItemId!}
          fridgeList={fridgeList}
          fridgeId={fridgeId}
        />
      )}
    </>
  );
}
