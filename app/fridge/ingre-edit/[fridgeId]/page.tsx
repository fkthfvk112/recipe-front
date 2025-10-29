"use client"
import { FridgeIdNameDesc, FridgeItem, FridgeSortingEnum } from "@/app/(type)/fridge";
import { ChangeEventHandler, useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import SetFridgeItem from "./SetFridgeItem";
import Image from "next/image";
import FridgeItemDetailModal from "../../[fridgeId]/(common)/FridgeItemDetailModal";
import { useRecoilState } from "recoil";
import { fridgeDataAtom, fridgeDataRefetcherSelector, fridgeModalOpenState, fridgeSortingAtom } from "@/app/(recoil)/fridgeAtom";
import ExpBar from "../../[fridgeId]/(common)/ExpBar";
import { useRouter } from "next/navigation";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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

    const [modalItem, setModalItem] = useState<FridgeItem>();
    const [fridgeList, setFirdgeList] = useState<FridgeIdNameDesc[]>([]);
    const [fridgeData, setFridgeData] = useRecoilState(fridgeDataAtom);
    const router = useRouter();

    const [open, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);

    useEffect(()=>{
        axiosAuthInstacne.get(`fridge/my/detail?fridgeId=${params.fridgeId}&sortingEnum=${fridgeSort}`)
            .then((res)=>{
                setIsLoading(false);
                setFridgeData(res.data);
            })
    }, [refetchCount, fridgeSort])


    useEffect(()=>{
        setOpen(false)
        axiosAuthInstacne.get("fridge/my")
            .then((res)=>{
                setFirdgeList(res.data);
            })
    }, [])

    const handleSortingChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setFridgeSort(Number(e.target.value));
    };


    const fridgeItemProp = fridgeData?.fridgeItems.map((item, inx)=>{
        return (
            <li key={inx} onClick={()=>{
                setModalItem(item);
                setOpen(true);
            }}  className="fridge-item relative cursor-pointer">
                <div className="absolute -top-14 z-10 w-full text-center overflow-hidden whitespace-nowrap text-ellipsis text-sm font-bold">
                    {item.expiredAt?<ExpBar expDateStr={item.expiredAt as string} k={2}/>:<div className="h-[30px]"></div>}
                    {item.name}
                </div>
                <div className="w-full h-full img-wrapper-square">
                    <Image className="inner-img-whole" src={item.imgUrl}  alt="ex" fill={true} quality={100} />
                </div>
            </li>)
    })

    const goPrev = ()=>{
        router.back();
    }

    return (
        <>
        <div className="defaultInnerContainer mt-6 flex-center-col">
            <div className="w-[100%] flex-col justify-start items-center mb-3">
                <nav className="text-center w-full py-5 px-3 relative bottom-line">
                    <div onClick={goPrev} className="absolute left-5 cursor-pointer">
                        <ArrowBackIosIcon />
                    </div>
                    <h1 className="text-xl ms-5">{fridgeData?.name}</h1>
                </nav>
            </div>
            <div className="flex-center w-full p-3">
                <SetFridgeItem fridgeId={params.fridgeId} lastOrder={fridgeData?fridgeData.fridgeItems.length:0} />
            </div>
        </div>
        {
        modalItem &&
        <FridgeItemDetailModal key={modalItem?.fridgeItemId} fridgeItem={modalItem} fridgeList={fridgeList} fridgeId={params.fridgeId} />
        }
        </>
    )
}