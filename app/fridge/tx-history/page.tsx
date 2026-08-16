import { Metadata } from "next";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import TxHistoryHolder from "./TxHistoryHolder";

export const metadata: Metadata = {
  title: "식재료 소비·폐기 내역 가계부 - 머그인",
  description: "내 냉장고의 식재료 소비 지출 및 폐기 손실 금액 내역을 스마트하게 확인할 수 있어요.",
};

export default function FridgeTxHistoryPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-gray-50/50 pt-20 pb-20 px-3 sm:px-6 box-border">
      <div className="max-w-5xl mx-auto w-full max-w-full min-w-0 space-y-4 sm:space-y-6 box-border">
        <TitleDescription
          title="식재료 관리 가계부"
          desc="내 냉장고에서 소비된 식재료와 버려진 손실 금액 이력을 스마트하게 관리하세요."
        />
        <TxHistoryHolder />
      </div>
    </div>
  );
}
