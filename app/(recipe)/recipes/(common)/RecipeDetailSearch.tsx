"use client";
import {
    Box,
  FormControl,
  MenuItem,
  Modal,
  Select,
  Slider,
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeSearchingCondition, sortingCondition } from "@/app/(type)/search";
import { searchingConToQueryString } from "@/app/(commom)/DetailSearch";
import IngreBadgeSetter from "@/app/(recipe-search)/search/recipe-detail/IngreBadgeSetter";
import Button from "@/app/(commom)/Component/Button";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    maxWidth:450,
    minWidth:280,
    bgcolor: "background.paper",
    borderRadius: "1.25rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    p: 4,
    border: "none",
    outline: "none"
};

export default function RecipeDetailSearch({modalOpen, setModalOpen}:{modalOpen:boolean, setModalOpen:(data:any)=>any}) {
  const router = useRouter();
  const [sortingCon, setSortingCon] = useState<sortingCondition>("POPULARITY");

  const [recipeSearchingData, setRecipeSearchingData] =
    useState<RecipeSearchingCondition>({
      recipeName: null,
      createdDate: null,
      cookMethod: "default",
      ingredientNames: null,
      ingredientAndCon: null,
      servingCon: {
        min: 1,
        max: 20,
      },
      cookCategory: "default",
    });

  const handleChangeSearchInput = (evt: any) => {
    const { name, value } = evt.target;

    setRecipeSearchingData({
      ...recipeSearchingData,
      [name]: value,
    });
  };


  const handleSlideChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (
      recipeSearchingData.servingCon === null ||
      recipeSearchingData.servingCon === undefined
    )
      return;

    const originMin: number = recipeSearchingData.servingCon.min;
    const originMax: number = recipeSearchingData.servingCon.max;
    if (activeThumb === 0) {
      setRecipeSearchingData({
        ...recipeSearchingData,
        servingCon: {
          ...recipeSearchingData.servingCon,
          min: Math.min(newValue[0], originMax - 1),
        },
      });
    } else {
      setRecipeSearchingData({
        ...recipeSearchingData,
        servingCon: {
          ...recipeSearchingData.servingCon,
          max: Math.max(newValue[1], originMin + 1),
        },
      });
    }
  };

  const clearSearchingDate = () => {
    setRecipeSearchingData({
        recipeName: null,
        createdDate: null,
        cookMethod: "default",
        ingredientNames: null,
        ingredientAndCon: null,
        servingCon: {
          min: 1,
          max: 20,
        },
        cookCategory: "default",
      });
      setSortingCon("POPULARITY");
  };

  const submitCondition = () => {
    let searchData: RecipeSearchingCondition = { ...recipeSearchingData };
    if (searchData.recipeName === ""){
      searchData.recipeName = null;
    }

    if(searchData.cookCategory === "default"){
      searchData.cookCategory = null;
    }
      
    if(searchData.cookMethod === "default"){
      searchData.cookMethod = null;
    }

    let queryStr: string = searchingConToQueryString(searchData, sortingCon);
    //have to edit 구현 완료

    router.push(`/recipes/1/${queryStr}`);
  };

  return (
    <Modal
        open={modalOpen}
        onClose={() => {
            setModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
            <main className={"w-full flex flex-col justify-center items-end max-w-4xl bg-white"}>
                <nav className="text-center w-full pt-2 pb-2 relative flex items-center justify-center">
                    <div onClick={()=>setModalOpen(false)} className="absolute left-1 cursor-pointer text-gray-400 hover:text-mugin-primary hover:scale-110 transition-all duration-200">
                        <ArrowBackIosIcon sx={{ fontSize: 20, color: "currentColor" }} />
                    </div>
                    <h1 className="text-lg font-bold text-gray-800">레시피 상세 검색</h1>
                </nav>
                <div className="w-full border-b border-gray-100 my-3"/>
                <div className="w-full">
                    <section className="mb-4">
                      <h3 className="w-full text-start text-sm font-bold text-gray-700 mb-2">
                        레시피 이름
                      </h3>
                      <input
                          name="recipeName"
                          type="text"
                          className="mugin-input"
                          placeholder="레시피 이름 입력..."
                          value={recipeSearchingData.recipeName || ""}
                          onChange={(evt) => handleChangeSearchInput(evt)}
                      />
                    </section>
                    
                    <div className="mb-4">
                      <IngreBadgeSetter recipeSearchingData={recipeSearchingData} setRecipeSearchingData={setRecipeSearchingData} />
                    </div>

                    <section className="mb-4">
                      <h3 className="w-full text-start text-sm font-bold text-gray-700 mb-2">
                        생성일 (입력 일자 이후)
                      </h3>
                      <input
                          name="createdDate"
                          type="date"
                          className="mugin-input"
                          value={
                          recipeSearchingData.createdDate === null
                              ? ""
                              : recipeSearchingData.createdDate.toString()
                          }
                          onChange={handleChangeSearchInput}
                      />
                    </section>
                    
                    <section className="flex justify-between items-center gap-4 mt-6 mb-4">
                      <div className="flex-1">
                          <h3 className="w-full text-start text-sm font-bold text-gray-700 mb-2">요리 방법</h3>
                          <FormControl sx={{ width:"100%" }}>
                          <Select
                              name="cookMethod"
                              value={recipeSearchingData.cookMethod}
                              onChange={handleChangeSearchInput}
                              sx={{ 
                                borderRadius: "0.75rem", 
                                fontSize: "0.875rem",
                                height: "42px",
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#FF7043',
                                }
                              }}
                          >
                              <MenuItem value="default">선택없음</MenuItem>
                              <MenuItem value="굽기">굽기</MenuItem>
                              <MenuItem value="볶기">볶기</MenuItem>
                              <MenuItem value="삶기">삶기</MenuItem>
                              <MenuItem value="찌기">찌기</MenuItem>
                              <MenuItem value="튀기기">튀기기</MenuItem>
                          </Select>
                          </FormControl>
                      </div>
                      <div className="flex-1">
                          <h3 className="w-full text-start text-sm font-bold text-gray-700 mb-2">카테고리</h3>
                          <FormControl sx={{ width:"100%" }}>
                          <Select
                              labelId="categoryLabel"
                              name="cookCategory"
                              value={recipeSearchingData.cookCategory}
                              onChange={handleChangeSearchInput}
                              sx={{ 
                                borderRadius: "0.75rem", 
                                fontSize: "0.875rem",
                                height: "42px",
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#FF7043',
                                }
                              }}
                          >
                              <MenuItem value="default">선택없음</MenuItem>
                              <MenuItem value="한식">한식</MenuItem>
                              <MenuItem value="중식">중식</MenuItem>
                              <MenuItem value="양식">양식</MenuItem>
                              <MenuItem value="일식">일식</MenuItem>
                              <MenuItem value="분식">분식</MenuItem>
                              <MenuItem value="후식">후식</MenuItem>
                              <MenuItem value="건강식">건강식</MenuItem>
                          </Select>
                          </FormControl>
                      </div>
                    </section>

                    <section className="flex items-center justify-between gap-4 mt-6 w-full">
                        <div className="flex-1">
                            <h3 className="w-full text-start text-sm font-bold text-gray-700 mb-2">요리양(인분)</h3>
                            <div className="w-full px-2">
                                <Slider
                                    name="serving"
                                    min={1}
                                    max={20}
                                    sx={{ color: '#FF7043' }}
                                    getAriaLabel={() => "Minimum distance shift"}
                                    onChange={handleSlideChange}
                                    value={[
                                    recipeSearchingData?.servingCon?.min === undefined
                                        ? 0
                                        : recipeSearchingData?.servingCon?.min,
                                    recipeSearchingData?.servingCon?.max === undefined
                                        ? 0
                                        : recipeSearchingData?.servingCon?.max,
                                    ]}
                                    valueLabelDisplay="auto"
                                    disableSwap/>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="w-full text-start text-sm font-bold text-gray-700 mb-2">정렬기준</h3>
                            <FormControl sx={{ width:"100%" }}>
                                <Select
                                  labelId="sortingLabel"
                                  name="sorting"
                                  value={sortingCon}
                                  onChange={(evt) => {
                                      setSortingCon(evt.target.value as sortingCondition);
                                  }}
                                  sx={{ 
                                    borderRadius: "0.75rem", 
                                    fontSize: "0.875rem",
                                    height: "42px",
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#FF7043',
                                    }
                                  }}
                                >
                                <MenuItem value="POPULARITY">인기순</MenuItem>
                                <MenuItem value="LATEST">최신순</MenuItem>
                                <MenuItem value="LIKE_MANY">좋아요 많은순</MenuItem>
                                <MenuItem value="LIKE_FEW">좋아요 적은순</MenuItem>
                                <MenuItem value="VIEW_MANY">조회수 많은순</MenuItem>
                                <MenuItem value="VIEW_FEW">조회수 적은순</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </section>
                </div>
                <div className="w-full flex justify-center mt-10 mb-2 gap-3">
                    <Button variant="primary" className="flex-1 max-w-[160px]" onClick={()=>{submitCondition(); setModalOpen(false)}}>검색</Button>
                    <Button variant="outline-neutral" className="flex-1 max-w-[160px]" onClick={clearSearchingDate}>초기화</Button>
                </div>
            </main>
        </Box> 
    </Modal>
  )
}
