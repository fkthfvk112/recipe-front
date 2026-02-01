"use client"

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import Swal from "sweetalert2";

export default function EditFridge({
    params
}:{
    params:{fridgeId:number};
}){
    const [loading, setLoading] = useState<boolean>(true);
    const [fridgeId, setFridgeId] = useState<number>();
    const [fridgeName, setFridgeName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const router = useRouter();

    const saveFridge = ()=>{
        Swal.fire({
            title: "냉장고 수정",
            text: "냉장고를 수정하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "수정",
            cancelButtonText: "취소",
            confirmButtonColor: '#52cf63',
          }).then((result) => {
            if (result.isConfirmed) {
              axiosAuthInstacne
                .put("fridge/name-desc", {
                    fridgeId:params.fridgeId,
                    fridgeName:fridgeName,
                    description:description
                })
                .then((res) => {
                  Swal.fire({
                    title: "수정 완료",
                    icon: "success",
                  }).then(() => {

                    router.push(`/fridge/${params.fridgeId}`);
                  });
                })
            }
          });      
    }

        const delFridge = ()=>{
        Swal.fire({
            title: "냉장고 삭제",
            text: "삭제하면 되돌릴 수 없어요. 정말 삭제하시겠어요?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              axiosAuthInstacne
                .delete(`fridge/${params.fridgeId}`)
                .then((res) => {
                  Swal.fire({
                    title: "삭제 완료",
                    icon: "success",
                  }).then(() => {

                    router.push(`/fridge`);
                  });
                })
            }
          });      
    }

    useEffect(()=>{
        axiosAuthInstacne.get(`fridge/my/name-desc/${params.fridgeId}`)
            .then((res)=>{
                setFridgeId(res.data.fridgeId);
                setDescription(res.data.description);
                setFridgeName(res.data.fridgeName);
                setLoading(false);
            })
    }, [])


    return(
        <div className="p-5 max-w-xl w-dvw m-3 mt-12 mb-16 bg-[white] px-4 flex flex-col justify-center items-center shadow-xl border border-[#1e1e1]">
            <div className="w-full mt-6 mb-6 p-5">
                <h3 className="text-lg">냉장고 이름</h3>
                {
                    loading?
                    <div className="min-w-32 bg-[#e1e1e1] mt-2 h-10" />:
                    <input
                    className="min-w-32 border-slate-500 mt-2"
                    placeholder="1자 이상 20자 이하"
                    onChange={(evt)=>{setFridgeName(evt.target.value)}}
                    type="text"
                    value={fridgeName}
                    maxLength={20}
                />
                }
            </div>
            <div className="flex flex-col justify-center items-center w-full mt-3 mb-6 p-5">
                <div className="text-start w-full">
                    <h3 className="text-lg">냉장고 설명</h3>
                </div>
                {
                    loading?
                    <div className="w-full bg-[#e1e1e1] mt-2 h-32 rounded-2xl" />:
                    <textarea
                    placeholder="200자 이하"
                    value={description}
                    onChange={(evt)=>{setDescription(evt.target.value)}}
                    className="border border-slate-500 rounded-2xl w-full h-32 p-3 resize-none"
                    maxLength={200}
                    name=""
                    id=""
                    ></textarea>
                }
                
            </div>
            <div className="w-full flex-center">
                <button
                    className="saveBtn me-1"
                    onClick={saveFridge}>
                    수정
                </button>
                <button
                    className="grayBtn ms-1"
                    onClick={delFridge}>
                    삭제
                </button>
            </div>

        </div>
    )
}