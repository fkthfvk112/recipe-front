"use client";

import { Box, Modal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { extractDate } from "@/app/(utils)/DateUtil";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 450,
  maxHeight: "80vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  overflow: "hidden",
};

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
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <div className="absolute right-3 top-2 cursor-pointer" onClick={onClose}>
          <ClearIcon />
        </div>

        <h3 className="font-semibold mb-3 text-center">변경 내역</h3>

        <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
          {txList.map((tx, idx) => {
            const isDiscard = tx.txType === "DISCARD";

            return (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-sm
                    ${isDiscard ? "bg-red-500" : "bg-green-600"}`}
                  >
                    {isDiscard ? "✕" : "✓"}
                  </div>

                  <div className="text-left">
                    <div className="font-medium">
                      {isDiscard ? "폐기" : "소비"} {tx.qqt}개
                    </div>
                    <div className="text-xs text-gray-500">
                      {extractDate(tx.createdAt)}
                    </div>
                  </div>
                </div>

                <div
                  className={`font-semibold ${
                    isDiscard ? "text-red-500" : "text-green-600"
                  }`}
                >
                  -{formatNumber(tx.amt)}원
                </div>
              </div>
            );
          })}
        </div>
      </Box>
    </Modal>
  );
}
