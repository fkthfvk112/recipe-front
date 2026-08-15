"use client";

import React, { useEffect, useState } from "react";
import { FridgeIdNameDesc, FridgeItem } from "../../../(type)/fridge";
import Image from "next/image";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRecoilState } from "recoil";
import { fridgeTxModalOpenState, fridgeModalOpenState } from "@/app/(recoil)/fridgeAtom";
import Swal from "sweetalert2";
import FridgeItemImgPickerModal from "./FridgeItemImgPickerModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getImgUrlByIdRQ } from "@/app/(utils)/fridgeUtils";
import FridgeItemTxModal from "./FridgeItemTxModal";
import { fetchFridgeItemDetail } from "@/app/(api)/fridge";
import FridgeItemTxHistoryModal from "./FridgeItemTxHistoryModal";
import FridgeItemTxHistoryPreview from "./FridgeItemTxHistoryPreview";
import { formatNumber } from "@/app/(utils)/StringUtil";
import Badge from "@/app/(commom)/Component/Badge";
import CommonModal from "@/app/(commom)/Component/CommonModal";
import { PrimaryButton, RoseButton, DarkButton, CancelButton } from "@/app/(commom)/Component/Buttons";

export type TxType = "DISCARD" | "CONSUME";
export type CallFrom = "hist";

interface Product {
  landingUrl?: string;
  productName?: string;
}

