"use client";

import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import FridgePresetPicker from "../FridgePresetPicker";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { PrimaryButton, CancelButton } from "@/app/(commom)/Component/Buttons";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";

export default function CreateFridge() {
  const [fridgeName, setFridgeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [presetId, setPresetId] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const isTokenValid = useChkLoginToken("refreshNeed");
  const router = useRouter();

  if (!isTokenValid) {
    return <></>;
  }

  const saveFridge = () => {
    if (!fridgeName.trim()) {
      Swal.fire({ title: "냉장고 이름을 입력해주세요.", icon: "warning" });
      return;
    }

    Swal.fire({
      title: "냉장고 생성",
      text: "입력하신 정보로 새 냉장고를 생성하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "생성",
      cancelButtonText: "취소",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axiosAuthInstacne
          .post("fridge", {
            name: fridgeName.trim(),
            description: description.trim(),
            fridgePresetId: presetId,
          })
          .then(() => {
            Swal.fire({
              title: "생성 완료",
              text: "새 냉장고가 만들어졌습니다.",
              icon: "success",
              timer: 1200,
              showConfirmButton: false,
            }).then(() => {
              router.replace("/fridge");
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <main className="min-h-screen bg-gray-50/60 py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs flex flex-col gap-6">
        
        {/* 상단 뱃지 & 헤더 */}
        <div className="flex flex-col gap-1 pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 w-fit">
            <KitchenOutlinedIcon sx={{ fontSize: 16 }} />
            <span>새 냉장고 생성</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            나만의 맞춤 냉장고 만들기
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            새로운 냉장고의 이름을 정하고, 기본 식재료 패키지를 한꺼번에 등록해 보세요.
          </p>
        </div>

        {/* 1. 냉장고 이름 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700">
            냉장고 이름 <span className="text-emerald-600">*</span>
          </label>
          <input
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            placeholder="예: 우리집 메인 냉장고, 자취방 미니 냉장고 (1~20자)"
            onChange={(evt) => setFridgeName(evt.target.value)}
            type="text"
            value={fridgeName}
            maxLength={20}
          />
        </div>

        {/* 2. 냉장고 설명 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700">냉장고 설명</label>
          <textarea
            placeholder="냉장고에 대한 간단한 설명을 입력하세요 (200자 이하)"
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
            className="w-full border border-gray-200 rounded-2xl p-4 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all resize-none h-24"
            maxLength={200}
          />
        </div>

        {/* 3. 기본 식재료 프리셋 선택 */}
        <section className="flex flex-col gap-3 pt-2 border-t border-gray-100">
          <TitleDescription
            title="초기 식재료 패키지 선택 (선택 사항)"
            desc="미리 등록된 기본 식재료 목록을 선택해 냉장고와 함께 한꺼번에 등록할 수 있습니다."
          />
          <div className="w-full">
            <FridgePresetPicker selectedPresetId={presetId} setSelectedPresetId={setPresetId} />
          </div>
        </section>

        {/* 하단 버튼 바 */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4 pt-4 border-t border-gray-100">
          <CancelButton size="md" className="w-full flex justify-center py-3" onClick={() => router.back()}>
            취소
          </CancelButton>
          <PrimaryButton size="md" className="w-full flex justify-center py-3" loading={loading} onClick={saveFridge}>
            냉장고 생성하기
          </PrimaryButton>
        </div>
      </div>
    </main>
  );
}