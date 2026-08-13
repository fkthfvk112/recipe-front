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
import { motion, useAnimation } from 'framer-motion';
import { RecipeDndCard } from "./ContainerDnd";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { createRecipeImgState } from "@/app/(recoil)/recipeAtom";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";

export interface CardProps {
  id: any;
  index: number;
  card: RecipeDndCard;
  moveCard: (dragIndex: number, hoverIndex: number, order: number) => void;
  setCards: Dispatch<SetStateAction<RecipeDndCard[]>>;
  cards: RecipeDndCard[];
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
}) => {
  const [, setRecipeImgCnt] = useRecoilState<number>(createRecipeImgState);
  
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

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
      if (!dragRef.current || !dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = dropRef.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY - 50) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY + 50) {
        return;
      }

      controls.start({
        y: [hoverIndex * 250, dragIndex * 250],
        transition: { duration: 0.1, ease: "easeOut" },
      });

      setTimeout(() => {
        moveCard(dragIndex, hoverIndex, card.order);
      }, 150);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
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
    (e: any) => {
      const newCards = cards.map((c) => {
        if (c.order === index) {
          c.description = e.target.value;
        }
        return c;
      });
      setCards(newCards);
    },
    [index, setCards, cards]
  );

  const tempSaveImg = async (imgStr: string, stepIdx: number) => {
    setRecipeImgCnt(prev => prev + 1);
    try {
      const res = await axiosAuthInstacne.post("recipe/img", { img: imgStr });
      const cloudinaryUrl = res.data;
      
      setCards(prevCards =>
        prevCards.map(c =>
          c.order === stepIdx ? { ...c, photo: cloudinaryUrl, photoString: cloudinaryUrl } : c
        )
      );
    } catch (err) {
      Swal.fire({
        title: "이미지를 다시 등록해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: '#10b981',
        allowEnterKey: false
      });
    } finally {
      setRecipeImgCnt(prev => Math.max(prev - 1, 0));
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        try {
          const base64String = await resizeFileToBase64(file, 1200, 1200) as string;
          const newCards = cards.map((c) => {
            if (c.order === index) {
              return { ...c, photo: base64String, photoString: base64String };
            }
            return c;
          });
          setCards(newCards);
          await tempSaveImg(base64String, index);
        } catch (error) {
          console.error("파일 변환 오류:", error);
        }
      }
    }
  };

  const handleTimeChange = useCallback(
    (e: any) => {
      const newCards = cards.map((c) => {
        if (c.order === index && !isNaN(Number(e.target.value)) && Number(e.target.value) <= 10000) {
          c.time = Number(e.target.value);
        }
        return c;
      });
      setCards(newCards);
    },
    [index, setCards, cards]
  );

  const deleteStep = () => {
    if (cards.length <= 1) return;
    const newCards = cards
      .filter((c) => c.order !== index)
      .map((c, inx) => {
        return { ...c, order: inx, id: inx };
      });
    setCards(newCards as RecipeDndCard[]);
  };

  const deletePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCards = cards.map((c) => {
      if (c.order === index) {
        c.photo = "";
      }
      return c;
    });
    setCards(newCards);
  };

  const fileInputId = `fileInputStep_${card.order}`;

  return (
    <motion.div
      className="mt-3 w-full flex flex-col bg-gray-50/70 border border-gray-200/80 rounded-2xl p-3.5 absolute text-left shadow-xs"
      ref={dropRef}
      initial={{ y: index * 250 }}
      animate={controls}
      data-handler-id={handlerId}
      key={id}
    >
      {/* Card Header Bar */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 text-white font-extrabold rounded-xl h-7 w-7 flex justify-center items-center text-xs shadow-xs">
            {card.order + 1}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-2.5 py-1 rounded-xl shadow-xs">
            <AccessTimeIcon sx={{ fontSize: 16 }} className="text-gray-400" />
            <input
              inputMode="numeric"
              onChange={handleTimeChange}
              value={card.time}
              className="w-12 text-center text-xs font-medium text-gray-800 focus:outline-none border-none bg-transparent"
              type="text"
            />
            <span className="text-[11px] font-bold text-gray-500">분</span>
          </div>

          <button
            type="button"
            onClick={deleteStep}
            disabled={cards.length <= 1}
            className="w-7 h-7 rounded-xl bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all border border-gray-200 border-none disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="단계 삭제"
          >
            <ClearIcon sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>

      {/* Card Content: Image Upload + Text Description */}
      <div className="flex gap-2.5 items-start">
        {/* Step Image Upload Slot */}
        <div className="w-24 h-24 shrink-0 relative rounded-2xl overflow-hidden border border-gray-200 bg-white">
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
                alt={`조리단계 ${card.order + 1}`}
                fill
                sizes="96px"
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
              <FileUploadIcon sx={{ fontSize: 22 }} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              <span className="text-[10px] font-bold text-gray-400 group-hover:text-emerald-600 transition-colors mt-0.5">사진 등록</span>
            </label>
          )}
        </div>

        {/* Step Description Input */}
        <textarea
          placeholder="이 조리 단계에 대한 설명을 적어주세요. (예: 삼겹살을 중불에서 노릇하게 구워줍니다)"
          className="flex-1 h-24 p-3 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-2xl placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none resize-none transition-all"
          onChange={handleTextChange}
          value={card.description}
          maxLength={200}
        />

        {/* Drag Handle */}
        <div ref={dragRef} className="h-24 flex items-center justify-center px-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-emerald-600 transition-colors">
          <ImportExportIcon sx={{ fontSize: 22 }} />
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(CookStepCard);