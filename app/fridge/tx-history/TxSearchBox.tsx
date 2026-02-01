"use client";

import { TxSearchCond } from "./TxHistoryHolder";

export default function TxSearchBox({
  searchCond,
  setSearchCond,
}: {
  searchCond: TxSearchCond;
  setSearchCond: React.Dispatch<React.SetStateAction<TxSearchCond>>;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchCond((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md space-y-3">
      {/* 1. 타입 + 식재료명 */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">소비/폐기</label>
          <select
            name="txType"
            value={searchCond.txType || ""}
            onChange={onChange}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">전체</option>
            <option value="CONSUME">소비</option>
            <option value="DISCARD">폐기</option>
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-gray-700">식재료명</label>
          <input
            name="itemName"
            value={searchCond.itemName || ""}
            onChange={onChange}
            placeholder="검색어 입력"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* 2. 기간 */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">기간</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="date"
            name="dateFrom"
            value={searchCond.dateFrom || ""}
            onChange={onChange}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-gray-500">~</span>
          <input
            type="date"
            name="dateTo"
            value={searchCond.dateTo || ""}
            onChange={onChange}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );
}
