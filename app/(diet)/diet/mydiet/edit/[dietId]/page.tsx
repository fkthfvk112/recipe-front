"use client"
import { useEffect, useState } from "react";
import { DietDay, DietItemRow } from "@/app/(type)/diet";
import EditIcon from "@mui/icons-material/Edit";
import { Checkbox } from "@mui/material";
import DietDayBox from "../../create/DietDayBox";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import UpdateModal from "@/app/(commom)/UpdateModal";

export default function MyDietEdit({
    params,
  }: {
    params: { dietId: string };
  }){
    

    const setInitialRecipeData = (fetchedData:DietDay)=>{
        if(fetchedData.memo!==undefined && fetchedData.memo.length > 0){
            setMemo(fetchedData.memo);
        }
        if(fetchedData.title !== undefined && fetchedData.title.length > 0){
            setTitle(fetchedData.title);
        }

        fetchedData.dietItemRowList.map((item)=>{
            if(item.title === '아침' && item.dietItemList.length > 0){
                setDietItemRowOne(prev=>{
                    return {...prev, dietItemList:item.dietItemList}
                 })
            }
            else if(item.title === '브런치' && item.dietItemList.length > 0){
                setDietItemRowTwo(prev=>{
                    return {...prev, dietItemList:item.dietItemList}
                 })
            }
            else if(item.title === '점심' && item.dietItemList.length > 0){
                setDietItemRowThree(prev=>{
                    return {...prev, dietItemList:item.dietItemList}
                 })
            }
            else if(item.title === '저녁' && item.dietItemList.length > 0){
                setDietItemRowFour(prev=>{
                    return {...prev, dietItemList:item.dietItemList}
                 })
            }
            else if(item.title === '간식' && item.dietItemList.length > 0){
                setDietItemRowFive(prev=>{
                    return {...prev, dietItemList:item.dietItemList}
                 })
            }
            else if(item.title === '야식' && item.dietItemList.length > 0){
                setDietItemRowSix(prev=>{
                    return {...prev, dietItemList:item.dietItemList}
                 })
            }
        })

    }

    useEffect(()=>{
        axiosAuthInstacne
            .get(`diet/day/my-day?dietId=${params.dietId}`)
            .then((res) => {
                console.log("검증", res.data);
                setInitialRecipeData(res.data);

            })
            .catch((err) => {
            if (err.response) {
            }
            });
    }, [])

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

        if(params.dietId === undefined || params.dietId === null) return;

        console.log("저장 전", isPublic);

        const dietDay:DietDay = {
            dietDayId:params.dietId,
            title:title,
            memo:memo,
            isPublic:isPublic,
            dietItemRowList:existRowList
        }

        setSaveData(dietDay);
    }

    console.log(isPublic)
    return (

        <div className="bg-white max-w-xl m-3 flex flex-col flex-wrap w-full justify-center items-center">
            <div className="w-80">
                <h1><EditIcon className="me-2"></EditIcon>제목</h1>
                <input value={title} onChange={(evt)=>setTitle(evt.target.value)} type="text" />
            </div>
            <div className="w-80 mt-5">
                <h1><EditIcon className="me-2 "></EditIcon>설명</h1>
                <textarea value={memo} onChange={(evt)=>setMemo(evt.target.value)}/>
            </div>

            <div className="flex flex-wrap justify-center items-center">
                <DietDayBox title="아침" dietItemRow={dietItemRowOne} setDietItemRow={setDietItemRowOne}></DietDayBox>
                <DietDayBox title="브런치" dietItemRow={dietItemRowTwo} setDietItemRow={setDietItemRowTwo}></DietDayBox>
                <DietDayBox title="점심" dietItemRow={dietItemRowThree} setDietItemRow={setDietItemRowThree}></DietDayBox>
                <DietDayBox title="저녁" dietItemRow={dietItemRowFour} setDietItemRow={setDietItemRowFour}></DietDayBox>
                <DietDayBox title="간식" dietItemRow={dietItemRowFive} setDietItemRow={setDietItemRowFive}></DietDayBox>
                <DietDayBox title="야식" dietItemRow={dietItemRowSix} setDietItemRow={setDietItemRowSix}></DietDayBox>
            </div>
            <div className="w-80 mt-5 mb-5 flex justify-center items-center">
                <h1 className="mt-1">공개</h1>
                <Checkbox value={isPublic} onChange={(evt)=>setIsPublic(!isPublic)} defaultChecked />
            </div>
            <button onClick={handleSubmit}>수정하기</button>
            <UpdateModal open={saveModalOpen} setOpen={setSaveModalOpen}
                 content="수정하시겠습니까?" data={saveData}
                 postUrl="diet/day/my-day/update" returnUrl={`/diet/mydiet/${params.dietId}`} ></UpdateModal>
        </div>
    )
}