"use client";

import React, { useEffect } from "react";
import { Modal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string; // 기본값 "max-w-md"
  zIndex?: number;
}

export default function CommonModal({
  open,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-md",
  zIndex = 1300,
}: CommonModalProps) {
  // ESC 키 클릭 지원
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ zIndex }}
      aria-labelledby="common-modal-title"
    >
      <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none">
        <div
          className={`bg-white rounded-3xl w-full ${maxWidthClass} p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden border border-gray-100/80 transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 상단 헤더 & X 닫기 버튼 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
              {title && (
                <div className="text-sm font-black text-gray-900 tracking-tight truncate">
                  {title}
                </div>
              )}
            </div>

            {/* 표준화된 X 닫기 버튼 (찌그러짐 방지, 동일 규격) */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer shrink-0 outline-none"
              aria-label="닫기"
            >
              <ClearIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* 모달 내부 컨텐츠 */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </Modal>
  );
}
