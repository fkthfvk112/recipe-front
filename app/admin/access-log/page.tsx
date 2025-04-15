"use client"

import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";

interface LogDate {
  ipAddress: string;
  userAgent: string;
  referrer: string;
  accessedAt: string;
}

interface Data {
  ipAddress: string;
  userAgent: string;
  referrer: string;
}

interface SortedData {
  ymd: string;
  extraData: Data[];
}

export default function UserListAdmin() {
  const [logData, setLogData] = useState<LogDate[]>([]);
  const [logSortedData, setLogSortedData] = useState<SortedData[]>([]);

  useEffect(() => {
    axiosAuthInstacne.get(`access/site`).then((res) => {
      setLogData(res.data);
    });
  }, []);

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

  const simpleData = logSortedData.map((log, inx) => (
    <div key={inx} className="my-3 bg-sky-200 p-3 text-2xl">
      <span>날짜: {log.ymd}</span>
      <span className="ms-3">개수: {log.extraData.length}</span>
    </div>
  ));

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
      <section className="w-full mb-20">
        <TitleDescription title="방문자수 확인" desc={"방문자수 확인"} />
        {simpleData}
      </section>
    </div>
  );
}
