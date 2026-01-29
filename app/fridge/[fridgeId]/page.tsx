"use client"
import { Fridge, FridgeIdNameDesc, FridgeItem, FridgeSortingEnum } from "@/app/(type)/fridge";
import { AdditionalBtn } from "../../(commom)/Component/AdditionalBtn";;
import { ChangeEventHandler, useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { fridgeModalOpenState, fridgeSortingAtom } from "@/app/(recoil)/fridgeAtom";
import FridgeItemDetailModal from "./(common)/FridgeItemDetailModal";
import ExpBar from "./(common)/ExpBar";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import { extractDate, extractDateTime } from "@/app/(utils)/DateUtil";
import { truncateString } from "@/app/(utils)/StringUtil";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeDetail } from "@/app/(api)/fridge";

export default function FridgeDetail({
    params
}:{
    params:{fridgeId:number};
}){
    const [fridgeSort, setFridgeSort]       = useRecoilState(fridgeSortingAtom);
    const [modalItem, setModalItem]         = useState<FridgeItem>();
    const [fridgeList, setFirdgeList]       = useState<FridgeIdNameDesc[]>([]);
    const [open, setOpen]                   = useRecoilState<boolean>(fridgeModalOpenState);
    
    const {data: fridgeData, isLoading} = useQuery<Fridge>({
        queryKey: ["fridgeDetail", params.fridgeId, fridgeSort],
        queryFn: () => fetchFridgeDetail(params.fridgeId, fridgeSort),
        enabled: !!params.fridgeId,
    });

    useEffect(()=>{
        setOpen(false)
        axiosAuthInstacne.get("fridge/my")
            .then((res)=>{
                setFirdgeList(res.data);
            })
    }, [])
    
    const fridgeItemProp = fridgeData?.fridgeItems.map((item, inx)=>{
        let dateDiff: number = -100_000;// 유효하지 않은 수
        if(item?.expiredAt){
            const now:Date = new Date();
            const expDate:Date = new Date(item.expiredAt);
            expDate.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0)

            dateDiff = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24); //남은 일수
            
            //더 큰 수로 세팅
            dateDiff = Math.max(dateDiff, 0);
        }

        return (
            <li
            key={inx}
            onClick={() => {
                setModalItem(item);
                setOpen(true);
            }}
            className="grid grid-cols-[1fr_3fr_1fr] cursor-pointer bg-white w-full p-3 gap-3 items-center rounded-lg shadow-sm"
            >
            {/* 왼쪽 이미지 (작게) */}
            <div>
                {item.expiredAt ? (
                <ExpBar expDateStr={item.expiredAt as string} k={2} />
                ) : (
                <div className="h-[0px]" />
                )}
                <div className="relative w-full aspect-square max-w-[60px] mx-auto">
                    <Image
                    className="object-cover rounded-md"
                    src={item.imgUrl}
                    alt="ex"
                    fill
                    quality={100}
                    />
                </div>
            </div>
            {/* 오른쪽 설명 */}
            <div className="flex flex-col justify-start text-left h-full w-full flex-wrap">
                <h2 className="font-bold text-sm text-ellipsis overflow-hidden whitespace-nowrap mb-0.5 ms-1">
                    {item.name}
                </h2>
                <p className="min-h-[20px] break-all w-full p-2 text-start bg-[#f0f0f0] rounded-xl text-xs">
                    {item?.description&&truncateString(item?.description, 30)}
                </p>
                <p className="text-xs text-gray-700 leading-tight ms-1 mt-2">
                    생성일: {extractDate(item?.createdAt as string)}
                </p>
            </div>
            <div className="w-full flex justify-center text-xl font-bold text-[#f77f00]">
                {
                    dateDiff != -100_000 ?
                    <span>D-{dateDiff}</span>
                    :
                    <span>-</span>
                }
            </div>
            </li>
            )
    })

    const additionalBtnInfo = [
        {name:"식재료 추가", url:`/fridge/ingre-edit/${params.fridgeId}`},
        {name:"냉장고 수정/삭제", url:`/fridge/${params.fridgeId}/edit`}
    ]

    const handleSortingChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setFridgeSort(Number(e.target.value));
    };

    return (
        <>
        {!isLoading&&
        <div className="defaultInnerContainer mt-6 flex-center-col">
            <div className="w-[93%] flex-col justify-start items-center mb-3">
                <h1 className="text-2xl mb-2">{fridgeData?.name}</h1>
                {
                fridgeData?.description&&
                <div className="w-[100%] bg-stone-100 rounded-lg p-3">
                    <div className="text-lg">{fridgeData?.description}</div>
                </div>
                }
                <div className="w-[100%] mt-3 text-right">
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
                            등록 최신순
                        </option>
                        <option className="p-2 m-3" value={FridgeSortingEnum.Oldest}>
                            등록 오래된순
                        </option>
                    </select>
                </div>
            </div>
            <section className="relative fridge-container">
                <div className="fridge gap-2">
                    {fridgeItemProp}
                    {fridgeItemProp&&fridgeItemProp?.length < 50 &&
                        <li className="fridge-item relative cursor-pointer">
                            <Link href={`/fridge/ingre-edit/${params.fridgeId}`}>
                                <AddIcon sx={{fill:'#121212', width:'6rem', height:'6rem'}}/>
                            </Link>
                        </li>
                    }
                </div>
            </section>
            <AdditionalBtn additionalBtns={additionalBtnInfo}/>
        </div>}
        {
        modalItem && !isLoading && 
        <FridgeItemDetailModal key={modalItem?.fridgeItemId} fridgeItem={modalItem} fridgeList={fridgeList} fridgeId={params.fridgeId} />
        }
        </>
    )
}