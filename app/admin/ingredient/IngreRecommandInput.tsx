"use client";

import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { containChosingJungsungJongsung } from "@/app/(utils)/StringUtil";
import { useEffect, useState, useRef } from "react";
import { searchLocalPopularIngredients } from "./popularIngredients";

interface Props {
  inputStyleStr?: string;
  containerStyleStr?: string;
  placeholderStr?: string;
  dataSettingCallback?: (data: string) => void;
  titleVideCnt?: number;
  defaultVal?: string;
  onEnterSubmit?: () => void;
  onConfirm?: (data: string) => void;
  dropdownPosition?: "top" | "bottom";
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function IngreRecommandInput({
  inputStyleStr,
  containerStyleStr,
  placeholderStr,
  dataSettingCallback,
  titleVideCnt,
  defaultVal,
  onEnterSubmit,
  onConfirm,
  dropdownPosition = "bottom",
  onFocus: onFocusProp,
  onBlur: onBlurProp,
}: Props) {
  const [ingre, setIngre] = useState<string>(defaultVal || "");
  const [recommendTermList, setRecommendTermList] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [lastSearchedTerm, setLastSearchedTerm] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync with defaultVal from parent when initial value is loaded
  useEffect(() => {
    if (defaultVal !== undefined && !isFocused) {
      setIngre(defaultVal);
    }
  }, [defaultVal, isFocused]);

  // Reset when titleVideCnt signal changes
  useEffect(() => {
    if (titleVideCnt) {
      setIngre("");
      setSelectedIndex(-1);
      setLastSearchedTerm("");
      setRecommendTermList([]);
      setIsFocused(true);
    }
  }, [titleVideCnt]);

  // 식재료 자동 추천 (로컬 메모리 캐시 우선 ➔ 캐시 미스 시 서버 Redis 조회)
  useEffect(() => {
    // 공백이나 숫자 단위가 섞인 경우(예: "양파 2개", "삼겹살 500g") 앞단 식재료명만 추출하여 검색
    const termToSearch = ingre.trim().split(/\s|\d/)[0] || "";

    if (termToSearch.length === 0) {
      setRecommendTermList([]);
      setLastSearchedTerm("");
      setSelectedIndex(-1);
      return;
    }

    // 1. 프론트엔드 TS 로컬 캐시에서 일치하는 인기 식재료 우선 검색 (0ms 지연)
    const localHits = searchLocalPopularIngredients(termToSearch);
    if (localHits.length > 0) {
      setRecommendTermList(localHits);
      setLastSearchedTerm(termToSearch);
      setSelectedIndex(-1);
      return; // 캐시 히트 시 서버 요청 생략
    }

    // 2. 로컬 캐시 미스 시 서버(Redis) 자동완성 조회
    if (
      !containChosingJungsungJongsung(termToSearch) &&
      termToSearch !== lastSearchedTerm
    ) {
      defaultAxios
        .get("ingre-list/recommend/redis", {
          params: {
            searchingTerm: termToSearch,
          },
        })
        .then((res) => {
          setLastSearchedTerm(termToSearch);
          if (res.data?.length > 0) {
            setRecommendTermList(res.data);
            setSelectedIndex(-1);
          } else {
            setRecommendTermList([]);
            setSelectedIndex(-1);
          }
        })
        .catch(() => {
          setRecommendTermList([]);
          setSelectedIndex(-1);
        });
    }
  }, [ingre, lastSearchedTerm]);

  // Redis 추천 결과 목록 노출 (단일 결과인 경우에도 목록이 유지되도록 처리)
  const filteredList = recommendTermList;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIngre(val);
    setIsFocused(true);
    setSelectedIndex(-1);
    if (dataSettingCallback) {
      dataSettingCallback(val);
    }
  };

  const handleSelectTerm = (term: string) => {
    setIngre(term);
    setLastSearchedTerm(term);
    setSelectedIndex(-1);
    setIsFocused(false);
    if (dataSettingCallback) {
      dataSettingCallback(term);
    }
    if (onConfirm) {
      onConfirm(term);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 등 조합 문자(IME) 입력 중 엔터 중복 실행 방지
    if (e.nativeEvent.isComposing) return;

    if (!isFocused || filteredList.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (onEnterSubmit) {
          onEnterSubmit();
        } else if (onConfirm) {
          onConfirm(ingre);
        }
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredList.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredList.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredList.length) {
        handleSelectTerm(filteredList[selectedIndex]);
      } else {
        if (onEnterSubmit) {
          onEnterSubmit();
        } else if (onConfirm) {
          onConfirm(ingre);
        }
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  // Scroll active item into view automatically
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const recommendComps =
    isFocused &&
    filteredList.map((term, inx) => {
      const isSelected = inx === selectedIndex;
      return (
        <div
          key={inx}
          onMouseDown={(e) => {
            e.preventDefault();
            handleSelectTerm(term);
          }}
          className={`w-full px-3.5 py-2.5 text-xs font-medium cursor-pointer transition-all flex items-center justify-between border-b border-gray-50 last:border-none ${
            isSelected
              ? "bg-emerald-50 text-emerald-800 font-extrabold border-l-4 border-l-emerald-500 ring-1 ring-emerald-400/50"
              : "text-gray-700 hover:bg-emerald-50/60 hover:text-emerald-700"
          }`}
        >
          <span>{term}</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors ${
              isSelected
                ? "bg-emerald-500 text-white"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            추천
          </span>
        </div>
      );
    });

  return (
    <div className={`relative w-full ${containerStyleStr || ""}`}>
      <input
        type="text"
        className={`${inputStyleStr || ""}`}
        value={ingre}
        maxLength={20}
        placeholder={`${placeholderStr || ""}`}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsFocused(true);
          if (onFocusProp) onFocusProp();
        }}
        onBlur={() => {
          setIsFocused(false);
          if (onBlurProp) onBlurProp();
          if (onConfirm) {
            onConfirm(ingre);
          }
        }}
      />
      {isFocused && filteredList.length > 0 && (
        <div
          ref={listRef}
          className={`absolute left-0 right-0 z-50 bg-white border border-gray-200/90 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto ${
            dropdownPosition === "top"
              ? "bottom-full mb-2"
              : "top-full mt-1"
          }`}
        >
          {recommendComps}
        </div>
      )}
    </div>
  );
}