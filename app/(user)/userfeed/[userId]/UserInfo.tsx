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
  birthDate: string;
  userPhoto: string | null;
  userUrl:   string | null;
  userIntro: string | null; 
}

export default function UserInfo({ userNickName, userId }: { userNickName: string, userId:string }) {
  const [userData, setUserData] = useState<UserFeedInfo>();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}feed/user/${userId}`)
      .then((res) => {
        setUserData(res.data);
      })
  }, [userId]);

  return (
    <div className="w-full max-w-[500px] p-3">
      <div className="w-full flex justify-start flex-wrap mt-3">
        <div className=" flex justify-center items-center">
          <MyFeedPhoto photoUrl={userData?.userPhoto}></MyFeedPhoto>
        </div>
        <div className="p-5 relative ms-5 mt-3">
          <h3>{userData?.nickName}</h3>
          <div>{userData?.userUrl}</div>
        </div>
      </div>
      <div className="w-full text-center mt-5">
        {userData?.userIntro &&
          <div className="w-full p-3 text-start bg-[#f0f0f0] rounded-xl">
            {userData?.userIntro}
          </div>
        }
      </div>
    </div>
  );
}
