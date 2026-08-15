"use client";

import FridgeItemImgList from "../../FridgeItemImgList";
import { FridgeItem } from "@/app/(type)/fridge";
import CommonModal from "@/app/(commom)/Component/CommonModal";
import { PrimaryButton } from "@/app/(commom)/Component/Buttons";

export default function FridgeItemImgPickerModal({
  initialFridItem,
  open,
  onClose,
  onPick,
}: {
  initialFridItem: FridgeItem;
  open: boolean;
  onClose: () => void;
  onPick: (img: FridgeItem) => void;
}) {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="식재료 아이콘 선택"
      maxWidthClass="max-w-xl"
      zIndex={2000}
    >
      <div className="w-full">
        <FridgeItemImgList
          initialImgId={initialFridItem.fridgeImgId}
          imgClickCallback={(img: FridgeItem) => {
            onPick(img);
          }}
        />
      </div>
      <div className="w-full flex gap-1 mt-4">
        <PrimaryButton fullWidth size="md" onClick={onClose}>
          확인
        </PrimaryButton>
      </div>
    </CommonModal>
  );
}
