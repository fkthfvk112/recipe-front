import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MyFeedPhoto from "./MyFeedPhoto";
import EditIcon from "@mui/icons-material/Edit";

export interface UserFeedInfo {
  userId:    string;
  nickName:  string | null;
  email:     string;
  grantType: string;
  userPhoto: string | null;
  userUrl:   string | null;
  userIntro: string | null; 
}

export default function UserInfo({ userNickName }: { userNickName: string }) {
  const [userData, setUserData] = useState<UserFeedInfo>();
  const [updateData, setUpdateData] = useState<number>(0);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}feed/user/${userNickName}`)
      .then((res) => {
        console.log("내 데이터", res.data);
        setUserData(res.data);
      })
      .catch((e) => {
        alert(e);
      });
  }, [updateData]);

  return (
    <div className="w-full max-w-[500px] p-3">
      <div className="w-full flex justify-center flex-wrap">
        <div className=" flex justify-center items-center">
          <MyFeedPhoto photoUrl={userData?.userPhoto}></MyFeedPhoto>
        </div>
        <div className="p-5 relative ms-5 mt-3">
          <h3>{userData?.nickName}</h3>
          <div>{userData?.userUrl}</div>
        </div>
      </div>
      <div className="w-full text-center mt-5">
          <div className="w-full p-3 m-3 text-start bg-[#f1f1f1] rounded-xl">
            {userData?.userIntro}
          </div>
      </div>
    </div>
  );
}
