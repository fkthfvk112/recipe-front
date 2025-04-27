"use client"

import { use, useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import EvtStatus from "./EvtStatus";
import Swal from "sweetalert2";

interface UserInfo {
  userId: string;
  nickName: string;
  email: string;
  grantType: string;
  blockEnum?: "UNBLOCK" | "CREATE_BLOCK_RECIPE_BOARD" | "CREATE_BLOCK_ALL" | "LOGIN_BLOCKED";
  gender: string;
  birthDate: string;
  createDate: string;
}

interface EvtUserListProps {
  eventId: number;
}

export default function EvtUserList({
    params
  }: {
    params:{eventId:string};
  }) {
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);

  useEffect(() => {
    if (params.eventId) {
      axiosAuthInstacne.get(`/admin/evt/extract-eligible-users/${params.eventId}`).then((res) => {
        setUserInfo(res.data);
      });
    }
  }, [params.eventId]);

  const registerUserToEvtStatus = ()=>{
    axiosAuthInstacne.post(`/admin/evt/evt-status/${params.eventId}`).then((res) => {
        Swal.fire("유저 상태가 이벤트에 반영 되었습니다!", "", "success");
        window.location.reload();
    })
    .catch((err) => {
        Swal.fire("등록 실패", "다시 시도해주세요.", "error");
    });
  }

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen p-5">
      <section className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-center">이벤트 참여 유저 목록</h2>
          <p className="text-center text-gray-600">이벤트에 참여한 유저들의 리스트를 확인하세요.</p>
        </div>

        <TitleDescription title="조건을 충족한 유저" desc="조건을 충족하지만 아직 이벤트에 참여하지 않은 유저에요. 버튼을 눌러 이벤트 참여 등록을 해주세요."/>
        {/* 유저 정보 리스트 */}
        <div className="w-full mt-6 overflow-x-auto overflow-y-scroll max-h-[1024px]">
        <div>총 {userInfo.length}명</div>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-gray-600">아이디</th>
                <th className="p-4 text-left text-gray-600">닉네임</th>
                <th className="p-4 text-left text-gray-600">이메일</th>
                <th className="p-4 text-left text-gray-600">가입일</th>
              </tr>
            </thead>
            <tbody>
              {userInfo.map((user, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-700">{user.userId}</td>
                  <td className="p-4 text-gray-700">{user.nickName}</td>
                  <td className="p-4 text-gray-700">{user.email}</td>
                  <td className="p-4 text-gray-700">{new Date(user.createDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="flex justify-center mt-10 mb-10">
        <button onClick={registerUserToEvtStatus} className="greenBtn w-[200px]">이벤트 참여시키기</button>
      </div>
      <section className="w-full">
        <EvtStatus eventId={params.eventId}/>
      </section>
    </div>
  );
}
