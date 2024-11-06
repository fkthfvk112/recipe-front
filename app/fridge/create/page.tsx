"use client"

import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRouter } from "next/navigation";
import { useState } from "react"
import Swal from "sweetalert2";

export default function CreateFridge(){
    const [fridgeName, setFridgeName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const checkingDone = useChkLoginToken("refreshNeed");
    const router = useRouter();

    if(!checkingDone){
      return <></>
    }


    const saveFridge = ()=>{
        Swal.fire({
            title: "냉장고 생성",
            text: "냉장고를 생성하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "생성",
            cancelButtonText: "취소",
            confirmButtonColor: '#52cf63',
          }).then((result) => {
            if (result.isConfirmed) {
              axiosAuthInstacne
                .post("fridge", {
                    name:fridgeName,
                    description:description
                })
                .then((res) => {
                  Swal.fire({
                    title: "생성 완료",
                    icon: "success",
                  }).then(() => {

                    router.push("/fridge");
                  });
                })
            }
          });      
    }


    return(
        <div className="p-5 max-w-xl w-dvw m-3 mt-12 mb-16 bg-[white] px-4 flex flex-col justify-center items-center shadow-xl border border-[#1e1e1]">
            <div className="w-full mt-6 mb-6 p-5">
                <h3 className="text-lg">냉장고 이름</h3>
                <input
                    className="min-w-32 border-slate-500 mt-2"
                    placeholder="1자 이상 20자 이하"
                    onChange={(evt)=>{setFridgeName(evt.target.value)}}
                    type="text"
                    value={fridgeName}
                    maxLength={20}
                />
            </div>
            <div className="flex flex-col justify-center items-center w-full mt-6 mb-6 p-5">
                <div className="text-start w-full">
                    <h3 className="text-lg">냉장고 설명</h3>
                </div>
                <textarea
                    placeholder="200자 이하"
                    value={description}
                    onChange={(evt)=>{setDescription(evt.target.value)}}
                    className="border border-slate-500 rounded-2xl w-full h-24 p-3 resize-none"
                    maxLength={200}
                    name=""
                    id=""
                ></textarea>
            </div>
            <button
        className="saveBtn"
        onClick={saveFridge}>
        냉장고 생성
      </button>
        </div>
    )
}