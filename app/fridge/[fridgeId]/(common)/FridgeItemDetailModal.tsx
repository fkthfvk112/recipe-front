"use client"

import React, { use, useEffect, useState } from "react";
import { FridgeIdNameDesc, FridgeItem } from "../../../(type)/fridge";
import { Box, Modal } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRecoilState } from "recoil";
import { fridgeTxModalOpenState, fridgeModalOpenState } from "@/app/(recoil)/fridgeAtom";
import Swal from "sweetalert2";
import FridgeItemImgPickerModal from "./FridgeItemImgPickerModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getImgUrlByIdRQ } from "@/app/(utils)/fridgeUtils";
import Require from "@/app/(commom)/Component/Require";
import FridgeItemTxModal from "./FridgeItemTxModal";
import { fetchFridgeItemDetail } from "@/app/(api)/fridge";
import FridgeItemTxHistory from "./FridgeItemTxHistoryModal";
import FridgeItemTxHistoryModal from "./FridgeItemTxHistoryModal";
import FridgeItemTxHistoryPreview from "./FridgeItemTxHistoryPreview";
import { formatNumber } from "@/app/(utils)/StringUtil";

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

const FieldRow = ({
    label,
    view,
    edit,
    editMode,
}: {
    label: React.ReactNode;
    view: React.ReactNode;
    edit: React.ReactNode;
    editMode: boolean;
}) => {
    return (
        <div className="w-full flex justify-between items-center mt-8">
            <div className="flex">{label}</div>
            <div className="text-right">
                {editMode ? edit : view}
            </div>
        </div>
    );
};


const FieldRowCol = ({
    label,
    view,
    edit,
    editMode,
}: {
    label: React.ReactNode;
    view: React.ReactNode;
    edit: React.ReactNode;
    editMode: boolean;
}) => {
    return (
        <div className="w-full flex flex-col justify-between items-start mt-4">
            <div className="flex">{label}</div>
            <div className="text-right">
                {editMode ? edit : view}
            </div>
        </div>
    );
};

export type TxType = "DISCARD"|"CONSUME"
export type CallFrom = "hist"

