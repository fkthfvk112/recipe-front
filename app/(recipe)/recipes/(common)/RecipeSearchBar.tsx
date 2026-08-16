"use client";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { usePathname, useRouter } from "next/navigation";
import { RecipeSearchingCondition, sortingCondition } from "@/app/(type)/search";
import { searchingConToQueryString } from "@/app/(commom)/DetailSearch";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { fetchFridgeDetail } from "@/app/(api)/fridge";
import { useRecoilState } from "recoil";
import { siginInState } from "@/app/(recoil)/recoilAtom";

import RecipeFilterPopovers from "./RecipeFilterPopovers";
import IngredientSearchModal from "./IngredientSearchModal";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import { formatDateYYYYMMDD } from "@/app/(utils)/DateUtil";

// Helper for Sorting condition label
const getSortingLabel = (sort: sortingCondition) => {
  switch (sort) {
    case "POPULARITY": return "인기순";
    case "LATEST": return "최신순";
    case "LIKE_FEW": return "오래된순";
    case "LIKE_MANY": return "좋아요 많은순";
    case "VIEW_MANY": return "조회수 많은순";
    case "VIEW_FEW": return "조회수 적은순";
    default: return "인기순";
  }
};

export default function RecipeSearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSignIn] = useRecoilState(siginInState);

  // Parse searchingTerm from URL
  const searchingTerm = 'searchingTerm=';
  const isPresent = pathname.includes(searchingTerm);
  const searchingValue = isPresent ? pathname.split(`${searchingTerm}`)[1].split('&')[0] : null;

  const [searchingData, setSearchingData] = useState<string>(decodeURIComponent(searchingValue || ""));

  // Active popover modal states
  const [activePopover, setActivePopover] = useState<"filter" | "category" | "sort" | "tag" | null>(null);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState<boolean>(false);

  // Detail search values mirroring Mug-in's exact properties
  const [sortingCon, setSortingCon] = useState<sortingCondition>("POPULARITY");
  const [recipeSearchingData, setRecipeSearchingData] = useState<RecipeSearchingCondition>({
    recipeName: null,
    createdDate: null,
    cookMethod: "default",
    ingredientNames: null,
    ingredientAndCon: null,
    servingCon: { min: 1, max: 20 },
    cookCategory: "default",
  });

  // Slider local states
  const [servingsRange, setServingsRange] = useState<number[]>([1, 20]);

  // User Fridge item list fetched from DB
  const [fridgeIngredients, setFridgeIngredients] = useState<string[]>([]);
  
  // Selected ingredients inside modal
  const [modalIngredients, setModalIngredients] = useState<string[]>([]);

  // Ref wrapper for outside clicks
  const barWrapperRef = useRef<HTMLDivElement>(null);

  const {layoutMargin} = useResponsiveDesignCss();

  // Sync state with url on mount/navigate
  useEffect(() => {
    if (!pathname) return;
    const last = pathname.split("/").at(-1);
    if (!last) return;
    const queryStrings = last.split("&");

    const map = new Map();
    queryStrings.forEach(query => {
      const nameVal = query.split("=");
      if (nameVal.length === 2) {
        const existingValues = map.get(nameVal[0]) || [];
        map.set(nameVal[0], [...existingValues, nameVal[1]]);
      }
    });

    const recName = map.get("recipeName")?.[0] ? decodeURIComponent(map.get("recipeName")[0]) : null;
    
    const crDateString = map.get("createdDate")?.[0] ? decodeURIComponent(map.get("createdDate")[0]) : null;
    const crDate = crDateString || null;

    const cMethod = (map.get("cookMethod")?.[0] ? decodeURIComponent(map.get("cookMethod")[0]) : "default") as RecipeSearchingCondition["cookMethod"];
    const cCategory = (map.get("cookCategory")?.[0] ? decodeURIComponent(map.get("cookCategory")[0]) : "default") as RecipeSearchingCondition["cookCategory"];
    
    const sMin = map.get("servingsMin")?.[0] ? Number(map.get("servingsMin")[0]) : 1;
    const sMax = map.get("servingsMax")?.[0] ? Number(map.get("servingsMax")[0]) : 20;
    const ingNames = map.get("ingredientNames") ? map.get("ingredientNames").map((val: string) => decodeURIComponent(val)) : null;
    const sortCondition = (map.get("sortingCondition")?.[0] || "POPULARITY") as sortingCondition;

    setRecipeSearchingData({
      recipeName: recName,
      createdDate: crDate as any, 
      cookMethod: cMethod,
      ingredientNames: ingNames,
      ingredientAndCon: null,
      servingCon: { min: sMin, max: sMax },
      cookCategory: cCategory,
    });
    setServingsRange([sMin, sMax]);
    setSortingCon(sortCondition);
    if (ingNames) {
      setModalIngredients(ingNames);
    } else {
      setModalIngredients([]);
    }
  }, [pathname]);

  // Fetch Fridge items for logged-in user dynamically using official API
  useEffect(() => {
    if (isSignIn) {
      axiosAuthInstacne.get("fridge/my")
        .then((res) => {
          const fridges = res.data;
          if (fridges && Array.isArray(fridges) && fridges.length > 0) {
            Promise.all(
              fridges.map((f: any) => fetchFridgeDetail(f.fridgeId, 0))
            ).then((details) => {
              const loadedItems: string[] = [];
              details.forEach((det: any) => {
                det?.fridgeItems?.forEach((item: any) => {
                  if (item.name && !loadedItems.includes(item.name)) {
                    loadedItems.push(item.name);
                  }
                });
              });
              setFridgeIngredients(loadedItems);
            }).catch(err => console.log("Fridge details fetch error", err));
          }
        }).catch(err => console.log("My Fridge fetch error", err));
    }
  }, [isSignIn]);

  // Detect clicks outside of popover box (including search bar itself)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!activePopover) return;
      const target = event.target as HTMLElement;
      if (target.closest('.recipe-popover-box') || target.closest('.recipe-popover-btn')) {
        return;
      }
      setActivePopover(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopover]);

  const togglePopover = (popover: "filter" | "category" | "sort" | "tag") => {
    setActivePopover(prev => (prev === popover ? null : popover));
  };

  const applyQuery = useCallback((updatedData = recipeSearchingData, updatedSort = sortingCon) => {
    let searchData = { ...updatedData };
    if (searchData.recipeName === "") searchData.recipeName = null;
    if (searchData.cookCategory === "default") searchData.cookCategory = null;
    if (searchData.cookMethod === "default") searchData.cookMethod = null;

    if (searchingData.length > 0) {
      searchData.recipeName = searchingData;
    }

    const queryStr = searchingConToQueryString(searchData, updatedSort);
    const basePath = pathname.includes("/recipes/simple/") ? "/recipes/simple/1" : "/recipes/1";
    const finalPath = `${basePath}/${queryStr || "sortingCondition=POPULARITY"}`;
    
    setActivePopover(null);
    router.push(finalPath);
  }, [recipeSearchingData, sortingCon, searchingData, pathname, router]);

  const searchTerm = () => {
    if (searchingData.length <= 0) {
      Swal.fire({ title: "검색어를 입력해주세요.", icon: "warning", confirmButtonText: "확인", confirmButtonColor: '#1c7c54' });
      return;
    }
    applyQuery();
  };

  const clearFilters = () => {
    setRecipeSearchingData({
      recipeName: null,
      createdDate: null,
      cookMethod: "default",
      ingredientNames: null,
      ingredientAndCon: null,
      servingCon: { min: 1, max: 20 },
      cookCategory: "default",
    });
    setSortingCon("POPULARITY");
    setServingsRange([1, 20]);
    setSearchingData("");
    setModalIngredients([]);
    setActivePopover(null);
    setIsIngredientModalOpen(false);
    router.push(`/recipes/1/sortingCondition=POPULARITY`);
  };

  const removeAppliedFilter = useCallback((key: string, value: string) => {
    if (key === "ingredientNames") {
      const ingList = recipeSearchingData.ingredientNames?.filter(v => v !== value) || [];
      const updated = {
        ...recipeSearchingData,
        ingredientNames: ingList.length > 0 ? ingList : null
      };
      setModalIngredients(ingList.length > 0 ? ingList : []);
      applyQuery(updated);
    } else if (key === "cookCategory") {
      applyQuery({ ...recipeSearchingData, cookCategory: "default" as RecipeSearchingCondition["cookCategory"] });
    } else if (key === "cookMethod") {
      applyQuery({ ...recipeSearchingData, cookMethod: "default" as RecipeSearchingCondition["cookMethod"] });
    } else if (key === "recipeName") {
      setSearchingData("");
      applyQuery({ ...recipeSearchingData, recipeName: null });
    } else if (key === "createdDate") {
      applyQuery({ ...recipeSearchingData, createdDate: null });
    } else if (key === "servingCon") {
      setServingsRange([1, 20]);
      applyQuery({ ...recipeSearchingData, servingCon: { min: 1, max: 20 } });
    }
  }, [recipeSearchingData, applyQuery]);

  const submitIngredientSearch = () => {
    const updated = {
      ...recipeSearchingData,
      ingredientNames: modalIngredients.length > 0 ? modalIngredients : null
    };
    setIsIngredientModalOpen(false);
    applyQuery(updated);
  };

  const handleDetailedFilterSubmit = () => {
    const updated = {
      ...recipeSearchingData,
      servingCon: { min: servingsRange[0], max: servingsRange[1] }
    };
    applyQuery(updated);
  };

  // 상세 필터 내부에 있는 항목들만 체크
  const isDetailedFilterApplied = useMemo(() => {
    return (
      recipeSearchingData.createdDate !== null ||
      recipeSearchingData.servingCon?.min !== 1 ||
      recipeSearchingData.servingCon?.max !== 20 ||
      recipeSearchingData.recipeName !== null
    );
  }, [recipeSearchingData]);

  // 선택된 조건 뱃지: 재료, 레시피명, 생성일, 요리양, 카테고리, 조리방법
  const activeConditionBadges = useMemo(() => {
    const badges: React.ReactNode[] = [];
    
    // 1. 레시피 이름 뱃지
    if (recipeSearchingData.recipeName) {
      badges.push(
        <span 
          key="recName-badge" 
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold transition-all"
        >
          <span className="opacity-80">레시피:</span> <span>{recipeSearchingData.recipeName}</span>
          <ClearIcon 
            onClick={() => removeAppliedFilter("recipeName", "")} 
            sx={{ fontSize: 14, cursor: "pointer", marginLeft: "2px", opacity: 0.7, '&:hover': { color: '#ef4444', opacity: 1 } }} 
          />
        </span>
      );
    }

    // 2. 재료 뱃지들
    if (recipeSearchingData.ingredientNames) {
      recipeSearchingData.ingredientNames.forEach((val) => {
        badges.push(
          <span 
            key={`ingre-${val}`} 
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold transition-all"
          >
            <span className="opacity-80">재료:</span> <span>{val}</span>
            <ClearIcon 
              onClick={() => removeAppliedFilter("ingredientNames", val)} 
              sx={{ fontSize: 14, cursor: "pointer", marginLeft: "2px", opacity: 0.7, '&:hover': { color: '#ef4444', opacity: 1 } }} 
            />
          </span>
        );
      });
    }

    // 3. 생성일 뱃지
    if (recipeSearchingData.createdDate) {
      const dateStr = formatDateYYYYMMDD(recipeSearchingData.createdDate);
      badges.push(
        <span 
          key="date-badge" 
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold transition-all"
        >
          <span className="opacity-80">생성일:</span> <span>{dateStr} 이후</span>
          <ClearIcon 
            onClick={() => removeAppliedFilter("createdDate", "")} 
            sx={{ fontSize: 14, cursor: "pointer", marginLeft: "2px", opacity: 0.7, '&:hover': { color: '#ef4444', opacity: 1 } }} 
          />
        </span>
      );
    }

    // 4. 요리양 (인분) 뱃지
    if (recipeSearchingData.servingCon && (recipeSearchingData.servingCon.min !== 1 || recipeSearchingData.servingCon.max !== 20)) {
      badges.push(
        <span 
          key="serving-badge" 
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold transition-all"
        >
          <span className="opacity-80">요리양:</span> <span>{recipeSearchingData.servingCon.min}~{recipeSearchingData.servingCon.max}인분</span>
          <ClearIcon 
            onClick={() => removeAppliedFilter("servingCon", "")} 
            sx={{ fontSize: 14, cursor: "pointer", marginLeft: "2px", opacity: 0.7, '&:hover': { color: '#ef4444', opacity: 1 } }} 
          />
        </span>
      );
    }

    // 5. 카테고리 뱃지
    if (recipeSearchingData.cookCategory && recipeSearchingData.cookCategory !== "default") {
      badges.push(
        <span 
          key="cat-badge" 
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold transition-all"
        >
          <span className="opacity-80">카테고리:</span> <span>{recipeSearchingData.cookCategory}</span>
          <ClearIcon 
            onClick={() => removeAppliedFilter("cookCategory", "")} 
            sx={{ fontSize: 14, cursor: "pointer", marginLeft: "2px", opacity: 0.7, '&:hover': { color: '#ef4444', opacity: 1 } }} 
          />
        </span>
      );
    }

    // 6. 조리방법 뱃지
    if (recipeSearchingData.cookMethod && recipeSearchingData.cookMethod !== "default") {
      badges.push(
        <span 
          key="method-badge" 
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold transition-all"
        >
          <span className="opacity-80">조리:</span> <span>{recipeSearchingData.cookMethod}</span>
          <ClearIcon 
            onClick={() => removeAppliedFilter("cookMethod", "")} 
            sx={{ fontSize: 14, cursor: "pointer", marginLeft: "2px", opacity: 0.7, '&:hover': { color: '#ef4444', opacity: 1 } }} 
          />
        </span>
      );
    }

    return badges;
  }, [recipeSearchingData, removeAppliedFilter]);

  return (
    <div 
      ref={barWrapperRef} 
      className="sticky top-0 md:top-[70px] z-50 w-full bg-white border-b border-gray-100 flex flex-col justify-center items-center select-none shadow-sm"
    >      
      {/* 1. input box */}
      <div className="w-full max-w-[800px] px-5 pt-4 pb-2">
        <div className="relative w-full bg-gray-50 border border-gray-200 rounded-full flex items-center pr-4 pl-12 h-11 transition-all focus-within:bg-white focus-within:border-darkGreen focus-within:ring-2 focus-within:ring-darkGreen/10">
          <div className="absolute left-5 flex items-center justify-center pointer-events-none">
            <SearchIcon sx={{ color: "#9CA3AF", fontSize: 19 }} />
          </div>

          <input
            placeholder='레시피 검색'
            className="w-full h-full bg-transparent text-[13px] font-medium text-gray-800 placeholder-gray-400 focus:outline-none border-none"
            onChange={(evt) => setSearchingData(evt.target.value)}
            onKeyDown={(evt) => {
              if (evt.key === 'Enter') {
                searchTerm();
              }
            }}
            value={searchingData}
            type="text"
          />
        </div>
      </div>
            
    {/* 2. horizontal Badge filter list */}
      <div className={`w-full max-w-[800px] px-5 pb-3.5 flex items-center gap-2 relative ${activePopover ? "overflow-visible" : "overflow-x-auto no-scrollbar scroll-smooth"}`}>
        
        {/* Filter Badge */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => togglePopover("filter")}
            className={`recipe-popover-btn flex w-fit whitespace-nowrap items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-all border shrink-0 outline-none ${
              activePopover === "filter" || isDetailedFilterApplied
                ? "border-deepDarkGreen bg-deepDarkGreen text-white shadow-md" 
                : "border-deepDarkGreen bg-white text-deepDarkGreen hover:bg-deepDarkGreen hover:text-white shadow-sm"
            }`}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3 17v2h6v-2H3zm0-12v2h10V5H3zm10 14v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-8v2h6V5h-6z" />
            </svg>
            <span>상세</span>
          </button>

          {activePopover === "filter" && (
            <RecipeFilterPopovers
              activePopover="filter"
              recipeSearchingData={recipeSearchingData}
              setRecipeSearchingData={setRecipeSearchingData}
              servingsRange={servingsRange}
              setServingsRange={setServingsRange}
              sortingCon={sortingCon}
              setSortingCon={setSortingCon}
              clearFilters={clearFilters}
              handleDetailedFilterSubmit={handleDetailedFilterSubmit}
              applyQuery={applyQuery}
            />
          )}
        </div>

        <div className="w-[1px] h-3.5 bg-gray-200 shrink-0 mx-1" />

        {/* Ingredients Badge */}
        <button 
          type="button" 
          onClick={() => setIsIngredientModalOpen(true)}
          className={`flex w-fit whitespace-nowrap items-center gap-0.5 px-3 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-all border shrink-0 outline-none ${
            isIngredientModalOpen || (recipeSearchingData.ingredientNames && recipeSearchingData.ingredientNames.length > 0)
              ? "border-gray-800 bg-gray-800 text-white shadow-sm" 
              : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <span>재료</span>
          <KeyboardArrowDownIcon sx={{ fontSize: 16, marginLeft: "0.5px" }} />
        </button>

        {/* Categories Badge */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => togglePopover("category")}
            className={`recipe-popover-btn flex w-fit whitespace-nowrap items-center gap-0.5 px-3 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-all border shrink-0 outline-none ${
              activePopover === "category" || (recipeSearchingData.cookCategory && recipeSearchingData.cookCategory !== "default")
                ? "border-gray-800 bg-gray-800 text-white shadow-sm" 
                : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <span>{recipeSearchingData.cookCategory && recipeSearchingData.cookCategory !== "default" ? recipeSearchingData.cookCategory : "카테고리"}</span>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, marginLeft: "0.5px", transform: activePopover === "category" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {activePopover === "category" && (
            <RecipeFilterPopovers
              activePopover="category"
              recipeSearchingData={recipeSearchingData}
              setRecipeSearchingData={setRecipeSearchingData}
              servingsRange={servingsRange}
              setServingsRange={setServingsRange}
              sortingCon={sortingCon}
              setSortingCon={setSortingCon}
              clearFilters={clearFilters}
              handleDetailedFilterSubmit={handleDetailedFilterSubmit}
              applyQuery={applyQuery}
            />
          )}
        </div>

        {/* Tag (Method) Badge */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => togglePopover("tag")}
            className={`recipe-popover-btn flex w-fit whitespace-nowrap items-center gap-0.5 px-3 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-all border shrink-0 outline-none ${
              activePopover === "tag" || (recipeSearchingData.cookMethod && recipeSearchingData.cookMethod !== "default")
                ? "border-gray-800 bg-gray-800 text-white shadow-sm" 
                : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <span>{recipeSearchingData.cookMethod && recipeSearchingData.cookMethod !== "default" ? recipeSearchingData.cookMethod : "조리 방법"}</span>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, marginLeft: "0.5px", transform: activePopover === "tag" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {activePopover === "tag" && (
            <RecipeFilterPopovers
              activePopover="tag"
              recipeSearchingData={recipeSearchingData}
              setRecipeSearchingData={setRecipeSearchingData}
              servingsRange={servingsRange}
              setServingsRange={setServingsRange}
              sortingCon={sortingCon}
              setSortingCon={setSortingCon}
              clearFilters={clearFilters}
              handleDetailedFilterSubmit={handleDetailedFilterSubmit}
              applyQuery={applyQuery}
            />
          )}
        </div>

        {/* Sorting Badge */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => togglePopover("sort")}
            className={`recipe-popover-btn flex w-fit whitespace-nowrap items-center gap-0.5 px-3 py-1.5 text-xs font-bold rounded-full cursor-pointer transition-all border shrink-0 outline-none ${
              activePopover === "sort" || sortingCon !== "POPULARITY"
                ? "border-gray-800 bg-gray-800 text-white shadow-sm" 
                : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <span>{getSortingLabel(sortingCon)}</span>
            <KeyboardArrowDownIcon sx={{ fontSize: 16, marginLeft: "0.5px", transform: activePopover === "sort" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>

          {activePopover === "sort" && (
            <RecipeFilterPopovers
              activePopover="sort"
              recipeSearchingData={recipeSearchingData}
              setRecipeSearchingData={setRecipeSearchingData}
              servingsRange={servingsRange}
              setServingsRange={setServingsRange}
              sortingCon={sortingCon}
              setSortingCon={setSortingCon}
              clearFilters={clearFilters}
              handleDetailedFilterSubmit={handleDetailedFilterSubmit}
              applyQuery={applyQuery}
            />
          )}
        </div>
      </div>

      {/* 3. Selected Condition Badges Chips Row (선택된 재료 및 필터 뱃지 칩스) */}
      {activeConditionBadges.length > 0 && (
        <div className="w-full max-w-[800px] px-5 pb-3 flex items-center gap-1.5 flex-wrap">
          {activeConditionBadges}
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors ml-1 border-none bg-transparent cursor-pointer"
          >
            <RefreshIcon sx={{ fontSize: 13 }} />
            <span>전체 초기화</span>
          </button>
        </div>
      )}

      {/* Separated Ingredient Search Modal Component */}
      <IngredientSearchModal
        isOpen={isIngredientModalOpen}
        onClose={() => setIsIngredientModalOpen(false)}
        modalIngredients={modalIngredients}
        setModalIngredients={setModalIngredients}
        onSubmit={submitIngredientSearch}
        isSignIn={isSignIn}
        fridgeIngredients={fridgeIngredients}
      />

    </div>
  );
}