"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import DetailSearchingModal from "./DetailSearchingModal";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
    else{
      router.push(`/recipes/simple/1/searchingTerm=${searchingData}`);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center pt-20 pb-10 w-full text-center bg-[#52cf63] p-10">
      <div className="w-full text-start max-w-[800px] mb-5">
        <h1 className="text-2xl">레시피 검색</h1>
        <p>재료, 요리명 등의 키워드로 입맛에 맞는 완벽한 레시피를 발견하세요!</p>
      </div>
      <div className="relative w-full max-w-[800px]">
        <input
          placeholder="요리명, 설명, 재료"
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
      <button className="rounded-3xl border-none mt-5 bg-[#FB8500] font-bold" onClick={() => setIsOpen(true)}>상세 검색</button>
      <DetailSearchingModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      ></DetailSearchingModal>
      {/* <button onClick={handleOpen}>상세 보기</button> */}
    </div>
  );
}
