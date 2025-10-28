import { atom } from "recoil";

export const createRecipeImgState = atom<number>({
  key: "createRecipeImgState",
  default: 0,
});


export const recipeStepInitialState = atom<number>({
  key:"recipeStepInitial",
  default: 0,
})