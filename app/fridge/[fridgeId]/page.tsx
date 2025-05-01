"use client"
import { FridgeIdNameDesc, FridgeItem, FridgeSortingEnum } from "@/app/(type)/fridge";
import { AdditionalBtn } from "../../(commom)/Component/AdditionalBtn";;
import { ChangeEventHandler, useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { fridgeDataAtom, fridgeDataRefetcherSelector, fridgeSortingAtom } from "@/app/(recoil)/fridgeAtom";
import FridgeItemDetailModal from "./(common)/FridgeItemDetailModal";
import ExpBar from "./(common)/ExpBar";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';

export default function FridgeDetail({
    params
}:{
    params:{fridgeId:number};
}){
    const [fridgeSort, setFridgeSort] = useRecoilState(fridgeSortingAtom);

    const [refetchCount, setRefetchCount] = useRecoilState(fridgeDataRefetcherSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [fridgeDate, setFridgeDate] = useState<Fridge>();
    const [fridgeData, setFridgeData] = useRecoilState(fridgeDataAtom);
    const [modalItem, setModalItem] = useState<FridgeItem>();
    const [itemDetailModalOpen, setItemDetailModalOpen] = useState<boolean>(false);
    const [fridgeList, setFirdgeList] = useState<FridgeIdNameDesc[]>([]);
    useEffect(()=>{
        setIsLoading(true)
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
                    <Image className="inner-img-whole" src={item.imgUrl}  alt="ex" fill={true}  quality={100}/>
                </div>
            </li>)
    })

    const additionalBtnInfo = [
        {name:"식재료 추가", url:`/fridge/ingre-edit/${params.fridgeId}`},
        {name:"냉장고 수정", url:`/fridge/${params.fridgeId}/edit`}
    ]

    const handleSortingChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setFridgeSort(Number(e.target.value));
        console.log(fridgeSort);
    };

    return (
        <>
        {!isLoading&&
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
                            등록 최신순
                        </option>
                        <option className="p-2 m-3" value={FridgeSortingEnum.Oldest}>
                            등록 오래된순
                        </option>
                    </select>
                </div>
            </div>
            <section className="relative fridge-container shadow-md ice-shadow-inner mt-6">
                <div className="fridge">
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
        <FridgeItemDetailModal key={modalItem?.fridgeItemId} fridgeItem={modalItem} fridgeList={fridgeList} fridgeId={params.fridgeId} open={itemDetailModalOpen} setOpen={setItemDetailModalOpen} />
        }
        </>
    )
}