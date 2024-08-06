"use client"

import { RecipeSearchingCondition } from "@/app/(type)/search";
import React, { Dispatch, SetStateAction, useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';

interface IngreBadgeProp{
    recipeSearchingData:RecipeSearchingCondition,
    setRecipeSearchingData:Dispatch<SetStateAction<RecipeSearchingCondition>>
}

function IngreBadgeSetter({recipeSearchingData, setRecipeSearchingData}:IngreBadgeProp){
    const [ingreStr, setIngreStr] = useState<string>("");

    const addIngre = ()=>{
        if(ingreStr.length < 1) return;
        if(recipeSearchingData.ingredientNames !== null && recipeSearchingData.ingredientNames.length >= 10) return;
        
        setRecipeSearchingData(prev => ({
            ...prev,
            ingredientNames: prev.ingredientNames?[...prev.ingredientNames, ingreStr]:[ingreStr]
        }));
        setIngreStr("");
    }

    const removeIngre = (index:number) => {
        setRecipeSearchingData(prev => ({
          ...prev,
          ingredientNames: (prev.ingredientNames)? prev.ingredientNames.filter((_, i) => i !== index):null
        }));
      };

    const circleBtnColor = ingreStr?.length >= 1 ? "green" : "gray";
    const ingreBadges = recipeSearchingData.ingredientNames?.map((ingre, inx)=>{
        return (
            <span key={inx} className="flex justify-center items-center w-fit pe-8 bg-[#a1a1a1]  m-1 mt-2 text-white ps-1.5 rounded-md font-bold whitespace-nowrap relative">
                <div onClick={()=>removeIngre(inx)} className="cursor-pointer absolute right-0">
                    <ClearIcon/>
                </div>
                {ingre}
            </span>
        )
    })

    return (
        <section>
            <h3 className="w-full mt-8 text-start">
            재료
            </h3>
            <div className="relative flex justify-center items-center">
                <input
                className="pe-10"
                name="ingredient"
                type="text"
                onChange={(evt) => setIngreStr(evt.target.value)}
                onKeyDown ={(evt)=>{
                    if(evt.key === "Enter"){
                        evt.preventDefault();
                        addIngre();
                    }
                }}
                value={ingreStr}
                maxLength={20}
                placeholder="최대 10개"
                />
                <div onClick={addIngre} className="absolute right-2 cursor-pointer">
                    <AddCircleOutlineIcon sx={{fill:circleBtnColor, width:"30px", height:"30px"}}/>
                </div>
            </div>
            <section className="flex flex-wrap">  
                {ingreBadges}
            </section>
        </section>
    )
}

export default React.memo(IngreBadgeSetter);