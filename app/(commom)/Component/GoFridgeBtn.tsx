"use client";

import { useRouter } from "next/navigation";
import KitchenIcon from "@mui/icons-material/Kitchen";

export default function GoFridgeBtn() {
  const router = useRouter();

  const goFridgePage = () => {
    router.push("/fridge");
  };

  return (
    <div className="mt-6">
      <div
        className="
          w-full
          border
          rounded-lg
          bg-green-50/60
          hover:bg-green-50
          transition
          px-4
          py-3
          flex
          items-center
          justify-between
          gap-4
        "
      >
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <KitchenIcon
              sx={{ fontSize: 20, color: "#1c7c54" }}
            />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-800">
              내 냉장고 재료로 만들 수 있을까?
            </p>
            <p className="text-xs text-gray-500">
              부족한 재료를 확인해보세요
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <button
          onClick={goFridgePage}
          className="
            shrink-0
            px-4
            py-1.5
            text-sm
            rounded-full
            bg-[#1c7c54]
            text-white
            font-medium
            hover:opacity-90
            transition
            border-none
          "
        >
          확인
        </button>
      </div>
    </div>
  );
}