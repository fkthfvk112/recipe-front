import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import axios from "axios";
import { useEffect, useState } from "react";
import MyFeedPhoto from "./MyFeedPhoto";
import EditIcon from "@mui/icons-material/Edit";
import FeedEditModal from "./FeedEditModal";

export interface UserFeedInfo {
  userId: string;
  nickName: string | null;
  email: string;
  grantType: string;
  userPhoto: string | null;
  userUrl: string | null;
}

export default function UserInfo({ userId }: { userId: string }) {
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
          userInfo={userData}
        ></FeedEditModal>
      )}
      <div className="grid grid-cols-[1fr,3fr] gap-4 h-44">
        <div className="bg-blue-500 flex justify-center items-center">
          <MyFeedPhoto photoUrl={userData?.userPhoto}></MyFeedPhoto>
        </div>
        <div className="bg-green-500 p-3 relative">
          <button
            onClick={modalOpen}
            className="border-none w-5 h-3 flex justify-center items-center absolute right-2"
          >
            <EditIcon></EditIcon>
          </button>
          <h3>{userData?.nickName}</h3>
          <div>{userData?.userUrl}</div>
          <div>{userData?.email}</div>
          <div className="text-sm">발행한 레시피gfd</div>
        </div>
      </div>
      <div>etc</div>
    </div>
  );
}
