"use client"

import { useState } from "react"
import IngreItem from "./IngreItem";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";

export default function IngredientAdmin(){
    const [ingreTerm, setIngreTerm] = useState<string>("");

    const [searchedIngreList, setSearchedIngreList] = useState<string[]>([]);

    const getIngreList = ()=>{
        axiosAuthInstacne.get('admin/ingre/not-exist-list')
            .then((res)=>{
                setSearchedIngreList(res.data);
        })
    }

    const ingreItemList =  searchedIngreList.map((name, inx)=>
        <IngreItem key={inx} ingreName={name} refetch={getIngreList}/>
    )

    const saveAllRecipe = ()=>{
        if (!ingreTerm.trim()) return;

        // 1. 콤마 기준 분리
        const ingreList: string[] = ingreTerm
            .split(",")
            .map(item => item.trim())   // 앞/뒤 공백 제거
            .filter(item => item.length > 0); // 빈 문자열 제거

        if (ingreList.length === 0) return;

        axiosAuthInstacne.post("admin/ingre/save/list", ingreList).then((res)=>{
            setIngreTerm("");
            getIngreList(); // 필요하면 리프레시
            Swal.fire({
                title: "저장이 완료되었습니다!",
                icon: "success",
            })
        })
    }

    return (
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            <section className="w-full mb-20">
                <h2 className="text-xl">
                    식재료 직접 등록
                </h2>
                <p>Rdbms에 식재료를 등록해요. ,로 나뉘어진 식재료를 입력받아요.</p>
                <textarea
                    placeholder="< , > 로 나뉘어진 입력해주세요.(ex: 안심, 등심)"
                    className="h-30 rounded-md p-3 mt-3"
                    onChange={(evt) => {
                        setIngreTerm(evt.target.value);
                    }}
                    value={ingreTerm}
                />
                <button onClick={saveAllRecipe} className="greenBtn ms-3 mt-10">한 번에 저장</button>
            </section>
            

            <div className="top-line w-full"/>
            <section className="w-full mt-20">
                <div>
                    <h2 className="text-xl">
                        레시피에서 식재료 불러오기(SQLD 데이터 세팅)
                    </h2>
                    <p>Rdbms에 등록되지 않은 식재료를 레시피에서 불러와요. +을 눌러 Rdbms에 저장할 수 있어요.</p>
                    <button onClick={getIngreList} className="greenBtn ms-3 mt-10">불러오기</button>
                </div>
                <div className="mt-6 flex justify-start items-center flex-wrap">
                    {ingreItemList}
                </div>
            </section>
        </div>
    )
}