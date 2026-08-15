"use client";

import { extractDate } from "@/app/(utils)/DateUtil";
import CommonModal from "@/app/(commom)/Component/CommonModal";

export interface TxItem {
  txType: "DISCARD" | "CONSUME";
  amt: number;
  qqt: number;
  createdAt: string;
}

export default function FridgeItemTxHistoryModal({
  open,
  onClose,
  txList,
}: {
  open: boolean;
  onClose: () => void;
  txList: TxItem[];
}) {
  const formatNumber = (v: number | string) =>
    v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="식재료 변경 내역"
      maxWidthClass="max-w-md"
      zIndex={1500}
    >
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-1">
        {txList.map((tx, idx) => {
          const isDiscard = tx.txType === "DISCARD";

          return (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-50/80 p-3 rounded-2xl border border-gray-100/80"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-xl font-bold text-xs text-white ${
                    isDiscard ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                >
                  {isDiscard ? "✕" : "✓"}
                </div>

                <div className="text-left">
                  <div className="font-extrabold text-xs text-gray-900">
                    {isDiscard ? "폐기" : "소비"} {tx.qqt}개
                  </div>
                  <div className="text-[11px] font-medium text-gray-400">
                    {extractDate(tx.createdAt)}
                  </div>
                </div>
              </div>

              <div
                className={`font-black text-xs ${
                  isDiscard ? "text-rose-500" : "text-emerald-600"
                }`}
              >
                -{formatNumber(tx.amt)}원
              </div>
            </div>
          );
        })}
      </div>
    </CommonModal>
  );
}
