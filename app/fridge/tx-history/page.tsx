// app/fridge/tx-history/page.tsx
import { Metadata } from "next";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import TxHistoryHolder from "./TxHistoryHolder";

export const metadata: Metadata = {
  title: "식재료 소비·폐기 내역 - 머그인",
  description: "내 식재료 소비 및 폐기 내역을 확인할 수 있어요.",
};

export default function FridgeTxHistoryPage() {
  return (
    <div className={`defaultOuterContainer flex pb-20`}>
      <TitleDescription
        title="식재료 관리 내역"
        desc="소비 및 폐기된 식재료 내역을 확인할 수 있어요."
      />
    <div className="defaultInnerContainer flex flex-col items-center w-full">
      <TxHistoryHolder />
    </div>
    </div>
  );
}
