// Evt.tsx
"use client"
import { use, useState } from "react"
import RegisterEvt from "./RegisterEvt";
import EventList from "./EventList";
export interface EventDTO {
    eventId: number;
    name: string;
    content: string;
    isActive: boolean;
    bannerImgUrl: string;
    contentImgUrl: string;
    rewardName: string;
    startAt: string;
    endAt: string;
  }

export default function Evt() {
  const [page, setPage] = useState<number>(0);
  const [selectedEvtId, setSelectedEventId] = useState<number>(0);

  return (
    <>
      <div className="flex flex-row">
        <button onClick={() => {
          setPage(0);
          setSelectedEventId(0);
        }} className={`${page === 0 ? "greenBtn" : "grayBtn"} me-1`}>이벤트 목록</button>

        <button onClick={() => {
          setPage(1);
          setSelectedEventId(0);
        }} className={`${page === 1 ? "greenBtn" : "grayBtn"} ms-1`}>이벤트 등록</button>
      </div>
      {page === 0 && <EventList setPage={setPage} setSelectedEventId={setSelectedEventId}/>}
      {page === 1 && <RegisterEvt />}
    </>
  );
}
