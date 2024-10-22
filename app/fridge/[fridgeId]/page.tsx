"use client"
import { FridgeIdNameDesc, FridgeItem } from "@/app/(type)/fridge";
import { AdditionalBtn } from "../../(commom)/Component/AdditionalBtn";;
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { fridgeDataAtom, fridgeDataRefetcherSelector } from "@/app/(recoil)/fridgeAtom";
import FridgeItemDetailModal from "./(common)/FridgeItemDetailModal";

export default function FridgeDetail({
    params
}:{
    params:{fridgeId:number};
}){
    const [refetchCount, setRefetchCount] = useRecoilState(fridgeDataRefetcherSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [fridgeDate, setFridgeDate] = useState<Fridge>();
    const [fridgeData, setFridgeData] = useRecoilState(fridgeDataAtom);
    const [modalItem, setModalItem] = useState<FridgeItem>();
    const [itemDetailModalOpen, setItemDetailModalOpen] = useState<boolean>(false);
    const [fridgeList, setFirdgeList] = useState<FridgeIdNameDesc[]>([]);

    useEffect(()=>{
        axiosAuthInstacne.get(`fridge/my/detail?fridgeId=${params.fridgeId}`)
            .then((res)=>{
                setIsLoading(false);
                setFridgeData(res.data);
            })
    }, [refetchCount])

    useEffect(()=>{
        axiosAuthInstacne.get("fridge/my")
            .then((res)=>{
                setFirdgeList(res.data);
            })
    }, [])


    const fridgeItemProp = fridgeData?.fridgeItems.map((item, inx)=>{
        return (
            <li key={inx} onClick={()=>{
                setModalItem(item);
                setItemDetailModalOpen(true);
            }}  className="fridge-item relative cursor-pointer">
                <div className="absolute -top-3 z-10 w-full text-center overflow-hidden whitespace-nowrap text-ellipsis text-sm font-bold">
                    {item.name}
                </div>
                <div className="w-full h-full img-wrapper-square">
                    <Image className="inner-img" src={item.imgUrl}  alt="ex" fill={true} />
                </div>
            </li>)
    })


    const additionalBtnInfo = [
        {name:"식재료 추가", url:`/fridge/ingre-edit/${params.fridgeId}`},
        {name:"냉장고 수정", url:`/fridge/${params.fridgeId}/edit`}
    ]

    return (
        <>
        <div className="defaultInnerContainer mt-6 flex-center-col">
            <div className="w-[93%] flex-col justify-start items-center mb-3">
                <h1 className="text-2xl mb-2">{fridgeData?.name}</h1>
                {
                fridgeData?.description&&
                <div className="w-[93%] bg-stone-100 rounded-lg p-3">
                    <div className="text-lg">{fridgeData?.description}</div>
                </div>
                }
            </div>
            <section className="relative fridge-container shadow-md ice-shadow-inner mt-6">
                <div className="fridge">
                    {fridgeItemProp}
                </div>
            </section>
            <AdditionalBtn additionalBtns={additionalBtnInfo}/>
        </div>
        {
        modalItem &&
        <FridgeItemDetailModal key={modalItem?.fridgeItemId} fridgeItem={modalItem} fridgeList={fridgeList} fridgeId={params.fridgeId} open={itemDetailModalOpen} setOpen={setItemDetailModalOpen} />
        }
        </>
    )
}