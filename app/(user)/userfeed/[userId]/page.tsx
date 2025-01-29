"use client";

import { useState } from "react";
import FeedRecipes from "./FeedRecipes";
import BurstModeOutlinedIcon from "@mui/icons-material/BurstModeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Divider } from "@mui/material";
import UserInfo from "./UserInfo";
import FeedDiet from "./FeedDiet";
import { useRecoilState } from "recoil";
import { userFeedMenuAtom } from "@/app/(recoil)/userFeedAtom";
import { cacheKey } from "@/app/(recoil)/cacheKey";

export default function UserFeed({
  params,
}: {
  params: { userId: string };
}) {
  const [menuSelect, setMenuSelect] = useRecoilState(userFeedMenuAtom(cacheKey.user_feed_menu_key + params.userId));

  return (
    <div className="bg-white max-w-3xl w-dvw m-3  flex flex-col justify-start items-center">
      <UserInfo userNickName={params.userId} userId={params.userId}></UserInfo>
      <Divider className="mt-5" orientation="horizontal" flexItem />
      <div className="flex">
        <button
          className={`max-w-60 min-w-32 text-xs flex justify-center items-center border-none 
              ${menuSelect === 0 ? "text-black" : "text-gray-400"}`}
          onClick={() => setMenuSelect(0)}
        >
          <BurstModeOutlinedIcon className="me-1"></BurstModeOutlinedIcon>
          레시피
        </button>
        <button
          className={`max-w-60 min-w-32 text-xs flex justify-center items-center border-none ${
            menuSelect === 1 ? "text-black" : "text-gray-400"
          }`}
          onClick={() => setMenuSelect(1)}
        >
          <BookmarkBorderOutlinedIcon className="me-1"></BookmarkBorderOutlinedIcon>
          공개 식단
        </button>
      </div>
      {menuSelect === 0 &&<FeedRecipes userId={params.userId}/>}
      {menuSelect === 1 &&<FeedDiet userId={params.userId}/>}
    </div>
  );
}
