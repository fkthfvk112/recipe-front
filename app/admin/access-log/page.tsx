"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";

interface logDate{
    ipAddress:string;
    userAgent:string;
    referrer:string;
    accessedAt:string;
}

interface data{
    ipAddress:string,
    userAgent:string,
    referrer:string
}

interface sortedData{
    ymd:string,
    extraData:data[]
}
export default function UserListAdmin(){
    const [logData, setLogData] = useState<logDate[]>([]);
    const [logSortedData, setLogSortedData]  = useState<sortedData[]>([]);

    console.log("로그 데이터", logData);

    useEffect(()=>{
        axiosAuthInstacne
            .get(`access/site`)
            .then((res)=>{
                setLogData(res.data);
            });
    }, [])

    useEffect(()=>{
        logData?.forEach((log)=>{
            const date = new Date(log.accessedAt);
            const formattedDate = date.toISOString().split('T')[0];

            const isIn = logSortedData.some(ele => ele.ymd === formattedDate);
            if(isIn){
                const updatedLogSortedData = logSortedData.map(ele => {
                    if (ele.ymd === formattedDate) {
                      return {
                        ...ele,
                        extraData: [...ele.extraData, {ipAddress:log.ipAddress, userAgent:log.userAgent, referrer:log.referrer}],
                      };
                    }
                    return ele; 
                  });

                setLogSortedData(updatedLogSortedData);

            }else{
                setLogSortedData([...logSortedData, {
                    ymd:formattedDate,
                    extraData:[{
                        ipAddress:log.ipAddress,
                        userAgent:log.userAgent,
                        referrer:log.referrer
                    }]
                }]);
            }

        })

    }, [logData])

    const simpleData = logSortedData.map((log, inx)=>{
        return(
            <div key={inx} className="my-3 bg-sky-200 p-3 text-2xl">
                <span>날짜: {log.ymd}</span>
                <span className="ms-3">개수: {log.extraData.length}</span>
            </div>
        )

    })

    return (
        <>
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            <section className="w-full mb-20">
                <TitleDescription title="방문자수 확인" desc={"방문자수 확인"}/>
                {JSON.stringify(logSortedData)}
                {simpleData}
            </section>
        </div>

        </>
    )
}