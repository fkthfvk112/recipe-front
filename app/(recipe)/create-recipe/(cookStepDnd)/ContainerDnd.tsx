import update from "immutability-helper";
import { useCallback, useEffect, useState } from "react";

import { CookStepCard } from "./CookStepCard";
import { CookStepProp } from "./CookStep";
import { CookingSteps_create } from "../../types/recipeType";

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

export const ContainerDnd = ({ recipe, setRecipe }: CookStepProp) => {
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
    console.log("카드", cards);
  }, [cards]);

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
      <div className="w-full">
        <h3>요리 순서</h3>
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </>
  );
};
