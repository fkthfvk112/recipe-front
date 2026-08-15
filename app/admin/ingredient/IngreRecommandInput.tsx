"use client";

import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { containChosingJungsungJongsung } from "@/app/(utils)/StringUtil";
import { useEffect, useState, useRef } from "react";

interface Props {
  inputStyleStr?: string;
  containerStyleStr?: string;
  placeholderStr?: string;
  dataSettingCallback?: (data: string) => void;
  titleVideCnt?: number;
  defaultVal?: string;
  onEnterSubmit?: () => void;
}

export default function IngreRecommandInput({
  inputStyleStr,
  containerStyleStr,
  placeholderStr,
  dataSettingCallback,
  titleVideCnt,
  defaultVal,
  onEnterSubmit,
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
    }
  }, [titleVideCnt]);

  // Fetch Redis auto-recommend terms ONLY
  useEffect(() => {
    if (ingre.length === 0) {
      setRecommendTermList([]);
      setLastSearchedTerm("");
      setSelectedIndex(-1);
      return;
    }

    if (
      ingre.length > 0 &&
      !containChosingJungsungJongsung(ingre) &&
      ingre !== lastSearchedTerm
    ) {
      defaultAxios
        .get("ingre-list/recommend/redis", {
          params: {
            searchingTerm: ingre,
          },
        })
        .then((res) => {
          setLastSearchedTerm(ingre);
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

  const filteredList = recommendTermList.filter((ele) => ele !== ingre);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIngre(val);
    setSelectedIndex(-1);
    if (dataSettingCallback) {
      dataSettingCallback(val);
    }
  };

  const handleSelectTerm = (term: string) => {
    setIngre(term);
    setSelectedIndex(-1);
    setIsFocused(false);
    if (dataSettingCallback) {
      dataSettingCallback(term);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || filteredList.length === 0) {
      if (e.key === "Enter" && onEnterSubmit) {
        e.preventDefault();
        onEnterSubmit();
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
      if (selectedIndex >= 0 && selectedIndex < filteredList.length) {
        e.preventDefault();
        handleSelectTerm(filteredList[selectedIndex]);
      } else if (onEnterSubmit) {
        e.preventDefault();
        onEnterSubmit();
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isFocused && filteredList.length > 0 && (
        <div
          ref={listRef}
          className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border border-gray-200/90 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto"
        >
          {recommendComps}
        </div>
      )}
    </div>
  );
}