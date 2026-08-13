"use client";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useResponsiveDesignCss from "./(commom)/Hook/useResponsiveDesignCss";

export default function SearchBar() {
  const [searchingData, setSearchingData] = useState<string>("");
  const router = useRouter();
  

  const searchTerm = () => {
    if (searchingData.length <= 0) {
      Swal.fire({
        title: "검색어를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: '#d33',
        allowEnterKey: false
      });
      return;
    }
    if (searchingData.length < 2) {
      Swal.fire({
        title: "2자 이상 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: '#d33',
        allowEnterKey: false
      });
      return;
    } else {
      router.push(`/recipes/simple/1/searchingTerm=${searchingData}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full text-center bg-white py-8 px-5">
      <div className="w-full text-start max-w-2xl mb-4 pl-2">
        <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">레시피 검색</h1>
      </div>
      
      {/* Recipi'O styled minimal search field (No Search button, left search icon) */}
      <div className="relative w-full max-w-2xl bg-gray-100 border border-transparent rounded-full flex items-center pr-4 pl-12 h-12 transition-all focus-within:bg-white focus-within:border-gray-200">
        
        {/* Left Search Icon inside input */}
        <div className="absolute left-4 flex items-center justify-center pointer-events-none">
          <SearchIcon sx={{ color: "#9CA3AF", fontSize: 20 }} />
        </div>

        {/* Input area */}
        <input
          placeholder='레시피 검색'
          className="w-full h-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none border-none"
          onChange={(evt) => {
            setSearchingData(evt.target.value);
          }}
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
  );
}
