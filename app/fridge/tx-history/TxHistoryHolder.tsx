"use client";

import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { FetchTxHistoryParams, FridgeItemTxRow } from "@/app/(type)/fridge";
import TxSearchBox from "./TxSearchBox";
import TxHistoryTable from "./TxHistoryTable";
import TxPagination from "./TxPagination";
import { fetchFridgeTxHistory } from "@/app/(api)/fridgeItemTx";
import { formatNumber } from "@/app/(utils)/StringUtil";

export interface TxSearchCond {
  txType?: string|null;
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
  const [summary, setSummary] = useState<{ CONSUME?: { qqt: number; amt: number }; DISCARD?: { qqt: number; amt: number } }>({});

    const fetchList = async (cond: TxSearchCond = appliedCond) => {
      const params: FetchTxHistoryParams = {
          ...cond,
          txType:appliedCond.txType === ""?null:appliedCond.txType,
          page: page - 1,
          size: 10,
      };

      const data = await fetchFridgeTxHistory(params);

      setList(data.list);
      setSummary(data.summary??{})
      setTotalCnt(data?.totalCnt??0);
    };
    
    useEffect(() => {
      fetchList();
    }, [page, appliedCond]);appliedCond

  return (
    <div className="w-full p-2">
      <TxSearchBox searchCond={searchCond} setSearchCond={setSearchCond} />
      <div className="text-center my-3">
        <button className="greenBtn" onClick={() => {
            setPage(1);
            setAppliedCond({ ...searchCond });
            fetchList()}}>
          조회
        </button>
      </div>
      <TxHistoryTable list={list} />
      <div className="text-sm text-gray-700 mt-2 text-right">
        <span className="text-green-700 font-medium">
          소비: {formatNumber(summary.CONSUME?.qqt ?? 0)}건 - {formatNumber(summary.CONSUME?.amt??0)}원
        </span>{" "}
        /{" "}
        <span className="text-red-600 font-medium">
          폐기: {formatNumber(summary.DISCARD?.qqt ?? 0)}건 - {formatNumber(summary.DISCARD?.amt??0)}원
        </span>
      </div>
      <TxPagination
        pageNow={page}
        totalCnt={totalCnt}
        setPage={setPage}
      />
    </div>
  );
}
