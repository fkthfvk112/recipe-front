"use client";

import BurstModeOutlinedIcon from "@mui/icons-material/BurstModeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Divider } from "@mui/material";
import UserInfo from "./UserInfo";
import MyDiet from "./MyDiet";
import MyRecipe from "./MyRecipe";
import { useRecoilState } from "recoil";
import { userFeedMenuAtom } from "@/app/(recoil)/userFeedAtom";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import { AdditionalBtn } from "@/app/(commom)/Component/AdditionalBtn";

export default function Userfeed() {
  const [menuSelect, setMenuSelect] = useRecoilState(userFeedMenuAtom(cacheKey.user_feed_menu_key + "myFeedMenu"));
  const isTokenValid = useChkLoginToken("refreshNeed");

  if(!isTokenValid){
    return <></>
  }

  return (
    <div className="bg-white max-w-3xl w-dvw m-3  flex flex-col justify-start items-center">
      <UserInfo></UserInfo>
      <Divider className="mt-5" orientation="horizontal" flexItem />
      <div className="flex">
        <button
          className={`max-w-60 min-w-32 text-xs flex justify-center items-center border-none 
          ${menuSelect === 0 ? "text-black" : "text-gray-400"}`}
          onClick={() => setMenuSelect(0)}
        >
          <BurstModeOutlinedIcon className="me-1"></BurstModeOutlinedIcon>내 레시피
        </button>
        <button
          className={`max-w-60 min-w-32 text-xs flex justify-center items-center border-none ${
            menuSelect === 1 ? "text-black" : "text-gray-400"
          }`}
          onClick={() => setMenuSelect(1)}
        >
          <BookmarkBorderOutlinedIcon className="me-1"></BookmarkBorderOutlinedIcon>
          내 식단
        </button>
      </div>
      {menuSelect === 0 && <MyRecipe></MyRecipe>}
      {menuSelect === 1 && <MyDiet></MyDiet>}
      <AdditionalBtn additionalBtns={[{name:"식단 작성", url:"/diet/mydiet/create"}, {name:"레시피 작성", url:"/create-recipe"}]}/>
    </div>
  );
}
//수정 : 메모이제이션
