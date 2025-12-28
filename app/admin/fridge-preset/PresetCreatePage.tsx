"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PresetItemRow from "./PresetItemRow";
import { createFridgePreset } from "@/app/(api)/fridge";
import Swal from "sweetalert2";
import PresetPreviewCard from "./PresetPreviewCard";

export type IngredientListItem = {
  ingreListId: number;
  name: string;
};

export type PresetItemCreate = {
  ingreListId: number;      // ingredient_list.ingre_list_id
  fridgeImgId: number;      // fridge_img.fridge_img_id
  sortOrder: number;        // 입력 순번
};

export type PresetCreateRequest = {
  name: string;
  presetSort: string;       // 키 (예: BASIC, SINGLE 등) - 너 테이블 preset_sort
  description?: string;
  items: PresetItemCreate[];
};

type PresetItemForm = {
  key: string;
  sortOrder: number;
  ingreListId?: number;
  ingreName?: string;
  fridgeImgId?: number;
  fridgeImgUrl?:string;
};

function makeKey() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function PresetCreatePage() {
  const [name, setName] = useState("");
  const [presetSort, setPresetSort] = useState(""); // 키
  const [description, setDescription] = useState("");

  const [items, setItems] = useState<PresetItemForm[]>([
    { key: makeKey(), sortOrder: 1 },
  ]);



  console.log("프리셋", items);

  const mutation = useMutation({
    mutationFn: (payload: PresetCreateRequest) => createFridgePreset(payload),
  });

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!presetSort.trim()) return false;
    if (items.length === 0) return false;
    // 아이템 검증: ingreListId + fridgeImgId 필수
    return items.every((x) => typeof x.ingreListId === "number" && typeof x.fridgeImgId === "number");
  }, [name, presetSort, items]);

  const addItem = () => {
    setItems((prev) => {
      const next = [...prev, { key: makeKey(), sortOrder: prev.length + 1 }];
      return next;
    });
  };

  const removeItem = (key: string) => {
    setItems((prev) => {
      const filtered = prev.filter((x) => x.key !== key);
      // 입력 순서대로 순번 재부여(조건 3)
      return filtered.map((x, idx) => ({ ...x, sortOrder: idx + 1 }));
    });
  };

  const updateItem = (key: string, next: PresetItemForm) => {
    setItems((prev) => prev.map((x) => (x.key === key ? next : x)));
  };

  const submit = async () => {
    const payload: PresetCreateRequest = {
      name: name.trim(),
      presetSort: presetSort.trim(),
      description: description?.trim() || undefined,
      items: items.map((x) => ({
        ingreListId: x.ingreListId!,   // canSubmit에서 보장
        fridgeImgId: x.fridgeImgId!,
        sortOrder: x.sortOrder,
      })),
    };

    await mutation.mutateAsync(payload);
    Swal.fire({
        title: "프리셋 등록이 완료되었습니다!",
        icon: "success",
    });
  };

  return (
    <section className="w-full max-w-5xl p-5">
      <h1 className="text-2xl font-bold mb-4">프리셋 등록</h1>

      <div className="w-full bg-white border border-[#e1e1e1] rounded-xl shadow-sm p-4">
        <div className="mb-3">
          <div className="text-sm mb-1">프리셋 이름</div>
          <input
            className="w-full border border-[#e1e1e1] rounded-md p-2"
            placeholder="예: 기본 가정용"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <div className="text-sm mb-1">프리셋 종류 (preset_sort)</div>
          <input
            className="w-full border border-[#e1e1e1] rounded-md p-2"
            placeholder="예: BASIC"
            value={presetSort}
            onChange={(e) => setPresetSort(e.target.value)}
          />
          <div className="text-xs text-[#777] mt-1">
            고유 키 권장: BASIC / SINGLE / HEALTH / COOK 등
          </div>
        </div>

        <div className="mb-1">
          <div className="text-sm mb-1">프리셋 설명</div>
          <textarea
            className="w-full border border-[#e1e1e1] rounded-md p-2 min-h-[80px]"
            placeholder="예: 가장 일반적인 가정 냉장고 기본 구성"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-xl font-bold">프리셋 아이템</h2>
        <button type="button" className="greenBtn px-3 py-2" onClick={addItem}>
          + 아이템 추가
        </button>
      </div>

      <div className="mt-3 mb-3">
        {items.map((it) => (
          <PresetItemRow
            key={it.key}
            item={it}
            onChange={(next) => updateItem(it.key, next)}
            onRemove={() => removeItem(it.key)}
          />
        ))}
      </div>

        <PresetPreviewCard
            name={name}
            presetSort={presetSort}
            description={description}
            items={items.map((x) => ({
                sortOrder: x.sortOrder,
                ingreName: x.ingreName,
                fridgeImgId: x.fridgeImgId,
                fridgeImgUrl: (x as any).fridgeImgUrl, // PresetItemRow에서 세팅
            }))}
        />
        {!canSubmit && (
          <div className="text-sm text-[#c00] flex items-center">
            이름/키 입력 + 모든 아이템에 식재료/이미지를 선택해야 등록 가능
          </div>
        )}
      <div className="mt-6 flex gap-2">
        
        <button
          type="button"
          className={`greenBtn px-4 py-3 ${!canSubmit || mutation.isPending ? "opacity-50" : ""}`}
          disabled={!canSubmit || mutation.isPending}
          onClick={submit}
        >
          {mutation.isPending ? "등록 중..." : "프리셋 등록"}
        </button>
      </div>
    </section>
  );
}
