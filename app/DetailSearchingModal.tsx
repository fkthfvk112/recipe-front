"use client";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { RecipeSearchingCondition, sortingCondition } from "./(type)/search";
import { searchingConToQueryString } from "./(commom)/DetailSearch";
import { useRouter } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';

interface DetailProp {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}


export default function DetailSearchingModal({
  isOpen,
  setIsOpen,
}: DetailProp) {
  const router = useRouter();

  const [ingreCsv, setIngreCsv] = useState<string>("");
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

  const clearSearchingDate = (name: string) => {
    setRecipeSearchingData({
      ...recipeSearchingData,
      [name]: null,
    });
  };

  const submitCondition = () => {
    let searchData: RecipeSearchingCondition = { ...recipeSearchingData };
    let ingres: string = ingreCsv;

    if (searchData.recipeName === ""){
      searchData.recipeName = null;
    }

    if(searchData.cookCategory === "default"){
      searchData.cookCategory = null;
    }
      
    if(searchData.cookMethod === "default"){
      searchData.cookMethod = null;
    }

    if (ingres === ""){
      searchData.ingredientNames = null;
    }
      
    if (ingres !== "") {
      searchData.ingredientNames = ingres
        .split(",")
        .map((ingre) => ingre.trim());
    }
    let queryStr: string = searchingConToQueryString(searchData, sortingCon);
    //have to edit 구현 완료
    //and or 조건 추가

    router.push(`/recipes/1/${queryStr}`);
  };

  return isOpen ? (
    <div
      className={
        "fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-50 z-10"
      }
      onClick={() => setIsOpen(false)}
    >
      <section
        className="min-w-[280px] max-w-[420px] w-full bg-white z-20 p-2"
        onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full">
            <button onClick={()=>setIsOpen(false)} className="closeBtnParent">
                <CloseIcon/>
            </button>
            <h1 className="m-2 mb-2 text-xl">레시피 상세 검색</h1>
          </div>
          <div className="bottom-line"/>
          <div className="w-full ps-4 pe-4 max-h-[80vh] overflow-y-scroll overflow-x-hidden">
            <div>
              <h3 className="w-full mt-6 text-start">
              레시피 이름
              </h3>
              <input
                name="recipeName"
                type="text"
                value={recipeSearchingData.recipeName || ""}
                onChange={(evt) => handleChangeSearchInput(evt)}
              />
            </div>
            <div>
              <h3 className="w-full mt-6 text-start">
              재료
              </h3>
              <input
                name="ingredient"
                type="text"
                onChange={(evt) => setIngreCsv(evt.target.value)}
                value={ingreCsv}
              />
            </div>
            <div>
              <h3 className="w-full mt-6 text-start">
              생성일
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
            </div>
            <div className="flex justify-around items-center m-8">
              <div>
                <div className="w-full mt-6 text-start">
                  <h3>요리 방법</h3>
                </div>
                <FormControl sx={{ minWidth: 120 }}>
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
              <div>
                <div className="w-full mt-6 text-start">
                  <h3>카테고리</h3>
                </div>
                <FormControl sx={{minWidth: 120 }}>
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
            </div>
            <div>
              <div className="flex items-center justify-center w-full">
                <div>인분(serving)</div>
              </div>
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
                disableSwap
              />
            </div>
            <div>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
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
        </div>
        <div className="m-3">
          <button className="saveBtn me-2" onClick={submitCondition}>검색</button>
          <button className="darkgrayBtn ms-2">조건 초기화</button>
        </div>
      </section>
    </div>
  ) : (
    <></>
  );
}
