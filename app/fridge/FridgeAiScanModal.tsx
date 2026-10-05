"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { scanReceiptOrImage, saveFridgeItemsBulk, fetchFridgeImages } from "@/app/(api)/fridge";
import { FridgeAiScanItem, FridgeItem, FridgeItem_IN } from "@/app/(type)/fridge";
import { compressImageForUpload } from "@/app/(utils)/imageCompressor";
import { useQuery } from "@tanstack/react-query";
import IngreRecommandInput from "@/app/admin/ingredient/IngreRecommandInput";
import { CancelButton, PrimaryButton } from "@/app/(commom)/Component/Buttons";
import { usePwaBackHandler } from "@/app/(commom)/Hook/usePwaBackHandler";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fridgeId: number;
  onSuccess: () => void;
}

const fieldClass =
  "w-full px-3 py-2 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none";

function fridgeImageName(img: FridgeItem) {
  return (img.name || (img as { imgName?: string }).imgName || "").trim().toLowerCase();
}

function findFridgeImgIdByStandardName(standardName: string, images: FridgeItem[]) {
  const clean = standardName.trim().toLowerCase();
  if (!clean) return undefined;
  return images.find((img) => fridgeImageName(img) === clean)?.fridgeImgId;
}

export default function FridgeAiScanModal({ isOpen, onClose, fridgeId, onSuccess }: Props) {
  const [step, setStep] = useState<"UPLOAD" | "ANALYZING" | "PREVIEW">("UPLOAD");
  const [items, setItems] = useState<FridgeAiScanItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: fridgeImgs = [] } = useQuery<FridgeItem[]>({
    queryKey: ["fridgeImages"],
    queryFn: fetchFridgeImages,
    staleTime: 5 * 60 * 1000,
    enabled: isOpen,
  });

  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewImgUrl(null);
  };

  const handleReset = useCallback(() => {
    setStep("UPLOAD");
    setItems([]);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewImgUrl(null);
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    onClose();
  }, [handleReset, onClose]);

  usePwaBackHandler(isOpen, handleClose);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !mounted) return null;

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      clearPreview();
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewImgUrl(url);
      setStep("ANALYZING");

      const compressedFile = await compressImageForUpload(file);
      const formData = new FormData();
      formData.append("image", compressedFile);

      const res = await scanReceiptOrImage(formData);

      if (!res.items || res.items.length === 0) {
        Swal.fire({
          title: "식재료를 찾지 못했어요",
          text: "글자가 잘 보이는 영수증이나 식재료 사진으로 다시 시도해 주세요.",
          icon: "info",
          confirmButtonColor: "#10b981",
        });
        setStep("UPLOAD");
        return;
      }

      setItems(res.items);
      setStep("PREVIEW");
    } catch (err: any) {
      Swal.fire({
        title: "사진을 읽지 못했어요",
        text: err?.response?.data?.message || "잠시 후 다시 시도해 주세요.",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
      setStep("UPLOAD");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleUpdateItem = (index: number, field: keyof FridgeAiScanItem, value: FridgeAiScanItem[keyof FridgeAiScanItem]) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleConfirmSave = async () => {
    const validItems = items.filter((it) => it.name && it.name.trim().length > 0);
    if (validItems.length === 0) {
      Swal.fire({
        title: "넣을 식재료가 없어요",
        text: "이름 있는 항목만 냉장고에 넣을 수 있어요.",
        icon: "warning",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    try {
      setIsSaving(true);

      const fridgeItemList: FridgeItem_IN[] = validItems.map((it, idx) => {
        return {
          name: it.name.trim(),
          qqt: it.qqt > 0 ? it.qqt : 1,
          unit: it.unit || "개",
          amt: it.amt >= 0 ? it.amt : 0,
          expiredAt: it.expiredAt,
          description: it.rawName && it.rawName !== it.name ? it.rawName : undefined,
          fridgeImgId: findFridgeImgIdByStandardName(it.name, fridgeImgs),
          itemOrder: idx,
        };
      });

      await saveFridgeItemsBulk({
        fridgeId,
        fridgeItemList,
      });

      Swal.fire({
        title: "냉장고에 넣었어요",
        text: `${validItems.length}개를 추가했습니다.`,
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 1600,
        showConfirmButton: false,
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      Swal.fire({
        title: "넣지 못했어요",
        text: err?.response?.data?.message || "잠시 후 다시 시도해 주세요.",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.amt) || 0), 0);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100/80 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">사진으로 넣기</h3>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {step === "PREVIEW"
                ? "맞는지 확인한 뒤 냉장고에 넣어 주세요."
                : "영수증이나 식재료 사진을 올리면 이름, 수량, 금액을 읽어 드려요."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer shrink-0 outline-none"
            aria-label="닫기"
          >
            <ClearIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2 min-h-0">
          {step === "UPLOAD" && (
            <div className="flex flex-col gap-2.5 pb-4">
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelected}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 hover:border-emerald-500 rounded-2xl text-left cursor-pointer outline-none transition-colors"
              >
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CameraAltOutlinedIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">사진 찍기</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">영수증이나 식재료를 찍어 주세요</p>
                </div>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-white border border-gray-200 hover:border-emerald-500 rounded-2xl text-left cursor-pointer outline-none transition-colors"
              >
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <PhotoLibraryOutlinedIcon sx={{ fontSize: 18 }} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">앨범에서 고르기</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">주문 내역 캡처도 괜찮아요</p>
                </div>
              </button>
            </div>
          )}

          {step === "ANALYZING" && (
            <div className="py-10 flex flex-col items-center text-center gap-4">
              {previewImgUrl && (
                <img
                  src={previewImgUrl}
                  alt="올린 사진"
                  className="w-24 h-24 rounded-2xl object-cover border border-gray-100"
                />
              )}
              <CircularProgress size={26} sx={{ color: "#10b981" }} />
              <div>
                <p className="text-sm font-black text-gray-900">사진을 읽고 있어요</p>
                <p className="text-xs text-gray-400 font-medium mt-1">잠시만 기다려 주세요.</p>
              </div>
            </div>
          )}

          {step === "PREVIEW" && (
            <div className="flex flex-col gap-2.5 pb-3">
              <p className="text-xs font-medium text-gray-500">
                {items.length}개
                {totalAmount > 0 ? ` · ${totalAmount.toLocaleString()}원` : ""}
              </p>
              {items.map((item, idx) => (
                <div
                  key={`scan-item-${idx}`}
                  className="p-3.5 bg-white border border-gray-200/90 rounded-2xl flex flex-col gap-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-gray-700 mb-1.5">이름</p>
                      <IngreRecommandInput
                        defaultVal={item.name}
                        placeholderStr="식재료 이름"
                        dataSettingCallback={(val) => handleUpdateItem(idx, "name", val)}
                        onConfirm={(val) => handleUpdateItem(idx, "name", val)}
                        dropdownPosition="bottom"
                        inputStyleStr={fieldClass}
                      />
                      {item.rawName && item.rawName !== item.name && (
                        <p className="text-[11px] text-gray-400 font-medium mt-1 line-clamp-1">
                          사진에는 {item.rawName}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="w-8 h-8 mt-5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center border-none bg-transparent cursor-pointer outline-none shrink-0"
                      aria-label="이 항목 빼기"
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-black text-gray-700">수량</span>
                      <input
                        type="number"
                        value={item.qqt}
                        min={1}
                        onChange={(e) => handleUpdateItem(idx, "qqt", parseInt(e.target.value, 10) || 1)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-black text-gray-700">단위</span>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(idx, "unit", e.target.value)}
                        placeholder="개, 단, g"
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-black text-gray-700">금액</span>
                      <input
                        type="number"
                        value={item.amt}
                        min={0}
                        onChange={(e) => handleUpdateItem(idx, "amt", parseInt(e.target.value, 10) || 0)}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-black text-gray-700">소비기한</span>
                      <input
                        type="date"
                        value={item.expiredAt || ""}
                        onChange={(e) => handleUpdateItem(idx, "expiredAt", e.target.value)}
                        className={fieldClass}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {step === "PREVIEW" && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-2 shrink-0">
            <CancelButton onClick={handleReset} className="flex-1">
              다시 고르기
            </CancelButton>
            <PrimaryButton onClick={handleConfirmSave} loading={isSaving} disabled={items.length === 0} className="flex-[1.4]">
              냉장고에 넣기
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
