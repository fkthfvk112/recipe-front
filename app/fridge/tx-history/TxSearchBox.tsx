"use client";

import { TxSearchCond } from "./TxHistoryHolder";
import { PrimaryButton, CancelButton } from "@/app/(commom)/Component/Buttons";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface TxSearchBoxProps {
  searchCond: TxSearchCond;
  setSearchCond: React.Dispatch<React.SetStateAction<TxSearchCond>>;
  onSearch: () => void;
  onReset: () => void;
}

export default function TxSearchBox({
  searchCond,
  setSearchCond,
  onSearch,
  onReset,
}: TxSearchBoxProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchCond((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-gray-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3 min-w-0 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
        {/* 1. 유형 선택 (소비/폐기) */}
        <div className="flex flex-col gap-1 min-w-0">
          <label className="text-[10px] sm:text-xs text-gray-500 font-medium">관리 유형</label>
          <select
            name="txType"
            value={searchCond.txType || ""}
            onChange={onChange}
            className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-2.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer font-medium"
          >
            <option value="">전체 (소비 + 폐기)</option>
            <option value="CONSUME">소비 (아껴쓴 식재료)</option>
            <option value="DISCARD">폐기 (버려진 식재료)</option>
          </select>
        </div>

        {/* 2. 식재료명 입력 */}
        <div className="flex flex-col gap-1 sm:col-span-2 min-w-0">
          <label className="text-[10px] sm:text-xs text-gray-500 font-medium">식재료 검색</label>
          <input
            name="itemName"
            value={searchCond.itemName || ""}
            onChange={onChange}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="식재료명 입력 (예: 양파, 우유)"
            className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-2.5 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>
      </div>

      {/* 3. 기간 선택 및 버튼 바 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-gray-100 w-full min-w-0">
        <div className="flex flex-col gap-1 w-full sm:w-auto min-w-0">
          <label className="text-[10px] sm:text-xs text-gray-500 font-medium">조회 기간</label>
          <div className="flex items-center gap-1 w-full min-w-0">
            <input
              type="date"
              name="dateFrom"
              value={searchCond.dateFrom || ""}
              onChange={onChange}
              className="w-1/2 min-w-0 bg-gray-50/80 border border-gray-200/80 rounded-xl px-1.5 sm:px-2.5 py-1.5 text-[11px] sm:text-xs text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
            />
            <span className="text-gray-400 text-[10px] shrink-0">~</span>
            <input
              type="date"
              name="dateTo"
              value={searchCond.dateTo || ""}
              onChange={onChange}
              className="w-1/2 min-w-0 bg-gray-50/80 border border-gray-200/80 rounded-xl px-1.5 sm:px-2.5 py-1.5 text-[11px] sm:text-xs text-gray-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end pt-1 sm:pt-0 shrink-0">
          <CancelButton size="sm" onClick={onReset} className="flex-1 sm:flex-none flex items-center justify-center gap-1 font-medium text-xs px-3 py-2">
            <RestartAltIcon style={{ fontSize: 14 }} />
            초기화
          </CancelButton>
          <PrimaryButton size="sm" onClick={onSearch} className="flex-1 sm:flex-none flex items-center justify-center gap-1 font-bold text-xs px-4 py-2">
            <SearchIcon style={{ fontSize: 14 }} />
            조회하기
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