export default function FridgeItemDetailModal({
  fridgeItemId,
  fridgeList,
  fridgeId,
  callFrom,
}: {
  fridgeItemId: number;
  fridgeList?: FridgeIdNameDesc[];
  fridgeId?: number;
  callFrom?: CallFrom;
}) {
  const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);
  const [txHistoryOpen, setTxHistoryOpen] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState<boolean>(false);
  const [, setTxModalOpen] = useRecoilState<boolean>(fridgeTxModalOpenState);
  const [txType, setTxType] = useState<TxType>("CONSUME");

  const [imgUrl, setImgUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [position, setPosition] = useState<number>(fridgeId ?? 0);
  const [qqt, setQqt] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");
  const [amt, setAmt] = useState<number>(0);
  const [exDate, setExDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fridgeImgId, setFridgeImgId] = useState<number>(0);

  const qc = useQueryClient();

  const { data: fridgeItemDetail } = useQuery({
    queryKey: ["fridgeItemDetail", fridgeItemId],
    queryFn: () => fetchFridgeItemDetail(fridgeItemId),
    enabled: open && !!fridgeItemId,
    staleTime: 1000 * 60 * 5,
  });

  const productInfo: Product = fridgeItemDetail?.product;
  const fridgeItem: FridgeItem = fridgeItemDetail?.fridgeItem;
  const remainAmt: number = fridgeItemDetail?.remainAmt ?? 0;
  const remainQqt: number = fridgeItemDetail?.remainQqt ?? 0;
  const isActivate: boolean = fridgeItem?.status === "ACTIVE";

  useEffect(() => {
    if (open) setEditMode(false);
  }, [open]);

  useEffect(() => {
    if (!open || !fridgeItem) return;
    setTitle(fridgeItem?.name ?? "");
    setPosition(fridgeId ?? 0);
    setQqt(fridgeItem?.qqt ?? 0);
    setUnit(fridgeItem?.unit ?? "개");
    setAmt(fridgeItem?.amt ?? 0);
    setExDate(fridgeItem?.expiredAt ?? "");
    setDescription(fridgeItem?.description ?? "");
    setFridgeImgId(fridgeItem?.fridgeImgId ?? 0);
    setImgUrl(fridgeItem?.imgUrl ?? "");
  }, [open, fridgeItem, fridgeId]);

  const isChanged = () => {
    if (!fridgeItem) return false;
    if (position !== fridgeId) return true;
    if (fridgeItem.name !== title) return true;
    if (fridgeItem.qqt !== qqt) return true;
    if (fridgeItem.unit !== unit) return true;
    if (fridgeItem.amt !== amt) return true;
    if ((fridgeItem.expiredAt || "") !== exDate) return true;
    if (fridgeItem.description !== description) return true;
    if (fridgeItem.fridgeImgId !== fridgeImgId) return true;
    return false;
  };

  const updateItem = () => {
    if (!isChanged() || !fridgeItem || callFrom === "hist") return;
    axiosAuthInstacne
      .put("fridge/my/fridge-item", {
        fridgeId: position,
        fridgeImgId,
        fridgeItemId: fridgeItem.fridgeItemId,
        expiredAt: exDate,
        name: title,
        qqt,
        unit,
        amt,
        description,
        order: fridgeItem.itemOrder,
      })
      .then((res) => {
        if (res.data === "UPDATE_SUCCESS") {
          Swal.fire({ title: "식재료 수정 완료", icon: "success", timer: 1200, showConfirmButton: false });
          qc.invalidateQueries({ queryKey: ["fridgeDetail", fridgeId] });
          qc.invalidateQueries({ queryKey: ["fridgeItemDetail", fridgeItemId] });
          setEditMode(false);
        }
      });
  };

  const deleteItem = () => {
    if (!fridgeItem || callFrom === "hist") return;
    Swal.fire({
      title: "식재료를 삭제하시겠습니까?",
      text: "삭제 시 관련 소비/폐기 히스토리가 함께 정리됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosAuthInstacne.delete(`/fridge/item/${fridgeItem.fridgeItemId}`).then((res) => {
          if (res.data === "DELETE_SUCCESS") {
            Swal.fire({ title: "삭제되었습니다.", icon: "success", timer: 1200, showConfirmButton: false });
            setOpen(false);
            qc.invalidateQueries({ queryKey: ["fridgeDetail", fridgeId] });
            qc.invalidateQueries({ queryKey: ["fridgeItemDetail", fridgeItemId] });
          }
        });
      }
    });
  };

  let dateDiff: number = -100_000;
  if (exDate) {
    const now = new Date();
    const exp = new Date(exDate);
    exp.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    dateDiff = Math.max((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24), 0);
  }

  const fridgeOptionList = fridgeList?.map((f, inx) => (
    <option key={inx} value={f.fridgeId}>
      {f.fridgeName}
    </option>
  ));

  const currentFridgeName = fridgeList?.find((f) => f.fridgeId === position)?.fridgeName || "냉장고";

  const modalTitleHeader = (
    <div className="flex items-center justify-between w-full pr-2">
      <div className="flex items-center gap-2">
        <Badge variant="emerald" size="sm">
          {currentFridgeName}
        </Badge>
        {dateDiff !== -100_000 && (
          <Badge variant={dateDiff <= 3 ? "rose" : "amber"} size="sm">
            {dateDiff === 0 ? "D-Day 만료" : `D-${dateDiff}`}
          </Badge>
        )}
      </div>
      {!editMode && isActivate && (
        <button
          type="button"
          onClick={() => setEditMode(true)}
          className="px-2.5 py-1 text-xs font-extrabold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border-0 cursor-pointer outline-none"
        >
          수정
        </button>
      )}
    </div>
  );

  return (
    <>
      <CommonModal
        open={open}
        onClose={() => setOpen(false)}
        title={modalTitleHeader}
        maxWidthClass="max-w-md"
      >
        {/* Main Info Header */}
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
          <div
            onClick={() => editMode && setImgModalOpen(true)}
            className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 ${
              editMode ? "cursor-pointer ring-2 ring-emerald-400" : ""
            }`}
          >
            {imgUrl ? (
              <Image src={imgUrl} alt={title} fill sizes="80px" className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400 font-medium">이미지 없음</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {editMode ? (
              <input
                className="text-base font-black text-gray-900 border border-gray-200 rounded-xl px-2.5 py-1 w-full outline-none focus:border-emerald-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <h2 className="text-lg font-black text-gray-900 tracking-tight leading-snug line-clamp-1">{title}</h2>
            )}

            {/* Progress Bar */}
            <div className="mt-2.5 w-full">
              <div className="flex items-center justify-between text-[11px] font-extrabold mb-1">
                <span className="text-gray-500">남은 수량</span>
                <span className={remainQqt === 0 ? "text-rose-500" : "text-emerald-600"}>
                  {remainQqt} {unit} / 총 {qqt} {unit}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    remainQqt === 0 ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${qqt > 0 ? Math.min((remainQqt / qqt) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Field Details */}
        <div className="space-y-2.5 mb-5 text-xs">
          {editMode ? (
            <div className="bg-gray-50 p-3.5 rounded-2xl space-y-3 border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-gray-600">위치</span>
                <select
                  value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-2 py-1 bg-white text-xs"
                >
                  {fridgeOptionList}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-gray-600">총 수량 / 단위</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs"
                    value={qqt}
                    onChange={(e) => setQqt(Number(e.target.value))}
                  />
                  <input
                    className="w-12 border border-gray-200 rounded-lg px-2 py-1 text-xs"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-gray-600">총 구매 금액</span>
                <input
                  className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-xs text-right"
                  value={amt ? formatNumber(amt) : ""}
                  onChange={(e) => setAmt(Number(e.target.value.replace(/,/g, "")))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-gray-600">소비기한</span>
                <input
                  type="date"
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                  value={exDate}
                  onChange={(e) => setExDate(e.target.value)}
                />
              </div>
              <div>
                <span className="font-extrabold text-gray-600 block mb-1">메모</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-2 text-xs resize-none"
                  rows={2}
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50/80 p-3.5 rounded-2xl space-y-2 border border-gray-100/80 text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">소비기한</span>
                <span className="font-bold text-gray-900">{exDate || "미설정"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-medium">구매 금액</span>
                <span className="font-bold text-gray-900">{amt ? `${formatNumber(amt)}원` : "기록 없음"}</span>
              </div>
              {description && (
                <div className="pt-2 border-t border-gray-200/60 text-gray-600 leading-relaxed font-medium">
                  {description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* History Preview */}
        {fridgeItemDetail?.txList?.length > 0 && !editMode && (
          <div className="mb-4">
            <FridgeItemTxHistoryPreview
              count={fridgeItemDetail.txList.length}
              onClick={() => setTxHistoryOpen(true)}
            />
          </div>
        )}

        {/* 공용 DarkButton 적용 - 식재료 보충하기 */}
        {!editMode && productInfo?.landingUrl && (
          <div className="w-full mb-4">
            <DarkButton
              fullWidth
              size="md"
              onClick={() => window.open(productInfo.landingUrl, "_blank", "noopener,noreferrer")}
              className={remainQqt !== 0 ? "opacity-80 hover:opacity-100" : ""}
            >
              {remainQqt === 0 ? "식재료 보충하기" : "미리 보충해두기"}
            </DarkButton>
          </div>
        )}

        {/* Primary Actions - 공용 PrimaryButton & RoseButton 적용 */}
        <div className="flex items-center gap-2 pt-1">
          {editMode ? (
            <>
              <PrimaryButton
                fullWidth
                size="md"
                onClick={updateItem}
                disabled={!isChanged()}
              >
                수정 완료
              </PrimaryButton>
              <RoseButton
                fullWidth
                size="md"
                onClick={deleteItem}
              >
                식재료 삭제
              </RoseButton>
            </>
          ) : isActivate ? (
            <>
              <PrimaryButton
                fullWidth
                size="md"
                onClick={() => {
                  setTxType("CONSUME");
                  setTxModalOpen(true);
                }}
                className="flex-[1.3]"
              >
                소비하기
              </PrimaryButton>
              <RoseButton
                fullWidth
                size="md"
                onClick={() => {
                  setTxType("DISCARD");
                  setTxModalOpen(true);
                }}
                className="flex-1"
              >
                폐기하기
              </RoseButton>
            </>
          ) : null}
        </div>
      </CommonModal>

      {/* Sub Modals */}
      {fridgeItem && (
        <FridgeItemImgPickerModal
          initialFridItem={fridgeItem}
          open={imgModalOpen}
          onClose={() => setImgModalOpen(false)}
          onPick={async (img: FridgeItem) => {
            setFridgeImgId(img.fridgeImgId ?? 0);
            const selectedImg = await getImgUrlByIdRQ(qc, img.fridgeImgId ?? 0);
            setImgUrl(selectedImg);
          }}
        />
      )}

      {fridgeItem && fridgeId && (
        <FridgeItemTxModal
          fridgeId={fridgeId}
          fridgeItem={fridgeItem}
          remainAmt={remainAmt}
          remainQqt={remainQqt}
          txType={txType}
        />
      )}

      {fridgeItemDetail?.txList && (
        <FridgeItemTxHistoryModal
          open={txHistoryOpen}
          onClose={() => setTxHistoryOpen(false)}
          txList={fridgeItemDetail.txList}
        />
      )}
    </>
  );
}