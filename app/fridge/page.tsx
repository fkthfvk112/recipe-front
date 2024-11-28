"use client"

import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { FridgeIdNameDesc } from "../(type)/fridge";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import { truncateString } from "../(utils)/StringUtil";
import Link from "next/link";
import TitleDescription from "../(commom)/Component/TitleDescription";
import RecipeVerticalItem from "../(board)/board/[boardMenuId]/create/(Recipe)/RecipeVerticalItem";
import { Recipe } from "../(recipe)/types/recipeType";
import { CircularProgress } from "@mui/material";
import useChkLoginToken from "../(commom)/Hook/useChkLoginToken";

export default function Fridge(){
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [initialSetted, setInitialSetted] = useState<boolean>(false);
    const [fridgeDate, setFridgeDate] = useState<FridgeIdNameDesc[]>([]);
    const [recommandRecipe, setRecommandRecipe] = useState<Recipe[]>([]);
    const [containIngre, setContainIngre] = useState<number>(3);

    const [refetcher, setRefetcher] = useState<number>(0);
    const isTokenValid = useChkLoginToken("refreshNeed");

    useEffect(()=>{
        if(isTokenValid){
            setIsLoading(true);
            Promise.all([
                axiosAuthInstacne.get("fridge/my"),
                axiosAuthInstacne.get(`recipe/my-fridge/ingres?ingreSize=${containIngre}`),
            ]).then(([fridgeRes, recipeRes])=>{
                setFridgeDate(fridgeRes.data);
                setRecommandRecipe(recipeRes.data);
                setInitialSetted(true);
            })
            .finally(()=>{
                setIsLoading(false);
            })
        }
    }, [refetcher, containIngre, isTokenValid])

    const updateRecommand = (fridId:number)=>{
        axiosAuthInstacne.put(`fridge/recommendable/${fridId}`)
            .then(()=>{
                setRefetcher(prev=>prev+1);
            });
    }

    const recommandRecipes = recommandRecipe?.map((recipe, inx) => (
        <Link className="inline-block" key={inx} href={`/recipe-detail/${recipe.recipeId}`}>
          <RecipeVerticalItem recipe={recipe}></RecipeVerticalItem>
        </Link>
    ));

    const fridgeCompSkeleton = [1, 2, 3, 4, 5, 6].map((fridge, inx)=>
        <div key={inx} className="aspect-square shadow-md border border-[#e1e1e1] rounded-xl m-1 p-2 overflow-hidden text-ellipsis bg-[#e1e1e1]">
        </div>
    )

    const fridgeComp = fridgeDate.map((fridge, inx)=>
        <Link href={`/fridge/${fridge.fridgeId}`} key={inx} className="aspect-square shadow-md border border-[#e1e1e1] rounded-xl m-1 p-2 overflow-hidden text-ellipsis">
            <h1 className="overflow-hidden text-ellipsis">{fridge.fridgeName}</h1>
            <p>{truncateString(fridge.description, 20)} </p>
        </Link>
    )

    const recommendFridgeComp = fridgeDate.map((fridge, inx)=>
        <span onClick={()=>updateRecommand(fridge.fridgeId)} className={`${fridge.recommendRecipeFlag?'bg-[#38C54B]':'bg-[#e1e1e1]'} p-1 ps-2 pe-2 m-1 rounded-xl whitespace-nowrap cursor-pointer`} key={inx}>{fridge.fridgeName}</span>
    )

    if(!isTokenValid) return <></>
    return (
        <>
        <div className="defaultInnerContainer flex flex-col justify-start items-center mt-3">
            <TitleDescription title={`나의 냉장고`} desc={'식재료를 저장하고, 관리하고, 낭김없이 사용해요.'}/>
            <section className="w-full max-w-[520px] min-w-[320px] grid grid-cols-3 p-6">
                {!initialSetted?fridgeCompSkeleton:fridgeComp}
                {initialSetted&&fridgeComp.length < 6 &&
                <Link href={"/fridge/create"} className="aspect-square flex justify-center items-center shadow-md border border-[#e1e1e1] rounded-xl m-1 p-2">
                    <h1 className="overflow-hidden text-ellipsis text-nowrap">
                        <AddIcon sx={{
                            width:"50px",
                            height:"50px"
                        }}/>
                    </h1>
                </Link>
                }
            </section>
            <div className="bottom-line w-[80%]"/>
            <section className="m-12 w-full">
                <div className="w-full text-start p-3">
                    <TitleDescription title={"레시피 추천"} desc={"내 냉장고 속 식재료가 포함된 레시피들이에요."} />
                    <div className="flex flex-wrap">{recommendFridgeComp}</div>
                    <div className="flex justify-between items-center my-2">
                        <div className="flex">
                            <span className="w-5 h-5 ms-2 me-1 bg-[#38C54B] block"/>포함
                            <span className="w-5 h-5 ms-2 me-1 bg-[#e1e1e1] block" />미포함
                        </div>
                        <p>포함된 식재료
                        <select
                            className="w-20 h-8 text-center bg-[#e1e1e1] rounded-full mx-1"
                            value={containIngre}
                            onChange={(evt) => {
                                setContainIngre(Number(evt.target.value))
                            }}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        개 이상</p>
                    </div>
                    <ul className="flex overflow-x-scroll h-[350px] no-scroll">
                        {
                            isLoading?
                            <div className="w-full text-center">
                                <CircularProgress />
                            </div>
                            :
                            recommandRecipes
                        }
                    </ul>
                </div>
            </section>
        </div>
        </>
    )
}