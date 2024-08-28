"use client";
import {
  FormControl,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeSearchingCondition, sortingCondition } from "@/app/(type)/search";
import { searchingConToQueryString } from "@/app/(commom)/DetailSearch";
import IngreBadgeSetter from "./IngreBadgeSetter";

export default function RecipeDetailSearch() {
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
    //and or 조건 추가

    router.push(`/recipes/1/${queryStr}`);
  };

  const goPrev = ()=>{
    router.back();
  }

  return (
    <main className={"w-full flex-col justify-center items-end max-w-4xl bg-white"}>
        <nav className="text-center w-full py-5 px-3 relative">
            <div onClick={goPrev} className="absolute left-5 cursor-pointer">
                <ArrowBackIosIcon />
            </div>
            <h1 className="text-xl ms-5">레시피 상세 검색</h1>
        </nav>
        <div className="bottom-line"/>
        <div className="w-full ps-4 pe-4">
            <section>
              <h3 className="w-full mt-10 text-start">
              레시피 이름
              </h3>
              <input
                name="recipeName"
                type="text"
                value={recipeSearchingData.recipeName || ""}
                onChange={(evt) => handleChangeSearchInput(evt)}
              />
            </section>
            <IngreBadgeSetter recipeSearchingData={recipeSearchingData} setRecipeSearchingData={setRecipeSearchingData} />
            <section>
              <h3 className="w-full mt-8 text-start">
              생성일 (입력 일자 이후)
              </h3>
              <input
                name="createdDate"
                type="date"
                value={
                  recipeSearchingData.createdDate === null
                    ? ""
                    : recipeSearchingData.createdDate.toString()
                }
                onChange={handleChangeSearchInput}
              />
            </section>
            <section className="flex justify-around items-center mt-12 flex-wrap">
              <div className="flex-1">
                <div className="w-full text-start">
                  <h3>요리 방법</h3>
                </div>
                <FormControl sx={{ width:"100%", marginRight:"0.5rem" }}>
                  <Select
                    name="cookMethod"
                    value={recipeSearchingData.cookMethod}
                    onChange={handleChangeSearchInput}
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
                <div className="w-full text-start">
                  <h3>카테고리</h3>
                </div>
                <FormControl sx={{ width:"100%", marginLeft:"0.5rem" }}>
                  <Select
                    labelId="categoryLabel"
                    name="cookCategory"
                    value={recipeSearchingData.cookCategory}
                    onChange={handleChangeSearchInput}
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
            <section className="flex items-center justify-around flex-wrap w-full mt-8">
                <div className="w-full flex-1">
                    <h3>요리양(인분)</h3>
                    <div className="w-full px-5 min-w-[125px]">
                        <Slider
                            name="serving"
                            min={1}
                            max={20}
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
                <div className="w-full flex-1">
                    <h3>정렬기준</h3>
                    <FormControl sx={{ minWidth: 120, width:"100%" }}>
                        <Select
                        labelId="sortingLabel"
                        name="sorting"
                        value={sortingCon}
                        onChange={(evt) => {
                            setSortingCon(evt.target.value as sortingCondition);
                        }}
                        >
                        <MenuItem value="POPULARITY">인기순</MenuItem>
                        <MenuItem value="LATEST">최신순</MenuItem>
                        <MenuItem value="LIKE_MANY">좋아요 많은순</MenuItem>
                        <MenuItem value="LIKE_FEW">좋아요 적은 순</MenuItem>
                        <MenuItem value="VIEW_MANY">조회수 많은 순</MenuItem>
                        <MenuItem value="VIEW_FEW">조회수 적은 순</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </section>
        </div>
        <div className="w-full flex justify-center mt-[100px] mb-[50px]">
          <button className="saveBtn me-2" onClick={submitCondition}>검색</button>
          <button className="darkgrayBtn ms-2" onClick={clearSearchingDate}>조건 초기화</button>
        </div>
    </main>
  )
}
