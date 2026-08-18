"use client";

import React, { useState } from "react";
import { FridgeItem, FridgeItem_IN } from "@/app/(type)/fridge";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import IngreRecommandInput from "@/app/admin/ingredient/IngreRecommandInput";
import Swal from "sweetalert2";
import { getNDayAfterBaseDateKST } from "@/app/(utils)/DateUtil";
import FridgeItemImgList from "../../FridgeItemImgList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NumbersIcon from "@mui/icons-material/Numbers";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { PrimaryButton } from "@/app/(commom)/Component/Buttons";
import { fetchFridgeImages } from "@/app/(api)/fridge";

function SetFridgeItem({
  fridgeId,
  lastOrder,
}: {
  fridgeId: number;
  lastOrder: number;
}) {
  const [selectedFridgeImg, setSelectedFridgeImg] = useState<FridgeItem>();
  const [autoMatchName, setAutoMatchName] = useState<string>("");
  const [titleVide, setTitleVide] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [exDate, setExDate] = useState<string>("");
  const [qqt, setQqt] = useState<number>(0);

  const [unit, setUnit] = useState<string>("");
  const [amt, setAmt] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  // Collapsible toggles
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showImgPicker, setShowImgPicker] = useState<boolean>(false);

  const qc = useQueryClient();

  const { data: fridgeImgs = [] } = useQuery<FridgeItem[]>({
    queryKey: ["fridgeImages"],
    queryFn: fetchFridgeImages,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleConfirmIngreName = (ingreName: string) => {
    const trimmed = ingreName.trim();
    if (!trimmed) return;
    setAutoMatchName(trimmed);

    if (fridgeImgs.length > 0) {
      const matched = fridgeImgs.find((img: FridgeItem) => {
        const imgName = (img.name || (img as any).imgName || "").trim().toLowerCase();
        return imgName.length > 0 && imgName === trimmed.toLowerCase();
      });
      if (matched) {
        setSelectedFridgeImg(matched);
      }
    }
  };

  const initializeAllData = () => {
    setTitle("");
    setAutoMatchName("");
    setSelectedFridgeImg(undefined);
    setExDate("");
    setQqt(0);
    setUnit("");
    setAmt(0);
    setDescription("");
    setTitleVide((prev) => prev + 1);
  };

  const clickImgCallBack = (imgItem: FridgeItem) => {
    setSelectedFridgeImg(imgItem);
  };

  const addItemToFridge = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length < 1) {
      Swal.fire({
        title: "식재료명을 입력해주세요.",
        text: "예: 사과, 대파, 삼겹살",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    let finalImg = selectedFridgeImg;
    if (!finalImg && fridgeImgs.length > 0) {
      const matched = fridgeImgs.find((img: FridgeItem) => {
        const imgName = (img.name || (img as any).imgName || "").trim().toLowerCase();
        return imgName.length > 0 && imgName === trimmedTitle.toLowerCase();
      });
      if (matched) {
        finalImg = matched;
      }
    }

    const item: FridgeItem_IN = {
      fridgeImgId: finalImg?.fridgeImgId ?? 1,
      imgUrl: finalImg?.imgUrl ?? "",
      expiredAt: exDate,
      name: trimmedTitle,
      qqt: qqt,
      unit: unit,
      amt: amt,
      description: description,
      itemOrder: lastOrder + 1,
    };

    axiosAuthInstacne
      .post("fridge/my/fridge-item", {
        fridgeId: fridgeId,
        fridgeItemDTO: item,
      })
      .then((res) => {
        if (res.data === "CREATE_SUCCESS") {
          Swal.fire({
            title: "식재료 추가 완료! 🥦",
            text: `'${title.trim()}'이(가) 냉장고에 추가되었습니다.`,
            icon: "success",
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          qc.invalidateQueries({
            queryKey: ["fridgeDetail", fridgeId],
          });
          initializeAllData();
        }
      });
  };

  // Quick Date Presets
  const setDateAfterN = (n: number) => {
    const baseDate = new Date();
    setExDate(getNDayAfterBaseDateKST(baseDate, n));
  };

  const MAX_AMT = 1_000_000_000;
  const formatNumber = (value: number | string) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parseNumber = (value: string) => Number(value.replace(/,/g, ""));

  return (
    <div className="w-full bg-white border border-gray-200/90 rounded-3xl p-5 shadow-xs flex flex-col gap-4">

      {/* ── Title Banner ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-black text-gray-900 tracking-tight">새 식재료 빠르게 추가</h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          이름만 입력하고 엔터를 누르면 1초 만에 등록돼요!
        </p>
      </div>

      {/* ── 1-Step Ultra-Fast Add Bar ──────────────────────────────── */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <IngreRecommandInput
            dataSettingCallback={(ingre: string) => {
              setTitle(ingre);
            }}
            onConfirm={handleConfirmIngreName}
            onEnterSubmit={addItemToFridge}
            placeholderStr="식재료 이름 입력 (예: 사과, 계란, 삼겹살)"
            inputStyleStr="w-full px-4 py-3 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
            containerStyleStr="w-full"
            titleVideCnt={titleVide}
          />
        </div>
        <PrimaryButton
          onClick={addItemToFridge}
          size="md"
          className="shrink-0 font-extrabold shadow-md flex items-center gap-1 py-3 px-5"
        >
          <AddIcon sx={{ fontSize: 17 }} />
          <span>추가</span>
        </PrimaryButton>
      </div>

      {/* ── Progressive Disclosure Collapsible Toggle ─────────────── */}
      <button
        type="button"
        onClick={() => setShowAdvanced((prev) => !prev)}
        className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between outline-none ${
          showAdvanced
            ? "border-emerald-500 bg-emerald-50/60 text-emerald-700"
            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-600"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <TuneIcon sx={{ fontSize: 15 }} />
          <span>유통기한, 수량, 금액도 입력할래요 (선택)</span>
        </div>
        <span className="text-xs">{showAdvanced ? "▲" : "▼"}</span>
      </button>

      {/* ── Collapsible Optional Details Panel ─────────────────────── */}
      {showAdvanced && (
        <div className="p-4 bg-gray-50/70 border border-gray-200/80 rounded-2xl flex flex-col gap-4">

          {/* Quick Date Presets & Expiry Date */}
          <div>
            <label className="text-[11px] font-black text-gray-700 flex items-center gap-1 mb-2">
              <CalendarTodayIcon sx={{ fontSize: 14 }} className="text-emerald-500" />
              <span>유통기한 (소비기한)</span>
            </label>

            {/* Quick Date Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <button
                type="button"
                onClick={() => setDateAfterN(0)}
                className="px-2.5 py-1 text-[11px] font-bold bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-600 rounded-xl transition-all cursor-pointer"
              >
                오늘까지
              </button>
              <button
                type="button"
                onClick={() => setDateAfterN(3)}
                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
              >
                +3일 (신선식품)
              </button>
              <button
                type="button"
                onClick={() => setDateAfterN(7)}
                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
              >
                +7일 (일주일)
              </button>
              <button
                type="button"
                onClick={() => setDateAfterN(14)}
                className="px-2.5 py-1 text-[11px] font-bold bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-600 rounded-xl transition-all cursor-pointer"
              >
                +14일 (2주)
              </button>
              <button
                type="button"
                onClick={() => setDateAfterN(30)}
                className="px-2.5 py-1 text-[11px] font-bold bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-600 rounded-xl transition-all cursor-pointer"
              >
                +30일 (한달)
              </button>
            </div>

            <input
              type="date"
              value={exDate}
              onChange={(evt) => setExDate(evt.target.value)}
              className="w-full px-3 py-2 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Quantity & Unit */}
          <div>
            <label className="text-[11px] font-black text-gray-700 flex items-center gap-1 mb-2">
              <NumbersIcon sx={{ fontSize: 14 }} className="text-emerald-500" />
              <span>수량 및 단위</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={qqt || ""}
                onChange={(evt) => setQqt(Number(evt.target.value))}
                placeholder="수량 (예: 2)"
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
              <input
                type="text"
                value={unit}
                onChange={(evt) => setUnit(evt.target.value)}
                placeholder="단위 (예: 개,팩,g)"
                className="w-28 px-3 py-2 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Total Purchase Amount */}
          <div>
            <label className="text-[11px] font-black text-gray-700 flex items-center gap-1 mb-2">
              <AttachMoneyIcon sx={{ fontSize: 14 }} className="text-emerald-500" />
              <span>총 구매 금액 (소비 내역용)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={amt ? formatNumber(amt) : ""}
                placeholder="금액 입력 (예: 5,000)"
                onChange={(e) => {
                  const raw = parseNumber(e.target.value);
                  if (isNaN(raw)) return;
                  if (raw > MAX_AMT) return;
                  setAmt(raw);
                }}
                className="w-full px-3 py-2 pr-8 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">원</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-black text-gray-700 flex items-center gap-1 mb-2">
              <DescriptionOutlinedIcon sx={{ fontSize: 14 }} className="text-emerald-500" />
              <span>메모 / 설명</span>
            </label>
            <textarea
              value={description}
              onChange={(evt) => setDescription(evt.target.value)}
              placeholder="식재료 보관 장소나 세부 사항을 적어보세요."
              maxLength={250}
              rows={2}
              className="w-full px-3 py-2 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none resize-none leading-relaxed"
            />
          </div>

        </div>
      )}

      {/* ── Collapsible Icon Picker Toggle ───────────────────────── */}
      <button
        type="button"
        onClick={() => setShowImgPicker((prev) => !prev)}
        className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between outline-none ${
          showImgPicker
            ? "border-emerald-500 bg-emerald-50/60 text-emerald-700"
            : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-gray-600"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <PaletteOutlinedIcon sx={{ fontSize: 15 }} />
          <span>식재료 아이콘 직접 선택하기 (선택)</span>
        </div>
        <span className="text-xs">{showImgPicker ? "▲" : "▼"}</span>
      </button>

      {/* ── Collapsible Icon Picker Panel ─────────────────────────── */}
      {showImgPicker && (
        <div className="p-4 bg-gray-50/70 border border-gray-200/80 rounded-2xl flex flex-col gap-4">
          <FridgeItemImgList
            autoMatchName={autoMatchName}
            initialImgId={selectedFridgeImg?.fridgeImgId}
            imgClickCallback={clickImgCallBack}
          />
        </div>
      )}

    </div>
  );
}

export default React.memo(SetFridgeItem);