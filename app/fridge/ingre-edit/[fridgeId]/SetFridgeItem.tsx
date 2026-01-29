"use client";

import React, { useState } from "react";
import { FridgeItem } from "@/app/(type)/fridge";
import { axiosAuthInstacne, } from "@/app/(customAxios)/authAxios";
import IngreRecommandInput from "@/app/admin/ingredient/IngreRecommandInput";
import { FridgeItem_IN } from "./page";
import Swal from "sweetalert2";
import { getNDayAfterBaseDateKST } from "@/app/(utils)/DateUtil";
import FridgeItemImgList from "../../FridgeItemImgList";
import Require from "@/app/(commom)/Component/Require";
import { useQueryClient } from "@tanstack/react-query";

function SetFridgeItem({fridgeId, lastOrder}:{fridgeId:number, lastOrder:number}){
    const [selectedFridgeImg, setSelectedFridgeImg] = useState<FridgeItem>();
    const [titleVide, setTitleVide] = useState<number>(0);//넘버값 바뀌면 식재료명 ""로 초기화
    const [title, setTitle] = useState<string>("");
    const [exDate, setExDate] = useState<string>("");
    const [qqt, setQqt] = useState<number>(0);

    const [unit, setUnit] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const qc = useQueryClient();

    const initializeAllData = ()=>{
      setTitle("");
      setExDate("");
      setQqt(0);
      setDescription("");
      setTitleVide(titleVide+1);
    }
    
    const clickImgCallBack = (imgItem:FridgeItem)=>{      
      setSelectedFridgeImg(imgItem);
    };

    const addItemToFridge = ()=>{

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
        fridgeImgId:selectedFridgeImg?.fridgeImgId??1,
        imgUrl:selectedFridgeImg?.imgUrl??"",
        expiredAt:exDate,
        name:title,
        qqt:qqt,
        unit:unit,
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
          qc.invalidateQueries({
              queryKey: ["fridgeDetail", fridgeId],
          });  
          initializeAllData();
        }
      })
    }

  const setDateAfterN = (n: number) => {
    setExDate(prev => {
      const baseDate = prev ? new Date(prev) : new Date();
      return getNDayAfterBaseDateKST(baseDate, n);
    });
  };
      
    return (
            <div className="flex flex-col justify-start items-center w-full ">
              <h1 className="text-[20px]">식재료 추가</h1>
                <div className="w-full">
                    <div className="mt-3">
                      <div className="flex">
                        <h3 className="me-1">식재료명</h3>
                        <Require/>
                      </div>
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
                      <div className="ms-6">
                        <h3 className="w-[100px]">수량/단위</h3>
                        <div className="flex">
                          <input className="w-[150px]" value={qqt} onChange={(evt)=>setQqt(Number(evt.target.value))} type="number" placeholder="100" />
                          <input className="w-[100px]" value={unit} onChange={(evt)=>setUnit(evt.target.value)} placeholder="개"/>
                        </div>
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
                <FridgeItemImgList imgClickCallback={clickImgCallBack}></FridgeItemImgList>
            </div>
    )
}

export default React.memo(SetFridgeItem);