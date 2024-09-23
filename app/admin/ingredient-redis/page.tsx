"use client"

import { useEffect, useState } from "react"
import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import { IngredientList } from "@/app/(type)/ingredient";

export default function IngredientAdmin(){
    const [testTerm, setTestTerm] = useState<string>("");
    const [recommendTermList, setRecommendTermList] = useState<string[]>([]);

    const [searchedIngreList, setSearchedIngreList] = useState<IngredientList[]>([]);

    const getIngreRedisList = ()=>{
        axiosAuthInstacne.get('admin/ingre/redis')
            .then((res)=>{
                setSearchedIngreList(res.data);
        })
    }

    const setRedisList = ()=>{
        axiosAuthInstacne.post('admin/ingre/set/redis')
        .then((res)=>{
            getIngreRedisList();
        })
    }

    useEffect(()=>{
        if(testTerm.length > 0){
            defaultAxios.get("ingre-list/recommend/redis",{
                params:{
                    searchingTerm:testTerm
                }
            })
            .then((res)=>{
                console.log(res.data);
                setRecommendTermList(res.data);
            })
        }else{
            setRecommendTermList([]);
        }
    }, [testTerm])

    const recommendList = recommendTermList.map((term, inx)=>{
        return (
            <div key={inx} className="w-full hover:bg-[#e1e1e1]">
                {term}
            </div>
        )
    })

    const ingreItemList =  searchedIngreList.map((name, inx)=>
        <span key={inx} className="flex justify-center items-center rounded-lg p-2 m-2 border border-[#e1e1e1] ">
            <h2>
                {name.name}
            </h2>
            <span className="ms-2">
                점수 : {name.useCnt}
            </span>
        </span>
    )

    return (
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            <section className="w-full mb-20">
                <div>
                    <h2 className="text-xl">
                        레디스에서 식재료 불러오기
                    </h2>
                    <p>레디스에 등록된 식재료를 불러와요. 식재료는 검색어 추천에 사용돼요.</p>
                    <p>데이터 동기화를 선택시 Rdbms에 있는 데이터로 레디스를 세팅해요.</p>
                    <button onClick={getIngreRedisList} className="greenBtn mt-10">불러오기</button>
                    <button onClick={setRedisList} className="greenBtn mt-10 w-36 ms-3">데이터 동기화</button>
                </div>
                <div className="mt-6 flex justify-start items-center flex-wrap">
                    {ingreItemList}
                </div>
            </section>
            <section className="w-full mb-20">
                <div>
                    <h2 className="text-xl">
                        검색어 추천 테스트
                    </h2>
                    <p>레디스에서 검색어를 추천해줄 거에요. 위에서 세팅한 데이터가 정상 동작하는지 확인해요.</p>
                </div>
                <div className="mt-6 flex justify-start items-center flex-wrap">
                    <input onChange={(evt)=>setTestTerm(evt.target.value)} value={testTerm} type="text" placeholder="식재료명 일부를 입력하세요" />
                    <div className="border border-gray-200 w-full">
                        {recommendList}
                    </div>
                </div>
            </section>
        </div>
    )
}