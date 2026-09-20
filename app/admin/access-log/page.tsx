"use client"

import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { pieChart, PieChart } from "../user-list/PieChart";

interface LogDate {
  ipAddress: string;
  userAgent: string;
  referrer: string;
  accessedAt: string;
  accessSource: string;
}

interface Data {
  ipAddress: string;
  userAgent: string;
  referrer: string;
  accessSource:string;
}

interface SortedData {
  ymd: string;
  extraData: Data[];
}

interface LogSearch {
  dateFrom?: string;
  dateTo?: string;
  dateType?: string;
}

const COLORS = [
  "#FFB3BA", // 연한 빨강
  "#FFDFBA", // 살구
  "#FFFFBA", // 연노랑
  "#BAFFC9", // 연두
  "#BAE1FF", // 연하늘
  "#E6CCFF", // 연보라
  "#D9F8C4", // 민트
  "#FFF0F5", // 라벤더 블러쉬
];

export default function UserListAdmin() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [searchData, setSearchData] = useState<LogSearch>({
    dateFrom: formatDate(sevenDaysAgo),
    dateTo: formatDate(today)
  });
  const [logData, setLogData] = useState<LogDate[]>([]);
  const [logSortedData, setLogSortedData] = useState<SortedData[]>([]);
  const [pieSourceData, setPieSourceData] = useState<pieChart[]>([]);

  useEffect(() => {
    axiosAuthInstacne.get(`access/site`, {
      params:searchData
    }).then((res) => {
      setLogData(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const search = ()=>{
    axiosAuthInstacne.get(`access/site`, {
      params:searchData
    }).then((res) => {
      setLogData(res.data);
    });
  }

  useEffect(() => {
    const countMap: Record<string, number> = {};

    logData.forEach((log) => {
      const source = log.accessSource || "Unknown";
      countMap[source] = (countMap[source] || 0) + 1;
    });

    const pieData = Object.entries(countMap).map(([source, count], idx) => ({
      id: source,
      label: source,
      value: count,
      color: COLORS[idx % COLORS.length],
    }));

    setPieSourceData(pieData);
  }, [logData]);

  useEffect(() => {
    if (!logData.length) return;

    const tempSortedData: { [key: string]: Data[] } = {};

    logData.forEach((log) => {
      const date = new Date(log.accessedAt);
      const formattedDate = date.toISOString().split("T")[0];

      if (!tempSortedData[formattedDate]) {
        tempSortedData[formattedDate] = [];
      }

      tempSortedData[formattedDate].push({
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        referrer: log.referrer,
        accessSource:log.accessSource
      });
    });

    const finalSortedData: SortedData[] = Object.entries(tempSortedData).map(
      ([ymd, extraData]) => ({
        ymd,
        extraData,
      })
    );

    setLogSortedData(finalSortedData);
  }, [logData]);


  
  const setSearchDate = (evt:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>)=>{
    const name  = evt.target.name;
    const value = evt.target.value;
    setSearchData((prevSearch: LogSearch) => ({
        ...prevSearch,
        [name]: value,
    }));
}


  const simpleData = logSortedData.map((log, inx) => (
    <div key={inx} className="my-4 bg-sky-100 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-2 text-xl font-semibold">
        <span>📅 날짜: {log.ymd}</span>
        <span>총 {log.extraData.length}건</span>
      </div>
  
      <div className="space-y-2">
        {log.extraData.map((logdetail, inx2) => (
          <div
            key={inx2}
            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="text-sm text-gray-600 mb-1">
              🔗 접근 경로: <span className="font-medium">{logdetail.accessSource}</span>
            </div>
            <div className="text-sm text-gray-700">
              🧭 Referrer: {logdetail.referrer || "없음"}
            </div>
            <div className="text-sm text-gray-500">
              🌐 IP: {logdetail.ipAddress}
            </div>
          </div>
        ))}
      </div>
    </div>
  ));
  
  return (
    <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
      <section className="w-full mb-20">
        <div className="flex justify-center items-center w-full">
          <input name="dateFrom" onChange={(evt)=>{setSearchDate(evt)}} type="date" value={searchData?.dateFrom} />
          <span className="mx-2">~</span>
          <input name="dateTo" onChange={(evt)=>{setSearchDate(evt)}} type="date" value={searchData?.dateTo}/>
          <button className="greenBtn ms-3" onClick={search}>조회</button>
        </div>
        <TitleDescription title="방문자수 확인" desc={"방문자수 확인"} />
        <div className="w-full h-[300px] mb-10">
          <h3 className="text-center">접근 경로</h3>
          <PieChart data={pieSourceData} />
        </div>
        {simpleData}
      </section>
    </div>
  );
}
