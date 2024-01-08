import update from "immutability-helper";
import { useCallback, useEffect, useState } from "react";

import { CookStepCard } from "./CookStepCard";
import { CookStepProp } from "./CookStep";
import { CookingSteps_create } from "../../types/recipeType";
import { Tooltip } from "@mui/material";

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

export interface CookingSteps_create_withPhotoSring
  extends CookingSteps_create {
  photoSring: string;
}

export const ContainerDnd = ({
  recipe,
  setRecipe,
  letsSetRecipe,
}: CookStepProp) => {
  const [cards, setCards] = useState<CookingSteps_create_withPhotoSring[]>([
    {
      order: 0,
      photo: null,
      description: "",
      time: 0,
      photoSring: "",
    },
    {
      order: 1,
      photo: null,
      description: "",
      time: 0,
      photoSring: "",
    },
    {
      order: 2,
      photo: null,
      description: "",
      time: 0,
      photoSring: "",
    },
  ]);

  useEffect(() => {
    const addCard: CookingSteps_create[] = cards
      .filter((card) => card.description.length >= 1)
      .map((card, inx) => {
        return {
          ...card,
          order: inx,
        };
      });

    setRecipe({
      ...recipe,
      steps: addCard,
    });
  }, [letsSetRecipe]);

  const addNewStep = () => {
    const newCards = [...cards];
    newCards.push({
      order: newCards.length,
      photo: null,
      description: "",
      time: 0,
      photoSring: "",
    });
    setCards(newCards);
  };

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number, order: number) => {
      setCards((prevCards: CookingSteps_create_withPhotoSring[]) => {
        const updatedCards = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [
              hoverIndex,
              0,
              prevCards[dragIndex] as CookingSteps_create_withPhotoSring,
            ],
          ],
        });

        return updatedCards.map((card, index) => ({
          ...card,
          order: index,
        }));
      });
    },
    []
  );

  const renderCard = useCallback(
    (
      card: {
        photo: File | null;
        order: number;
        description: string;
        time: number;
        photoSring: string;
      },
      index: number
    ) => {
      return (
        <CookStepCard
          id={index}
          key={index}
          index={index}
          card={card}
          setCards={setCards}
          cards={cards}
          moveCard={(dragIndex, hoverIndex) =>
            moveCard(dragIndex, hoverIndex, card.order)
          }
        />
      );
    },
    [moveCard, setCards, cards]
  );

  return (
    <>
      <div className="w-full mt-6 mb-6 p-5">
        <h3 className="text-lg">요리 순서</h3>
        <Tooltip title="Delete">
          <span></span>
        </Tooltip>
        {cards.map((card, i) => renderCard(card, i))}
        <div className="w-full flex justify-center">
          <button onClick={addNewStep}>추가</button>
        </div>
      </div>
    </>
  );
};
