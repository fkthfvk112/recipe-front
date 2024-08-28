"use client"

import { useState } from "react";
import BoardSearchBar from "./BoardSearchBar";
import BoardSearchHolder from "./BoardSearchHolder";


//searchingTerm으로 입력값 조절, lastSearchedData은 마지막 검색된 데이터, 이 데이터로 페이지 네이션 처리, doSearch로 검색 마지막 데이터 변경
export default function BoardSearch(){
    const [searchingTerm, setSearchingTerm] = useState<string>("");
    const [lastSearchedData, setLastSearchedData] = useState<string>("");

    return (
        <div className="defaultOuterContainer">
            <section className="w-[95%] m-2 max-w-[1024px] min-w-[320px] pt-10">
                <h1 className="menuTitle">게시글 검색</h1>
                <BoardSearchBar searchingTerm={searchingTerm} setSearchingTerm={setSearchingTerm} setLastSearchedData={setLastSearchedData}/>
            </section>
            <main className="defaultInnerContainer pt-10 pb-[100px]">
                <BoardSearchHolder key={lastSearchedData} searchedData={lastSearchedData}/>
            </main>
        </div>
    )
}