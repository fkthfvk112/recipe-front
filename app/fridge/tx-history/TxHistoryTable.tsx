"use client";

import React, { useState } from "react";
import { FridgeItemTxRow } from "@/app/(type)/fridge";
import { formatNumber } from "@/app/(utils)/StringUtil";
import FridgeItemDetailModal from "../[fridgeId]/(common)/FridgeItemDetailModal";
import { useRecoilState } from "recoil";
import { fridgeModalOpenState } from "@/app/(recoil)/fridgeAtom";

export default function TxHistoryTable({ list }: { list: FridgeItemTxRow[] }) {
 
  const [open, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);
  const [fridgeItemId, setFridgeItemId] = useState<number>();

  const openDetailModal = (fridgeItemId:number) =>{
    setOpen(true);
    setFridgeItemId(fridgeItemId);
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[500px] w-full text-center border-collapse rounded-lg shadow-md">
        <thead className="bg-green-50">
          <tr className="text-gray-700 font-semibold text-sm">
            <th className="py-2 px-3">날짜</th>
            <th className="py-2 px-3">식재료</th>
            <th className="py-2 px-3">유형</th>
            <th className="py-2 px-3 text-right">수량</th>
            <th className="py-2 px-3 text-right">금액</th>
          </tr>
        </thead>
        <tbody>
          {list.map((tx) => (
            <React.Fragment key={tx.txId}>
              <tr
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => openDetailModal(tx.fridgeItemId)}
              >
                <td className="py-2 px-3">{tx.createdAt.substring(0, 10)}</td>
                <td className="py-2 px-3 flex items-center justify-center gap-1">
                  {tx.name}
                </td>
                <td
                  className={`py-2 px-3 font-medium ${
                    tx.txType === "DISCARD" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {tx.txType === "DISCARD" ? "폐기" : "소비"}
                </td>
                <td className="py-2 px-3 text-right">{tx.qqt}</td>
                <td className="py-2 px-3 text-right">{formatNumber(tx.amt)}원</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {
        fridgeItemId&&
        <FridgeItemDetailModal key={fridgeItemId} fridgeItemId={fridgeItemId} callFrom="hist" />
      }
    </div>
  );
}
