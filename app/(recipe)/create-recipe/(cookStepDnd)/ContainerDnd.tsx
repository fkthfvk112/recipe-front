"use client";

import update from "immutability-helper";
import { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CookStepCard from "./CookStepCard";
import { CookStepProp } from "./CookStep";
import { CookingSteps_create } from "../../types/recipeType";
import { useRecoilState } from "recoil";
import { recipeStepInitialState } from "@/app/(recoil)/recipeAtom";

export interface RecipeDndCard extends CookingSteps_create {
  id: string;
}

const generateUniqueId = (): string => {
  return `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

function getInitialCards(recipe: { steps?: CookingSteps_create[] }): RecipeDndCard[] {
  if (recipe.steps && recipe.steps.length > 0) {
    return recipe.steps.map((ele, inx) => {
      const existPhoto =
        ele.photo !== null && ele.photo !== undefined && ele.photo.length > 10
          ? ele.photo
          : "";

      return {
        ...ele,
        photo: existPhoto,
        order: inx,
        id: generateUniqueId(),
      } as RecipeDndCard;
    });
  } else {
    return [
      { order: 0, photo: "", description: "", time: 0, id: generateUniqueId() },
      { order: 1, photo: "", description: "", time: 0, id: generateUniqueId() },
      { order: 2, photo: "", description: "", time: 0, id: generateUniqueId() },
    ] as RecipeDndCard[];
  }
}

export const ContainerDnd = ({ recipe, setRecipe }: CookStepProp) => {
  const [resetStep] = useRecoilState<number>(recipeStepInitialState);
  const [cards, setCards] = useState<RecipeDndCard[]>(() => getInitialCards(recipe));
  const cardHeight = 175; // Optimized step height

  useEffect(() => {
    const resetCards = getInitialCards(recipe);
    setCards(resetCards);
  }, [resetStep]);

  useEffect(() => {
    const updatedSteps: CookingSteps_create[] = cards.map((card, inx) => ({
      photo: card.photo,
      description: card.description,
      time: card.time,
      order: inx,
    }));

    setRecipe((prev) => ({
      ...prev,
      steps: updatedSteps,
    }));
  }, [cards, setRecipe]);

  const addNewStep = () => {
    setCards((prev) => [
      ...prev,
      {
        order: prev.length,
        photo: "",
        description: "",
        time: 0,
        id: generateUniqueId(),
      },
    ]);
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: RecipeDndCard[]) => {
      const draggedCard = prevCards[dragIndex];
      if (!draggedCard) return prevCards;

      const updatedCards = update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedCard],
        ],
      });

      return updatedCards.map((card, index) => ({
        ...card,
        order: index,
      }));
    });
  }, []);

  return (
    <div className="w-full mb-6 text-left">
      <div className="mb-3">
        <h3 className="text-sm font-black text-gray-900">조리 순서 등록 (드래그하여 순서 변경)</h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          요리 과정을 순서대로 작성해 주세요. 오른쪽 아이콘을 잡고 위치를 옮길 수 있습니다.
        </p>
      </div>

      <div
        className="relative w-full transition-all duration-200"
        style={{ height: cards.length * cardHeight }}
      >
        {cards.map((card, i) => (
          <CookStepCard
            key={card.id}
            id={card.id}
            index={i}
            card={card}
            setCards={setCards}
            cards={cards}
            moveCard={moveCard}
            cardHeight={cardHeight}
          />
        ))}
      </div>

      {/* Add Step Button */}
      <button
        type="button"
        onClick={addNewStep}
        className="w-full py-3.5 mt-3 border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/40 hover:bg-emerald-50/20 text-emerald-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer outline-none shadow-xs"
      >
        <AddIcon sx={{ fontSize: 18 }} />
        <span>조리 단계 추가하기</span>
      </button>
    </div>
  );
};
