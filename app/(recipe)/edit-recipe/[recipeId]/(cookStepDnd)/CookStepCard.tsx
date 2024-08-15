import React, {
  Dispatch,
  FC,
  SetStateAction,
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
import { CookingSteps_create } from "@/app/(recipe)/types/recipeType";

export interface CardProps {
  id: any;
  index: number;
  card: CookingSteps_create;
  moveCard: (dragIndex: number, hoverIndex: number, order: number) => void;
  setCards: Dispatch<SetStateAction<CookingSteps_create[]>>;
  cards: CookingSteps_create[];
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
  const ref = useRef<HTMLDivElement>(null);
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
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex, card.order);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    const newCards = cards.map((card) => {
      if (card.order === index) {
        card.description = e.target.value;
      }
      return card;
    });

    setCards(newCards);
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {


    console.log("이거요오~");

    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        try {
          const base64String = await resizeFileToBase64(file) as string;
          const newCards = cards.map((card) => {
            if (card.order === index) {
              return { ...card, photo: base64String };
            }
            return card;
          });

          setCards(newCards);
        } catch (error) {
          console.error("파일 변환 오류:", error);
        }
      }
    }
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newCards = cards.map((card) => {
      if (card.order === index && !isNaN(Number(e.target.value))) {
        card.time = Number(e.target.value);
      }
      return card;
    });

    setCards(newCards);
  };

  const deleteStep = () => {
    const newCards = cards
      .filter((card) => card.order !== index)
      .map((card, inx) => {
        return { ...card, order: inx };
      });

    setCards(newCards as CookingSteps_create[]);
  };


  const deletePhoto = ()=>{
    const newCards = cards.map((card) => {
      if (card.order === index) {
        card.photo = "";
      }
      return card;
    });
    setCards(newCards);
  }

  return (
    <div
      className={
        "mt-3 w-full flex flex-col relative bg-zinc-100 rounded-2xl p-2"
      }
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <ClearIcon
        className="w-6 h-6 hover:cursor-pointer absolute right-2 top-2"
        onClick={deleteStep}
      ></ClearIcon>
      <div className="flex flex-row justify-between items-center row-span-1 col-span-1 row-start-1">
        <div className="bg-[#52cf63] text-white font-bold rounded-xl h-8 w-8 flex justify-center items-center ms-2">
          {card.order + 1}
        </div>
        <div className="mr-10">
          <AccessTimeIcon></AccessTimeIcon>
          <input
            onChange={handleTimeChange}
            value={card.time}
            className="w-20 m-1 border border-slate-500"
            type="text"
          />
          분
        </div>
      </div>
      <div className=" p-3 flex flex-row justify-center items-center w-full">
        <div className="bg-slate-50 border border-slate-400 m-2 w-24 h-24 ">
            <input
              className="border border-slate-500"
              onChange={handleFileChange}
              id={`fileInput${card.order.toString()}`}
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .webp"
              hidden
            />
            {card.photo ? (
              <div className="w-[100px] h-[100px] img-wrapper-square">
                <button onClick={()=>deletePhoto()} className="border-none w-5 h-5 absolute -top-3 right-1 z-50">
                  <ClearIcon className="bg-white"/>
                </button>
                <Image
                  className="w-full h-full"
                  style={{ objectFit: "cover" }}
                  src={card.photo}
                  alt="no img"
                  fill
                />
              </div>
            ) : (
              <label className="w-[100px] h-[100px] flex justify-center items-center hover:cursor-pointer" htmlFor={`fileInput${card.order.toString()}`}>
                <FileUploadIcon className="text-gray-500 w-10 h-10" />
              </label>
            )}

          {/* <FilePreview file={card?.photo}></FilePreview> */}
        </div>
        <textarea
          placeholder="3자 이상 200자 이하"
          className="ml-2 flex-grow rounded-2xl w-auto h-24 p-2 border border-slate-500 border-solid resize-none"
          onChange={handleTextChange}
          value={card.description}
          maxLength={200}
        ></textarea>

        <ImportExportIcon className="hover:cursor-pointer h-12 w-12"></ImportExportIcon>
      </div>
    </div>
  );
};

export default React.memo(CookStepCard)