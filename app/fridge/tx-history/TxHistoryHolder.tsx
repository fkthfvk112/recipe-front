"use client";

import { useEffect, useState } from "react";
import { FetchTxHistoryParams, FridgeItemTxRow } from "@/app/(type)/fridge";
import TxSearchBox from "./TxSearchBox";
import TxHistoryTable from "./TxHistoryTable";
import TxPagination from "./TxPagination";
import { fetchFridgeTxHistory } from "@/app/(api)/fridgeItemTx";
import { formatNumber } from "@/app/(utils)/StringUtil";
import Badge from "@/app/(commom)/Component/Badge";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";

export interface TxSearchCond {
  txType?: string | null;
  itemName?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function TxHistoryHolder() {
  const [searchCond, setSearchCond] = useState<TxSearchCond>({});
  const [appliedCond, setAppliedCond] = useState<TxSearchCond>({});

  const [list, setList] = useState<FridgeItemTxRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  const [summary, setSummary] = useState<{
    CONSUME?: { qqt: number; amt: number };
    DISCARD?: { qqt: number; amt: number };
  }>({});

  const fetchList = async (cond: TxSearchCond = appliedCond) => {
    const params: FetchTxHistoryParams = {
      ...cond,
      txType: cond.txType === "" ? null : cond.txType,
      page: page - 1,
      size: 10,
    };

    const data = await fetchFridgeTxHistory(params);

    setList(data.list);
    setSummary(data.summary ?? {});
    setTotalCnt(data?.totalCnt ?? 0);
  };

  useEffect(() => {
    fetchList();
  }, [page, appliedCond]);

  const handleSearch = () => {
    setPage(1);
    setAppliedCond({ ...searchCond });
  };

  const handleReset = () => {
    setPage(1);
    setSearchCond({});
    setAppliedCond({});
  };

  const consumeAmt = summary.CONSUME?.amt ?? 0;
  const consumeQqt = summary.CONSUME?.qqt ?? 0;
  const discardAmt = summary.DISCARD?.amt ?? 0;
  const discardQqt = summary.DISCARD?.qqt ?? 0;
  const totalAmt = consumeAmt + discardAmt;

  const wasteRate = totalAmt > 0 ? ((discardAmt / totalAmt) * 100).toFixed(1) : "0.0";

  return (
    <div className="w-full max-w-full min-w-0 box-border mx-auto space-y-4 sm:space-y-6">
      {/* ─── 1. 요약 통계 카드 3종 (화면 밖으로 밀리지 않는 100% 핏팅) ────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full min-w-0">
        {/* 소비 금액 카드 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between w-full min-w-0">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant="emerald" size="sm">
                소비 완료
              </Badge>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">총 {formatNumber(consumeQqt)}건</span>
            </div>
            <p className="text-base sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
              {formatNumber(consumeAmt)}<span className="text-[10px] sm:text-xs text-gray-500 font-normal ml-0.5">원</span>
            </p>
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 ml-2">
            <SavingsOutlinedIcon style={{ fontSize: 18 }} />
          </div>
        </div>

        {/* 폐기 손실 금액 카드 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-rose-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between w-full min-w-0">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant="rose" size="sm">
                폐기 손실
              </Badge>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">총 {formatNumber(discardQqt)}건</span>
            </div>
            <p className="text-base sm:text-2xl font-bold text-rose-600 tracking-tight truncate">
              {formatNumber(discardAmt)}<span className="text-[10px] sm:text-xs text-gray-500 font-normal ml-0.5">원</span>
            </p>
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 ml-2">
            <DeleteOutlineIcon style={{ fontSize: 18 }} />
          </div>
        </div>

        {/* 이력 대비 폐기 손실률 카드 */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between w-full min-w-0">
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <Badge variant="amber" size="sm">
                이력 대비 폐기율
              </Badge>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">이력 금액 대비</span>
            </div>
            <p className="text-base sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
              {wasteRate}<span className="text-[10px] sm:text-xs text-gray-500 font-normal ml-0.5">%</span>
            </p>
          </div>
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 ml-2">
            <TrendingDownIcon style={{ fontSize: 18 }} />
          </div>
        </div>
      </div>

      {/* ─── 2. 검색 필터 박스 ────────────────────────────────────────────── */}
      <TxSearchBox
        searchCond={searchCond}
        setSearchCond={setSearchCond}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* ─── 3. 내역 테이블 (하단 전용 수평 스크롤) ─────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] w-full max-w-full min-w-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
            관리 이력 목록
          </h3>
          <div className="flex items-center gap-2">
            <span className="sm:hidden text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <TouchAppOutlinedIcon style={{ fontSize: 13 }} /> 드래그로 보기
            </span>
            <span className="text-[11px] sm:text-xs text-gray-400">
              검색 <span className="text-emerald-600 font-bold">{totalCnt}</span>건
            </span>
          </div>
        </div>

        <TxHistoryTable list={list} />

        <TxPagination pageNow={page} totalCnt={totalCnt} setPage={setPage} />
      </div>
    </div>
  );
}
