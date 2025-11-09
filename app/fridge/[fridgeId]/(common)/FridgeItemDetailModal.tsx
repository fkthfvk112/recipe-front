"use client"

import React, { use, useEffect, useState } from "react";
import { FridgeIdNameDesc, FridgeItem } from "../../../(type)/fridge";
import { Box, Modal } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import Image from "next/image";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRecoilState } from "recoil";
import { fridgeDataRefetcherSelector, fridgeModalOpenState } from "@/app/(recoil)/fridgeAtom";
import Swal from "sweetalert2";
import FridgeItemImgPickerModal from "./FridgeItemImgPickerModal";
import { useQueryClient } from "@tanstack/react-query";
import { getImgUrlByIdRQ } from "@/app/(utils)/fridgeUtils";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    maxWidth:450,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

function FridgeItemDetailModal({fridgeItem, fridgeList, fridgeId, }:{fridgeItem:FridgeItem, fridgeList:FridgeIdNameDesc[], fridgeId:number}){
    const [open, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);
    const [imgModalOpen, setImgModalOpen] = useState<boolean>(false);

    const [imgUrl, setImgUrl] = useState<string>(fridgeItem.imgUrl)

    const [title, setTitle] = useState<string>(fridgeItem?.name || "");
    const [position, setPosition] = useState<number>(fridgeId);
    const [qqt, setQqt] = useState<string>(fridgeItem?.qqt || "");
    const [exDate, setExDate] = useState<string>(fridgeItem?.expiredAt || "");
    const [description, setDescription] = useState<string>(fridgeItem?.description || "");
    const [fridgeImgId, setFridgeImgId] = useState<number>(fridgeItem?.fridgeImgId || 0);


    const [refetchCount, setRefetchCount] = useRecoilState(fridgeDataRefetcherSelector);
    const qc = useQueryClient();

    const isChanged = ()=>{
        if(position != fridgeId) return true; 
        if(fridgeItem.name !== title) return true;
        if(fridgeItem.qqt !== qqt) return true;
        if((fridgeItem.expiredAt||"") !== exDate) return true;
        if(fridgeItem.description !== description) return true;
        if(fridgeItem.fridgeImgId !== fridgeImgId) return true;
        return false;
    }
    
    const updateItem = ()=>{
        if(!isChanged()) return;
        axiosAuthInstacne.put("fridge/my/fridge-item", {
            fridgeId:position,
            fridgeImgId:fridgeImgId,
            fridgeItemId:fridgeItem.fridgeItemId,
            expiredAt:exDate,
            name:title,
            qqt:qqt,
            description:description,
            order:fridgeItem.itemOrder
          }).then((res)=>{
            if(res.data === 'UPDATE_SUCCESS'){
                Swal.fire({
                    title: "변경 완료",
                    icon: "success",
                })
                setOpen(false);
                setRefetchCount(refetchCount);
            }
          })
    }

    const deleteItem = ()=>{
        Swal.fire({
            title: "삭제하시겠습니까?",
            text: "삭제하면 되돌릴 수 없어요. 정말 삭제하시겠어요?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "삭제",
            cancelButtonText: "취소",
            confirmButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              axiosAuthInstacne
                .delete(`/fridge/item/${fridgeItem.fridgeItemId}`)
                .then((res) => {
                    if(res.data === 'DELETE_SUCCESS'){
                        setOpen(false);
                        setRefetchCount(refetchCount);
                        Swal.fire({
                            title: "삭제 완료",
                            icon: "success",
                          })
                    };
                })
            }
          });      
    }

    //모달 열릴 때마다 보이는 데이터 리셋
    useEffect(() => {
        if (!open) return; // 열릴 때만 리셋
        setTitle(fridgeItem?.name ?? "");
        setPosition(fridgeId);
        setQqt(fridgeItem?.qqt ?? "");
        setExDate(fridgeItem?.expiredAt ?? "");
        setDescription(fridgeItem?.description ?? "");
        setFridgeImgId(fridgeItem?.fridgeImgId ?? 0);
        setImgUrl(fridgeItem?.imgUrl ?? "");
    }, [open, fridgeItem, fridgeId]);

    const fridgeOptionList = fridgeList?.map((fridge, inx)=>{
        return <option key={inx} value={fridge.fridgeId}>{fridge.fridgeName}</option>
    })

    return(
        <>
        <Modal
            open={open}
            onClose={() => {
                setOpen(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>setOpen(false)}>
                    <ClearIcon/>
                </div>
                <div className="text-center">
                    <section className="flex-col mt-2 mb-8 w-full relative">
                        <div className="w-full flex justify-between items-center">
                            <div className="text-start">
                                <h2>식재료명</h2>
                                <input className="w-[180px]" onChange={(evt)=>{setTitle(evt.target.value)}} value={title} type="text" />
                            </div>
                            <div onClick={()=>setImgModalOpen(true)} className="w-[100px] h-[100px] img-wrapper-square bg-[#e1e1e1] rounded-2xl">
                                <Image className="inner-img-whole" src={imgUrl}  alt="ex" fill={true} quality={100}/>
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col justify-start items-center">
                        <div className="w-full flex justify-between items-center my-1">
                            <h2>위치</h2>
                            <select value={position} onChange={(evt)=>{setPosition(Number(evt.target.value))}} className="w-[250px] border p-3" name="" id="">
                                {fridgeOptionList}
                            </select>
                        </div>
                        <div className="w-full flex justify-between items-center my-1">
                            <h2>양</h2>
                            <input className="w-[150px]" onChange={(evt)=>{setQqt(evt.target.value)}} value={qqt} type="text" />
                        </div>
                        <div className="w-full flex justify-between items-center my-1">
                            <h2>소비기한</h2>
                            <input className="w-[150px]" value={exDate} onChange={(evt)=>{setExDate(evt.target.value)}} type="date" />
                        </div>
                        <div className="my-1 w-full">
                            <textarea value={description} onChange={(evt)=>{setDescription(evt.target.value)}} className="p-1" name="" id="" maxLength={250}/>
                        </div>
                        <div className="w-full flex gap-1">
                            <button onClick={updateItem} className={`w-full ${!isChanged()?"deadBtn":"greenBtn"}`}>저장</button>
                            <button onClick={deleteItem} className={`w-full grayBtn`}>삭제</button>
                        </div>
                    </section>
                </div>
            </Box>
        </Modal>
        <FridgeItemImgPickerModal
            initialFridItem={fridgeItem}
            open={imgModalOpen}
            onClose={() => setImgModalOpen(false)}
            onPick={async(img:FridgeItem) => {
                setFridgeImgId(img.fridgeImgId??0)
                const selectedImg = await getImgUrlByIdRQ(qc, img.fridgeImgId??0);
                setImgUrl(selectedImg)
            }}
        />
        </>
    )
}

export default React.memo(FridgeItemDetailModal);