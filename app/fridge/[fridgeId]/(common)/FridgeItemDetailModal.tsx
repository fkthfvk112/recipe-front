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
import { PrimaryButton, RoseButton, DarkButton, CancelButton, SubtleButton } from "@/app/(commom)/Component/Buttons";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

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
    <div className="flex items-center justify-between w-full pr-1">
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
      <div className="ms-3">
      {editMode ? (
        <SubtleButton
          size="sm"
          onClick={() => setEditMode(false)}
        >
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
          <span>수정 취소</span>
        </SubtleButton>
      ) : isActivate ? (
        <SubtleButton
          size="sm"
          onClick={() => setEditMode(true)}
        >
          <EditOutlinedIcon sx={{ fontSize: 14 }} />
          <span>수정</span>
        </SubtleButton>
      ) : null}
      </div>
    </div>
  );

  const resetEditForm = () => {
    if (!fridgeItem) return;
    setTitle(fridgeItem?.name ?? "");
    setPosition(fridgeId ?? 0);
    setQqt(fridgeItem?.qqt ?? 0);
    setUnit(fridgeItem?.unit ?? "개");
    setAmt(fridgeItem?.amt ?? 0);
    setExDate(fridgeItem?.expiredAt ?? "");
    setDescription(fridgeItem?.description ?? "");
    setFridgeImgId(fridgeItem?.fridgeImgId ?? 0);
    setImgUrl(fridgeItem?.imgUrl ?? "");
    setEditMode(false);
  };

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
            className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 transition-all ${
              editMode ? "cursor-pointer ring-2 ring-emerald-400 hover:opacity-90" : ""
            }`}
          >
            {imgUrl ? (
              <Image src={imgUrl} alt={title} fill sizes="80px" className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-gray-400 font-medium">이미지 없음</div>
            )}
            {editMode && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-[10px] font-bold">
                변경
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {editMode ? (
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-500">식재료명</label>
                <input
                  className="text-sm font-bold text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 w-full outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="식재료명 입력"
                />
              </div>
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
            <div className="bg-gray-50/80 p-4 rounded-2xl space-y-3.5 border border-gray-200/70">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700 text-xs">위치 (냉장고)</span>
                <select
                  value={position}
                  onChange={(e) => setPosition(Number(e.target.value))}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-xs font-bold text-gray-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                >
                  {fridgeOptionList}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700 text-xs">총 수량 / 단위</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    className="w-20 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    value={qqt}
                    onChange={(e) => setQqt(Number(e.target.value))}
                    placeholder="수량"
                  />
                  <input
                    className="w-16 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="단위"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700 text-xs">총 구매 금액</span>
                <div className="flex items-center gap-1">
                  <input
                    className="w-32 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-right bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    value={amt ? formatNumber(amt) : ""}
                    onChange={(e) => setAmt(Number(e.target.value.replace(/,/g, "")))}
                    placeholder="0"
                  />
                  <span className="text-xs font-bold text-gray-500">원</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700 text-xs">소비기한</span>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    className="border w-28 border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    value={exDate}
                    onChange={(e) => setExDate(e.target.value)}
                  />
                  <span className="text-xs font-bold text-gray-500">까지</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <span className="font-bold text-gray-700 text-xs">메모</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-xs font-medium bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                  rows={2}
                  placeholder="식재료 관련 메모 작성 (선택)"
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

        {/* Primary Actions - 공용 PrimaryButton, CancelButton & RoseButton 적용 */}
        <div className="flex items-center gap-2 pt-1">
          {editMode ? (
            <div className="grid grid-cols-3 gap-2 w-full">
              <CancelButton
                size="md"
                className="w-full justify-center py-2.5 font-bold"
                onClick={resetEditForm}
              >
                취소
              </CancelButton>
              <PrimaryButton
                size="md"
                className="w-full justify-center py-2.5 font-bold"
                onClick={updateItem}
                disabled={!isChanged()}
              >
                수정 완료
              </PrimaryButton>
              <RoseButton
                size="md"
                className="w-full justify-center py-2.5 font-bold"
                onClick={deleteItem}
              >
                삭제
              </RoseButton>
            </div>
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