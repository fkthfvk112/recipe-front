"use client";

import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { usePathname, useRouter } from "next/navigation";
import useResponsiveDesignCss from "@/app/(commom)/Hook/useResponsiveDesignCss";
import RecipeConditionBtns from "./RecipeConditionBtns";

export default function RecipeSearchBar() {
  const pathname = usePathname();
  const searchingTerm = 'searchingTerm=';
  const isPresent = pathname.includes(searchingTerm);
  const searchingValue = isPresent ? pathname.split(`${searchingTerm}`)[1].split('&')[0] : null;

  const [searchingData, setSearchingData] = useState<string>(decodeURIComponent(searchingValue||""));
  const {layoutTop} = useResponsiveDesignCss();

  const router = useRouter();


  const searchTerm = ()=>{
    if(searchingData.length <= 0){
      Swal.fire({
        title: "검색어를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: '#d33',
        allowEnterKey:false
      });
      return;
    }
    if(searchingData.length < 2){
      Swal.fire({
        title: "2자 이상 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: '#d33',
        allowEnterKey:false
      });
      return;
    }
    else{
      router.push(`/recipes/simple/1/searchingTerm=${searchingData}`);
    }
  }

  return (
    <>
    <div className="flex flex-col justify-center items-center pb-5 w-full text-center shadow-sm pt-5 ">
      <div className="relative w-full max-w-[800px]">
        <input
          placeholder="요리명, 설명, 재료"
          className="h-12 rounded-full ps-11 pe-[72px] border-[#e1e1e1] shadow-sm"
          onChange={(evt) => {
            setSearchingData(evt.target.value);
          }}
          onKeyDown={(evt)=>{
            if(evt.key === 'Enter'){
              searchTerm();
            }
          }}
          value={searchingData}
          type="text"/>
        <button className="flex absolute top-0 left-1 justify-center items-center border-none rounded-full w-12 h-12"
          onClick={()=>searchTerm()}>
          <SearchIcon sx={{fill:"a1a1a1"}} />
        </button>
        <span className="flex-center absolute top-1.5 w-[80px] h-[35px] right-2 bg-[#FB8500] rounded-full">
          <button className="border-none font-semibold text-sm text-[#121212]" onClick={() => router.push("/search/recipe-detail")}>상세</button>
        </span>
      </div>   
    </div>
    <div className={`flex bg-white justify-center items-center pb-3 pt-3 w-full text-center shadow-sm sticky ${layoutTop} z-50`}>
        <RecipeConditionBtns/>
    </div>
    </>
  );
}
