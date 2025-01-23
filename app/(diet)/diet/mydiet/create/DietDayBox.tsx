import Image from "next/image";
import AddIcon from '@mui/icons-material/Add';
import { DietItem, DietItemRow } from "@/app/(type)/diet";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar, Box, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import Swal from "sweetalert2";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    height:700,
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 400,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

interface DietDayRowProp{
    title:string;
    dietItemRow:DietItemRow;
    setDietItemRow: Dispatch<SetStateAction<DietItemRow>>;
}

function DietDayBox({title, dietItemRow, setDietItemRow}:DietDayRowProp){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddItem = ()=>{
        if(dietItemRow.dietItemList.length >= 15){
            Swal.fire({
                icon: "warning",
                text: "한 끼에 최대 15개의 음식만 추가 가능해요.",
              })
            return;
        }
        const newDietRow = {...dietItemRow};
        newDietRow.dietItemList.push({calorie: 0, memo: "", qqt: "", title: ""});
        setDietItemRow(newDietRow);
    }

    const handleValChg = (evt:any)=>{
        const {value, name} = evt.target;
        if(value === undefined || name === undefined) return;

        const nowIndex = Number(name.split('-')[1]);
        const strName = name.split('-')[0];

        const newDietItemRowArray = [...dietItemRow.dietItemList];

        newDietItemRowArray[nowIndex] = {
            ...newDietItemRowArray[nowIndex],
            [strName]:value//have to :: edit 이름 변경 ex title로 할때 itemTitle로 들어오고 있음
        }
        
        setDietItemRow({
            ...dietItemRow,
             dietItemList:newDietItemRowArray
        })
    }

    const handleGetVal = (name:string):string|number|undefined=>{
        const nowIndex = Number(name.split('-')[1]);
        const strName = name.split('-')[0];

        const itemNow:DietItem = dietItemRow.dietItemList[nowIndex];
        if(itemNow === undefined) return;

        switch (strName){
            case "title":
                return itemNow.title;
            case "calorie":
                return itemNow.calorie;
            case "qqt":
                return itemNow.qqt;
            case "memo":
                return itemNow.memo;
        }
    }

    const handleDelete = (evt:any)=>{
        const {value, name} = evt.currentTarget;
        if(value === undefined || name === undefined) return;
        const nowIndex = Number(name.split('-')[1]);
        const strName = name.split('-')[0];

        const newDietItemRowArray:DietItem[] = dietItemRow.dietItemList.map((item, inx)=>{
            if(inx !== nowIndex) return item;
        }).filter(ele=>ele) as DietItem[];

        setDietItemRow({
            ...dietItemRow,
             dietItemList:newDietItemRowArray
        })
    }
    

    const resetDiet = ()=>{
        Swal.fire({
            title: "입력 초기화",
            text: "정말로 입력을 초기화하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "초기화",
            cancelButtonText: "취소",
            confirmButtonColor: '#f22707',
        }).then((result) => {
            if (result.isConfirmed) {
                setDietItemRow({
                    ...dietItemRow,
                    dietItemList:[{calorie: 0, memo: "", qqt: "", title: ""}]
                });
            }
        });
    }

    const itemInputSections = dietItemRow?.dietItemList.map((dietItem, inx)=>{
        return(
            <div key={inx} className="flex flex-col justify-center items-center p-3 bottom-line pb-10 relative mt-2">
                <button name={`delete-${inx}`} onClick={(evt)=>handleDelete(evt)} className="absolute right-0 top-0 flex justify-center items-center border-none h-8 w-8">
                        <ClearIcon className="bg-white"/>
                </button>
                <div className="w-full flex flex-col">
                    <span className="font-bold">음식 이름 <span className="text-green-700">(필수)</span></span>
                    <input onChange={(evt)=>handleValChg(evt)} value={dietItem?.title} name={`title-${inx}`} placeholder="음식 이름(최대 12자)" type="text" maxLength={12}/>
                </div>
                <div className="w-full flex flex-col mt-3">
                    <span className="font-bold">음식 설명</span>
                    <textarea className="p-2" name={`memo-${inx}`} onChange={(evt)=>handleValChg(evt)} value={dietItem.memo} placeholder="음식 설명(최대 60자)" maxLength={60} />
                </div>
                <div className="w-full mt-3 grid grid-cols-2">
                    <div className="col-span-1">
                        <input name={`qqt-${inx}`} onChange={(evt)=>handleValChg(evt)} value={dietItem.qqt} placeholder="음식양" className="col-span-1" type="text" maxLength={15} />
                    </div>
                    <div className="col-span-1 relative">
                        <div className="absolute font-bold text-[#a1a1a1]" style={{top:"7px", right:"17px"}}>kcal</div>
                        <input name={`calorie-${inx}`} onChange={(evt)=>handleValChg(evt)} value={dietItem.calorie} placeholder="칼로리" type="number" />
                    </div>
                </div>
            </div>
        )
    })

    const handlePhotoUpload = async(evt:React.ChangeEvent<HTMLInputElement>)=>{
        const file: File | null | undefined = evt.target.files?.[0];
        
        if(file){
            const resizedFile = await resizeFileToBase64(file) as string;
            setDietItemRow({...dietItemRow, photo:resizedFile});
        } 
    };

    const deletePhoto = ()=>{
        setDietItemRow({...dietItemRow, photo:""});
    }


    return (
        <div className="flex flex-col justify-start items-center border-2 rounded-xl min-h-[208px] p-3">
            <div className="flex-center-col w-full bottom-line">
                <div className="w-full mb-2 font-bold text-xl flex justify-between">
                    {title}
                    <div onClick={()=>{setIsModalOpen(true)}}>
                        <button className="font-normal text-sm border-none p-0 m-0 w-20 greenBtn">음식 추가</button>
                    </div>
                </div>
            </div>
            <div className="w-full flex-center">
                    <div className="relative flex-center w-[10rem] h-[10rem] bg-[#d1d1d1] mt-3 img-wrapper-square">
                        <div className="w-full">
                            {
                                dietItemRow.photo.length > 0 &&
                                <button onClick={()=>deletePhoto()} className="right-top-xboxBtn">
                                    <ClearIcon className="bg-white"/>
                                </button>
                            }
                        </div> 
                            {
                                dietItemRow.photo.length > 0 &&
                                <Image src={dietItemRow.photo} alt="no img" fill/>
                            }

                        <input id={`diet-file-input-${title}`} onChange={handlePhotoUpload} type="file" accept=".jpg, .jpeg, .png, .gif, .webp" hidden />
                        <label className="flex justify-center items-center border border-[#d1d1d1] w-[10rem] h-[10rem] m-3 cursor-pointer" htmlFor={`diet-file-input-${title}`}>
                            {
                                dietItemRow.photo.length <= 0 &&
                                <AddAPhotoIcon sx={{fill:'black', width:'5rem', height:'5rem', margin:'5rem'}}/>
                            }
                        </label>
                    </div>
                </div>
            <div className="flex w-full flex-wrap text-sm">
                {dietItemRow.dietItemList?.map((item, inx)=>{
                    return (
                        <span key={inx} className="bg-[#a1a1a1]  m-1 mt-2 text-white ps-1.5 pe-1.5 rounded-md font-bold"
                            onClick={()=>{setIsModalOpen(true)}}>{item.title}</span>
                    )
                })}
            </div>
            <Modal
                open={isModalOpen}
                onClose={() => {
                setIsModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <div className="w-full relative">
                        <h1 className="m-2 mb-2 text-2xl">{title}</h1>
                        <button onClick={()=>setIsModalOpen(false)} className="closeBtnParent">
                            <CloseIcon/>
                        </button>
                    </div>
                    <div className="bottom-line"/>
                        <div className="p-3 min-h-[500px] max-h-[500px] overflow-y-scroll">
                            {
                            dietItemRow?.photo&&
                            <div className="w-full flex-center">
                                <div className="relative flex-center w-[10rem] h-[10rem] bg-[#d1d1d1] mt-3 img-wrapper-square">
                                    <div className="relative flex-center w-[10rem] h-[10rem] bg-[#d1d1d1] img-wrapper-square">
                                        <Image src={dietItemRow.photo} alt="no img" fill/>
                                    </div>
                                </div>
                            </div>
                            }
                            {itemInputSections}
                            <div className="text-center mt-4">
                                <AddIcon
                                sx={{width:"45px", height:"45px"}}
                                className="m-1 border border-slate-500 hover:cursor-pointer"
                                onClick={handleAddItem}
                                >
                                </AddIcon>
                            </div>
                    </div>
                    <div className="flex flex-col text-center top-line pt-3">
                        <div>
                            <button className="grayBtn mb-2" onClick={()=>{resetDiet()}}>초기화</button>
                            <button className="greenBtn ms-2" onClick={()=>{setIsModalOpen(false)}}>확인</button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default React.memo(DietDayBox);