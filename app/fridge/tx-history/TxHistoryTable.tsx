"use client";

import React, { useState } from "react";
import { FridgeItemTxRow } from "@/app/(type)/fridge";
import { formatNumber } from "@/app/(utils)/StringUtil";
import FridgeItemDetailModal from "../[fridgeId]/(common)/FridgeItemDetailModal";
import { useRecoilState } from "recoil";
import { fridgeModalOpenState } from "@/app/(recoil)/fridgeAtom";
import Badge from "@/app/(commom)/Component/Badge";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function TxHistoryTable({ list }: { list: FridgeItemTxRow[] }) {
  const [, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);
  const [fridgeItemId, setFridgeItemId] = useState<number>();

  const openDetailModal = (id: number) => {
    setOpen(true);
    setFridgeItemId(id);
  };

  if (!list || list.length === 0) {
    return (
      <div className="py-12 sm:py-16 text-center text-gray-400 font-normal text-xs">
        조회된 식재료 이력이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-auto touch-pan-x box-border">
      {/* 540px 미만 화면에서만 오직 이 카드 안에서 독립 수평 스크롤 렌더링 */}
      <table className="min-w-[500px] sm:min-w-full w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-[11px] sm:text-xs font-semibold text-gray-400 pb-2.5">
            <th className="pb-2.5 px-2">날짜</th>
            <th className="pb-2.5 px-2">식재료명</th>
            <th className="pb-2.5 px-2">구분</th>
            <th className="pb-2.5 px-2 text-right">수량</th>
            <th className="pb-2.5 px-2 text-right">금액</th>
            <th className="pb-2.5 px-2 text-center">상세</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/70 text-xs sm:text-sm font-normal">
          {list.map((tx) => {
            const isDiscard = tx.txType === "DISCARD";
            return (
              <tr
                key={tx.txId}
                className="hover:bg-gray-50/80 transition-colors cursor-pointer group active:bg-gray-100"
                onClick={() => openDetailModal(tx.fridgeItemId)}
              >
                {/* 날짜 */}
                <td className="py-3 px-2 text-gray-400 text-[11px] sm:text-xs whitespace-nowrap">
                  {tx.createdAt ? tx.createdAt.substring(0, 10) : "-"}
                </td>

                {/* 식재료명 */}
                <td className="py-3 px-2 font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate max-w-[130px]">
                  {tx.name}
                </td>

                {/* 구분 뱃지 */}
                <td className="py-3 px-2 whitespace-nowrap">
                  <Badge variant={isDiscard ? "rose" : "emerald"} size="sm">
                    {isDiscard ? "폐기" : "소비"}
                  </Badge>
                </td>

                {/* 수량 */}
                <td className="py-3 px-2 text-right text-gray-700 whitespace-nowrap">
                  {formatNumber(tx.qqt)}개
                </td>

                {/* 금액 */}
                <td className={`py-3 px-2 text-right whitespace-nowrap ${isDiscard ? "text-rose-600 font-bold" : "text-emerald-700 font-medium"}`}>
                  {isDiscard ? `-` : ``}{formatNumber(tx.amt)}원
                </td>

                {/* 상세보기 아이콘 */}
                <td className="py-3 px-2 text-center text-gray-300 group-hover:text-emerald-600 transition-colors">
                  <OpenInNewIcon style={{ fontSize: 15 }} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {fridgeItemId && (
        <FridgeItemDetailModal key={fridgeItemId} fridgeItemId={fridgeItemId} callFrom="hist" />
      )}
    </div>
  );
}
