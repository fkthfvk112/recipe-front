"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

interface RecipeTagInputProps {
  tags?: string[];
  onChangeTags: (tags: string[]) => void;
  maxTags?: number;
}

export default function RecipeTagInput({
  tags = [],
  onChangeTags,
  maxTags = 10,
}: RecipeTagInputProps) {
  const [tagInput, setTagInput] = useState("");

  const addTag = (rawVal: string) => {
    const val = rawVal.trim().replace(/^#+/, "").trim();
    if (!val) return;

    if (tags.length >= maxTags) {
      alert(`태그는 최대 ${maxTags}개까지 등록할 수 있습니다.`);
      return;
    }

    if (!tags.includes(val)) {
      onChangeTags([...tags, val]);
    }
    setTagInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      // 입력창이 비어있을 때 백스페이스 누르면 마지막 태그 삭제
      onChangeTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChangeTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
          <LocalOfferOutlinedIcon sx={{ fontSize: 16, color: "#10b981" }} />
          관련 태그
          <span className="text-[11px] font-normal text-gray-400">
            ({tags.length}/{maxTags})
          </span>
        </h3>
        <span className="text-[11px] text-gray-400">
          Enter 또는 쉼표(,)로 구분하여 입력
        </span>
      </div>

      {/* 태그 입력 및 칩 박스 */}
      <div className="w-full min-h-[52px] p-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:border-darkGreen focus-within:ring-2 focus-within:ring-darkGreen/10 transition-all flex flex-wrap items-center gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs animate-fadeIn"
          >
            <span>#{t}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(t)}
              className="w-4 h-4 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-200 hover:text-emerald-900 transition-colors border-none bg-transparent cursor-pointer text-[10px] font-bold p-0 ml-0.5"
              title="태그 삭제"
            >
              ✕
            </button>
          </span>
        ))}

        {tags.length < maxTags && (
          <div className="flex-1 min-w-[140px] flex items-center gap-1">
            <input
              type="text"
              placeholder={
                tags.length === 0
                  ? "예: 김치찌개, 백종원, 초간단, 자취요리"
                  : "태그 추가 입력..."
              }
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full py-1 px-2 text-xs text-gray-900 bg-transparent outline-none placeholder-gray-400"
            />
            {tagInput.trim() && (
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="shrink-0 px-2 py-0.5 rounded-lg w-16 text-xs font-bold text-white bg-darkGreen hover:bg-emerald-700 transition-colors flex items-center gap-0.5 border-none cursor-pointer"
              >
                <AddIcon sx={{ fontSize: 13 }} />
                추가
              </button>
            )}
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 mt-1.5 pl-1">
        💡 검색 키워드, 주재료, 조리 상황(예: #야식, #다이어트) 등을 태그로 등록하면 다른 사용자들이 레시피를 더 쉽게 찾을 수 있습니다.
      </p>
    </div>
  );
}
