import { useEffect, useState } from "react";
import { FridgeItem } from "../(type)/fridge";
import { defaultAxios } from "../(customAxios)/authAxios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchFridgeImages } from "../(api)/fridge";

interface FridgeItemImgListInterface{
    initialImgId?:number; //초기값
    imgClickCallback:(prop?:any)=>any; //이미지 선택 시 실행할 함수
}


export default function FridgeItemImgList({initialImgId, imgClickCallback}:FridgeItemImgListInterface){
    const [imgSort, setImgSort] = useState<string>("전체");
    const [selectedFridgeImg, setSelectedFridgeImg] = useState<FridgeItem>();

    // 같은 queryKey면 캐시 자동 재사용
    const { data: fridgeImgs = [], isLoading, isError } = useQuery({
      queryKey: ["fridgeImages"],
      queryFn: fetchFridgeImages,
      staleTime: 5 * 60 * 1000,     // 5분 동안 fresh
      gcTime: 30 * 60 * 1000,       // 30분 캐시 유지
      refetchOnWindowFocus: false,
      retry: 1,
    });

    // 초기 선택 로직: initialImgId > id=1 > 첫 항목
    useEffect(() => {
      if (fridgeImgs.length === 0) return;
      const picked =
        (typeof initialImgId === "number" &&
          fridgeImgs.find((x) => x.fridgeImgId === initialImgId)) ||
          fridgeImgs.find((x) => x.fridgeImgId === 0) ||
          fridgeImgs[0];
      setSelectedFridgeImg(picked);
    }, [fridgeImgs, initialImgId]);
      
    const sortBtns = ["전체" ,"채소", "과일", "육류", "수산물", "달걀/유제품", "곡류", "빵/과자", "냉동식품", "조미료/소스", "음료", "기타"].map((sort, inx)=>{
      return (
        <span key={inx}>
          <button
            onClick={()=>setImgSort(sort)}
            className={`text-[#123123] w-[100px] p-1 m-1 border-0 border-b-2 ${imgSort === sort ?  " border-b-[#123123]" : "border-b-transparent"}`}>
              {sort}
          </button>
        </span>
      )
    })

    const imageComps = fridgeImgs.filter((img)=>{
      if(imgSort === "전체"){
        return true;
      }else{
        return imgSort === img.imgSort
      }
    }).map((img, inx) => (
        <div
          onMouseDown={()=>{
            setSelectedFridgeImg(img);
            imgClickCallback(img);
        }}
          className={`flex m-1 justify-start items-center flex-col border border-[#a1a1a1] shadow-md bg-white aspect-square rounded-md img-wrapper-square relative ${
            img.imgUrl === selectedFridgeImg?.imgUrl ? "outline outline-2 outline-slate-950" : ""
          }}`}
          key={inx}
        >
          {img.imgUrl === selectedFridgeImg?.imgUrl ? (
            <CheckCircleIcon className="absolute right-0 top-0 w-8 h-8 z-10"></CheckCircleIcon>
          ) : (
            <></>
          )}
          <div className="w-[60px] h-[60px] ">
            <Image className="inner-img-whole" src={img.imgUrl}  alt="ex" fill={true} quality={100} />
          </div>
        </div>
      ));

    return(
        <>
        <div className="w-full mt-6">
            <h3 className="w-[100px]">이미지 선택</h3>
        </div>
        <div className="w-full flex-center flex-wrap">
            {sortBtns}
        </div>
        <div className="max-w-[512px] min-h-[300px]">
            <section className="grid grid-cols-5 w-full max-w-[512px] max-h-[300px] overflow-y-scroll overscroll-none"
            onMouseDown={(e)=>{
                e.stopPropagation();
            }}
            onTouchStart={(e)=>{
                e.stopPropagation();
            }}
            onMouseUp={(e)=>{
                e.stopPropagation();
            }}
            onTouchEnd={(e)=>{
                e.stopPropagation();
            }}>
                {imageComps}
            </section>
        </div>
        </>
    )
}