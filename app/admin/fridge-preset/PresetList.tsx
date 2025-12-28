"use client";

import { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Image from "next/image";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useRouter } from "next/navigation";


export interface FridgePresetPreviewDTO{
  fridgePresetId:number;
  name:string;
  presetSort:string;
  description:string;
  items:FrdgePresetItemPreviewDTO[];
}

export interface FrdgePresetItemPreviewDTO{
  fridgeItemPresetId:number;
  sortOrder:number;
  imgUrl:String;
  ingreName:String;
}

interface PresetDetailDTO{
   presetId: number;
   name: string;
   presetSort: string;
   description?: string;
   items: {
     sortOrder: number;
     ingreListId?: number;
     ingreName?: string;
     fridgeImgId?: number;
     fridgeImgUrl?: string;
   }[];
   createdAt?: string;
  updatedAt?: string;
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

export default function PresetList() {
  const [presets, setPresets] = useState<FridgePresetPreviewDTO[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<PresetDetailDTO | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const router = useRouter();


  // 1) 프리셋 목록 조회
  useEffect(() => {
    axiosAuthInstacne.get("/fridge/preset/list").then((res) => {
      setPresets(res.data ?? []);
    });
  }, []);

  // 2) 카드 클릭 시 상세 조회 후 모달 오픈
  const openDetail = async (presetId: number) => {
    try {
      setLoadingDetail(true);
      setModalOpen(true);

      const res = await axiosAuthInstacne.get(
        `/fridge/preset/detail?presetId=${presetId}`
      );
      setSelectedPreset(res.data);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 mt-10">
        {presets.map((preset) => (
          <div
            key={preset.fridgePresetId}
            className="p-4 border rounded-lg shadow cursor-pointer hover:shadow-md bg-white"
            onClick={() => openDetail(preset.fridgePresetId)}
          >
            <div className="font-bold text-lg mb-2">{preset.name}</div>

            <div className="text-sm text-gray-700">
              종류(presetSort): <b>{preset.presetSort}</b>
            </div>

            {typeof preset.items?.length === "number" && (
              <div className="text-sm text-gray-700 mt-1">
                아이템 수: <b>{preset.items.length}</b>
              </div>
            )}

            {preset.description && (
              <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                {preset.description}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            ...modalStyle,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setModalOpen(false)}
          >
            <ClearIcon />
          </div>

          {loadingDetail && (
            <div className="p-2 text-sm text-gray-600">불러오는 중...</div>
          )}

          {!loadingDetail && selectedPreset && (
            <div className="space-y-4 pb-4">
              <TitleDescription
                title={selectedPreset.name}
                desc={
                  selectedPreset.description
                    ? selectedPreset.description
                    : `presetSort: ${selectedPreset.presetSort}`
                }
              />

              <div className="text-sm text-gray-700">
                <b>presetSort:</b> {selectedPreset.presetSort}
              </div>

              <div className="mt-3">
                <div className="font-bold mb-2">아이템</div>

                {selectedPreset.items?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPreset.items
                      .slice()
                      .sort((a:any, b:any) => a.sortOrder - b.sortOrder)
                      .map((it:any) => (
                        <div
                          key={it.sortOrder}
                          className="border rounded-lg p-3 bg-[#fafafa] flex gap-3 items-center"
                        >
                          <div className="w-[52px] h-[52px] relative rounded-md overflow-hidden border bg-white">
                            {it.fridgeImgUrl ? (
                              <Image
                                src={it.fridgeImgUrl as string}
                                alt="img"
                                fill
                                sizes="52px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                NO IMG
                              </div>
                            )}
                          </div>

                          <div className="text-sm">
                            <div className="font-semibold">
                              {it.sortOrder}-
                              {it.ingreName}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    등록된 아이템이 없습니다.
                  </div>
                )}
              </div>

              {/* 삭제/수정 버튼은 다음 단계에서 연결(요청하신 “리스트 출력” 이후) */}
              <div className="flex flex-col items-center justify-center gap-2 pt-2">
                <button
                  className="grayBtn px-3 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/fridge-preset/edit/${selectedPreset?.presetId}`);
                  }}
                >
                  수정
                </button>
                <button
                  type="button"
                  className="grayBtn w-40"
                  onClick={() => setModalOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
