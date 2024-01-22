"use client";

import { useState } from "react";
import MyFeed from "./MyFeed";
import BurstModeOutlinedIcon from "@mui/icons-material/BurstModeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Divider } from "@mui/material";
import UserInfo from "./UserInfo";

export default function Userfeed() {
  const [menuSelect, setMenuSelect] = useState<0 | 1>(0);

  return (
    <div className="bg-white max-w-xl w-dvw m-3  flex flex-col justify-start items-center">
      <UserInfo userId={"fkthfvk112"}></UserInfo>
      <Divider className="mt-5" orientation="horizontal" flexItem />

      <div className="flex">
        <button
          className={`max-w-60 min-w-32 text-xs flex justify-center items-center border-none 
          ${menuSelect === 0 ? "text-black" : "text-gray-400"}`}
          onClick={() => setMenuSelect(0)}
        >
          <BurstModeOutlinedIcon className="me-1"></BurstModeOutlinedIcon>내
          레시피
        </button>
        <button
          className={`max-w-60 min-w-32 text-xs flex justify-center items-center border-none ${
            menuSelect === 1 ? "text-black" : "text-gray-400"
          }`}
          onClick={() => setMenuSelect(1)}
        >
          <BookmarkBorderOutlinedIcon className="me-1"></BookmarkBorderOutlinedIcon>
          찜한 레시피
        </button>
      </div>
      {menuSelect === 0 && <MyFeed></MyFeed>}
    </div>
  );
}
//수정 : 메모이제이션
