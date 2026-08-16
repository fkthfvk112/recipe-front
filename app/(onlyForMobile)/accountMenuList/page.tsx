"use client";

import { cacheKey } from "@/app/(recoil)/cacheKey";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { userFeedRecipeCacheSelectorAtom } from "@/app/(recoil)/userFeedRecipeCacheSelector";
import { deleteAuthToken, isAdmin } from "@/app/(user)/signin/utils/authUtil";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import BookmarkAddedOutlinedIcon from "@mui/icons-material/BookmarkAddedOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";

export default function MyAccountMenuList() {
  const likeRecipeReset = useResetRecoilState(
    userFeedRecipeCacheSelectorAtom(cacheKey.user_feed_like_recipe_key + "myFeedRecipe")
  );
  const [isAdminChk, setIsAdmin] = useState<boolean>(false);
  const [, setIsSignIn] = useRecoilState(siginInState);
  const router = useRouter();

  useEffect(() => {
    isAdmin().then((res) => {
      if (res === true) {
        setIsAdmin(true);
      }
    });
  }, []);

  const handelLogOut = () => {
    deleteAuthToken(); // server side job
    setIsSignIn(false);
    router.push("/");
    router.refresh();
  };

  const goToMyFeed = async () => {
    router.push(`/userfeed/myfeed`);
  };

  const goToCreatMyDiet = () => {
    router.push(`/diet/mydiet/create`);
  };

  const goToFridge = () => {
    router.push(`/fridge`);
  };

  const goToSetting = () => {
    router.push(`/accountSetting`);
  };

  const goToLikeRecipe = () => {
    likeRecipeReset();
    router.push(`/mylike/recipe`);
  };

  const goToAdminPage = () => {
    router.push(`/admin/ingredient`);
  };

  const goToMyFridgeItemTx = () => {
    router.push(`/fridge/tx-history`);
  };

  const menuGroups = [
    {
      title: "나의 식생활",
      items: [
        {
          label: "나의 레시피",
          icon: <MenuBookOutlinedIcon className="text-emerald-600" sx={{ fontSize: 22 }} />,
          onClick: goToMyFeed,
        },
        {
          label: "내 냉장고 관리",
          icon: <KitchenOutlinedIcon className="text-emerald-600" sx={{ fontSize: 22 }} />,
          onClick: goToFridge,
        },
        // {
        //   label: "식단 작성하기",
        //   icon: <RestaurantOutlinedIcon className="text-emerald-600" sx={{ fontSize: 22 }} />,
        //   onClick: goToCreatMyDiet,
        // },
        {
          label: "찜한 레시피",
          icon: <BookmarkAddedOutlinedIcon className="text-emerald-600" sx={{ fontSize: 22 }} />,
          onClick: goToLikeRecipe,
        },
        {
          label: "식재료 가계부 (소비 이력)",
          icon: <ReceiptLongOutlinedIcon className="text-emerald-600" sx={{ fontSize: 22 }} />,
          onClick: goToMyFridgeItemTx,
        },
      ],
    },
    {
      title: "서비스 & 설정",
      items: [
        {
          label: "서비스 소개",
          icon: <FavoriteBorderIcon className="text-gray-500" sx={{ fontSize: 20 }} />,
          onClick: () => router.push("/welcome"),
        },
        {
          label: "계정 설정",
          icon: <SettingsOutlinedIcon className="text-gray-500" sx={{ fontSize: 20 }} />,
          onClick: goToSetting,
        },
        ...(isAdminChk
          ? [
              {
                label: "어드민 전용 관리자",
                icon: <AdminPanelSettingsOutlinedIcon className="text-amber-600" sx={{ fontSize: 20 }} />,
                onClick: goToAdminPage,
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <nav className="flex flex-col items-center max-w-[600px] w-full mx-auto my-6 px-4 box-border">
      {/* 타이틀 & 헤더 */}
      <div className="w-full mb-6 text-left flex flex-col gap-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 w-fit">
          마이페이지
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          내 계정 메뉴
        </h1>
        <p className="text-xs text-gray-500 font-medium">
          냉장고 관리부터 식재료 소비 이력, 작성한 식단까지 관리하세요.
        </p>
      </div>

      {/* 메뉴 그룹 카드 */}
      <div className="w-full flex flex-col gap-5">
        {menuGroups.map((group, idx) => (
          <div key={`group-${idx}`} className="bg-white rounded-3xl border border-gray-100 p-2 shadow-xs overflow-hidden">
            <h2 className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 tracking-wider">
              {group.title}
            </h2>
            <ul className="w-full flex flex-col">
              {group.items.map((item, itemIdx) => (
                <li
                  key={`item-${itemIdx}`}
                  onClick={item.onClick}
                  className="flex items-center justify-between p-3.5 hover:bg-emerald-50/50 rounded-2xl transition-colors cursor-pointer active:scale-[0.995]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                      {item.label}
                    </span>
                  </div>
                  <NavigateNextIcon className="text-gray-300" sx={{ fontSize: 20 }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 하단 로그아웃 */}
      <div className="mt-8 mb-6 flex justify-center w-full">
        <button
          onClick={handelLogOut}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all border-none cursor-pointer"
        >
          <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
          <span>로그아웃</span>
        </button>
      </div>
    </nav>
  );
}