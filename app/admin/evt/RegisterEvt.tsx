"use client"
import { useState } from "react";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import Image from "next/image";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";

export interface EvtCondition {
    description: string;
    userSelectQuery: string;
}

export interface RegisterEvtDTO_IN {
    eventName: string;
    evtContent: string;
    evtBannerImg: string;
    contentImg: string;
    returnUrl:string;
    startAt: string;
    endAt: string;
    isActive: boolean;
    rewardName: string;
    evtConditionList: EvtCondition[];
}

export default function RegisterEvt() {
    // 상태 정의
    const [eventName, setEventName] = useState<string>('');
    const [evtContent, setEvtContent] = useState<string>('');
    const [returnUrl, setReturnUrl] = useState<string>("");
    const [evtBannerImg, setEvtBannerImg] = useState<string>(""); // 배너 이미지 상태
    const [contentImg, setContentImg] = useState<string>(""); // 콘텐츠 이미지 상태
    const [startAt, setStartAt] = useState<string>('');
    const [endAt, setEndAt] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [rewardName, setRewardName] = useState<string>('');
    
    // 조건 리스트 상태 정의
    const [evtConditionList, setEvtConditionList] = useState<EvtCondition[]>([
        { description: "", userSelectQuery: "" },
    ]);

    // 이벤트 이름 업데이트
    const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value);

    // 조건 리스트 업데이트
    const handleConditionChange = (index: number, field: keyof EvtCondition, value: string) => {
        const updatedConditions = [...evtConditionList];
        updatedConditions[index][field] = value;
        setEvtConditionList(updatedConditions);
    };

    // 조건 추가
    const addCondition = () => {
        setEvtConditionList([
            ...evtConditionList,
            { description: "", userSelectQuery: "" },
        ]);
    };

    // 조건 삭제
    const removeCondition = (index: number) => {
        const updatedConditions = [...evtConditionList];
        updatedConditions.splice(index, 1);
        setEvtConditionList(updatedConditions);
    };

    const handleBannerFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
        event
      ) => {
        if (event.target.files) {
          const file = event.target.files[0];
          if (file) {
            try {
              const base64String = await resizeFileToBase64(file, 1200, 1200) as string;
              setEvtBannerImg(base64String);
                } catch (error) {
              console.error("파일 변환 오류:", error);
            }
          }else{
            setEvtBannerImg("");
          }
        }
      };
      
    const handleContentFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
        event
      ) => {
        if (event.target.files) {
          const file = event.target.files[0];
          if (file) {
            try {
              const base64String = await resizeFileToBase64(file, 1200, 1200) as string;
              setContentImg(base64String);
                } catch (error) {
              console.error("파일 변환 오류:", error);
            }
          }
          else{
            setContentImg("");
          }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const payload: RegisterEvtDTO_IN = {
            eventName,
            evtContent,
            evtBannerImg, // base64 문자열
            contentImg,   // base64 문자열
            returnUrl,
            startAt,
            endAt,
            isActive,
            rewardName,
            evtConditionList,
        };

        axiosAuthInstacne.post("admin/evt/register", payload)
            .then((res)=>{
                Swal.fire({
                    title: "이벤트가 등록 되었습니다!",
                    icon: "success",
                })
            })
    };

    return (
        <>
            <TitleDescription title="이벤트 등록" desc="이벤트를 등록해요." />

            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
                {/* 이벤트 이름 */}
                <div className="flex flex-col">
                    <label htmlFor="eventName">이벤트 이름</label>
                    <input
                        id="eventName"
                        type="text"
                        value={eventName}
                        onChange={handleEventNameChange}
                        className="border p-2"
                        required
                    />
                </div>

                {/* 이벤트 설명 */}
                <div className="flex flex-col">
                    <label htmlFor="evtContent">이벤트 설명</label>
                    <textarea
                        id="evtContent"
                        value={evtContent}
                        onChange={(e) => setEvtContent(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="returnUrl">클릭시 이동 url(ex: /recipe-detail/12)</label>
                    <textarea
                        id="returnUrl"
                        value={returnUrl}
                        onChange={(e) => setReturnUrl(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>
                {/* 배너 이미지 */}
                <div className="flex flex-col">
                    <label htmlFor="evtBannerImg">배너 이미지 (*정사각 이미지)</label>
                    <div className="m-1 relative border rounded-xl min-w-[150px] min-h-[150px] w-[150px] h-[150px] mt-5">
                        <Image className="inner-img" width={150} height={150} src={evtBannerImg} alt="no imgage"/>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBannerFileChange(e)}
                        className="border p-2"
                    />
                </div>

                {/* 콘텐츠 이미지 */}
                <div className="flex flex-col">
                    <label htmlFor="contentImg">컨텐츠 이미지</label>
                    <div className="m-1 relative border rounded-xl bg-slate-200 mt-5">
                    <Image
                    src={contentImg}
                    alt="no image"
                    width={0}
                    height={0}
                    sizes="100vw" // 크기 자동 계산에 도움
                    style={{ width: 'auto', height: 'auto' }}
                    className="object-contain"
                    />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleContentFileChange(e)}
                        className="border p-2"
                    />
                </div>

                {/* 시작 시간 */}
                <div className="flex flex-col">
                    <label htmlFor="startAt">시작 시간</label>
                    <input
                        type="datetime-local"
                        id="startAt"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>

                {/* 종료 시간 */}
                <div className="flex flex-col">
                    <label htmlFor="endAt">종료 시간</label>
                    <input
                        type="datetime-local"
                        id="endAt"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                        className="border p-2"
                    />
                </div>

                {/* 이벤트 활성화 여부 */}
                <div className="flex flex-col">
                    <label htmlFor="isActive">이벤트 활성화 여부</label>
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                </div>

                {/* 보상 유형 */}
                <div className="flex flex-col">
                    <label htmlFor="rewardName">보상 유형</label>
                    <input
                        id="rewardName"
                        type="text"
                        value={rewardName}
                        onChange={(e) => setRewardName(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>

                {/* 조건 리스트 */}
                <div>
                    {evtConditionList.map((condition, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex flex-col">
                                <label htmlFor={`condition${index}`}>조건 설명</label>
                                <input
                                    type="text"
                                    value={condition.description}
                                    onChange={(e) => handleConditionChange(index, 'description', e.target.value)}
                                    className="border p-2"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor={`conditionDomainType${index}`}>조건에 맞는 유저 select쿼리(jpql)</label>
                                <input
                                    type="text"
                                    value={condition.userSelectQuery}
                                    onChange={(e) => handleConditionChange(index, 'userSelectQuery', e.target.value)}
                                    className="border p-2"
                                />
                            </div>
                            {/* 조건 삭제 버튼 */}
                            <button
                                type="button"
                                onClick={() => removeCondition(index)}
                                className="cancelBtn"
                            >
                                조건 삭제
                            </button>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button type="button" onClick={addCondition} className="saveBtn">
                            조건 추가
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button type="submit" className="greenBtn text-white p-2 mt-4">
                        이벤트 등록
                    </button>
                </div>
            </form>
        </>
    );
}
