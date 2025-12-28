"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import PresetItemRow from "../../PresetItemRow";
import PresetPreviewCard from "../../PresetPreviewCard";
import { updateFridgePreset } from "@/app/(api)/fridge";

// 프론트 상세 DTO(당신이 쓰는 형태에 맞춤)
type PresetDetailDTO = {
  fridgePresetId: number;
  presetId: number;
  name: string;
  presetSort: string;
  description?: string;
  items: {
    fridgeItemPresetId?: number; // 기존 아이템이면 존재
    sortOrder: number;
    ingreListId?: number;
    ingreName?: string;
    fridgeImgId?: number;
    fridgeImgUrl?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
};

// CreatePage에서 쓰던 폼 타입과 동일하게 유지
type PresetItemForm = {
  key: string;
  fridgeItemPresetId?: number;
  sortOrder: number;
  ingreListId?: number;
  ingreName?: string;
  fridgeImgId?: number;
  fridgeImgUrl?: string;
};

export type PresetItemCreate = {
  ingreListId: number;
  fridgeImgId: number;
  sortOrder: number;
};

// 서버로 다시 보낼 item DTO
export type PresetItemUpdate = {
  fridgeItemPresetId?: number; // ★ 추가: 기존이면 포함, 신규면 undefined/null
  ingreListId: number;
  fridgeImgId: number;
  sortOrder: number;
};

// 서버로 다시 보낼 preset DTO (FridgePresetDTO)
export type PresetUpdateRequest = {
  fridgePresetId: number; // ★ 추가: preset PK 포함
  name: string;
  presetSort: string;
  description?: string;
  items: PresetItemUpdate[];
};

function makeKey() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function PresetUpdatePage({ presetId }: { presetId: number }) {
  const [loading, setLoading] = useState(true);
  const [fridgePresetId, setFridgePresetId] = useState<number>(presetId);
  const [name, setName] = useState("");
  const [presetSort, setPresetSort] = useState("");
  const [description, setDescription] = useState("");

  const [items, setItems] = useState<PresetItemForm[]>([]);

  console.log("아이템", items);

  // 1) 상세 로딩해서 폼 초기화
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await axiosAuthInstacne.get(
          `/fridge/preset/detail?presetId=${presetId}`
        );

        const detail: PresetDetailDTO = res.data;

        setName(detail.name ?? "");
        setPresetSort(detail.presetSort ?? "");
        setDescription(detail.description ?? "");

        const mapped: PresetItemForm[] = (detail.items ?? [])
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((it) => ({
            key: makeKey(),
            sortOrder: it.sortOrder,
            ingreListId: it.ingreListId,
            ingreName: it.ingreName,
            fridgeImgId: it.fridgeImgId,
            fridgeImgUrl: it.fridgeImgUrl,
          }));

        // 아이템이 아예 없으면 최소 1개는 보여주기
        setItems(mapped.length ? mapped : [{ key: makeKey(), sortOrder: 1 }]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [presetId]);

  const mutation = useMutation({
    mutationFn: (payload: PresetUpdateRequest) =>
      updateFridgePreset(payload),
  });

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (!presetSort.trim()) return false;
    if (items.length === 0) return false;
    return items.every(
      (x) => typeof x.ingreListId === "number" && typeof x.fridgeImgId === "number"
    );
  }, [name, presetSort, items]);

  const addItem = () => {
    setItems((prev) => [...prev, { key: makeKey(), sortOrder: prev.length + 1 }]);
  };

  const removeItem = (key: string) => {
    setItems((prev) => {
      const filtered = prev.filter((x) => x.key !== key);
      const next = filtered.map((x, idx) => ({ ...x, sortOrder: idx + 1 }));
      return next.length ? next : [{ key: makeKey(), sortOrder: 1 }];
    });
  };

  const updateItem = (key: string, next: PresetItemForm) => {
    setItems((prev) => prev.map((x) => (x.key === key ? next : x)));
  };

  const submit = async () => {
    const payload: PresetUpdateRequest = {
      fridgePresetId,
      name: name.trim(),
      presetSort: presetSort.trim(),
      description: description?.trim() || undefined,
      items: items.map((x) => ({
        ingreListId: x.ingreListId!, // canSubmit로 보장
        fridgeImgId: x.fridgeImgId!,
        sortOrder: x.sortOrder,
      })),
    };

    await mutation.mutateAsync(payload);

    Swal.fire({
      title: "프리셋 수정이 완료되었습니다!",
      icon: "success",
    });
  };

  if (!Number.isFinite(presetId) || presetId <= 0) {
    return <div className="p-5">잘못된 presetId 입니다.</div>;
  }

  if (loading) {
    return <div className="p-5">불러오는 중...</div>;
  }

  return (
    <section className="w-full max-w-5xl p-5">
      <h1 className="text-2xl font-bold mb-4">프리셋 수정</h1>

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
            고유 키 권장: BASIC / SINGLE / HEALTH / COOK / NON_USE등
            *미사용시 NON_USE로 설정
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
          fridgeImgUrl: x.fridgeImgUrl,
        }))}
      />

      {!canSubmit && (
        <div className="text-sm text-[#c00] flex items-center">
          이름/키 입력 + 모든 아이템에 식재료/이미지를 선택해야 저장 가능
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className={`greenBtn px-4 py-3 ${
            !canSubmit || mutation.isPending ? "opacity-50" : ""
          }`}
          disabled={!canSubmit || mutation.isPending}
          onClick={submit}
        >
          {mutation.isPending ? "저장 중..." : "프리셋 수정"}
        </button>
      </div>
    </section>
  );
}
