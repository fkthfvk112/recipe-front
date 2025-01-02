"use client"
import { FridgeIdNameDesc, FridgeItem, FridgeSortingEnum } from "@/app/(type)/fridge";
import { ChangeEventHandler, useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import SetFridgeItem from "./SetFridgeItem";
import Image from "next/image";
import FridgeItemDetailModal from "../../[fridgeId]/(common)/FridgeItemDetailModal";
import { useRecoilState } from "recoil";
import { fridgeDataAtom, fridgeDataRefetcherSelector, fridgeSortingAtom } from "@/app/(recoil)/fridgeAtom";
import ExpBar from "../../[fridgeId]/(common)/ExpBar";


export interface FridgeItem_IN extends FridgeItem{
    expiredAt?:string;
    name:string;
    qqt?:string;
    description?:string;
    itemOrder:number;
}

export default function FridgeDetail({
    params
}:{
    params:{fridgeId:number};
}){
    const [fridgeSort, setFridgeSort] = useRecoilState(fridgeSortingAtom);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    //const [fridgeDate, setFridgeDate] = useState<Fridge>();
    //const [fridgeRefetch, fridgeRefetcher] = useReducer((state:boolean)=>!state, false);
    const [refetchCount, setRefetchCount] = useRecoilState(fridgeDataRefetcherSelector);

    const [itemDetailModalOpen, setItemDetailModalOpen] = useState<boolean>(false);
    const [modalItem, setModalItem] = useState<FridgeItem>();
    const [fridgeList, setFirdgeList] = useState<FridgeIdNameDesc[]>([]);
    const [fridgeData, setFridgeData] = useRecoilState(fridgeDataAtom);

    useEffect(()=>{
        axiosAuthInstacne.get(`fridge/my/detail?fridgeId=${params.fridgeId}&sortingEnum=${fridgeSort}`)
            .then((res)=>{
                setIsLoading(false);
                setFridgeData(res.data);
            })
    }, [refetchCount, fridgeSort])


    useEffect(()=>{
        axiosAuthInstacne.get("fridge/my")
            .then((res)=>{
                setFirdgeList(res.data);
            })
    }, [])

    const handleSortingChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setFridgeSort(Number(e.target.value));
        console.log(fridgeSort);
    };


    const fridgeItemProp = fridgeData?.fridgeItems.map((item, inx)=>{
        return (
            <li key={inx} onClick={()=>{
                setModalItem(item);
                setItemDetailModalOpen(true);
            }}  className="fridge-item relative cursor-pointer">
                <div className="absolute -top-14 z-10 w-full text-center overflow-hidden whitespace-nowrap text-ellipsis text-sm font-bold">
                    {item.expiredAt?<ExpBar expDateStr={item.expiredAt as string} k={2}/>:<div className="h-[30px]"></div>}
                    {item.name}
                </div>
                <div className="w-full h-full img-wrapper-square">
                    <Image className="inner-img" src={item.imgUrl}  alt="ex" fill={true} />
                </div>
            </li>)
    })

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
                <div className="w-[93%] mt-3 text-right">
                    <select
                        onChange={handleSortingChange}
                        className="border border-slate-300 rounded-2xl mr-2 text-center w-[170px] h-10 bg-zinc-100"
                        value={fridgeSort}
                        name=""
                        id=""
                        >
                        <option className="p-2 m-3" value={FridgeSortingEnum.ExpMany}>
                            유통기한 넉넉한순
                        </option>
                        <option className="p-2 m-3" value={FridgeSortingEnum.ExpFew}>
                            유통기한 급한순
                        </option>
                        <option className="p-2 m-3" value={FridgeSortingEnum.Latest}>
                            최신순
                        </option>
                        <option className="p-2 m-3" value={FridgeSortingEnum.Oldest}>
                            오래된순
                        </option>
                    </select>
                </div>
            </div>
            <div className="flex-center w-full p-3">
                <section className="fridge-container shadow-md ice-shadow-inner mt-6">
                    <ul className="fridge">
                        {fridgeItemProp}
                    </ul>
                </section>
                    <SetFridgeItem fridgeId={params.fridgeId} lastOrder={fridgeData?fridgeData.fridgeItems.length:0} />
            </div>
        </div>
        {
        modalItem &&
        <FridgeItemDetailModal key={modalItem?.fridgeItemId} fridgeItem={modalItem} fridgeList={fridgeList} fridgeId={params.fridgeId} open={itemDetailModalOpen} setOpen={setItemDetailModalOpen} />
        }
        </>
    )
}