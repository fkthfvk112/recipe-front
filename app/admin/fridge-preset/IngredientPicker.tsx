"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeImages } from "@/app/(api)/fridge";
import { fetchIngredients, IngredientListItem } from "@/app/(api)/ingredient";
import { FridgeItem } from "@/app/(type)/fridge";

type Props = {
  initialIngreListId?: number;
  onPick: (picked: IngredientListItem) => void;
};

export default function IngredientPicker({ initialIngreListId, onPick }: Props) {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<IngredientListItem | null>(null);

  // 전체 식재료 한 번만 가져오기
  const { data: allIngredients = [], isLoading } = useQuery({
    queryKey: ["ingredientAll"],
    queryFn: fetchIngredients,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000,
  });

  // 초기 선택
  useEffect(() => {
    if (!initialIngreListId || allIngredients.length === 0) return;

    const found = allIngredients.find(
      (x) => x.ingreListId === initialIngreListId
    );
    if (found) {
      setSelected(found);
    }
  }, [initialIngreListId, allIngredients]);

  // 프론트에서 필터링
  const filtered = useMemo(() => {
    if (!keyword.trim()) return allIngredients;

    const lower = keyword.toLowerCase();
    return allIngredients.filter((x) =>
      x.name.toLowerCase().includes(lower)
    );
  }, [keyword, allIngredients]);

  return (
    <div className="w-full">
      {/* 검색창 */}
      <div className="flex items-center gap-2">
        <input
          className="w-full border border-[#e1e1e1] rounded-md p-2"
          placeholder="식재료 검색 (예: 양파)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="mt-2 max-h-[200px] overflow-y-auto border border-[#e1e1e1] rounded-md bg-white">
        {isLoading ? (
          <div className="p-3 text-sm text-[#777]">불러오는 중...</div>
        ) : filtered.length === 0 ? (
          <div className="p-3 text-sm text-[#777]">
            검색 결과가 없습니다.
          </div>
        ) : (
          filtered.map((item) => (
            <button
              key={item.ingreListId}
              type="button"
              className={`w-full text-left p-2 hover:bg-[#f4f4f4] ${
                selected?.ingreListId === item.ingreListId
                  ? "bg-[#f0f0f0]"
                  : ""
              }`}
              onClick={() => {
                setSelected(item);
                onPick(item);
              }}
            >
              {item.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
