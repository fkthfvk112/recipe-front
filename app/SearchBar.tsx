"use client";

import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import DetailSearchingModal from "./DetailSearchingModal";
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
    <div className="flex flex-col justify-center items-center w-full text-center bg-[#52cf63] p-5">
      <div className="w-full text-start max-w-[800px] mb-2">
        <h1 className="text-2xl">레시피 검색</h1>
      </div>
      <div className="relative w-full max-w-[800px]">
        <input
          placeholder="요리명, 설명, 재료 (2자 이상)"
          className="h-12 rounded-full ps-5 pe-12"
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
        <button className="flex absolute top-0 right-1 justify-center items-center border-none rounded-full w-12 h-12"
          onClick={()=>searchTerm()}>
          <SearchIcon sx={{fill:"a1a1a1"}} />
        </button>
      </div>
      <button className="rounded-3xl border-none mt-5 bg-[#FB8500] font-bold" onClick={() => router.push("/search/recipe-detail")}>상세 검색</button>
      <DetailSearchingModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      ></DetailSearchingModal>
    </div>
  );
}
