"use client"
import { siginInState } from "@/app/(recoil)/recoilAtom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import DietDayItem from "./DietDayBox";
import { useState } from "react";
import { DietDay, DietItemRow } from "@/app/(type)/diet";
import EditIcon from "@mui/icons-material/Edit";
import DietDayBox from "./DietDayBox";
import axios from "axios";

export default function MyDiet(){
    const [title, setTitle] = useState<string>("");

    const [dietItemRowOne, setDietItemRowOne] = useState<DietItemRow>({
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
        // //have to :: 유효성 검사 추가
        // axios
        // .post(`${process.env.NEXT_PUBLIC_API_URL}diet/day/my-day`, userData, {
        //   withCredentials: true,
        // })
        // .then((res) => {
        //   console.log(res.data);
        // })
        // .catch((err) => {
        //   alert("로그인 실패 " + err);
        // });
    }

    return (

        <div className="bg-white max-w-xl m-3 flex flex-col flex-wrap w-full justify-center items-center">
            <div>
                <h1><EditIcon className="me-2"></EditIcon>제목</h1>
                <input value={title} onChange={(evt)=>setTitle(evt.target.value)} type="text" />
            </div>
            <div className="flex flex-wrap justify-center items-center">
                <DietDayBox title="아침" dietItemRow={dietItemRowOne} setDietItemRow={setDietItemRowOne}></DietDayBox>
                <DietDayBox title="브런치" dietItemRow={dietItemRowTwo} setDietItemRow={setDietItemRowTwo}></DietDayBox>
                <DietDayBox title="점심" dietItemRow={dietItemRowThree} setDietItemRow={setDietItemRowThree}></DietDayBox>
                <DietDayBox title="저녁" dietItemRow={dietItemRowFour} setDietItemRow={setDietItemRowFour}></DietDayBox>
                <DietDayBox title="간식" dietItemRow={dietItemRowFive} setDietItemRow={setDietItemRowFive}></DietDayBox>
                <DietDayBox title="야식" dietItemRow={dietItemRowSix} setDietItemRow={setDietItemRowSix}></DietDayBox>
            </div>
            <button onClick={handleSubmit}>저장?</button>
        </div>
    )
}