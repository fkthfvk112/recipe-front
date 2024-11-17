"use client"

import React, { useEffect, useState } from "react";
import { UserFeedInfo } from "../userfeed/[userNickName]/UserInfo";
import FeedEditModal from "../userfeed/myfeed/FeedEditModal";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import MyFeedPhoto from "../userfeed/[userNickName]/MyFeedPhoto";

function UserInfoSetting(){
    const [userData, setUserData] = useState<UserFeedInfo>();
    const [updateData, setUpdateData] = useState<number>(0);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const modalOpen = () => setIsOpenModal(true);

    useEffect(() => {
      axiosAuthInstacne
        .get(`${process.env.NEXT_PUBLIC_API_URL}feed/myfeed`)
        .then((res) => {
          setUserData(res.data);
        })
    }, [updateData]);

    return (
        <div className="grid grid-cols-3 gap-2 p-6 border rounded-md">
            {userData && (
                <FeedEditModal
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                setUpdateData={setUpdateData}
                updateData={updateData}
                userInfo={userData}
                ></FeedEditModal>
            )}
        <div className="col-span-3 flex justify-center items-center mt-3 mb-3">
            <MyFeedPhoto photoUrl={userData?.userPhoto}></MyFeedPhoto>
        </div>
        <span className="col-span-1">닉네임</span>
        <input className="col-span-2 h-7" value={userData?.nickName ? userData.nickName : ""} disabled/>
        <span className="col-span-1">내 주소</span>
        <input className="col-span-2 h-7" value={userData?.userUrl ? userData.userUrl : ""} disabled/>
        <span className="col-span-1">자기소개</span>
        <textarea className="col-span-2 h-20 px-2" value={userData?.userIntro ? userData.userIntro : ""} disabled/>
        <div className="col-span-3 text-center mt-3 ">
            <button
                onClick={modalOpen}
                className="btn-outline-gray">
                프로필 편집
            </button>
        </div>
    </div>
    )
}

export default React.memo(UserInfoSetting);