"use client";

import BurstModeOutlinedIcon from "@mui/icons-material/BurstModeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import UserInfo from "./UserInfo";
import MyDiet from "./MyDiet";
import MyRecipe from "./MyRecipe";
import { useRecoilState } from "recoil";
import { userFeedMenuAtom } from "@/app/(recoil)/userFeedAtom";
import { cacheKey } from "@/app/(recoil)/cacheKey";
import useChkLoginToken from "@/app/(commom)/Hook/useChkLoginToken";
import { AdditionalBtn } from "@/app/(commom)/Component/AdditionalBtn";

export default function Userfeed() {
  const [menuSelect, setMenuSelect] = useRecoilState(
    userFeedMenuAtom(cacheKey.user_feed_menu_key + "myFeedMenu")
  );
  const isTokenValid = useChkLoginToken("refreshNeed");

  if (!isTokenValid) {
    return <></>;
  }

  return (
    <main className="min-h-screen bg-gray-50/60 py-8 px-3 sm:px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col items-center gap-6">
        {/* 프로필 회원 정보 헤더 카드 */}
        <UserInfo />

        {/* 세그먼트 탭 메뉴 */}
        <div className="w-full max-w-2xl bg-white rounded-2xl p-1.5 border border-gray-100 shadow-2xs flex gap-1">
          <button
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all border-none flex items-center justify-center gap-2 cursor-pointer ${
              menuSelect === 0
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
            onClick={() => setMenuSelect(0)}
          >
            <BurstModeOutlinedIcon sx={{ fontSize: 18 }} />
            <span>내 작성 레시피</span>
          </button>
          {/* <button
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all border-none flex items-center justify-center gap-2 cursor-pointer ${
              menuSelect === 1
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
            onClick={() => setMenuSelect(1)}
          >
            <BookmarkBorderOutlinedIcon sx={{ fontSize: 18 }} />
            <span>내 작성 식단</span>
          </button> */}
        </div>

        {/* 메인 탭 컨텐츠 */}
        <div className="w-full max-w-2xl">
          {menuSelect === 0 && <MyRecipe />}
          {menuSelect === 1 && <MyDiet />}
        </div>
      </div>

      {/* 우측 하단 플로팅 레시피 작성 버튼 */}
      <AdditionalBtn additionalBtns={[{ name: "레시피 작성", url: "/create-recipe" }]} />
    </main>
  );
}
