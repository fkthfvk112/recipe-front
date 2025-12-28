"use client"

import { useState } from "react";
import PresetCreatePage from "./PresetCreatePage";
import PresetList from "./PresetList";

export default function FridgePreset(){
    const [page, setPage] = useState<number>(0);
    return (
      <>
        <div className="flex flex-row">
          <button onClick={() => {
            setPage(0);
          }} className={`${page === 0 ? "greenBtn" : "grayBtn"} me-1`}>이벤트 목록</button>
  
          <button onClick={() => {
            setPage(1);
          }} className={`${page === 1 ? "greenBtn" : "grayBtn"} ms-1`}>프리셋 등록</button>
        </div>
        {page === 0 && <PresetList/>}
        {page === 1 && <PresetCreatePage />}
      </>
    );
}