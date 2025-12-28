"use client";

import FridgeItemImgList from "@/app/fridge/FridgeItemImgList";
import IngredientPicker from "./IngredientPicker";

type PresetItemForm = {
  key: string;
  sortOrder: number;
  ingreListId?: number;
  ingreName?: string;
  fridgeImgId?: number;
  fridgeImgUrl?: string;
};

type Props = {
  item: PresetItemForm;
  onChange: (next: PresetItemForm) => void;
  onRemove: () => void;
};

export default function PresetItemRow({ item, onChange, onRemove }: Props) {
  return (
    <div className="w-full mt-3 p-3 border border-[#e1e1e1] rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-sm">아이템 #{item.sortOrder}</div>
        <button type="button" className="redBtn text-xs px-2 py-1" onClick={onRemove}>
          삭제
        </button>
      </div>

      {/* 식재료 선택 */}
      <div className="mb-4">
        <div className="text-sm mb-2">식재료 선택</div>
        <IngredientPicker
          onPick={(picked:any) => {
            onChange({
              ...item,
              ingreListId: picked.ingreListId,
              ingreName: picked.name,
            });
          }}
        />
        {item.ingreListId ? (
          <div className="mt-2 text-xs text-[#555]">
            선택됨: <span className="font-bold">{item.ingreName}</span> (ID: {item.ingreListId})
          </div>
        ) : (
          <div className="mt-2 text-xs text-[#999]">아직 선택된 식재료가 없습니다.</div>
        )}
      </div>

      <div className="mb-2">
        <FridgeItemImgList
          initialImgId={item.fridgeImgId}
          imgClickCallback={(img: any) => {
            onChange({ 
                    ...item, 
                    fridgeImgId: img.fridgeImgId,
                    fridgeImgUrl:img.imgUrl 
                  });
          }}
        />
        {!item.fridgeImgId && (
          <div className="mt-2 text-xs text-[#999]">이미지를 선택해 주세요.</div>
        )}
      </div>
    </div>
  );
}
