"use client"

import SearchIcon from "@mui/icons-material/Search";
import { Dispatch, SetStateAction, useState } from "react";

interface BoardSearchProp{
    searchingTerm:string;
    setSearchingTerm:(data:string)=>void;
    setLastSearchedData:(data:string)=>void;
}
export default function BoardSearchBar({searchingTerm, setSearchingTerm, setLastSearchedData}:BoardSearchProp){

    const searchTerm = ()=>{
        setLastSearchedData(searchingTerm);
    }


    return(
        <>
            <div className="relative w-full">
                <input
                placeholder="검색어를 입력해주세요."
                className="h-12 rounded-full ps-5 pe-12"
                onChange={(evt) => {
                    setSearchingTerm(evt.target.value);
                }}
                onKeyDown={(evt)=>{
                    if(evt.key === 'Enter'){
                    searchTerm();
                    }
                }}
                value={searchingTerm}
                maxLength={15}
                type="text"/>
                <button className="flex absolute top-0 right-1 justify-center items-center border-none rounded-full w-12 h-12"
                onClick={()=>searchTerm()}>
                <SearchIcon sx={{fill:"a1a1a1"}} />
                </button>
            </div>
        </>
    )
}