import { Box, Modal } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { Recipe } from "@/app/(recipe)/types/recipeType";
import RecipeHoriItem from "./RecipeHoriItem";
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RecipeVerticalItem from "./RecipeVerticalItem";
import ClearIcon from '@mui/icons-material/Clear';
import { useInView } from 'react-intersection-observer';
import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { IndexPagenation } from "@/app/(type)/Pagenation";
import { CircularProgress } from "@mui/material";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    maxWidth:450,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    dispay:'relative'
  };

function RecipeFinderModal({recipes, setRecipes}:{recipes:Recipe[], setRecipes:(recipes:Recipe[])=>void}){
    const [open, setOpen] = useState<boolean>(false);
    const [searchingTerm, setSearchingTerm] = useState<string>("");

    const [myRecipe, setMyRecipe] = useState<IndexPagenation<Recipe[], string>>({
        isEnd:false,
        index:"",
        data:[]
    });

    const [searchedRecipe, setSearchedRecipe] = useState<IndexPagenation<Recipe[], number>>({
        isEnd:false,
        index:Number.MAX_SAFE_INTEGER,
        data:[]
    });

    const [isSearchMode, setSearchMode] = useState<boolean>(false);
    const [reSearchToggle, setResearchToggle] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [viewRef, inview] = useInView();

    /** 레시피 검색 */
    const handleSearchRecipe = ()=>{
        setSearchMode(true);
        setResearchToggle((prev)=>!prev)
    }

    /** 엔터시 레시피 검색*/
    const handleEnterInput = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        if (e.key === "Enter") {
            setSearchMode(true);
            setResearchToggle((prev)=>!prev)
        }
    }

    /** 내 레시피 보기 */
    const showMyRecipe = ()=>{
        setSearchingTerm("");
        setIsLoading(true);
        defaultAxios.get("recipe/my-recipe/inx-pagination", { 
            params:{
                dateInx:"",
                size:10
            }
        }).then((res)=>{
            setMyRecipe(res.data);
            setSearchMode(false);
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    const deleteRecipe = (inx:number)=>{
        const deletedRecipe = recipes.filter((_, index) => index !== inx);
        setRecipes(deletedRecipe);
    };

    //for pagination
    useEffect(()=>{
        if(isLoading) return;
        if(!isSearchMode && inview && !myRecipe.isEnd){
            defaultAxios.get("recipe/my-recipe/inx-pagination", { 
                params:{
                    dateInx:myRecipe?.index,
                    size:10
                }
            }).then((res)=>{
                setMyRecipe(prev=>({
                    isEnd:res.data.isEnd,
                    index:res.data.index,
                    data:[...prev.data, ...res.data.data]
                }));
            })
        }

        //isEnd는 검색시 새로 받아온 데이터로 다시 세팅됨
        if(isSearchMode && inview && !searchedRecipe.isEnd){
            defaultAxios.get("recipe/searchingTerm/inx-pagination", { 
                params:{
                    searchingTerm:searchingTerm,
                    inx:searchedRecipe?.index,
                    size:10
                }
            }).then((res)=>{
                setSearchedRecipe(prev=>({
                    isEnd:res.data.isEnd,
                    index:res.data.index,
                    data:[...prev.data, ...res.data.data]
                }));
            })       
        }

    }, [inview, isLoading])


    //for search
    useEffect(()=>{
        if(isSearchMode){
            setIsLoading(true);
            defaultAxios.get("recipe/searchingTerm/inx-pagination", { 
                params:{
                    searchingTerm:searchingTerm,
                    inx:Number.MAX_SAFE_INTEGER,
                    size:10
                }
            }).then((res)=>{
                setSearchMode(true);
                setSearchedRecipe(res.data);
                setSearchingTerm("");
            }) 
            .finally(()=>{
                setIsLoading(false); 
            })
        }
    }, [reSearchToggle])


    /**모달 내 선택 가능한 아이템(나의 레시피) */
    const searchedMyRecipeComps = myRecipe?.data.filter((ele) => {
        return !recipes.some((selected) => selected.recipeId === ele.recipeId);
    }).map((ele, inx) =>
    <RecipeHoriItem key={inx} recipe={ele} selectedRecipe={recipes} setSelectedRecipe={setRecipes} />
    );
    

    /**모달 내 선택 가능한 아이템(검색된 레시피) */
    const searchedRecipeComps = searchedRecipe?.data.filter((ele) => {
        return !recipes.some((selected) => selected.recipeId === ele.recipeId);
    }).map((ele, inx) =>
    <RecipeHoriItem key={inx} recipe={ele} selectedRecipe={recipes} setSelectedRecipe={setRecipes} />
    );
      

    /**모달 내 선택한 레시피 */
    const selectedRecipeComps = recipes.map((ele, inx)=>
        <span key={inx} className="flex justify-center items-center w-fit pe-8 bg-[#a1a1a1]  m-1 mt-2 text-white ps-1.5 rounded-md font-bold whitespace-nowrap relative">
            <div onClick={()=>delFromSelectedRecipe(ele)} className="cursor-pointer absolute right-0">
                <ClearIcon/>
            </div>
            {ele.recipeName}
        </span>
    )

    /**선택된 요소에 현재 요소가 있다면 삭제 후 true 리턴, 이외는 false */
    const delFromSelectedRecipe = (clickedRecipe:Recipe)=>{
        if(recipes.some((ele)=>ele.recipeId === clickedRecipe.recipeId)){
            setRecipes(recipes.filter((ele)=>ele.recipeId !== clickedRecipe.recipeId));

            return true;
        }
        return false;
    }
    

    /**선택 미리보기 */
    const selectedRecipeCardComps = recipes.map((ele, inx)=>
        <div key={inx} className="relative" onClick={()=>setOpen(true)}>
                <div className="w-full text-right">
                    <button onClick={(evt)=>{
                        deleteRecipe(inx);
                        evt.stopPropagation();
                        }} className="border-none w-5 h-5 absolute -top-2 right-3 z-50">
                        <ClearIcon className="bg-white"/>
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
                    <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>setOpen(false)}>
                        <ClearIcon/>
                    </div>
                    <div className="text-center">
                        <div className="w-full flex flex-col justify-start items-center">
                            <section className="flex-col mt-2 mb-8 w-full relative">
                                <div className="w-full text-start">
                                    <h2>레시피 검색</h2>
                                </div>
                                <input onChange={(evt)=>setSearchingTerm(evt.target.value)}
                                    type="text" value={searchingTerm}
                                    onKeyDown={(evt)=>handleEnterInput(evt)}/>
                                <Tooltip className="absolute right-1" title="검색" arrow>
                                    <button className="w-12 border-none" onClick={handleSearchRecipe}>
                                        <SearchIcon/>
                                    </button>
                                </Tooltip>
                                <div className="text-center">
                                    <button className="saveBtn-outline-green mt-2 p-1" onClick={showMyRecipe}>내 레시피 보기</button>
                                </div>
                                <div className="flex flex-wrap">
                                    {selectedRecipeComps}
                                </div>
                            </section>
                            <div className="w-full flex justify-start items-center">
                                <h2>{isSearchMode?'검색된 레시피':'내 레시피'}</h2>
                                <Tooltip className="ml-2 mb-1" title="레시피를 클릭하여 추가" arrow>
                                    <HelpOutlineIcon/>
                                </Tooltip>
                            </div>
                            <section className="w-full h-80 overflow-y-scroll">
                                {}
                                {!isLoading && !isSearchMode && searchedMyRecipeComps}
                                {!isLoading && isSearchMode && searchedRecipeComps}
                                {isLoading && <CircularProgress className="mt-[100px]"/>}
                                <div ref={viewRef}></div>
                            </section>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
    
}

export default React.memo(RecipeFinderModal);