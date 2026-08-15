"use client";

import React, { useEffect, useState } from "react";
import { FridgeItem } from "../../../(type)/fridge";
import { Box, LinearProgress, Slider } from "@mui/material";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { fridgeTxModalOpenState } from "@/app/(recoil)/fridgeAtom";
import { useQueryClient } from "@tanstack/react-query";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import { TxType } from "./FridgeItemDetailModal";
import { formatNumber } from "@/app/(utils)/StringUtil";
import Badge from "@/app/(commom)/Component/Badge";
import CommonModal from "@/app/(commom)/Component/CommonModal";
import { PrimaryButton, DangerButton } from "@/app/(commom)/Component/Buttons";

export interface FridgeItemTx {
  fridgeItemId: number;
  txType: TxType;
  amt?: number;
  qqt: number;
  reason?: string;
}

function FridgeItemTxModal({
  fridgeItem,
  fridgeId,
  remainAmt,
  remainQqt,
  txType,
}: {
  fridgeItem: FridgeItem;
  remainAmt: number;
  remainQqt: number;
  fridgeId: number;
  txType: TxType;
}) {
  const [open, setOpen] = useRecoilState<boolean>(fridgeTxModalOpenState);
  const [reason, setReason] = useState<string>("");
  const [amt, setAmt] = useState<number>(0);
  const [qqt, setQqt] = useState<number>(0);
  const [imgUrl] = useState<string>(fridgeItem.imgUrl);

  const qc = useQueryClient();
  const isDiscard = txType === "DISCARD";
  const typeKor = isDiscard ? "폐기" : "소비";

  useEffect(() => {
    if (!open) return;
    setReason("");
    setAmt(0);
    setQqt(0);
  }, [open]);

  const maxQqt = remainQqt;
  const progressValue = maxQqt > 0 ? (qqt / maxQqt) * 100 : 0;

  const calculNSetAmt = (q: number) => {
    setQqt(q);
    if (!fridgeItem) {
      setAmt(0);
      return;
    }
    const totalQqt = remainQqt;
    const totalAmt = remainAmt;
    if (totalQqt <= 0 || q <= 0) {
      setAmt(0);
      return;
    }
    if (q >= totalQqt) {
      setAmt(totalAmt);
      return;
    }
    const oneUnitAmt = totalAmt / totalQqt;
    setAmt(Math.round(oneUnitAmt * q));
  };

  const saveItemTx = () => {
    if (!fridgeItem?.fridgeImgId) return;

    if ((qqt <= 0 && remainQqt !== 0) || (amt < 0 && remainAmt !== 0)) {
      Swal.fire({
        icon: "warning",
        text: "수량을 올바르게 입력해 주세요.",
      });
      return;
    }

    Swal.fire({
      title: isDiscard ? "식재료를 폐기하시겠습니까?" : "식재료를 소비하시겠습니까?",
      text: isDiscard ? "폐기 후 되돌릴 수 없습니다." : "소비 내역이 기록됩니다.",
      icon: isDiscard ? "warning" : "question",
      showCancelButton: true,
      confirmButtonText: isDiscard ? "폐기하기" : "소비하기",
      cancelButtonText: "취소",
      confirmButtonColor: isDiscard ? "#ef4444" : "#10b981",
    }).then((result) => {
      if (result.isConfirmed) {
        const item: FridgeItemTx = {
          fridgeItemId: fridgeItem.fridgeItemId!,
          txType,
          amt,
          qqt,
          reason,
        };

        axiosAuthInstacne.post("fridge/my/fridge-item/tx", item).then((res) => {
          if (res.data === "CREATE_SUCCESS") {
            Swal.fire({
              title: isDiscard ? "식재료가 폐기되었습니다." : "식재료가 소비되었습니다.",
              icon: "success",
              timer: 1200,
              showConfirmButton: false,
            });
            setOpen(false);
            qc.invalidateQueries({ queryKey: ["fridgeDetail", fridgeId] });
            qc.invalidateQueries({ queryKey: ["fridgeItemDetail", fridgeItem.fridgeItemId!] });
          }
        });
      }
    });
  };

  const selectAll = () => {
    calculNSetAmt(remainQqt);
  };

  const modalTitleHeader = (
    <div className="flex items-center gap-2">
      <Badge variant={isDiscard ? "rose" : "emerald"} size="sm">
        {typeKor} 처리
      </Badge>
    </div>
  );

  return (
    <CommonModal
      open={open}
      onClose={() => setOpen(false)}
      title={modalTitleHeader}
      maxWidthClass="max-w-md"
      zIndex={1400}
    >
      {/* Main Visual & 식재료명 헤더 */}
      <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-gray-100">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
          {imgUrl ? (
            <Image src={imgUrl} alt={fridgeItem.name} fill sizes="64px" className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-gray-400 font-medium">이미지 없음</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-black text-gray-900 mb-1.5 leading-snug line-clamp-1">{fridgeItem.name}</h2>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 font-medium">남은 수량</span>
            <span className="font-extrabold text-gray-800">
              {formatNumber(remainQqt)} {fridgeItem.unit ?? ""}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-0.5">
            <span className="text-gray-400 font-medium">남은 금액</span>
            <span className="font-extrabold text-gray-800">{formatNumber(remainAmt)}원</span>
          </div>
        </div>
      </div>

      {/* Qqt Input & Slider */}
      <div className="space-y-4 mb-5">
        <div className="bg-gray-50/80 p-3.5 rounded-2xl space-y-3 border border-gray-100/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-gray-800">{typeKor} 수량</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                max={remainQqt}
                min={0}
                value={qqt}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v > remainQqt) calculNSetAmt(remainQqt);
                  else if (v < 0) calculNSetAmt(0);
                  else calculNSetAmt(v);
                }}
                className="w-20 border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-right font-extrabold outline-none focus:border-emerald-500 bg-white"
              />
              <span className="text-xs font-bold text-gray-600">{fridgeItem.unit ?? ""}</span>
              <button
                type="button"
                onClick={selectAll}
                className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200/60 transition-all cursor-pointer outline-none"
              >
                전체 선택
              </button>
            </div>
          </div>

          {/* Slider / Progress Bar */}
          <div className="pt-2 px-1">
            <Box sx={{ position: "relative", width: "100%" }}>
              <LinearProgress
                variant="determinate"
                value={progressValue}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#e5e7eb",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: isDiscard ? "#ef4444" : "#10b981",
                  },
                }}
              />
              <Slider
                value={qqt}
                onChange={(_, v) => calculNSetAmt(v as number)}
                min={0}
                max={remainQqt}
                sx={{
                  position: "absolute",
                  top: -6,
                  left: 0,
                  width: "100%",
                  padding: 0,
                  "& .MuiSlider-rail": { opacity: 0 },
                  "& .MuiSlider-track": { opacity: 0 },
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    backgroundColor: isDiscard ? "#ef4444" : "#10b981",
                    boxShadow: isDiscard
                      ? "0 0 0 4px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 4px rgba(16, 185, 129, 0.2)",
                  },
                }}
              />
            </Box>
          </div>
        </div>

        {/* Amt Input */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-gray-500 font-medium">{typeKor} 금액 환산</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={amt}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v > remainAmt) setAmt(remainAmt);
                else if (v < 0) setAmt(0);
                else setAmt(v);
              }}
              className="w-24 border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-right font-extrabold outline-none focus:border-emerald-500 bg-white"
            />
            <span className="font-bold text-gray-700">원</span>
          </div>
        </div>

        {/* Reason / Memo */}
        <div>
          <span className="text-xs font-bold text-gray-600 block mb-1">메모 및 사유</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={isDiscard ? "예: 유통기한 경과, 변질" : "예: 오늘 저녁 요리에 사용"}
            className="w-full border border-gray-200 rounded-2xl p-3 text-xs outline-none focus:border-emerald-500 resize-none bg-white"
            rows={2}
            maxLength={100}
          />
        </div>
      </div>

      {/* Primary Submit Button - 공용 PrimaryButton 또는 DangerButton 적용 */}
      {isDiscard ? (
        <DangerButton fullWidth size="md" onClick={saveItemTx}>
          폐기 처리 완료
        </DangerButton>
      ) : (
        <PrimaryButton fullWidth size="md" onClick={saveItemTx}>
          소비 처리 완료
        </PrimaryButton>
      )}

      <p className="mt-3 text-[11px] text-gray-400 text-center font-medium">
        *전체 수량 {typeKor} 시 냉장고 목록에서 해당 항목이 차감/정리됩니다.
      </p>
    </CommonModal>
  );
}

export default React.memo(FridgeItemTxModal);