function FridgeItemDetailModal({fridgeItemId, fridgeList, fridgeId, callFrom }:{fridgeItemId:number, fridgeList?:FridgeIdNameDesc[], fridgeId?:number, callFrom?:CallFrom}){
    const [editMode, setEditMode] = useState(false);

    const [open, setOpen] = useRecoilState<boolean>(fridgeModalOpenState);
    const [txHistoryOpen, setTxHistoryOpen] = useState(false);

    const [imgModalOpen, setImgModalOpen] = useState<boolean>(false);
    const [txModalOpen, setTxModalOpen] = useRecoilState<boolean>(fridgeTxModalOpenState);
    const [txType, setTxType] = useState<TxType>("DISCARD");

    const [imgUrl, setImgUrl] = useState<string>("");

    const [title, setTitle] = useState<string>("");
    const [position, setPosition] = useState<number>(fridgeId??0);
    const [qqt, setQqt] = useState<number>(0);
    const [unit, setUnit] = useState<string>("");
    const [amt, setAmt] = useState<number>(0);

    const [exDate, setExDate] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [fridgeImgId, setFridgeImgId] = useState<number>(0);

    const qc = useQueryClient();

    const {
        data: fridgeItemDetail,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["fridgeItemDetail", fridgeItemId],
        queryFn: () => fetchFridgeItemDetail(fridgeItemId),
        enabled: open && !!fridgeItemId,
        staleTime: 1000 * 60 * 5, // 5분
    });
    const productInfo:Product = fridgeItemDetail?.product

    const fridgeItem = fridgeItemDetail?.fridgeItem;
    const remainAmt:number = fridgeItemDetail?.remainAmt??0;
    const remainQqt:number = fridgeItemDetail?.remainQqt??0;
    const isActivate:boolean = fridgeItem?.status == "ACTIVE";

    useEffect(() => {
        if (open) setEditMode(false);
    }, [open]);

    const isChanged = ()=>{
        if (!fridgeItem) return false;
        if(position != fridgeId) return true; 
        if(fridgeItem.name !== title) return true;
        if(fridgeItem.qqt !== qqt) return true;
        if(fridgeItem.unit !== unit) return true;
        if(fridgeItem.amt !== amt) return true;
        if((fridgeItem.expiredAt||"") !== exDate) return true;
        if(fridgeItem.description !== description) return true;
        if(fridgeItem.fridgeImgId !== fridgeImgId) return true;
        return false;
    }
    
    const updateItem = ()=>{
        if(!isChanged()) return;
        if(!fridgeItem) return;
        if(callFrom === "hist") return;
        axiosAuthInstacne.put("fridge/my/fridge-item", {
            fridgeId:position,
            fridgeImgId:fridgeImgId,
            fridgeItemId:fridgeItem.fridgeItemId,
            expiredAt:exDate,
            name:title,
            qqt:qqt,
            unit:unit,
            amt:amt,
            description:description,
            order:fridgeItem.itemOrder
          }).then((res)=>{
            if(res.data === 'UPDATE_SUCCESS'){
                Swal.fire({
                    title: "수정 완료",
                    icon: "success",
                })
                qc.invalidateQueries({
                    queryKey: ["fridgeDetail", fridgeId],
                });
                qc.invalidateQueries({
                    queryKey:  ["fridgeItemDetail", fridgeItemId],
                });    
                setEditMode(false);
            }
          })
    }

    const deleteItem = ()=>{
        if(!fridgeItem) return;
        if(callFrom === "hist") return;
        Swal.fire({
            title: "삭제하시겠습니까?",
            text: "식재료 삭제 시 되돌릴 수 없으며 식재료 관리 데이터(소비/폐기)도 함께 사라집니다. 정말 삭제하시겠어요?",
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
                        Swal.fire({
                            title: "삭제 완료",
                            icon: "success",
                        })
                        setOpen(false);
                        qc.invalidateQueries({
                            queryKey: ["fridgeDetail", fridgeId],
                        });
                        qc.invalidateQueries({
                            queryKey:  ["fridgeItemDetail", fridgeItemId],
                        });  
                    };
                })
            }
          });      
    }

    const cancelEdit = ()=>{
        if(callFrom === "hist") return;
        Swal.fire({
            title: "변경사항을 취소하시겠습니까?",
            text: "변경사항은 저장되지 않습니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "취소하기",
            cancelButtonText: "계속 수정",
            confirmButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
                setEditMode(false);
            }
          });    
    }

    //모달 열릴 때마다 보이는 데이터 리셋
    useEffect(() => {
        if (!open) return; // 열릴 때만 리셋
        if (!fridgeItem) return;
        setTitle(fridgeItem?.name ?? "");
        setPosition(fridgeId??0);
        setQqt(fridgeItem?.qqt ?? 0);
        setAmt(fridgeItem?.amt ?? 0);
        setExDate(fridgeItem?.expiredAt ?? "");
        setDescription(fridgeItem?.description ?? "");
        setFridgeImgId(fridgeItem?.fridgeImgId ?? 0);
        setImgUrl(fridgeItem?.imgUrl ?? "");
    }, [open, fridgeItem, fridgeId]);

    const fridgeOptionList = fridgeList?.map((fridge, inx)=>{
        return <option key={inx} value={fridge.fridgeId}>{fridge.fridgeName}</option>
    })

    const MAX_AMT = 1_000_000_000;
    const parseNumber = (value: string) => Number(value.replace(/,/g, ""));
        

    return(
        <>
        <Modal
            open={open}
            onClose={() => {
                if(editMode){
                    cancelEdit();
                }else{
                    setOpen(false)
                }            
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>{
                    if(editMode){
                        cancelEdit();
                    }else{
                        setOpen(false)
                    }       
                }}>
                    <ClearIcon/>
                </div>
                <div className="text-center">
                    <section className="flex-col mt-2 w-full relative">
                        <h2 className="mb-3">
                        {editMode&&"식재료 수정/제거"}
                        </h2>
                        <div className="w-full flex justify-between items-center">
                            <div className="text-start">
                                <FieldRowCol
                                    label={<>
                                        <div className="flex relative">
                                        <h2>식재료명</h2>
                                        {editMode&&<Require/>}
                                        {!editMode&&isActivate&&
                                        <>
                                        <div className="cursor-pointer relative -top-1 ms-1" onClick={()=>setEditMode(true)}>
                                            <EditIcon/>
                                        </div>
                                        </>
                                        }
                                        </div>
                                        </>}
                                    editMode={editMode}
                                    view={<div className="font-medium">{title}</div>}
                                    edit={
                                        <input
                                            className="w-[180px]"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    }
                                />
                                {/* <div className="flex">
                                    <h2>식재료명</h2>
                                    <Require/>
                                </div>
                                <input className="w-[180px]" onChange={(evt)=>{setTitle(evt.target.value)}} value={title} type="text" /> */}
                            </div>
                            <div onClick={()=>{
                                if(editMode){
                                    setImgModalOpen(true)
                                }
                            }} className="w-[80px] h-[80px] img-wrapper-square bg-[#e1e1e1] rounded-2xl">
                                <Image className="inner-img-whole" src={imgUrl}  alt="ex" fill={true} quality={100}/>
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col justify-start items-center">
                        {
                            fridgeId && fridgeList && 
                            <FieldRow
                                label={<><h2>위치</h2>{editMode&&<Require/>}</>}
                                editMode={editMode}
                                view={
                                    <div>
                                        {fridgeList.find(f => f.fridgeId === position)?.fridgeName}
                                    </div>
                                }
                                edit={
                                    <select
                                        value={position}
                                        onChange={(e) => setPosition(Number(e.target.value))}
                                        className="w-[202px] border p-3"
                                    >
                                        {fridgeOptionList}
                                    </select>
                                }
                            />
                        }

                        <hr className="w-full mt-1"></hr>
                        {callFrom !== "hist" &&
                        <>
                        <FieldRow
                            label={editMode?<h2>총 수량 / 단위</h2>:<h2>남은 수량</h2>}
                            editMode={editMode}
                            view={<div>{remainQqt} {unit}</div>}
                            edit={
                                <div className="flex gap-1">
                                    <input
                                        className="w-[120px]"
                                        type="number"
                                        value={qqt}
                                        onChange={(e) => setQqt(Number(e.target.value))}
                                    />
                                    <input
                                        className="w-[80px]"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    />
                                </div>
                            }
                        />
                        <hr className="w-full mt-1"></hr>
                        <FieldRow
                            label={<h2>총 구매 금액</h2>}
                            editMode={editMode}
                            view={<div>{formatNumber(amt)}원</div>}
                            edit={
                                <input
                                    className="w-[202px]"
                                    value={amt ? formatNumber(amt) : ""}
                                    onChange={(e) => {
                                        const raw = parseNumber(e.target.value);
                                        if (!isNaN(raw)) setAmt(raw);
                                    }}
                                />
                            }
                        />
                        <hr className="w-full mt-1"></hr>
                        <FieldRow
                            label={<h2>소비기한</h2>}
                            editMode={editMode}
                            view={<div>{exDate || "-"}</div>}
                            edit={
                                <input
                                    className="w-[150px]"
                                    type="date"
                                    value={exDate}
                                    onChange={(e) => setExDate(e.target.value)}
                                />
                            }
                        />
                        <div className="w-full mt-3">
                            {editMode ? (
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="p-1 w-full"
                                    maxLength={250}
                                />
                            ) : (
                                <>
                                <hr className="mb-3"></hr>
                                <div className="text-left text-sm text-gray-700">
                                    {description || "메모 없음"}
                                </div>
                                </>
                            )}
                        </div>         
                        </>
                        }
                        {fridgeItemDetail?.txList?.length > 0 && !editMode && (
                        <FridgeItemTxHistoryPreview
                            count={fridgeItemDetail.txList.length}
                            onClick={() => setTxHistoryOpen(true)}
                        />
                        )}          
                        <div className="w-full flex gap-1 mt-9">
                            {editMode && (
                            <>
                            <button onClick={updateItem} className={`w-full ${!isChanged()?"deadBtn":"greenBtn"}`}>식재료 수정</button>
                            <button onClick={deleteItem} className={`w-full grayBtn`}>식재료 삭제</button>
                            </>
                            )}
                            {!editMode && isActivate &&(
                            <>
                            <button onClick={()=>{
                                setTxType("CONSUME");
                                setTxModalOpen(true)
                            }} className={`w-full greenBtn`}>소비하기</button>
                            <button onClick={()=>{
                                setTxType("DISCARD");
                                setTxModalOpen(true)
                            }} className={`w-full grayBtn`}>폐기하기</button>
                            </>
                            )}
                        </div>
                        {!editMode && productInfo?.landingUrl && (
                        <div className={`w-full rounded-lg mt-6`}>
                            <button
                            onClick={() => {
                                window.open(productInfo.landingUrl, "_blank", "noopener,noreferrer");
                            }}
                            className={`
                                px-6 py-2
                                w-[80%]
                                max-w-64
                                rounded-lg
                                text-sm font-medium
                                transition-all duration-200
                                border-none
                                ${
                                remainQqt === 0
                                    ? "bg-neutral-800 text-white shadow-md hover:shadow-lg active:scale-[0.97]"
                                    : "bg-neutral-700/40 text-white/70 hover:bg-neutral-700/60 hover:text-white/90"
                                }
                            `}
                            >
                            {remainQqt === 0 ? "식재료 보충하기" : "미리 보충해두기"}
                            </button>
                        </div>
                        )}
                    </section>
                </div>
            </Box>
        </Modal>
        {fridgeItem&&
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
        }

        {fridgeItem&&fridgeId&&
        <FridgeItemTxModal
            fridgeId={fridgeId}
            fridgeItem={fridgeItem}
            remainAmt={remainAmt}
            remainQqt={remainQqt}
            txType={txType}
        />
        }
        {fridgeItemDetail?.txList && (
        <FridgeItemTxHistoryModal
            open={txHistoryOpen}
            onClose={() => setTxHistoryOpen(false)}
            txList={fridgeItemDetail.txList}
        />
        )}

        </>
    )
}

export default React.memo(FridgeItemDetailModal);