"use client";
import {
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

interface DetailProp {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface DisableCheckInputs {
  recipeName: boolean;
  createdDate: boolean;
  cookMethod: boolean;
  ingredient: boolean;
  serving: boolean;
  cookCategory: boolean;
}

export default function DetailSearchingModal({
  isOpen,
  setIsOpen,
}: DetailProp) {
  const router = useRouter();
  const [disableInput, setDisableInput] = useState<DisableCheckInputs>({
    recipeName: false,
    createdDate: false,
    cookMethod: false,
    ingredient: false,
    serving: false,
    cookCategory: false,
  });
  const [ingreCsv, setIngreCsv] = useState<string>("");
  const [sortingCon, setSortingCon] = useState<sortingCondition>("POPULARITY");

  const [recipeSearchingData, setRecipeSearchingData] =
    useState<RecipeSearchingCondition>({
      recipeName: null,
      createdDate: null,
      cookMethod: null,
      ingredientNames: null,
      ingredientAndCon: null,
      servingCon: {
        min: 1,
        max: 20,
      },
      cookCategory: null,
    });

  console.log(recipeSearchingData);
  const handleChangeSearchInput = (evt: any) => {
    const { name, value } = evt.target;
    console.log(name);
    console.log(value);

    setRecipeSearchingData({
      ...recipeSearchingData,
      [name]: value,
    });
  };

  const handleCheckChange = (evt: any) => {
    const { checked, name } = evt.target;
    if (!checked) {
      clearSearchingDate(name);
    }

    setDisableInput({
      ...disableInput,
      [name]: checked,
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

    if (searchData.recipeName === "" || disableInput.recipeName === false)
      searchData.cookCategory = null;
    if (ingres === "" || disableInput.ingredient === false)
      searchData.ingredientNames = null;

    let ingreList: string[] = [];
    if (ingres !== "") {
      searchData.ingredientNames = ingres
        .split(",")
        .map((ingre) => ingre.trim());
    }
    let queryStr: string = searchingConToQueryString(searchData, sortingCon);
    alert(queryStr);
    //have to edit 구현 완료
    //and or 조건 추가

    router.push(`recipes/1/${queryStr}`);
    console.log(ingreList);
  };

  return isOpen ? (
    <div
      className={
        "fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-50 z-10"
      }
      onClick={() => setIsOpen(false)}
    >
      <section
        style={{ maxWidth: "60rem" }}
        className="w-1/2 min-w-80 bg-white z-20 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h1>레시피 상세 검색</h1>
        <div>
          <div className="flex items-center justify-center w-full">
            <div>레시피 이름</div>
            <input
              name="recipeName"
              checked={disableInput.recipeName}
              onChange={handleCheckChange}
              type="checkbox"
              className="w-10"
            />
          </div>
          <input
            name="recipeName"
            type="text"
            value={recipeSearchingData.recipeName || ""}
            onChange={(evt) => handleChangeSearchInput(evt)}
            disabled={!disableInput.recipeName}
          />
        </div>
        <div>
          <div className="flex items-center justify-center w-full">
            <div>재료</div>
            <input
              name="ingredient"
              checked={disableInput.ingredient}
              onChange={(evt) => {
                handleCheckChange(evt);
                setIngreCsv("");
              }}
              type="checkbox"
              className="w-10"
            />
          </div>
          <input
            name="ingredient"
            type="text"
            onChange={(evt) => setIngreCsv(evt.target.value)}
            value={ingreCsv}
            disabled={!disableInput.ingredient}
          />
        </div>

        <div>
          <div className="flex items-center justify-center w-full">
            <div>생성일</div>
            <input
              name="createdDate"
              checked={disableInput.createdDate}
              onChange={handleCheckChange}
              type="checkbox"
              className="w-10"
            />
          </div>
          <input
            name="createdDate"
            type="date"
            disabled={!disableInput.createdDate}
            value={
              recipeSearchingData.createdDate === null
                ? ""
                : recipeSearchingData.createdDate.toString()
            }
            onChange={handleChangeSearchInput}
          />
        </div>
        <div className="flex justify-center items-center m-8">
          <div>
            <div className="flex items-center justify-center w-full">
              <div>요리 방법</div>

              <input
                name="cookMethod"
                checked={disableInput.cookMethod}
                onChange={handleCheckChange}
                type="checkbox"
                className="w-10"
              />
            </div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                name="cookMethod"
                value={recipeSearchingData.cookMethod || ""}
                disabled={!disableInput.cookMethod}
                onChange={handleChangeSearchInput}
              >
                <MenuItem value="">선택없음</MenuItem>
                <MenuItem value="굽기">굽기</MenuItem>
                <MenuItem value="볶기">볶기</MenuItem>
                <MenuItem value="삶기">삶기</MenuItem>
                <MenuItem value="찌기">찌기</MenuItem>
                <MenuItem value="튀기기">튀기기</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <div className="flex items-center justify-center w-full">
              <div>카테고리</div>

              <input
                name="cookCategory"
                checked={disableInput.cookCategory}
                onChange={handleCheckChange}
                type="checkbox"
                className="w-10"
              />
            </div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                labelId="categoryLabel"
                name="cookCategory"
                value={recipeSearchingData.cookCategory || ""}
                disabled={!disableInput.cookCategory}
                onChange={handleChangeSearchInput}
              >
                <MenuItem value="">선택없음</MenuItem>
                <MenuItem value="한식">한식</MenuItem>
                <MenuItem value="중식">중식</MenuItem>
                <MenuItem value="양식">양식</MenuItem>
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
            <input
              name="serving"
              checked={disableInput.serving}
              onChange={handleCheckChange}
              type="checkbox"
              className="w-10"
            />
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
            disabled={!disableInput.serving}
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
              <MenuItem value="LIKE_MANY">좋아요 많은순</MenuItem>
              <MenuItem value="LIKE_FEW">좋아요 적은 순</MenuItem>
              <MenuItem value="VIEW_MANY">조회수 많은 순</MenuItem>
              <MenuItem value="VIEW_FEW">조회수 적은 순</MenuItem>
            </Select>
          </FormControl>
        </div>
        <button onClick={submitCondition}>검색</button>
        <button>조건 초기화</button>
      </section>
    </div>
  ) : (
    <></>
  );
}
