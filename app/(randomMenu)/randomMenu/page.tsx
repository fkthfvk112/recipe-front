"use client"

import { useEffect, useState } from "react"
import { randomMenuData } from "./menuData";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RandomMenuRoulette from "./RandomMenuRoulette";

export default function RandomMenu(){
    const [secondMenuSelcet, setSecondSelect] = useState<string[]>([]); //중식, 일식, 양식

    const [firstSelected, setFirstSelected]   = useState<string>("전체");
    const [secondSelected, setSecondSelected] = useState<string>("전체");

    const [menuName, setMenuName]             = useState<string>("?");

    const [startRotate, setStartRotate]       = useState<number>(0);
    const [nowRotating, setNowRotating]       = useState<boolean>(false);

    const firstClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        setFirstSelected((e.currentTarget as HTMLDivElement).id);
    };

    const secondClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        setSecondSelected((e.currentTarget as HTMLDivElement).id);
    };


    const firstSelection = ["전체", "식사", "간식"].map((menu, inx)=>{
        return (
            <div className={`flex-center p-3 border border-[#a1a1a1] shadow-md rounded-md m-2 w-20 relative cursor-pointer ${
                menu === firstSelected
                  ? "outline outline-2 outline-slate-950"
                  : ""
              }`}
              key={inx}
              id={menu}
              onMouseDown={firstClick}
            >
              {menu === firstSelected ? (
                <CheckCircleIcon className="absolute -right-2 -top-2.5 w-8 h-8"></CheckCircleIcon>
              ) : (
                <></>
              )}
              {menu}
            </div>
          );
    })

    const secondSelection = secondMenuSelcet.map((menu, inx)=>{
        return (
            <div className={`flex-center p-3 border border-[#a1a1a1] shadow-md rounded-md m-2 w-20 relative cursor-pointer ${
                menu === secondSelected
                  ? "outline outline-2 outline-slate-950"
                  : ""
              }`}
              key={inx}
              id={menu}
              onMouseDown={secondClick}
            >
              {menu === secondSelected ? (
                <CheckCircleIcon className="absolute -right-2 -top-2.5 w-8 h-8"></CheckCircleIcon>
              ) : (
                <></>
              )}
              {menu}
            </div>
          );
    })

    useEffect(() => {
        if (firstSelected) {
            if(firstSelected === "전체"){
                setSecondSelect([]);
                return;
            }
            setSecondSelect(["전체", ...Object.keys(randomMenuData[firstSelected])]);
        }

        setSecondSelected("전체");
      }, [firstSelected]);


    const getRandomMenu = ()=>{
        if(firstSelected !== "전체"){
            const menuKeyList= randomMenuData[firstSelected];

            if(secondSelected == "전체"){
                const allMenuList:string[] = [];
                Object.entries(menuKeyList).forEach(([key, menuName])=>{
                    allMenuList.push(...menuName);
                })
                const randomInx = Math.floor(Math.random() * allMenuList.length);

                setMenuName(allMenuList[randomInx]);
            }else{
                const menuNameList = menuKeyList[secondSelected];
                const randomInx = Math.floor(Math.random() * menuNameList.length);
    
                setMenuName(menuNameList[randomInx]);
            }
        }
        else{
            const allMenuList:string[] = [];
            Object.entries(randomMenuData).forEach(([key, value])=>{
                Object.entries(value).forEach(([key, menuName])=>{
                    allMenuList.push(...menuName);
                })
            })

            const randomInx = Math.floor(Math.random() * allMenuList.length);

            setMenuName(allMenuList[randomInx]);
        }

        setNowRotating(true);
        setStartRotate(prv=>prv+1)
        setTimeout(()=>{
            setNowRotating(false);
        }, 2200)
    }

    return (
        <main className="defaultInnerContainer-noPTop">
            <div className="flex flex-col justify-center items-center w-full text-center bg-[#61df72] mb-12 p-8 rounded-t-3xl">
                <div className="text-start">
                    <h1 className="text-2xl">랜덤 메뉴 추천</h1>
                    <p>무엇을 먹을지 고민이신가요?</p>
                    <p>메뉴를 선택하고 <span className="font-bold">&quot;무엇을 먹을까?&quot;</span> 버튼을 눌러 보세요.</p>
                </div>
            </div>
            <section className="w-full flex-center-col">
                <div className="flex flex-col justify-center items-center w-[300px] h-[250px] text-center border-2 mb-5">
                    {
                        !nowRotating?<h1 className="text-xl">{menuName}</h1>:<RandomMenuRoulette startRotate={startRotate} rotationTime={2}/>
                    }
                    {
                        nowRotating&&<p>메뉴 찾는 중...</p>
                    }
                </div>
                <div className="w-full flex flex-col justify-start items-center min-h-[200px]">
                    <div className="flex justify-center flex-wrap bottom-line w-full min-h-18">
                        {firstSelection}
                    </div>
                    <div className="flex justify-center flex-wrap bottom-line w-full min-h-16">
                        {secondSelection}
                    </div>
                </div>
                <div>
                    <button className={`w-[230px] h-[60px] ${nowRotating?'bg-[#e1e1e1] border-none':'border-2'}  rounded-full`} onClick={getRandomMenu} disabled={nowRotating}>{!nowRotating?"무엇을 먹을까?":"메뉴 찾는 중..."}</button>
                </div>
            </section>
        </main>
    )
}