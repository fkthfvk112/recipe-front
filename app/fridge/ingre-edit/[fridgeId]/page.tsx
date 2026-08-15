"use client";

import { Fridge, FridgeIdNameDesc, FridgeItem } from "@/app/(type)/fridge";
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import SetFridgeItem from "./SetFridgeItem";
import Image from "next/image";
import FridgeItemDetailModal from "../../[fridgeId]/(common)/FridgeItemDetailModal";
import { useRecoilState } from "recoil";
import { fridgeModalOpenState, fridgeSortingAtom } from "@/app/(recoil)/fridgeAtom";
import ExpBar from "../../[fridgeId]/(common)/ExpBar";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KitchenIcon from "@mui/icons-material/Kitchen";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeDetail } from "@/app/(api)/fridge";
import { CircularProgress } from "@mui/material";

export default function FridgeDetail({
  params,
}: {
  params: { fridgeId: number };
}) {
  const [fridgeSort] = useRecoilState(fridgeSortingAtom);
  const [modalItem, setModalItem] = useState<FridgeItem>();
  const [fridgeList, setFridgeList] = useState<FridgeIdNameDesc[]>([]);
  const router = useRouter();

  const [open, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);

  const { data: fridgeData, isLoading } = useQuery<Fridge>({
    queryKey: ["fridgeDetail", params.fridgeId, fridgeSort],
    queryFn: () => fetchFridgeDetail(params.fridgeId, fridgeSort),
    enabled: !!params.fridgeId,
  });

  useEffect(() => {
    setOpen(false);
    axiosAuthInstacne.get("fridge/my").then((res) => {
      setFridgeList(res.data);
    });
  }, [setOpen]);

  const goPrev = () => {
    router.back();
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto px-4 py-8 bg-white min-h-screen text-left text-gray-800 pb-28">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-7 border-b border-gray-100 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="w-9 h-9 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer border border-gray-200/80 outline-none shrink-0"
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                <KitchenIcon sx={{ fontSize: 20 }} className="text-emerald-500" />
                <span>{fridgeData?.name || "냉장고"} 식재료 관리 🧊</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                이름만 입력해서 1초 만에 추가하고, 보유한 식재료를 관리해보세요.
              </p>
            </div>
          </div>
        </div>

        {/* ── SetFridgeItem Form Component ────────────────────────────── */}
        <div className="mb-10">
          <SetFridgeItem
            fridgeId={params.fridgeId}
            lastOrder={fridgeData ? fridgeData.fridgeItems.length : 0}
          />
        </div>

        {/* ── Current Fridge Items Section ────────────────────────────── */}
        <section className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-900 tracking-tight">
              보유 중인 식재료 ({fridgeData?.fridgeItems.length ?? 0}개)
            </h2>
            <span className="text-[11px] text-gray-400 font-medium">카드를 누르면 상세/수정할 수 있어요</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <CircularProgress sx={{ color: "#10b981" }} size={26} />
            </div>
          ) : (fridgeData?.fridgeItems.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <span className="text-3xl">🧺</span>
              <p className="text-xs font-bold text-gray-500">등록된 식재료가 없습니다.</p>
              <p className="text-[11px] font-medium text-gray-400">위에서 첫 식재료를 추가해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {fridgeData!.fridgeItems.map((item, inx) => (
                <div
                  key={inx}
                  onClick={() => {
                    setModalItem(item);
                    setOpen(true);
                  }}
                  className="bg-white border border-gray-200/80 hover:border-emerald-500 rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md group relative overflow-hidden"
                >
                  {/* ExpBar Header */}
                  <div className="w-full mb-2">
                    {item.expiredAt ? (
                      <ExpBar expDateStr={item.expiredAt as string} k={2} />
                    ) : (
                      <div className="h-[18px]" />
                    )}
                  </div>

                  {/* Item Image */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 mb-2 shrink-0">
                    {item.imgUrl ? (
                      <Image
                        src={item.imgUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="flex items-center justify-center h-full text-xl">🍏</span>
                    )}
                  </div>

                  {/* Name */}
                  <span className="text-xs font-black text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

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