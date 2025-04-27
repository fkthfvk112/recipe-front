"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Box, Switch } from "@mui/material";
import Image from "next/image";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import ClearIcon from "@mui/icons-material/Clear";
import { extractDateTime } from "@/app/(utils)/DateUtil";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { useRouter } from "next/navigation";

interface EventDTO {
  eventId: number;
  name: string;
  content:string;
  isActive: boolean;
  bannerImgUrl: string;
  contentImgUrl:string;
  rewardName: string;
  startAt: string;
  endAt: string;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

interface EventListProps {
  setPage: Dispatch<SetStateAction<number>>;
  setSelectedEventId: Dispatch<SetStateAction<number>>;
}

export default function EventList({setPage, setSelectedEventId}:EventListProps) {
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDTO | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axiosAuthInstacne.get("/admin/evt/list").then((res) => {
      setEvents(res.data);
    });
  }, []);

  const handleToggleActive = (eventId: number, currentState: boolean) => {
    axiosAuthInstacne.patch(`/admin/evt/active-toggle/${eventId}`, {
      isActive: !currentState,
    }).then(() => {
      setEvents((prev) =>
        prev.map((e) =>
          e.eventId === eventId ? { ...e, isActive: !currentState } : e
        )
      );
      if (selectedEvent) {
        setSelectedEvent({ ...selectedEvent, isActive: !currentState });
      }
    });
  };

  const goEditPage = (eventId: string) => {
    router.push(`/admin/evt/edit/${eventId}`)
  };


  const goUserListPage = (eventId:string)=>{
    router.push(`/admin/evt/user/${eventId}`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 mt-10">
      {events.map((event) => (
        <div
          key={event.eventId}
          className="p-4 border rounded-lg shadow cursor-pointer hover:shadow-md"
          onClick={() => {
            setSelectedEvent(event);
            setModalOpen(true);
          }}
        >
          <div className="font-bold text-lg mb-2">{event.name}</div>
          <div>보상: {event.rewardName}</div>
          <div className="text-sm text-gray-600 mt-1">
            기간: {extractDateTime(event.startAt)} ~ {extractDateTime(event.endAt)}
          </div>
          <div className="mt-2">
            상태:{" "}
            <span
              className={
                event.isActive ? "text-green-600 font-semibold" : "text-gray-500"
              }
            >
              {event.isActive ? "활성화됨" : "비활성화됨"}
            </span>
          </div>
        </div>
      ))}
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
    <Box
        sx={{
        ...modalStyle,
        maxHeight: "90vh", // 전체 높이 제한
        overflowY: "auto", // 세로 스크롤
        }}
    >
        <div className="absolute right-3 top-3 cursor-pointer" onClick={() => setModalOpen(false)}>
        <ClearIcon />
        </div>
        {selectedEvent && (
        <div className="space-y-4 pb-4"> {/* 아래 패딩 추가 */}
            <TitleDescription title={selectedEvent.name} desc={selectedEvent.content}/>
            <div className="flex justify-center">
            <Image
                src={selectedEvent.bannerImgUrl}
                width={200}
                height={200}
                alt="배너 이미지"
                className="rounded-lg"
            />
            </div>

            <div className="flex justify-center">
            <Image
                src={selectedEvent.contentImgUrl}
                width={300}
                height={300}
                alt="컨텐츠 이미지"
                className="rounded-lg"
            />
            </div>

            <div className="flex justify-start items-center">
            <span className="font-medium">활성화 상태:</span>
            <Switch
                checked={selectedEvent.isActive}
                onChange={() =>
                handleToggleActive(selectedEvent.eventId, selectedEvent.isActive)
                }
                color="success"
            />
            </div>
              <div className="flex flex-col justify-center items-center">
              <button
                onClick={() => goEditPage(String(selectedEvent.eventId))} // 버튼 클릭 시 수정 페이지로 이동
                className="mt-4 px-4 py-2 w-40 saveBtn"
              >
                수정하러 가기
              </button>
              <button 
                onClick={() => goUserListPage(String(selectedEvent.eventId))} // 버튼 클릭 시 수정 페이지로 이동
                className="mt-4 px-4 py-2 w-40 saveBtn">
                유저목록
              </button>
            </div>
        </div>
        )}
    </Box>
    </Modal>

    </div>
  );
}
