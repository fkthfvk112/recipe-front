import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { Identifier, XYCoord } from "dnd-core";
import { useDrag, useDrop } from "react-dnd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ClearIcon from "@mui/icons-material/Clear";
import Image from "next/image";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import { motion } from 'framer-motion';
import { RecipeDndCard } from "./ContainerDnd";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { createRecipeImgState } from "@/app/(recoil)/recipeAtom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";

export interface CardProps {
  id: string;
  index: number;
  card: RecipeDndCard;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  setCards: Dispatch<SetStateAction<RecipeDndCard[]>>;
  cards: RecipeDndCard[];
  cardHeight: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ItemTypes = {
  CARD: "card",
};

const CookStepCard: FC<CardProps> = ({
  id,
  index,
  moveCard,
  setCards,
  card,
  cards,
  cardHeight = 175,
}) => {
  const [, setRecipeImgCnt] = useRecoilState<number>(createRecipeImgState);
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!dropRef.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (isDragging) {
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }
  }, [isDragging]);

  drag(dragRef);
  drop(dropRef);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, description: val } : c))
      );
    },
    [id, setCards]
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numVal = Number(e.target.value);
      if (!isNaN(numVal) && numVal <= 10000) {
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, time: numVal } : c))
        );
      }
    },
    [id, setCards]
  );

  const tempSaveImg = async (imgStr: string) => {
    setRecipeImgCnt((prev) => prev + 1);
    try {
      const res = await axiosAuthInstacne.post("recipe/img", { img: imgStr });
      const cloudinaryUrl = res.data;

      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === id ? { ...c, photo: cloudinaryUrl, photoString: cloudinaryUrl } : c
        )
      );
    } catch (err) {
      Swal.fire({
        title: "이미지를 다시 등록해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#10b981",
        allowEnterKey: false,
      });
    } finally {
      setRecipeImgCnt((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const base64String = (await resizeFileToBase64(file, 1200, 1200)) as string;
        setCards((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, photo: base64String, photoString: base64String } : c
          )
        );
        await tempSaveImg(base64String);
      } catch (error) {
        console.error("파일 변환 오류:", error);
      }
    }
  };

  const deleteStep = () => {
    if (cards.length <= 1) return;
    setCards((prev) =>
      prev
        .filter((c) => c.id !== id)
        .map((c, inx) => ({ ...c, order: inx }))
    );
  };

  const deletePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, photo: "" } : c))
    );
  };

  const fileInputId = `fileInputStep_${id}`;

  return (
    <motion.div
      className={`mt-2 w-full flex flex-col bg-gray-50/80 border border-gray-200/80 rounded-2xl p-3.5 absolute text-left shadow-xs transition-shadow ${
        isDragging ? "opacity-40 shadow-xl border-emerald-400 z-50" : "hover:border-gray-300"
      }`}
      ref={dropRef}
      initial={false}
      animate={{ y: index * cardHeight }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      data-handler-id={handlerId}
    >
      {/* Card Header Bar */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white font-extrabold rounded-xl h-6 w-6 flex justify-center items-center text-[11px] shadow-xs">
            {index + 1}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded-xl shadow-xs">
            <AccessTimeIcon sx={{ fontSize: 15 }} className="text-gray-400" />
            <input
              inputMode="numeric"
              onChange={handleTimeChange}
              value={card.time}
              className="w-10 text-center text-xs font-medium text-gray-800 focus:outline-none border-none bg-transparent"
              type="text"
            />
            <span className="text-[11px] font-bold text-gray-500">분</span>
          </div>

          <button
            type="button"
            onClick={deleteStep}
            disabled={cards.length <= 1}
            className="w-6 h-6 rounded-xl bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-gray-200 border-none disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="단계 삭제"
          >
            <ClearIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      </div>

      {/* Card Content: Image Slot + Text Description + Drag Handle */}
      <div className="flex gap-2.5 items-center">
        {/* Step Image Upload Slot */}
        <div className="w-20 h-20 shrink-0 relative rounded-2xl overflow-hidden border border-gray-200 bg-white">
          <input
            onChange={handleFileChange}
            id={fileInputId}
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            hidden
          />
          {card.photo ? (
            <div className="relative w-full h-full group">
              <Image
                src={card.photo}
                alt={`조리단계 ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={deletePhoto}
                className="w-5 h-5 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-all absolute top-1 right-1 z-20 cursor-pointer border-none"
                title="사진 삭제"
              >
                <ClearIcon sx={{ fontSize: 12 }} />
              </button>
            </div>
          ) : (
            <label
              htmlFor={fileInputId}
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/20 transition-colors group p-1"
            >
              <FileUploadIcon sx={{ fontSize: 20 }} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-emerald-600 transition-colors mt-0.5">사진 등록</span>
            </label>
          )}
        </div>

        {/* Step Description Input */}
        <textarea
          placeholder="이 조리 단계에 대한 설명을 적어주세요. (예: 삼겹살을 중불에서 노릇하게 구워줍니다)"
          className="flex-1 h-20 p-2.5 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-2xl placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none resize-none transition-all"
          onChange={handleTextChange}
          value={card.description}
          maxLength={200}
        />

        {/* Drag Handle */}
        <div 
          ref={dragRef} 
          className="h-20 flex items-center justify-center px-1.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-emerald-600 transition-colors select-none"
          title="드래그하여 순서 변경"
        >
          <ImportExportIcon sx={{ fontSize: 22 }} />
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(CookStepCard);