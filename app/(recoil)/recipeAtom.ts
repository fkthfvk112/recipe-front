import { atom } from "recoil";

export const createRecipeImgState = atom<number>({
  key: "createRecipeImgState",
  default: 0,
});
