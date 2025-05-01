"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { EvtCondition } from "../../RegisterEvt";

// interface EventUpdProps {
//     eventId:number;
//     setPage: Dispatch<SetStateAction<number>>;
//     setSelectedEventId: Dispatch<SetStateAction<number>>;
// }

export default function UpdateEvt({
    params
  }: {
    params:{eventId:string};
  }) {
    const [eventName, setEventName] = useState<string>('');
    const [evtContent, setEvtContent] = useState<string>('');
    const [returnUrl, setReturnUrl] = useState<string>('');
    const [evtBannerImg, setEvtBannerImg] = useState<string>(""); // 배너 이미지 상태
    const [contentImg, setContentImg] = useState<string>(""); // 콘텐츠 이미지 상태
    const [startAt, setStartAt] = useState<string>('');
    const [endAt, setEndAt] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [rewardName, setRewardName] = useState<string>('');
    
    const [evtConditionList, setEvtConditionList] = useState<EvtCondition[]>([]);
    
    useEffect(() => {
        if (params.eventId) {
            axiosAuthInstacne.get(`/admin/evt/${params.eventId}`).then(res => {
                const data = res.data;
                setEventName(data.name);
                setEvtContent(data.content);
                setReturnUrl(data.returnUrl)
                setEvtBannerImg(data.bannerImgUrl);
                setContentImg(data.contentImgUrl);
                setStartAt(data.startAt?.slice(0, 16));
                setEndAt(data.endAt?.slice(0, 16));
                setIsActive(data.isActive);
                setRewardName(data.rewardName);
                setEvtConditionList(data.conditionList || []);
            });
        }
    }, [params.eventId]);

    const handleBannerFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await resizeFileToBase64(file, 1200, 1200) as string;
            setEvtBannerImg(base64);
        }
    };

    const handleContentFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await resizeFileToBase64(file, 1200, 1200) as string;
            setContentImg(base64);
        }
    };

    const handleConditionChange = (index: number, field: keyof EvtCondition, value: string) => {
        const updated = [...evtConditionList];
        updated[index][field] = value;
        setEvtConditionList(updated);
    };

    const addCondition = () => {
        setEvtConditionList([...evtConditionList, { description: "", userSelectQuery: ""}]);
    };

    const removeCondition = (index: number) => {
        const updated = [...evtConditionList];
        updated.splice(index, 1);
        setEvtConditionList(updated);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            eventName,
            evtContent,
            returnUrl,
            evtBannerImg,
            contentImg,
            startAt,
            endAt,
            isActive,
            rewardName,
            evtConditionList,
        };

    
        axiosAuthInstacne.put(`/admin/evt/update/${params.eventId}`, payload)
            .then((res) => {
                Swal.fire("이벤트가 수정되었습니다!", "", "success");
            })
            .catch((err) => {
                Swal.fire("수정 실패", "다시 시도해주세요.", "error");
            });
    };

    return (
        <>
            <TitleDescription title="이벤트 수정" desc="이벤트를 수정해요." />
            <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
                <div className="flex flex-col">
                    <label>이벤트 이름</label>
                    <input value={eventName} onChange={(e) => setEventName(e.target.value)} className="border p-2" required />
                </div>

                <div className="flex flex-col">
                    <label>이벤트 설명</label>
                    <textarea value={evtContent} onChange={(e) => setEvtContent(e.target.value)} className="border p-2" required />
                </div>

                <div className="flex flex-col">
                    <label>클릭시 이동 url(ex: /recipe-detail/12)</label>
                    <input value={returnUrl} onChange={(e) => setReturnUrl(e.target.value)} className="border p-2" required />
                </div>

                <div className="flex flex-col">
                    <label>배너 이미지</label>
                    <Image src={evtBannerImg} alt="banner" width={150} height={150} className="rounded-xl border mt-2" />
                    <input type="file" accept="image/*" onChange={handleBannerFileChange} className="border p-2 mt-2" />
                </div>

                <div className="flex flex-col">
                    <label>컨텐츠 이미지</label>
                    <Image src={contentImg} alt="content" width={0} height={0} sizes="100vw" style={{ width: 'auto', height: 'auto' }} className="object-contain mt-2" />
                    <input type="file" accept="image/*" onChange={handleContentFileChange} className="border p-2 mt-2" />
                </div>

                <div className="flex flex-col">
                    <label>시작 시간</label>
                    <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="border p-2" required />
                </div>

                <div className="flex flex-col">
                    <label>종료 시간</label>
                    <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="border p-2" />
                </div>

                <div className="flex flex-col">
                    <label>이벤트 활성화 여부</label>
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                </div>

                <div className="flex flex-col">
                    <label>보상 유형</label>
                    <input value={rewardName} onChange={(e) => setRewardName(e.target.value)} className="border p-2" required />
                </div>

                <div>
                    {evtConditionList.map((condition, index) => (
                        <div key={index} className="border p-2 my-2 rounded space-y-2">
                            <input value={condition.description} onChange={(e) => handleConditionChange(index, 'description', e.target.value)} placeholder="조건 설명" className="border p-2 w-full" />
                            <input value={condition.userSelectQuery} onChange={(e) => handleConditionChange(index, 'userSelectQuery', e.target.value)} placeholder="유저 쿼리(jpql)" className="border p-2 w-full" />
                            <button type="button" onClick={() => removeCondition(index)} className="text-red-500 underline">조건 삭제</button>
                        </div>
                    ))}
                    <button type="button" onClick={addCondition} className="greenBtn mt-2">조건 추가</button>
                </div>

                <button type="submit" className="greenBtn text-white p-2 mt-4">이벤트 수정</button>
            </form>
        </>
    );
}
