"use client";

import { Box, Modal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FridgeItemImgList from "../../FridgeItemImgList";
import { FridgeItem } from "@/app/(type)/fridge";
import { useState } from "react";

const pickerStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 560,
  minWidth: 320,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};


export default function FridgeItemImgPickerModal({
    initialFridItem,
    open,
    onClose,
    onPick,
}: {
    initialFridItem:FridgeItem
    open: boolean;
    onClose: () => void;
    onPick: (img: FridgeItem) => void;
}) {    

    return (
        <Modal
            open={open}
            onClose={onClose}
            
            // ✅ 부모 모달 위에 렌더되도록 Z-Index 상향
            sx={{ zIndex: 2000 }}
            hideBackdrop                
            // ✅ 포커스 트랩 충돌 피하기(필요 시)
            disableEnforceFocus
        >
            <Box sx={pickerStyle}>
            <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>onClose()}>
                <ClearIcon/>
            </div>

            {/* ⬇️ 리스트 내부에서 클릭 시 onPick 호출 */}
            <div className="w-full">
            <FridgeItemImgList
                initialImgId={initialFridItem.fridgeImgId}
                imgClickCallback={(img:FridgeItem) => {
                    onPick(img);
                }}
            />
            </div>
            <div className="w-full flex gap-1">
                <button onClick={onClose} className={`w-full greenBtn`}>확인</button>
            </div>
            </Box>
        </Modal>
    );
}
