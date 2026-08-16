"use client";

import { useRouter } from "next/navigation";
import KitchenIcon from "@mui/icons-material/Kitchen";

export default function GoFridgeBtn() {
  const router = useRouter();

  const goFridgePage = () => {
    router.push("/fridge");
  };

  return (
    <div className="mt-6 w-full">
      <div
        className="
          w-full
          border
          border-emerald-200/80
          rounded-2xl
          bg-emerald-50/50
          hover:bg-emerald-50/80
          transition-all
          p-4
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-3.5
          sm:gap-4
          shadow-2xs
        "
      >
        {/* 좌측 텍스트 & 아이콘 영역 */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-2xl shadow-2xs border border-emerald-100 shrink-0">
            <KitchenIcon
              sx={{ fontSize: 22, color: "#1c7c54" }}
            />
          </div>

          <div className="leading-tight text-left">
            <p className="text-sm sm:text-base font-extrabold text-gray-900">
              내 냉장고 재료로 만들 수 있을까?
            </p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              지금 보유 중인 재료와 부족한 재료를 한눈에 비교해 보세요.
            </p>
          </div>
        </div>

        {/* 버튼: 모바일(sm 미만)에서는 아래로 내려와 전체 폭(w-full), 데스크탑(sm 이상)에서는 우측(w-auto) 고정 */}
        <button
          type="button"
          onClick={goFridgePage}
          className="
            w-full
            sm:w-auto
            shrink-0
            px-5
            py-2.5
            text-xs
            sm:text-sm
            rounded-xl
            bg-[#1c7c54]
            hover:bg-[#145c3e]
            text-white
            font-extrabold
            transition-all
            border-none
            cursor-pointer
            shadow-xs
            active:scale-[0.98]
            outline-none
            whitespace-nowrap
            flex
            items-center
            justify-center
          "
        >
          확인하기
        </button>
      </div>
    </div>
  );
}