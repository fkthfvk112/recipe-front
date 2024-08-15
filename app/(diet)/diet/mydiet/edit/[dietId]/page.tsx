"use client"
import { useEffect, useState } from "react";
import { DietDay, DietItemRow } from "@/app/(type)/diet";
import EditIcon from "@mui/icons-material/Edit";
import { Checkbox } from "@mui/material";
import DietDayBox from "../../create/DietDayBox";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import UpdateModal from "@/app/(commom)/UpdateModal";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";

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
        if(fetchedData.dietDate !== undefined && fetchedData.dietDate.length > 0){
            setDietDate(fetchedData.dietDate);
        }
        
        fetchedData.dietItemRowList.map((item)=>{
            if(item.title === '아침' && item.dietItemList.length > 0){
                setDietItemRowOne(prev=>{
                    return {...prev, dietItemList:item.dietItemList, photo:item.photo}
                 })
            }
            else if(item.title === '점심' && item.dietItemList.length > 0){
                setDietItemRowTwo(prev=>{
                    return {...prev, dietItemList:item.dietItemList, photo:item.photo}
                 })
            }
            else if(item.title === '저녁' && item.dietItemList.length > 0){
                setDietItemRowThree(prev=>{
                    return {...prev, dietItemList:item.dietItemList, photo:item.photo}
                 })
            }
            else if(item.title === '간식' && item.dietItemList.length > 0){
                setDietItemRowFour(prev=>{
                    return {...prev, dietItemList:item.dietItemList, photo:item.photo}
                 })
            }
        })
    }

    useEffect(()=>{
        axiosAuthInstacne
            .get(`diet/day/my-day?dietId=${params.dietId}`)
            .then((res) => {
                setInitialRecipeData(res.data);
            })
            .catch((err) => {
            if (err.response) {
            }
            });
    }, [])


    const [saveModalOpen, setSaveModalOpen]     = useState<boolean>(false);

    const [title, setTitle]                     = useState<string>("");
    const [dietDate, setDietDate]               = useState<string>("");
    const [memo, setMemo]                       = useState<string>("");
    const [isPublic, setIsPublic]               = useState<boolean>(true);
    const [saveData, setSaveData]               = useState<DietDay>();
    const {layoutBottomMargin}                  = useResponsiveDesignCss(); 

    const [dietItemRowOne, setDietItemRowOne]  = useState<DietItemRow>({
        title:"아침",
        photo:"",
        dietItemList:[]
    });

    const [dietItemRowTwo, setDietItemRowTwo] = useState<DietItemRow>({
        title:"점심",
        photo:"",
        dietItemList:[]
    });

    const [dietItemRowThree, setDietItemRowThree] = useState<DietItemRow>({
        title:"저녁",
        photo:"",
        dietItemList:[]
    });

    const [dietItemRowFour, setDietItemRowFour] = useState<DietItemRow>({
        title:"간식",
        photo:"",
        dietItemList:[]
    });

    const handleSubmit = ()=>{
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
            dietDate:dietDate,
            dietDayId:params.dietId,
            title:title,
            memo:memo,
            isPublic:isPublic,
            dietItemRowList:[existDietRowOne, existDietRowTwo, existDietRowThree, existDietRowFour]
        };
        if(params.dietId === undefined || params.dietId === null) return;

        setSaveData(dietDay);
    }

    const setTodayDateKST = () => {
        const today = new Date();
        const utc = today.getTime() + (today.getTimezoneOffset() * 60000);
        const KST_TIME_DIFF = 9 * 60 * 60000;
        const kst = new Date(utc + KST_TIME_DIFF);

        kst.setDate(kst.getDate());

        const year = kst.getFullYear();
        const month = String(kst.getMonth() + 1).padStart(2, '0');
        const day = String(kst.getDate()).padStart(2, '0');

        setDietDate(`${year}-${month}-${day}`);
    };
    
    const setYesterdayDateKST = () => {
        const today = new Date();
        const utc = today.getTime() + (today.getTimezoneOffset() * 60000);
        const KST_TIME_DIFF = 9 * 60 * 60000;
        const kst = new Date(utc + KST_TIME_DIFF);

        kst.setDate(kst.getDate() - 1);

        const year = kst.getFullYear();
        const month = String(kst.getMonth() + 1).padStart(2, '0');
        const day = String(kst.getDate()).padStart(2, '0');

        setDietDate(`${year}-${month}-${day}`);
    };
    

    return (
        <main className='w-full bg-[#1d3124] flex flex-col justify-center items-center pt-14'>
            <section className="max-w-xl bg-white pt-10 pb-10 mb-20 border shadow-xl flex flex-col flex-wrap w-full justify-center items-center rounded-xl">
                <div className="w-80">
                    <h3 className="mt-6">날짜</h3>
                    <input className="bg-[#f5f5f5] ps-2 pe-2 border placeholder-gray-600" value={dietDate} type="date" onChange={(evt)=>setDietDate(evt.target.value)}/>
                    <button className="saveBtn-outline-orange w-[80px] p-0 m-0.5 mt-2" onClick={setTodayDateKST}>오늘</button>
                    <button className="saveBtn-outline-orange w-[80px] p-0 m-0.5 mt-2" onClick={setYesterdayDateKST}>어제</button>
                </div>
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

                <UpdateModal open={saveModalOpen} setOpen={setSaveModalOpen}
                 content="수정하시겠습니까?" data={saveData}
                 postUrl="diet/day/my-day/update" returnUrl={`/diet/mydiet/${params.dietId}`} ></UpdateModal>
            </section>
            <section className={`z-[10] flex justify-end fixed bottom-0 bg-white w-full p-3 pr-8 top-line-noM ${layoutBottomMargin}`}>
                <div className='w-full flex justify-between max-w-[300px]'>
                    <div className='flex justify-center items-center mr-10'>
                        <Checkbox onChange={()=>{setIsPublic(!isPublic)}}  checked={isPublic} className='mr-0' color="success" />공개
                    </div>
                    <button className='greenBtn' onClick={handleSubmit}>식단 수정</button>
                </div>
            </section>
        </main>
    )
}

/*
         <UpdateModal open={saveModalOpen} setOpen={setSaveModalOpen}
                 content="수정하시겠습니까?" data={saveData}
                 postUrl="diet/day/my-day/update" returnUrl={`/diet/mydiet/${params.dietId}`} ></UpdateModal>

*/