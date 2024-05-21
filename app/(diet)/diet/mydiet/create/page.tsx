"use client"
import { useState } from "react";
import { DietDay, DietItemRow } from "@/app/(type)/diet";
import EditIcon from "@mui/icons-material/Edit";
import DietDayBox from "./DietDayBox";
import { Checkbox } from "@mui/material";
import SaveModal from "../../../../(commom)/SaveModal";

export default function MyDiet(){
    const [saveModalOpen, setSaveModalOpen]     = useState<boolean>(false);

    const [title, setTitle]                     = useState<string>("");
    const [memo, setMemo]                       = useState<string>("");
    const [isPublic, setIsPublic]               = useState<boolean>(true);
    const [saveData, setSaveData]               = useState<DietDay>();

    const [dietItemRowOne, setDietItemRowOne]  = useState<DietItemRow>({
        title:"아침",
        dietItemList:[]
    });

    const [dietItemRowTwo, setDietItemRowTwo] = useState<DietItemRow>({
        title:"브런치",
        dietItemList:[]
    });

    const [dietItemRowThree, setDietItemRowThree] = useState<DietItemRow>({
        title:"점심",
        dietItemList:[]
    });

    const [dietItemRowFour, setDietItemRowFour] = useState<DietItemRow>({
        title:"저녁",
        dietItemList:[]
    });

    const [dietItemRowFive, setDietItemRowFive] = useState<DietItemRow>({
        title:"간식",
        dietItemList:[]
    });

    const [dietItemRowSix, setDietItemRowSix] = useState<DietItemRow>({
        title:"야식",
        dietItemList:[]
    });

    const handleSubmit = ()=>{
        setSaveModalOpen(true);

        const existRowList = [
            dietItemRowOne,
            dietItemRowTwo,
            dietItemRowThree,
            dietItemRowFour,
            dietItemRowFive,
            dietItemRowSix
        ].filter(row => row.dietItemList.length >= 1);

        const dietDay:DietDay = {
            title:title,
            memo:memo,
            isPublic:isPublic,
            dietItemRowList:existRowList
        }

        setSaveData(dietDay);
    }

    console.log(isPublic)
    return (
        <div className='w-full bg-[#1e5094]  flex flex-col justify-center items-center pt-14'>
            <div className="max-w-xl m-3 flex flex-col flex-wrap w-full justify-center items-center">
                <div className="w-80">
                    <h1 className="white-title"><EditIcon className="me-2"></EditIcon>제목</h1>
                    <input className="bg-[#94aece] ps-2 pe-2 border placeholder-gray-600" value={title} onChange={(evt)=>setTitle(evt.target.value)} 
                    type="text" placeholder="3자 이상 20자 이하"/>
                </div>
                <div className="w-80 mt-5">
                    <h1  className="white-title"><EditIcon className="me-2 "></EditIcon>설명</h1>
                    <textarea className="bg-[#94aece] p-2 border placeholder-gray-600" value={memo} onChange={(evt)=>setMemo(evt.target.value)}
                    placeholder="60자 이하"/>
                </div>

                <div className="flex flex-wrap justify-center items-center mt-10">
                    <DietDayBox title="아침" dietItemRow={dietItemRowOne} setDietItemRow={setDietItemRowOne}></DietDayBox>
                    <DietDayBox title="브런치" dietItemRow={dietItemRowTwo} setDietItemRow={setDietItemRowTwo}></DietDayBox>
                    <DietDayBox title="점심" dietItemRow={dietItemRowThree} setDietItemRow={setDietItemRowThree}></DietDayBox>
                    <DietDayBox title="저녁" dietItemRow={dietItemRowFour} setDietItemRow={setDietItemRowFour}></DietDayBox>
                    <DietDayBox title="간식" dietItemRow={dietItemRowFive} setDietItemRow={setDietItemRowFive}></DietDayBox>
                    <DietDayBox title="야식" dietItemRow={dietItemRowSix} setDietItemRow={setDietItemRowSix}></DietDayBox>
                </div>

                
                <SaveModal open={saveModalOpen} setOpen={setSaveModalOpen}
                    content="식단을 저장하시겠습니까?" data={saveData}
                    postUrl="diet/day/my-days/save" returnUrl="/userfeed/myfeed" ></SaveModal>
            </div>
            <div className="w-full bg-[#94aece] flex justify-center flex-col items-center p-3 pb-14">
                <div className="w-80 mt-5 mb-5 flex justify-center items-center">
                    <div className="mt-1 black-title">공개</div>
                    <Checkbox value={isPublic} onChange={(evt)=>setIsPublic(!isPublic)} defaultChecked />
                </div>
                <button className="saveBtn" onClick={handleSubmit}>저장하기</button>
            </div>
        </div>
    )
}