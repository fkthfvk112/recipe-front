"use client";

import { useState, useEffect } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { useEmailForm } from "@/app/(commom)/Hook/useEmailForm";
import EmailForm from "@/app/(commom)/Component/EmailForm";
import Swal from "sweetalert2";

interface EvtStatusDTO_OUT {
    evtStatusId:number;
    eventId: number;
    userId: string;
    nickName: string;
    email: string;
    isEligible: boolean;
    beEligibleAt: string;
    isRewarded: boolean;
    rewardedAt: string;
    updatedAt: string;
}

export default function EvtStatus({eventId}:{eventId:string}) {
  const [userInfo, setUserInfo] = useState<EvtStatusDTO_OUT[]>([]);
  const [isEligible, setIsEligible] = useState<string | undefined>(""); // empty for all values
  const [isRewarded, setIsRewarded] = useState<string | undefined>(""); // empty for all values
  const { isEmailFormOpen, emailTo, openEmailForm, closeEmailForm } = useEmailForm();//이메일 전송 EmailForm과 연동

  const fetchUserEvtStatuses = () => {
    axiosAuthInstacne
      .get(`/admin/evt/evt-statuses`, {
        params: {
          eventId: eventId,
          isEligible: isEligible !== "" ? isEligible : undefined,
          isRewarded: isRewarded !== "" ? isRewarded : undefined,
        }
      })
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user event statuses:", err);
      });
  };

  const handleRewardStatusToggle = (statusId:number)=>{
    axiosAuthInstacne.patch(`/admin/evt/reward-toggle/${statusId}`)
        .then((res)=>{
            fetchUserEvtStatuses();
        })

  }
  
  //이메일 보내기
  const handleSendEmail = (emailData: { emailAddress: string; emailTitle: string; emailContent: string, base64Img:string }) => {
    console.log('이메일 발송 데이터:', emailData);
    axiosAuthInstacne.post("admin/email/send", {...emailData}).then((res)=>{
      if(res.data === "메일 전송 완료"){
        Swal.fire(`${emailData.emailAddress} 님에게 이메일을 보냈습니다.`, "", "success");

      }else{
        Swal.fire(`${ res.data}`, "", "success");
      }
    })
    // TODO: 이메일 전송 API 호출 구현

    closeEmailForm();
  };

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-screen p-5">
      <section className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-center">이벤트 참여 유저 목록</h2>
          <p className="text-center text-gray-600">이벤트에 참여한 유저들의 리스트를 확인하세요.</p>
        </div>

        <TitleDescription
          title="조건을 충족한 유저"
          desc="조건을 충족하지만 아직 이벤트에 참여하지 않은 유저에요. 버튼을 눌러 이벤트 참여 등록을 해주세요."
        />

        <div className="w-full mt-6">
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <label className="mr-2">참여 여부</label>
              <select
                className="border p-2 rounded"
                value={isEligible}
                onChange={(e) => setIsEligible(e.target.value)}
              >
                <option value="">전체</option>
                <option value="true">참여</option>
                <option value="false">미참여</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="mr-2">보상 여부</label>
              <select
                className="border p-2 rounded"
                value={isRewarded}
                onChange={(e) => setIsRewarded(e.target.value)}
              >
                <option value="">전체</option>
                <option value="true">보상됨</option>
                <option value="false">보상 안됨</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded"
              onClick={fetchUserEvtStatuses}
            >
              조회
            </button>
          </div>

          {/* 유저 리스트 */}
          <div className="w-full overflow-x-scroll overflow-y-scroll max-h-[1024px]">
            <div>총 {userInfo.length}명</div>
            <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
                <tr className="bg-gray-100">
                    <th className="p-4 text-left text-gray-600">아이디</th>
                    <th className="p-4 text-left text-gray-600">닉네임</th>
                    <th className="p-4 text-left text-gray-600">이메일</th>
                    <th className="p-4 text-left text-gray-600">참여 여부</th>
                    <th className="p-4 text-left text-gray-600">보상 지급 여부</th>
                    <th className="p-4 text-left text-gray-600">수정일</th>               
                </tr>
              </thead>
              <tbody>
                {userInfo.map((user, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-4 text-gray-700">{user.userId}</td>
                        <td className="p-4 text-gray-700">{user.nickName}</td>
                        <td onClick={()=>{openEmailForm(user.email)}} className="p-4 text-blue-700 cursor-pointer">{user.email}</td>
                        <td className="p-4 text-gray-700">
                        <span
                            className={`px-3 py-1 rounded-full text-white whitespace-nowrap ${
                            user.isEligible ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        >
                            {user.isEligible ? "참여" : "미참여"}
                        </span>
                        </td>
                        <td className="p-4 text-gray-700 cursor-pointer" onClick={() => handleRewardStatusToggle(user.evtStatusId)}>
                        <span
                            className={`px-3 py-1 rounded-full text-white whitespace-nowrap ${
                            user.isRewarded ? 'bg-blue-500' : 'bg-gray-500'
                            }`}
                        >
                            {user.isRewarded ? "지급" : "미지급"}
                        </span>
                        </td>
                        <td className="p-4 text-gray-700 flex flex-col">
                            <span>
                                {new Date(user.updatedAt).toLocaleDateString()}
                            </span>
                            <span>
                                {new Date(user.updatedAt).toLocaleTimeString()}
                            </span>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {isEmailFormOpen && (
          <EmailForm
            initialEmail={emailTo}
            onClose={closeEmailForm}
            onSend={handleSendEmail}
            />
      )}
    </div>
  );
}
