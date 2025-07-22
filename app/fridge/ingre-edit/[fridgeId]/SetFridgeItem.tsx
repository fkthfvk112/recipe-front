"use client";

import React, { Dispatch, DispatchWithoutAction, SetStateAction, useEffect, useState } from "react";
import BottomFixedAccordion from "@/app/(commom)/Component/BottomFixedArcodian";
import { FridgeItem } from "@/app/(type)/fridge";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import IngreRecommandInput from "@/app/admin/ingredient/IngreRecommandInput";
import { FridgeItem_IN } from "./page";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { fridgeDataRefetcherSelector } from "@/app/(recoil)/fridgeAtom";
import { getNDayAfterBaseDateKST, getNDayAfterDateKST } from "@/app/(utils)/DateUtil";
import useWindowSize from "@/app/(commom)/Hook/useWindowSize";

function SetFridgeItem({fridgeId, lastOrder}:{fridgeId:number, lastOrder:number}){
    const [fridgeImgs, setFridgeImgs] = useState<FridgeItem[]>([]);
    const [selectedFridgeImg, setSelectedFridgeImg] = useState<FridgeItem>();
    const [refetchCount, setRefetchCount] = useRecoilState(fridgeDataRefetcherSelector); //데이터 초기화 리패쳐

    const [titleVide, setTitleVide] = useState<number>(0);//넘버값 바뀌면 식재료명 ""로 초기화
    const [title, setTitle] = useState<string>("");
    const [exDate, setExDate] = useState<string>("");
    const [qqt, setQqt] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const windowSize = useWindowSize();

    const [scrollLock, setScrollLock] = useState<boolean>(false);

    const [imgSort, setImgSort] = useState<string>("전체");

    const initializeAllData = ()=>{
      setTitle("");
      setExDate("");
      setQqt("");
      setDescription("");
      setTitleVide(titleVide+1);
    }

    useEffect(()=>{
        defaultAxios.get("fridge/images")
            .then((res)=>{
                if(Array.isArray(res.data)){
                  res.data.forEach((img)=>{
                    if(img.fridgeImgId === 1){
                      setSelectedFridgeImg(img);
                    }
                  })
                }
                setFridgeImgs(res.data);
            })
    }, [])
    
    const clickImgComp = (imgItem:FridgeItem)=>{
        setSelectedFridgeImg(imgItem);
    };

    const addItemToFridge = ()=>{
      if(!selectedFridgeImg) return; //have to 디폴트 이미지 선택으로 변경
      if(!title || title.length < 1){
        Swal.fire({
          title: "식재료명을 입력해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: '#d33',
          allowEnterKey:false
        });
        return;      
      }

      const item:FridgeItem_IN = {
        fridgeImgId:selectedFridgeImg.fridgeImgId,
        imgUrl:selectedFridgeImg.imgUrl,
        expiredAt:exDate,
        name:title,
        qqt:qqt,
        description:description,
        itemOrder:lastOrder + 1
      }

      axiosAuthInstacne.post("fridge/my/fridge-item", {
        fridgeId:fridgeId,
        fridgeItemDTO:item
      }).then((res)=>{
        if(res.data === 'CREATE_SUCCESS'){
          Swal.fire({
            title: "식재료가 추가되었습니다",
            icon: "success",
        })
          setRefetchCount(refetchCount);
          initializeAllData();
        }
      })
    }

    const imageComps = fridgeImgs.filter((img)=>{
      if(imgSort === "전체"){
        return true;
      }else{
        return imgSort === img.imgSort
      }
    }).map((img, inx) => (
        <div
          onMouseDown={()=>clickImgComp(img)}
          className={`flex justify-start items-center flex-col border border-[#a1a1a1] shadow-md bg-white aspect-square rounded-md img-wrapper-square relative ${
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
    
    const setDateAfterN=(n:number)=>{
      setExDate(prev=>{
        const baseDate = new Date(prev)
        
        return getNDayAfterBaseDateKST(baseDate, n)
      });
    }


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
    
    return (
            <div className="flex flex-col justify-start items-center w-full ">
              <h1 className="text-[20px]">식재료 추가</h1>
                <div className="w-full">
                    <div className="mt-3">
                      <h3>식재료명 (필수)</h3>
                      <div className="flex">
                          <IngreRecommandInput dataSettingCallback={(ingre:string)=>{
                            setTitle(ingre);
                          }}
                          placeholderStr="냉장고에 넣을 식재료 입력"
                          inputStyleStr="col-span-3 rounded-none"
                          containerStyleStr="col-span-3"
                          titleVideCnt={titleVide}
                          />
                            <button onClick={addItemToFridge} className="greenBtn ms-2">추가</button>
                        </div>
                      </div>
                    <div className="mt-6 flex w-[300px] flex-start items-start">
                      <div className="me-0.5">
                        <h3 className="w-[100px]">유효기간</h3>
                        <input value={exDate} onChange={(evt)=>setExDate(evt.target.value)} type="date" />

                      </div>
                      <div className="ms-0.5">
                        <h3 className="w-[100px]">수량</h3>
                        <input value={qqt} onChange={(evt)=>setQqt(evt.target.value)} type="text" />
                      </div>
                    </div>
                    <div>
                        <button className="saveBtn-outline-orange w-[80px] p-0 m-0.5 mt-2" onClick={()=>setDateAfterN(1)}>+1일</button>
                        <button className="saveBtn-outline-orange w-[80px] p-0 m-0.5 mt-2" onClick={()=>setDateAfterN(5)}>+5일</button>
                        <button className="saveBtn-outline-orange w-[80px] p-0 m-0.5 mt-2" onClick={()=>setDateAfterN(10)}>+10일</button>
                    </div>
                    <div className="mt-6 ">
                      <h3 className="w-[100px]">설명</h3>
                      <textarea value={description} className="p-2 h-[80px]" onChange={(evt)=>setDescription(evt.target.value)} maxLength={250}></textarea>
                    </div>
                </div>
                <div className="w-full mt-6">
                  <h3 className="w-[100px]">이미지 선택</h3>
                </div>
                <div>
                  {sortBtns}
                </div>
                <section className="grid grid-cols-5 gap-1 w-full max-w-[512px] max-h-[300px] min-h-[300px] overflow-y-scroll overscroll-none"
                  onMouseDown={(e)=>{
                    setScrollLock(true);
                    e.stopPropagation();
                  }}
                  onTouchStart={(e)=>{
                    setScrollLock(true);
                    e.stopPropagation();
                  }}
                  onMouseUp={(e)=>{
                    setScrollLock(false)
                    e.stopPropagation();
                  }}
                  onTouchEnd={(e)=>{
                    setScrollLock(false)
                    e.stopPropagation();
                  }}>
                    {imageComps}
                </section>
            </div>
    )
}

export default React.memo(SetFridgeItem);