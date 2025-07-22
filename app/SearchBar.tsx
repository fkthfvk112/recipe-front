"use client";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchingData, setSearchingData] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="flex flex-col justify-center items-center w-full text-center bg-[#52cf63] p-5 pb-7">
      <div className="w-full text-start max-w-[800px] mb-2">
        <h1 className="text-2xl">레시피 검색</h1>
      </div>
      <div className="relative w-full max-w-[800px]">
        <input
          placeholder="요리명, 설명, 재료"
          className="h-12 rounded-full ps-[75px] pe-[72px]"
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
          <button className="flex absolute top-0 right-2 justify-center items-center border-none rounded-full w-12 h-12"
            onClick={()=>searchTerm()}>
            <SearchIcon sx={{fill:"a1a1a1"}} />
          </button>
          <span className="flex-center absolute top-1.5 w-[60px] h-[35px] left-2 bg-[#FB8500] rounded-full">
            <button className="border-none font-semibold text-sm text-[#121212]" onClick={() => router.push("/search/recipe-detail")}>상세</button>
          </span>
      </div>
    </div>
  );
}
