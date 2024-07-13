import { Box, Modal } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Recipe } from "@/app/(recipe)/types/recipeType";
import axios from "axios";
import RecipeHoriItem from "./RecipeHoriItem";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RecipeVerticalItem from "./RecipeVerticalItem";
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

function RecipeFinderModal({recipes, setRecipes}:{recipes:Recipe[], setRecipes:(recipes:Recipe[])=>void}){
    const [open, setOpen] = useState<boolean>(false);
    const [searchingTerm, setSearchingTerm] = useState<string>("");

    // const [selectedRecipe, setSelectedRecipe] = useState<Recipe[]>([]);
    const [searchedRecipe, setSearchedRecipe] = useState<Recipe[]>([]);
    
    /** 레시피 검색 */
    const handleSearchRecipe = ()=>{
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}recipe/conditions?recipeName=${searchingTerm}&sortingCondition=POPULARITY`)
            .then((res)=>{
                setSearchedRecipe(res.data);
            })
    }

    /** 엔터시 레시피 검색*/
    const handleEnterInput = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === "Enter") {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}recipe/conditions?recipeName=${searchingTerm}&sortingCondition=POPULARITY`)
            .then((res)=>{
                setSearchedRecipe(res.data);
            })
        }
    }

    const deleteRecipe = (inx:number)=>{
        const deletedRecipe = recipes.filter((_, index) => index !== inx);
        setRecipes(deletedRecipe);
    };

    /**모달 내 선택 가능한 아이템(검색된 아이템) */
    const searchedRecipeComps = searchedRecipe?.filter((ele) => {
        return !recipes.some((selected) => selected.recipeId === ele.recipeId);
      }).map((ele, inx) =>
        <RecipeHoriItem key={inx} recipe={ele} selectedRecipe={recipes} setSelectedRecipe={setRecipes} />
      );
      

      /**모달 내 선택된 아이템 */
    const selectedRecipeComps = recipes.map((ele, inx)=>
        <RecipeHoriItem key={inx} recipe={ele} selectedRecipe={recipes} setSelectedRecipe={setRecipes} />)


    /**선택 미리보기 */
    const selectedRecipeCardComps = recipes.map((ele, inx)=>
        <div key={inx} className="relative" onClick={()=>setOpen(true)}>
                <div className="w-full text-right">
                    <button onClick={(evt)=>{
                        deleteRecipe(inx);
                        evt.stopPropagation();
                        }} className="border-none w-5 h-5 mr-2 absolute -top-2 right-3 z-50">
                        <ClearIcon/>
                    </button>
                </div> 
            <RecipeVerticalItem key={inx} recipe={ele}/>
        </div>)

    return(
        <div className="w-full flex justify-start items-center overflow-x-scroll">
            {selectedRecipeCardComps}
            {
            recipes.length < 3 &&
            <button className="flex justify-center items-center border-[#d1d1d1] w-20 h-20 m-3" onClick={()=>setOpen(true)}>
                <AddIcon sx={{fill:'black', width:'2.5rem', height:'2.5rem'}}/>
            </button>
            }
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <div className="text-center">
                    <div className="flex justify-center items-center">
                        <h2>선택된 레시피</h2>
                        <Tooltip className="ml-2" title="레시피를 클릭하여 제거" arrow>
                            <HelpOutlineIcon/>
                        </Tooltip>
                    </div>
                    <div className="w-full min-h-16 max-h-72 overflow-y-scroll">
                        {selectedRecipeComps}
                    </div>
                    <div className="w-full max-h-72 flex flex-col justify-start items-center">
                        <div className="flex mt-2 mb-2 w-full relative">
                            <input onChange={(evt)=>setSearchingTerm(evt.target.value)}
                                type="text" value={searchingTerm}
                                onKeyDown={(evt)=>handleEnterInput(evt)}/>
                            <Tooltip className="absolute right-1" title="검색" arrow>
                                <button className="w-12 border-none" onClick={handleSearchRecipe}>
                                    <SearchIcon/>
                                </button>
                            </Tooltip>
                        </div>
                        <div className="flex justify-center items-center">
                            <h2>검색된 레시피</h2>
                            <Tooltip className="ml-2" title="레시피를 클릭하여 추가" arrow>
                                <HelpOutlineIcon/>
                            </Tooltip>
                        </div>
                        <div className="w-full h-72 overflow-y-scroll">
                            {searchedRecipeComps}
                        </div>
                    </div>
                </div>
                </Box>
            </Modal>
        </div>
    )
    
}

export default React.memo(RecipeFinderModal);