import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { Recipe } from "@/app/(recipe)/types/recipeType";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Image from "next/image";
import React from "react";
import Swal from 'sweetalert2';

function RecipeHoriItem({recipe, selectedRecipe, setSelectedRecipe}:{recipe:Recipe, selectedRecipe:Recipe[], setSelectedRecipe:(recipe:Recipe[])=>void}){

    /**선택된 요소에 현재 요소가 있다면 삭제 후 true 리턴, 이외는 false */
    const delFromSelectedRecipe = ()=>{
        if(selectedRecipe.some((ele)=>ele.recipeId === recipe.recipeId)){
            setSelectedRecipe(selectedRecipe.filter((ele)=>ele.recipeId !== recipe.recipeId));

            return true;
        }
        return false;
    }


    /**현재 아이템을 선택된 아이템으로 변환, 선택된 아이템의 최대 수는 5*/
    const hadleSelectRecipe = ()=>{
        if(delFromSelectedRecipe()){
            return;
        }

        if(selectedRecipe.length >= 3){
            Swal.fire({
                title:"더 이상 추가할 수 없습니다.",
                text:"레시피는 최대 3개까지 선택 가능해요."
            }).then((result)=>{
                if(result.isConfirmed){
                    return;
                }
            })
        }
        else{
            setSelectedRecipe([...selectedRecipe, recipe]);
        }
    };

    return (
        <div onClick={()=>{hadleSelectRecipe()}} className=" w-full grid grid-cols-6 mt-2 p-3 shadow-md border border-[#e1e1e1] rounded-xl hover:bg-[#e1e1e1]">
            <div className="col-span-2 flex justify-center items-center">
                <div className='img-wrapper-square w-full h-full'>
                    {
                        recipe.repriPhotos[0]?
                        <Image className='inner-img' src={recipe.repriPhotos[0]} width={70} height={70} alt="ex" />
                        :
                        <MenuBookIcon className="inner-img"/>
                    }
                </div>
            </div>
            <div className="col-span-4 flex flex-col">
                <div>
                    <h1>{recipe.recipeName}</h1>
                </div>
                <div className="flex items-center justify-center text-sm mt-6 ">
                    <div className='flex'>
                        <svg width="40" height="23" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="13" cy="11" r="8" fill="transparent" stroke="black" stroke-width="3"/>
                        <circle cx="10" cy="11" r="3" fill="black"/>
                        <circle cx="26" cy="11" r="8" fill="transparent" stroke="black" stroke-width="3"/>
                        <circle cx="23" cy="11" r="3" fill="black"/>
                        </svg>
                        {recipe.viewCnt}
                    </div>
                    <div className='ms-2'>
                        <FavoriteIcon/>
                        <span className='ms-1'>{recipe?.likeCnt}</span>
                    </div>
                    <div className='ms-2'>
                        <CommentIcon/>
                        <span className='ms-1'>{recipe?.reviewCnt}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(RecipeHoriItem);