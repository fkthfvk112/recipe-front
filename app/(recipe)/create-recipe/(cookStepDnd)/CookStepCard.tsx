import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Identifier, XYCoord } from "dnd-core";
import { useDrag, useDrop } from "react-dnd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { CookingSteps_create_withPhotoSring } from "./ContainerDnd";
import ClearIcon from "@mui/icons-material/Clear";
import Image from "next/image";
import fileToBase64 from "@/app/(utils)/fileToBase64";
export interface CardProps {
  id: any;
  index: number;
  card: CookingSteps_create_withPhotoSring;
  moveCard: (dragIndex: number, hoverIndex: number, order: number) => void;
  setCards: Dispatch<SetStateAction<CookingSteps_create_withPhotoSring[]>>;
  cards: CookingSteps_create_withPhotoSring[];
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ItemTypes = {
  CARD: "card",
};

export const CookStepCard: FC<CardProps> = ({
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
    // const newCards = [...cards];
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
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        console.log("파일 있음");
        try {
          const base64String = await fileToBase64(file);
          console.log("베이스64", base64String);
          const newCards = cards.map((card) => {
            if (card.order === index) {
              return { ...card, photo: base64String, photoSring: base64String };
            }
            return card;
          });

          setCards(newCards);
          // handleFilePreviewChange(file);
        } catch (error) {
          console.error("파일 변환 오류:", error);
        }
      }
    }
  };

  // const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
  //   event
  // ) => {
  //   let file: File | null = null;
  //   if (event.target.files !== null) file = event.target.files[0];
  //   if (file) {

  //     const newCards = cards.map((card) => {
  //       if (card.order === index) {
  //         card.photo = file;
  //       }
  //       return card;
  //     });

  //     if (file) {
  //       handleFilePreviewChange(file);
  //       file;
  //     } else {
  //       setCards(newCards);
  //     }
  //   }
  // };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newCards = cards.map((card) => {
      if (card.order === index && !isNaN(Number(e.target.value))) {
        card.time = Number(e.target.value);
      }
      return card;
    });

    setCards(newCards);
  };

  // const handleFilePreviewChange = (file: File) => {
  //   const reader = new FileReader();

  //   reader.onloadend = () => {
  //     if (reader.result !== null && typeof reader.result === "string") {
  //       const newCards = cards.map((card) => {
  //         if (card.order === index && typeof reader.result === "string") {
  //           card.photoSring = reader.result;
  //         }
  //         return card;
  //       });

  //       setCards(newCards);
  //     }
  //   };

  //   reader.readAsDataURL(file);
  // };

  const deleteStep = () => {
    const newCards = cards
      .filter((card) => card.order !== index)
      .map((card, inx) => {
        return { ...card, order: inx };
      });

    console.log(newCards);
    setCards(newCards as CookingSteps_create_withPhotoSring[]);
  };
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
        <div className="bg-yellow-300 rounded-full h-8 w-8 flex justify-center items-center">
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
          <label
            className="w-full h-full flex justify-center items-center hover:cursor-pointer"
            htmlFor={`fileInput${card.order.toString()}`}
          >
            <input
              className="border border-slate-500"
              onChange={handleFileChange}
              id={`fileInput${card.order.toString()}`}
              type="file"
              hidden
            />
            {card.photoSring ? (
              <Image
                width={500}
                height={500}
                className="w-full h-full"
                style={{ objectFit: "cover" }}
                src={card.photoSring}
                alt="no img"
              />
            ) : (
              <FileUploadIcon className="text-gray-500 w-10 h-10" />
            )}
          </label>

          {/* <FilePreview file={card?.photo}></FilePreview> */}
        </div>
        <textarea
          className="ml-2 flex-grow rounded-2xl w-auto h-24 p-2 border border-slate-500 border-solid resize-none"
          onChange={handleTextChange}
          value={card.description}
        ></textarea>

        <ImportExportIcon className="hover:cursor-pointer h-12 w-12"></ImportExportIcon>
      </div>
    </div>
  );
};
