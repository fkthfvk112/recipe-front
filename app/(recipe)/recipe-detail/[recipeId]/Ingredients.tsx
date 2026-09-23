"use client";

import Link from "next/link";
import { Ingredient } from "../../types/recipeType";
import GoFridgeBtn from "@/app/(commom)/Component/GoFridgeBtn";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Swal from "sweetalert2";
import { checklistEvents } from "@/app/(commom)/ga4/ga4Events";

const STORAGE_KEY = "mugin_shopping_checklist";

interface ChecklistItem {
  id: string;
  name: string;
  unit: string;
  completed: boolean;
  createdAt: number;
}

export default function Ingredients({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  const handleAddAllToChecklist = () => {
    if (!ingredients || ingredients.length === 0) return;

    // GA4 이벤트 추적: 장보기 카트에 레시피 재료 추가
    checklistEvents.clickAddRecipeToCart(ingredients.length);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let currentItems: ChecklistItem[] = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          currentItems = parsed;
        }
      }

      const newItems: ChecklistItem[] = ingredients.map((ing, idx) => ({
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `item_${Date.now()}_${idx}_${Math.random()}`,
        name: ing.name,
        unit: ing.qqt || "",
        completed: false,
        createdAt: Date.now() + idx,
      }));

      const updated = [...currentItems, ...newItems];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      Swal.fire({
        title: "장보기 목록에 추가 완료! 🛒",
        text: `총 ${newItems.length}개 식재료가 추가되었습니다. 지금 장보기 체크리스트로 이동하시겠습니까?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "장보기 목록으로",
        cancelButtonText: "레시피 계속 보기",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#9ca3af",
      }).then((result) => {
        if (result.isConfirmed) {
          window.open("/checklist", "_blank");
        }
      });
    } catch (err) {
      console.error("Failed to add to checklist:", err);
    }
  };

  const ingreItems = ingredients.map((data, inx) => {
    return (
      <li className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0" key={inx}>
        <Link prefetch={false} href={`/recipes/1/ingre/${data.name}`} className="font-bold text-gray-700 hover:text-mugin-primary transition-colors duration-200 text-sm sm:text-base">
          {data.name}
        </Link>
        <div className="text-sm text-gray-500 font-medium">{data.qqt}</div>
      </li>
    );
  });

  return (
    <div className="w-full mt-10 mb-10 px-2">
      <div className="flex justify-between items-center border-b gap-1 border-gray-100 pb-3 mb-4">
        <h2 className="text-lg font-black text-gray-800 tracking-tight">재료</h2>
        <button
          type="button"
          onClick={handleAddAllToChecklist}
          className="w-40 flex-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl transition-all shadow-2xs outline-none cursor-pointer"
          title="장보기 카트에 추가"
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />
          <span>장보기 카트에 추가</span>
        </button>
      </div>
      <ul className="w-full mb-6">
        {ingreItems}
      </ul>
      <GoFridgeBtn></GoFridgeBtn>
    </div>
  );
}
