import Image from "next/image";
import AddIcon from '@mui/icons-material/Add';
import { DietItem, DietItemRow } from "@/app/(type)/diet";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Avatar, Box, Modal } from "@mui/material";
import fileToBase64 from "@/app/(utils)/fileToBase64";
import ClearIcon from '@mui/icons-material/Clear';

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

interface DietDayRowProp{
    title:string;
    dietItemRow:DietItemRow;
    setDietItemRow: Dispatch<SetStateAction<DietItemRow>>;
}

function DietDayBox({title, dietItemRow, setDietItemRow}:DietDayRowProp){
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddItem = ()=>{
        const newDietRow = {...dietItemRow};
        newDietRow.dietItemList.push({
            title:undefined,
            calorie:undefined,
            photo:undefined,
            memo:undefined,
            qqt:undefined,
        });
        setDietItemRow(newDietRow);
    }

    const handleValChg = (evt)=>{
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

    const handleSetVal = (name:string):string|undefined=>{
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
            case "photo":
                return itemNow.photo;
        }
    }

    const handlePhotoChange = (evt, base64str:string)=>{
        const {value, name} = evt.target;
        const nowIndex = Number(name.split('-')[1]);
        const strName = name.split('-')[0];

        if(value === undefined || name === undefined || strName !== 'photo') return;

        const newDietItemRowArray = [...dietItemRow.dietItemList];
        newDietItemRowArray[nowIndex] = {
            ...newDietItemRowArray[nowIndex],
            photo:base64str
        }

        setDietItemRow({
            ...dietItemRow,
             dietItemList:newDietItemRowArray
        })
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
        evt
      ) => {
        const {value, name} = evt.target;
        if(value === undefined || name === undefined) return;

        if (evt.target.files) {
          const file = evt.target.files[0];
          if (file) {
            try {
              const base64String = await fileToBase64(file);
              handlePhotoChange(evt, base64String);

            } catch (error) {
              alert("파일 변환 오류 발생 " + error);
            }
          }
        }
      };

      const getImg = (inx:number)=>{
        const itemNow:DietItem = dietItemRow.dietItemList[inx];
        if(itemNow?.photo === undefined || itemNow?.photo === null || itemNow.photo === ""){
            return <Avatar className="w-16 h-16" />
        }
        return (
                <Image
                    className="rounded-full"
                    width={64}
                    height={64}
                    src={itemNow.photo as string}
                    alt="no img">
                </Image>
        )
      }

    const handleDelete = (evt)=>{
        const {value, name} = evt.currentTarget;
        if(value === undefined || name === undefined) return;
        const nowIndex = Number(name.split('-')[1]);
        const strName = name.split('-')[0];

        const newDietItemRowArray:DietItem[] = dietItemRow.dietItemList.map((item, inx)=>{
            if(inx !== nowIndex) return item;
        }).filter(ele=>ele) as DietItem[];

        console.log('das ', newDietItemRowArray);

        setDietItemRow({
            ...dietItemRow,
             dietItemList:newDietItemRowArray
        })
    }
    
    const itemBageList = dietItemRow?.dietItemList.map((dietItem, inx)=>{
        return(
            <div>
                <div className="w-full flex justify-end">
                    <button name={`delete-${inx}`} onClick={(evt)=>handleDelete(evt)} className="flex justify-center items-center border-none h-8 w-8">
                        <ClearIcon/>
                    </button>
                </div>
                <div className="grid grid-cols-4 mb-8 " key={inx}>
                    <div className="col-span-1">
                    <div className="p-1">
                        <label htmlFor={`edit-${inx}`} className="cursor-pointer">
                        <input
                            id={`edit-${inx}`} 
                            name={`photo-${inx}`}
                            className="border border-slate-500"
                            onChange={(evt)=>handleFileChange(evt)}
                            type="file"
                            hidden
                        />
                        {getImg(inx)}
                        </label>
                    </div>
                    </div>
                    <div className="col-span-3">
                        <div className="flex justify-between">
                            <input onChange={(evt)=>handleValChg(evt)} value={handleSetVal(`title-${inx}`)} name={`title-${inx}`} placeholder="음식명" type="text" className="w-28"/>
                            <input name={`calorie-${inx}`} onChange={(evt)=>handleValChg(evt)} value={handleSetVal(`calorie-${inx}`)} placeholder="칼로리" type="text" className="w-28"/>
                        </div>
                        <div className="grid grid-cols-3 mb-3">
                            <input name={`qqt-${inx}`} onChange={(evt)=>handleValChg(evt)} value={handleSetVal(`qqt-${inx}`)} placeholder="음식양" className="col-span-1" type="text" />
                            <input name={`memo-${inx}`} onChange={(evt)=>handleValChg(evt)} value={handleSetVal(`memo-${inx}`)} placeholder="설명" className="col-span-2" type="text" />
                        </div>
                        <hr />
                    </div>
                </div>
            </div>
        )
    })

    console.log("아이템", dietItemRow);

    return (
        <div className="flex flex-col justify-start items-center bg-slate-200 w-52 h-52 p-3 m-3">
            <div className="flex justify-between w-full">
                <div className="w-full mt-2 font-bold">
                    {title}
                </div>
                <div onClick={()=>{setIsModalOpen(true)}}>
                    <AddIcon></AddIcon>
                </div>
            </div>
            <div className="flex flex-wrap text-sm">
                {dietItemRow.dietItemList?.map((item)=>{
                    return (
                        <span className="bg-white m-1 border border-1 rounded-md ps-2 pe-2 pt-0.5 pb-0.5">{item.title}</span>
                    )
                })}
            </div>
            
            <Modal
                open={isModalOpen}
                onClose={() => {
                setIsModalOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1>{title}</h1>
                    <div className="text-center">
                    </div>
                    {itemBageList}
                    <div className="flex flex-col text-center">
                        <button onClick={handleAddItem}>더하기</button>
                        <button onClick={()=>{setIsModalOpen(false)}}>확인</button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default React.memo(DietDayBox);