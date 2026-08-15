"use client";

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KitchenIcon from "@mui/icons-material/Kitchen";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckIcon from "@mui/icons-material/Check";

export default function EditFridge({
  params,
}: {
  params: { fridgeId: number };
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [fridgeName, setFridgeName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    axiosAuthInstacne
      .get(`fridge/my/name-desc/${params.fridgeId}`)
      .then((res) => {
        setDescription(res.data.description || "");
        setFridgeName(res.data.fridgeName || "");
        setLoading(false);
      });
  }, [params.fridgeId]);

  const saveFridge = () => {
    if (!fridgeName.trim()) {
      Swal.fire({
        title: "입력 오류",
        text: "냉장고 이름을 1자 이상 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    Swal.fire({
      title: "냉장고 수정",
      text: "변경된 정보로 냉장고를 수정하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "수정 완료",
      cancelButtonText: "취소",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosAuthInstacne
          .put("fridge/name-desc", {
            fridgeId: params.fridgeId,
            fridgeName: fridgeName,
            description: description,
          })
          .then(() => {
            Swal.fire({
              title: "수정 완료",
              text: "냉장고 정보가 성공적으로 변경되었습니다.",
              icon: "success",
              confirmButtonColor: "#10b981",
            }).then(() => {
              router.push(`/fridge`);
            });
          });
      }
    });
  };

  const delFridge = () => {
    Swal.fire({
      title: "냉장고 삭제",
      text: "냉장고를 삭제하면 내부 식재료도 함께 삭제됩니다. 삭제 후에는 되돌릴 수 없습니다. 정말 삭제하시겠어요?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosAuthInstacne.delete(`fridge/${params.fridgeId}`).then(() => {
          Swal.fire({
            title: "삭제 완료",
            text: "냉장고가 삭제되었습니다.",
            icon: "success",
            confirmButtonColor: "#10b981",
          }).then(() => {
            router.push(`/fridge`);
          });
        });
      }
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 bg-white min-h-screen text-left text-gray-800 pb-28">

      {/* Header */}
      <div className="mb-7 border-b border-gray-100 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer border border-gray-200/80 outline-none"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">냉장고 정보 수정 🧊</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              식재료를 보관하는 냉장고의 이름과 설명을 변경합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Card Form */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-xs flex flex-col gap-6">

        {/* Fridge Name Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-black text-gray-800 flex items-center gap-1">
              <KitchenIcon sx={{ fontSize: 16 }} className="text-emerald-500" />
              <span>냉장고 이름 <span className="text-emerald-500">*</span></span>
            </label>
            <span className="text-[11px] font-medium text-gray-400">
              {fridgeName.length}/20자
            </span>
          </div>

          {loading ? (
            <div className="w-full h-11 bg-gray-100 animate-pulse rounded-2xl" />
          ) : (
            <input
              type="text"
              value={fridgeName}
              onChange={(e) => setFridgeName(e.target.value)}
              placeholder="냉장고 이름을 입력해주세요 (예: 메인 냉장고)"
              maxLength={20}
              className="w-full px-4 py-3 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
            />
          )}
        </div>

        {/* Description Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-black text-gray-800">냉장고 설명</label>
            <span className="text-[11px] font-medium text-gray-400">
              {description.length}/200자
            </span>
          </div>

          {loading ? (
            <div className="w-full h-28 bg-gray-100 animate-pulse rounded-2xl" />
          ) : (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="냉장고에 대한 설명을 적어보세요. (예: 주방에 위치한 4도어 메인 냉장고)"
              maxLength={200}
              rows={4}
              className="w-full px-4 py-3 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all resize-none leading-relaxed"
            />
          )}
        </div>

        {/* Primary Action Buttons: [취소] & [수정 완료] */}
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3.5 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl transition-all cursor-pointer outline-none"
          >
            취소
          </button>
          <button
            type="button"
            onClick={saveFridge}
            className="flex-[2] py-3.5 text-xs font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] rounded-2xl shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 outline-none"
          >
            <CheckIcon sx={{ fontSize: 16 }} />
            <span>수정 완료</span>
          </button>
        </div>

        {/* Destructive Action Area */}
        <div className="mt-4 pt-5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">더 이상 필요하지 않은 냉장고인가요?</span>
          <button
            type="button"
            onClick={delFridge}
            className="px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200/60 transition-all cursor-pointer flex items-center gap-1 outline-none"
          >
            <DeleteOutlineIcon sx={{ fontSize: 15 }} />
            <span>냉장고 삭제</span>
          </button>
        </div>

      </div>

    </div>
  );
}