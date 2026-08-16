"use client";

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useEffect, useState } from "react";
import MyFeedPhoto from "./MyFeedPhoto";
import FeedEditModal from "./FeedEditModal";
import { OutlineButton } from "@/app/(commom)/Component/Buttons";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LinkIcon from "@mui/icons-material/Link";

export interface UserFeedInfo {
  userId: string;
  nickName: string | null;
  email: string;
  grantType: string;
  userPhoto: string | null;
  userUrl: string | null;
  userIntro: string | null;
}

export default function UserInfo() {
  const [userData, setUserData] = useState<UserFeedInfo>();
  const [updateData, setUpdateData] = useState<number>(0);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const modalOpen = () => setIsOpenModal(true);

  useEffect(() => {
    axiosAuthInstacne
      .get(`${process.env.NEXT_PUBLIC_API_URL}feed/myfeed`)
      .then((res) => {
        setUserData(res.data);
      });
  }, [updateData]);

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-6">
      {userData && (
        <FeedEditModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          setUpdateData={setUpdateData}
          updateData={updateData}
          userInfo={userData}
        />
      )}

      {/* 프로필 상단 영역 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="shrink-0 relative">
          <MyFeedPhoto photoUrl={userData?.userPhoto} />
        </div>

        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {userData?.nickName || "사용자"}
            </h2>
          </div>

          <p className="text-xs text-gray-400 font-medium">
            {userData?.email}
          </p>

          {userData?.userUrl && (
            <a
              href={userData.userUrl.startsWith("http") ? userData.userUrl : `https://${userData.userUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline mt-1"
            >
              <LinkIcon sx={{ fontSize: 14 }} />
              <span>{userData.userUrl}</span>
            </a>
          )}
        </div>

        <div className="sm:ml-auto shrink-0 mt-2 sm:mt-0">
          <OutlineButton
            size="sm"
            onClick={modalOpen}
            className="flex items-center gap-1.5 font-bold px-4 py-2"
          >
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
            <span>프로필 편집</span>
          </OutlineButton>
        </div>
      </div>

      {/* 자기소개 카키 상자 */}
      {userData?.userIntro && (
        <div className="w-full p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
          {userData.userIntro}
        </div>
      )}
    </div>
  );
}
