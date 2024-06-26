import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useEffect, useState } from "react";
import MyFeedPhoto from "./MyFeedPhoto";
import FeedEditModal from "./FeedEditModal";

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
        console.log("내 데이터", res.data);
        setUserData(res.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, [updateData]);

  return (
    <div className="w-full p-3">
      {userData && (
        <FeedEditModal
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          setUpdateData={setUpdateData}
          updateData={updateData}
          userInfo={userData}
        ></FeedEditModal>
      )}
      <div className="w-full flex justify-center flex-wrap ">
        <div className=" flex justify-center items-center">
          <MyFeedPhoto photoUrl={userData?.userPhoto}></MyFeedPhoto>
        </div>
        <div className="p-5 relative ms-5 mt-3">
          <h3>{userData?.nickName}</h3>
          <div>{userData?.userUrl}</div>
        </div>
      </div>
      <div className="w-full text-center mt-8">
        <button
            onClick={modalOpen}
            className="btn-outline-gray">
            프로필 편집
          </button>
      </div>
    </div>
  );
}
