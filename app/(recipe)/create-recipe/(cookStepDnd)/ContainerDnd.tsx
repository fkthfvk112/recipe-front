import update from "immutability-helper";
import { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import  CookStepCard from "./CookStepCard";
import { CookStepProp } from "./CookStep";
import { CookingSteps_create } from "../../types/recipeType";

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}


export const ContainerDnd = ({
  recipe,
  setRecipe,
}: CookStepProp) => {
  const [cards, setCards] = useState<CookingSteps_create[]>(()=>{
    if(recipe.steps && recipe.steps.length > 0){
      const initialData:CookingSteps_create[] = recipe.steps.map(ele=>{
        const existPhoto:string = !(ele.photo === null || ele.photo === undefined) && ele.photo.length > 10 ? ele.photo : "";    
        return {
          ...ele,
          photo: existPhoto
        }
      })
      return initialData;
    }
    else{
      return[
        {
          order: 0,
          photo: "",
          description: "",
          time: 0,
        },
        {
          order: 1,
          photo: "",
          description: "",
          time: 0,
        },
        {
          order: 2,
          photo: "",
          description: "",
          time: 0,
        },
      ]
    }
  })

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
  }, [cards]);

  const addNewStep = () => {
    const newCards = [...cards];
    newCards.push({
      order: newCards.length,
      photo: "",
      description: "",
      time: 0,
    });
    setCards(newCards);
  };

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number, order: number) => {
      setCards((prevCards: CookingSteps_create[]) => {
        const updatedCards = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [
              hoverIndex,
              0,
              prevCards[dragIndex] as CookingSteps_create,
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
        photo: string | null;
        order: number;
        description: string;
        time: number;
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
        <h2 className="text-xl">요리 순서</h2>

        {cards.map((card, i) => renderCard(card, i))}
        <div className="w-full flex justify-center">
          <AddIcon
            className="m-1 w-12 h-12 border border-slate-500 hover:cursor-pointer"
            onClick={addNewStep}
          >
            추가
          </AddIcon>
        </div>
      </div>
    </>
  );
};
