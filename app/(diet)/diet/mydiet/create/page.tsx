"use client"
import { useState } from "react";
import { DietDay, DietItemRow } from "@/app/(type)/diet";
import EditIcon from "@mui/icons-material/Edit";
import DietDayBox from "./DietDayBox";
import { Checkbox } from "@mui/material";
import SaveModal from "../../../../(commom)/SaveModal";
import AddIcon from '@mui/icons-material/Add';
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import Image from "next/image";
import ClearIcon from '@mui/icons-material/Clear';
import { Validation } from "@/app/(user)/check";
import Swal from "sweetalert2";

export default function MyDiet(){
    const [saveModalOpen, setSaveModalOpen]     = useState<boolean>(false);
    const [title, setTitle]                     = useState<string>("");
    const [memo, setMemo]                       = useState<string>("");
    const [isPublic, setIsPublic]               = useState<boolean>(true);
    const [saveData, setSaveData]               = useState<DietDay>();

    const [dietItemRowOne, setDietItemRowOne]  = useState<DietItemRow>({
        title:"아침",
        photo:"",
        dietItemList:[{calorie: 0, memo: "", qqt: "", title: ""}]
    });
    console.log(dietItemRowOne)

    const [dietItemRowTwo, setDietItemRowTwo] = useState<DietItemRow>({
        title:"점심",
        photo:"",
        dietItemList:[{calorie: 0, memo: "", qqt: "", title: ""}]
    });

    const [dietItemRowThree, setDietItemRowThree] = useState<DietItemRow>({
        title:"저녁",
        photo:"",
        dietItemList:[{calorie: 0, memo: "", qqt: "", title: ""}]
    });

    const [dietItemRowFour, setDietItemRowFour] = useState<DietItemRow>({
        title:"간식",
        photo:"",
        dietItemList:[{calorie: 0, memo: "", qqt: "", title: ""}]
    });

    const handleSubmit = ()=>{
        if(!chkDietValid().isValid){
            Swal.fire({
                title: "에러가 발생하였습니다.",
                icon: "error",
                text:chkDietValid().message
              });
            return;
        }

        setSaveModalOpen(true);

        const existInnerItemOne = dietItemRowOne.dietItemList.filter(item=>item.title!= undefined && item.title.length >= 1);
        const existDietRowOne:DietItemRow = {...dietItemRowOne, dietItemList:existInnerItemOne};

        const existInnerItemTwo = dietItemRowTwo.dietItemList.filter(item=>item.title!= undefined && item.title.length >= 1);
        const existDietRowTwo:DietItemRow = {...dietItemRowTwo, dietItemList:existInnerItemTwo};

        const existInnerItemThree = dietItemRowThree.dietItemList.filter(item=>item.title!= undefined && item.title.length >= 1);
        const existDietRowThree:DietItemRow = {...dietItemRowThree, dietItemList:existInnerItemThree};

        const existInnerItemFour = dietItemRowFour.dietItemList.filter(item=>item.title!= undefined && item.title.length >= 1);
        const existDietRowFour:DietItemRow = {...dietItemRowFour, dietItemList:existInnerItemFour};

        const dietDay:DietDay = {
            title:title,
            memo:memo,
            isPublic:isPublic,
            dietItemRowList:[existDietRowOne, existDietRowTwo, existDietRowThree, existDietRowFour]
        };

        console.log("저장할 데이터", dietDay);

        setSaveData(dietDay);
    }

    const chkDietValid = ():Validation=>{
        if(title.length < 3 || title.length > 20){
            return{
                isValid:false,
                message:"제목의 길이는 3자 이상 20자 이하여야해요."
            }
        }
        if(memo.length > 60){
            return{
                isValid:false,
                message:"설명의 길이는 60자 이하여야해요."
            }
        }
        return{
            isValid:true,
            message:"valid"
        };
    }

    console.log(isPublic)
    return (
        <div className='w-full bg-[#1d3124] flex flex-col justify-center items-center pt-14'>
            <div className="max-w-xl bg-white pt-10 pb-10 mb-20 border shadow-xl flex flex-col flex-wrap w-full justify-center items-center rounded-xl">
                <div className="w-80">
                    <h1 className="text-2xl mt-6"><EditIcon className="me-2"></EditIcon>제목</h1>
                    <input maxLength={20} className="bg-[#f5f5f5] ps-2 pe-2 border placeholder-gray-600" value={title} onChange={(evt)=>setTitle(evt.target.value)} 
                    type="text" placeholder="3자 이상 20자 이하"/>
                </div>
                <div className="w-80 mt-5">
                    <h1 className="text-2xl mt-6"><EditIcon className="me-2"></EditIcon>설명</h1>
                    <textarea maxLength={60} className="bg-[#f5f5f5] p-2 border placeholder-gray-600" value={memo} onChange={(evt)=>setMemo(evt.target.value)}
                    placeholder="60자 이하"/>
                </div>

                <div className="flex flex-wrap justify-center items-start mt-10">
                    <DietDayBox title="아침" dietItemRow={dietItemRowOne} setDietItemRow={setDietItemRowOne}></DietDayBox>
                    <DietDayBox title="점심" dietItemRow={dietItemRowTwo} setDietItemRow={setDietItemRowTwo}></DietDayBox>
                    <DietDayBox title="저녁" dietItemRow={dietItemRowThree} setDietItemRow={setDietItemRowThree}></DietDayBox>
                    <DietDayBox title="간식" dietItemRow={dietItemRowFour} setDietItemRow={setDietItemRowFour}></DietDayBox>
                </div>

                <SaveModal open={saveModalOpen} setOpen={setSaveModalOpen}
                    content="식단을 저장하시겠습니까?" data={saveData}
                    postUrl="diet/day/my-days/save" returnUrl="/userfeed/myfeed" />
            </div>
            <div className='flex justify-end fixed bottom-0 bg-white w-full p-3 pr-12 top-line-noM'>
                <div className='flex justify-center items-center mr-10'>
                    <Checkbox onChange={()=>{setIsPublic(!isPublic)}}  checked={isPublic} className='mr-0' color="success" />공개
                </div>
                <button className='greenBtn' onClick={handleSubmit}>식단 작성</button>
            </div>
        </div>
    )
}