"use client"

import { useState } from "react"
import IngreItem from "./IngreItem";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";

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

    return (
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            <section className="w-full mb-20">
                <h2 className="text-xl">
                    식재료 직접 등록
                </h2>
                <textarea
                    placeholder="< , > 로 나뉘어진 입력해주세요.(ex: 안심, 등심)"
                    className="h-30 rounded-md p-3"
                    onChange={(evt) => {
                        setIngreTerm(evt.target.value);
                    }}
                    value={ingreTerm}
                />
            </section>
            <div className="top-line w-full"/>
            <section className="w-full mt-20">
                <div className="flex items-center">
                    <h2 className="text-xl">
                        레시피에서 불러오기
                    </h2>
                    <button onClick={getIngreList} className="greenBtn ms-3">불러오기</button>
                </div>
                <div className="mt-6 flex justify-start items-center flex-wrap">
                    {ingreItemList}
                </div>
            </section>
        </div>
    )
}