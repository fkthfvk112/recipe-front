"use client";

import React, { useEffect, useState, useRef } from "react";
import IngreRecommandInput from "@/app/admin/ingredient/IngreRecommandInput";
import { parseIngredientInput } from "./checklistParser";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { CHECKLIST_PRESETS, ChecklistPreset } from "./checklistPresets";
import { checklistEvents } from "@/app/(commom)/ga4/ga4Events";
import { marketApi } from "@/app/(commom)/api/marketApi";

export interface ChecklistItem {
  id: string;
  name: string;
  unit: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = "all" | "active" | "completed";

const STORAGE_KEY = "mugin_shopping_checklist";

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [resetCount, setResetCount] = useState<number>(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editUnit, setEditUnit] = useState<string>("");
  const listEndRef = useRef<HTMLDivElement>(null);

  // 1. 브라우저 LocalStorage에서 초기 데이터 불러오기 (SSR 하이드레이션 불일치 방지)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load checklist from localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. 변경된 데이터 LocalStorage에 영구 저장
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save checklist to localStorage:", err);
    }
  }, [items, isLoaded]);

  // 4. 아이템 추가 핸들러
  const handleAddItem = (rawInput?: string) => {
    const textToAdd = (rawInput !== undefined ? rawInput : inputValue).trim();
    if (!textToAdd) return;

    const { name, unit } = parseIngredientInput(textToAdd);
    if (!name) return;

    const newItem: ChecklistItem = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `item_${Date.now()}_${Math.random()}`,
      name,
      unit,
      completed: false,
      createdAt: Date.now(),
    };

    // 입력 순서대로 위에서부터 나열
    setItems((prev) => [...prev, newItem]);
    setInputValue("");
    setResetCount((prev) => prev + 1);

    // 새 항목 추가 시 목록 하단으로 부드럽게 스크롤
    setTimeout(() => {
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  // 5. 체크 토글 핸들러
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // 6. 개별 삭제 핸들러
  const handleDeleteItem = (id: string) => {
    if (editingId === id) {
      setEditingId(null);
      setEditName("");
      setEditUnit("");
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 6-1. 수정 모드 진입
  const handleStartEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditUnit(item.unit || "");
  };

  // 6-2. 수정 저장
  const handleSaveEdit = () => {
    if (!editingId) return;
    const trimmedName = editName.trim();
    if (!trimmedName) {
      Swal.fire({
        text: "식재료 이름을 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: trimmedName,
              unit: editUnit.trim(),
            }
          : item
      )
    );
    setEditingId(null);
    setEditName("");
    setEditUnit("");
  };

  // 6-3. 수정 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditUnit("");
  };

  // 7. 완료 항목 일괄 삭제
  const handleClearCompleted = () => {
    const completedCount = items.filter((item) => item.completed).length;
    if (completedCount === 0) return;

    Swal.fire({
      title: "구매 완료 항목 삭제",
      text: `구매 완료된 ${completedCount}개 항목을 목록에서 삭제하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#9ca3af",
    }).then((result) => {
      if (result.isConfirmed) {
        setItems((prev) => prev.filter((item) => !item.completed));
      }
    });
  };

  // 7-1. 전체 선택 / 전체 해제 토글
  const handleToggleSelectAll = () => {
    if (items.length === 0) return;
    const isAllDone = items.every((item) => item.completed);
    setItems((prev) => prev.map((item) => ({ ...item, completed: !isAllDone })));
  };

  // 7-2. 전체 항목 삭제
  const handleClearAll = () => {
    if (items.length === 0) return;

    Swal.fire({
      title: "전체 항목 삭제",
      text: `장보기 목록의 모든 항목(${items.length}개)을 삭제하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "전체 삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    }).then((result) => {
      if (result.isConfirmed) {
        setItems([]);
        setEditingId(null);
      }
    });
  };

  // 8. 장보기 목록 & 사이트 링크 공유/복사 (Web Share API 대응)
  const handleCopyList = async () => {
    if (items.length === 0) {
      Swal.fire({
        title: "목록이 비어있습니다",
        text: "공유할 장보기 항목이 없습니다.",
        icon: "info",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    // 장보기 목록 공유 이벤트 추적
    checklistEvents.clickShareChecklist(items.length);

    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = "🛒 [머그인 장보기 목록]";
    const listBody = items
      .map((item) => {
        const mark = item.completed ? "☑" : "☐";
        const unitPart = item.unit ? ` ${item.unit}` : "";
        return `${mark} ${item.name}${unitPart}`;
      })
      .join("\n");

    const textToShare = `${shareTitle}\n${listBody}\n\n🔗 장보기 목록 바로가기:\n${currentUrl}`;

    // 모바일 브라우저 표준 공유 (카카오톡, 라인, 문자 등 스마트폰 하단 공유 시트)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "머그인 장보기 목록",
          text: textToShare,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    // 데스크톱 및 navigator.share 미지원 시 클립보드 복사
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToShare).then(() => {
        Swal.fire({
          title: "목록 복사 완료!",
          text: "장보기 목록과 사이트 링크가 클립보드에 복사되었습니다. 카카오톡이나 메시지로 공유해 보세요!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      });
    }
  };

  // 9. 추천 프리셋 일괄 추가 핸들러 (한 번 확인 후 장바구니에 싹 추가, 두 번 누르면 두 번 추가)
  const handleApplyPreset = (preset: ChecklistPreset) => {
    // GA4 프리셋 담기 이벤트 추적
    checklistEvents.clickApplyPreset(preset.id, preset.title, preset.items.length);

    Swal.fire({
      title: `${preset.emoji} ${preset.title}`,
      text: `총 ${preset.items.length}개 식재료를 장보기 목록에 추가하시겠습니까?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "추가하기",
      cancelButtonText: "취소",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#9ca3af",
    }).then((result) => {
      if (result.isConfirmed) {
        const newItems: ChecklistItem[] = preset.items.map((item, idx) => ({
          id:
            typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : `item_${Date.now()}_${idx}_${Math.random()}`,
          name: item.name,
          unit: item.unit,
          completed: false,
          createdAt: Date.now() + idx,
        }));

        setItems((prev) => [...prev, ...newItems]);

        Swal.fire({
          title: "추가 완료!",
          text: `${preset.title} (${preset.items.length}개) 식재료가 추가되었습니다.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 150);
      }
    });
  };

  // 10. 쿠팡 랜딩 URL 비동기 요청 후 새 탭으로 이동 핸들러
  const handleCoupangClick = async (itemName: string) => {
    // GA4 이벤트 추적
    checklistEvents.clickCoupangSearch(itemName);

    // 브라우저 팝업 블록 방지를 위한 빈 탭 미리 열기
    const newTab = typeof window !== "undefined" ? window.open("about:blank", "_blank") : null;

    try {
      const res = await marketApi.getLandingUrl(itemName);

      const landingUrl = res.data;

      if (landingUrl && typeof landingUrl === "string" && landingUrl.trim().length > 0) {
        if (newTab) {
          newTab.location.href = landingUrl.trim();
        } else {
          window.open(landingUrl.trim(), "_blank");
        }
      } else {
        if (newTab) newTab.close();
        Swal.fire({
          title: "링크 연결 실패",
          text: "해당 상품의 쿠팡 파트너스 링크를 찾을 수 없습니다.",
          icon: "warning",
          confirmButtonColor: "#10b981",
        });
      }
    } catch (err: any) {
      if (newTab) newTab.close();
      const errMsg =
        err?.response?.data || "쿠팡 파트너스 링크를 불러오는 도중 에러가 발생했습니다.";
      if (typeof errMsg === "string" && !Swal.isVisible()) {
        Swal.fire({
          title: "링크 연결 실패",
          text: errMsg,
          icon: "warning",
          confirmButtonColor: "#10b981",
        });
      }
    }
  };

  // 통계 계산
  const totalCount = items.length;
  const completedCount = items.filter((item) => item.completed).length;
  const activeCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // 필터링 적용
  const filteredItems = items.filter((item) => {
    if (filter === "active") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  return (
    <main className="w-full min-h-screen bg-slate-50 pt-6 pb-24 md:pb-16 px-3 sm:px-4 flex flex-col items-center box-border overflow-x-hidden">
      <div className="max-w-xl w-full min-w-0 flex flex-col gap-4 sm:gap-5 box-border">
        {/* 상단 타이틀 Header */}
        <div className="w-full min-w-0 text-left flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 w-fit">
            장보기 체크리스트
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            머그인 - 장보기 체크리스트
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            살 것을 잊지 않도록 식재료를 등록하고 체크하세요. (숫자를 함께 적으면 수량으로 자동 분리됩니다)
          </p>
        </div>

        {/* 진행률 바 (Progress Bar) */}
        {totalCount > 0 && (
          <div className="w-full min-w-0 bg-white p-3.5 sm:p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-2.5 box-border">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold gap-2 min-w-0">
              <span className="text-gray-700 truncate min-w-0">
                장보기 진행률 <span className="text-emerald-600 font-black">{progressPercent}%</span>
              </span>
              <span className="text-gray-400 font-medium text-[11px] sm:text-xs shrink-0 whitespace-nowrap">
                {totalCount}개 중 {completedCount}개 구매 완료
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* 필터 탭 & 편의 기능 바 (항상 2개 행: 1행은 100% 꽉 찬 필터 탭, 2행은 편의 버튼) */}
        {totalCount > 0 && (
          <div className="w-full flex flex-col gap-2 px-0.5 box-border">
            {/* 1행: 필터 탭 (100% 꽉 차는 세그먼트 컨트롤) */}
            <div className="w-full flex items-center gap-1 bg-gray-200/60 p-1 rounded-2xl box-border">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`flex-1 min-w-0 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border-none outline-none cursor-pointer text-center ${
                  filter === "all"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800 bg-transparent"
                }`}
              >
                <span className="truncate">전체 {totalCount}</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter("active")}
                className={`flex-1 min-w-0 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border-none outline-none cursor-pointer text-center ${
                  filter === "active"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800 bg-transparent"
                }`}
              >
                <span className="truncate">살 것 {activeCount}</span>
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={`flex-1 min-w-0 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border-none outline-none cursor-pointer text-center ${
                  filter === "completed"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-800 bg-transparent"
                }`}
              >
                <span className="truncate">완료 {completedCount}</span>
              </button>
            </div>

            {/* 2행: 편의 기능 버튼 (좌: 토글 전체 선택 / 우: 공유, 완료 삭제, 전체 삭제) */}
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={`w-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all border outline-none cursor-pointer ${
                  isAllCompleted
                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/60"
                    : "text-gray-700 bg-white hover:bg-gray-50 border-gray-200 shadow-2xs"
                }`}
                title={isAllCompleted ? "전체 선택 해제" : "전체 선택"}
              >
                <span>{isAllCompleted ? "전체 해제" : "전체 선택"}</span>
              </button>
              <div className="flex items-center gap-1.5 flex-wrap">
                {completedCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCompleted}
                    className="w-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/70 border border-amber-200/60 rounded-xl transition-all outline-none cursor-pointer"
                    title="완료 항목 삭제"
                  >
                    <span>완료 삭제</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="w-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/60 rounded-xl transition-all outline-none cursor-pointer"
                  title="전체 삭제"
                >
                  <span>전체 삭제</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 체크리스트 카드 영역 (최소 공간 min-h 설정) */}
        <div className="w-full min-w-0 bg-white rounded-3xl border border-gray-100 p-3.5 sm:p-5 shadow-lg shadow-slate-200/60 flex flex-col min-h-[380px] sm:min-h-[440px] box-border">
          {/* 목록 영역: 데이터가 적거나 비어있을 때는 flex-1로 늘어나서 입력창을 최소 높이 하단에 위치시킴 */}
          <div className="flex-1 flex flex-col w-full min-w-0">
            {filteredItems.length === 0 ? (
              /* 빈 목록 상태 (Empty State) */
              <div className="w-full flex-1 flex flex-col items-center justify-center text-center py-10 sm:py-14 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 28 }} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-bold text-gray-800">
                    {totalCount === 0
                      ? "장보기 목록이 비어있습니다."
                      : filter === "active"
                      ? "구매할 식재료가 없습니다. 모두 담으셨네요!"
                      : "구매 완료된 식재료가 없습니다."}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {totalCount === 0
                      ? "하단 입력창에서 식재료를 검색하고 추가해 보세요."
                      : "항목의 체크박스를 눌러 상태를 변경해 보세요."}
                  </p>
                </div>
              </div>
            ) : (
              <>
              <div className="w-full text-end">
                <button
                  type="button"
                  onClick={handleCopyList}
                  className="border-none w-20 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-emerald-700 bg-white hover:bg-emerald-50/60 border border-gray-200 rounded-xl transition-all shadow-2xs outline-none cursor-pointer"
                  title="목록 공유"
                >
                  <ShareOutlinedIcon sx={{ fontSize: 15 }} />
                  <span>공유</span>
                </button>
              </div>
              <ul className="w-full divide-y divide-gray-50 list-none p-0 m-0 box-border">
                {filteredItems.map((item) => {
                  const isEditing = editingId === item.id;

                  return (
                    <li
                      key={item.id}
                      className={`w-full min-w-0 box-border flex flex-col py-2 sm:py-2.5 px-2 sm:px-3 rounded-2xl transition-colors gap-1 ${
                        isEditing
                          ? "bg-emerald-50/50 ring-1 ring-emerald-200"
                          : item.completed
                          ? "bg-gray-50/40"
                          : "hover:bg-gray-50/70"
                      }`}
                    >
                      {/* 1행: 체크박스 + 이름/단위 & (수정/삭제 버튼) */}
                      <div className="w-full flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                          {/* 체크박스 */}
                          <div
                            onClick={() => {
                              if (!isEditing) handleToggleItem(item.id);
                            }}
                            className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                              isEditing
                                ? "opacity-40 cursor-default"
                                : "cursor-pointer"
                            } ${
                              item.completed
                                ? "bg-emerald-500 text-white shadow-xs"
                                : "border-2 border-gray-300 hover:border-emerald-500 bg-white"
                            }`}
                          >
                            {item.completed && <CheckIcon sx={{ fontSize: 16 }} className="stroke-current stroke-1" />}
                          </div>

                          {isEditing ? (
                            /* 수정 모드: 현재값 디폴트로 들어간 2개 인풋 (이름, 단위) */
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit();
                                  if (e.key === "Escape") handleCancelEdit();
                                }}
                                placeholder="식재료명"
                                className="flex-1 min-w-0 bg-white border border-emerald-500 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/20 box-border"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={editUnit}
                                onChange={(e) => setEditUnit(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit();
                                  if (e.key === "Escape") handleCancelEdit();
                                }}
                                placeholder="단위/수량"
                                className="w-16 sm:w-20 shrink-0 bg-white border border-gray-200 focus:border-emerald-500 rounded-lg px-2 py-1 text-xs sm:text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 box-border"
                              />
                            </div>
                          ) : (
                            /* 일반 모드: 이름 & 단위 표시 */
                            <div
                              onClick={() => handleToggleItem(item.id)}
                              className="flex items-center gap-1 flex-wrap min-w-0 flex-1 cursor-pointer select-none"
                            >
                              <span
                                className={`text-xs sm:text-sm font-semibold transition-all break-all ${
                                  item.completed
                                    ? "line-through text-gray-400 font-normal"
                                    : "text-gray-800"
                                }`}
                              >
                                {item.name}
                              </span>
                              {item.unit && (
                                <span className="inline-flex items-center gap-0.5 shrink-0">
                                  <span
                                    className={`text-[10px] sm:text-xs select-none ${
                                      item.completed ? "text-gray-300" : "text-gray-400 font-bold"
                                    }`}
                                  >
                                    ·
                                  </span>
                                  <span
                                    className={`text-[11px] sm:text-xs px-1.5 py-0.5 rounded-md font-medium transition-all ${
                                      item.completed
                                        ? "bg-gray-100 text-gray-400 line-through"
                                        : "bg-emerald-50/80 text-emerald-800 border border-emerald-200/50"
                                    }`}
                                  >
                                    {item.unit}
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 오른쪽 버튼 영역 (수정, 삭제) */}
                        <div className="flex items-center shrink-0">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveEdit();
                                }}
                                className="w-16 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all border-none outline-none cursor-pointer shadow-xs"
                                title="저장"
                              >
                                저장
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelEdit();
                                }}
                                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors border-none outline-none bg-transparent cursor-pointer"
                                title="취소"
                              >
                                <CloseIcon sx={{ fontSize: 16 }} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(item);
                                }}
                                className="w-7 h-7 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors border-none outline-none bg-transparent cursor-pointer"
                                title="수정"
                              >
                                <EditOutlinedIcon sx={{ fontSize: 16 }} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item.id);
                                }}
                                className="w-7 h-7 rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors border-none outline-none bg-transparent cursor-pointer"
                                title="삭제"
                              >
                                <CloseIcon sx={{ fontSize: 16 }} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 2행: 쿠팡 검색 버튼 (일반 모드일 때 1행 밑 제일 왼쪽에 위치) */}
                      {!isEditing && (
                        <div className="w-full flex items-center pl-8 sm:pl-8.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCoupangClick(item.name);
                            }}
                            className="w-14 inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-gray-500 active:text-orange-600 bg-gray-100/80 active:bg-orange-50 border border-gray-200/60 rounded-md transition-all no-underline cursor-pointer"
                            title="쿠팡에서 최저가 검색"
                          >
                            쿠팡 🛒
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
                <div ref={listEndRef} />
              </ul>
              </>
            )}
          </div>          
          <div className="w-full min-w-0 mt-4 pt-3.5 border-t border-gray-100 flex flex-col gap-2 box-border">
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 min-w-0 relative">
                <IngreRecommandInput
                  placeholderStr="예) 삼겹살500g, 양파2개"
                  dataSettingCallback={(data) => setInputValue(data)}
                  titleVideCnt={resetCount}
                  onEnterSubmit={() => handleAddItem()}
                  dropdownPosition="top"
                  containerStyleStr="w-full min-w-0"
                  inputStyleStr="w-full min-w-0 bg-gray-50/90 focus:bg-white border border-gray-200 focus:border-emerald-500 rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500/15 box-border"
                />
              </div>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddItem();
                }}
                onClick={() => handleAddItem()}
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500 hover:bg-emerald-600 active:scale-90 text-white rounded-full flex items-center justify-center transition-all shadow-xs border-none outline-none cursor-pointer"
                title="추가"
              >
                <AddIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 text-center m-0 pt-1">
              * 식재료와 숫자 단위를 바로 입력해보세요.(예 삼겹살300g)
            </p>
            <p className="text-[11px] text-gray-300 text-center m-0 pt-1">
              쿠팡 버튼을 통해 구매 시 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다.
            </p>
          </div>
        </div>

        {/* 추천 장보기 프리셋 영역 (하단 고정 배치: 제목 + 내부 재료 작은 글씨, 클릭 시 한 번 확인 후 추가) */}
        <div className="w-full min-w-0 flex flex-col gap-2.5 box-border mt-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-1.5 m-0">
              추천 장보기 프리셋
            </h2>
            <span className="text-[11px] sm:text-xs text-gray-400 font-medium">
              누르면 바로 장보기 리스트에 추가돼요
            </span>
          </div>

          <div className="w-full flex flex-col gap-2">
            {CHECKLIST_PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="w-full bg-white hover:bg-emerald-50/30 active:scale-[0.99] border border-gray-100 hover:border-emerald-300 rounded-2xl p-3 sm:p-3.5 shadow-2xs transition-all cursor-pointer flex flex-col gap-1 text-left box-border group"
              >
                {/* 1행: 이모지 + 제목 + 뱃지 + 담기 버튼 */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">{preset.emoji}</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors truncate">
                      {preset.title}
                    </span>
                    <span className="shrink-0 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {preset.badge}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyPreset(preset);
                    }}
                    className="w-16 shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white transition-all border border-emerald-200/60 group-hover:border-transparent outline-none cursor-pointer"
                  >
                    + 담기
                  </button>
                </div>
                <p className="text-[12px] sm:text-xs text-gray-800 font-medium m-0 pl-6 sm:pl-7">
                  {preset.description}
                </p>

                {/* 2행: 내부 재료를 간단하게 작은 글씨로 보여주기 */}
                <p className="text-[11px] sm:text-xs text-gray-400 font-medium line-clamp-1 break-all m-0 pl-6 sm:pl-7">
                  {preset.items.map((it) => `${it.name}${it.unit ? ` ${it.unit}` : ""}`).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

