import { Recipe } from "../(recipe)/types/recipeType";
import { DietDay } from "./diet";

export interface BoardPreview{
    boardId: number
    boardName: string;
    boardMenuId: number;
    content:string;
    viewCnt: number;
    heartCnt: number;
    reviewCnt: number;
    createdAt: string;
}

export interface Board{
    boardId:      number;
    userId:       string;
    userNickName: string;
    boardUUID:    string;
    boardMenuId:  number;
    title:        string;
    content:      string;
    photos?:      string[];
    recipes?:     Recipe[];
    dietDays?:    DietDay[];
    viewCnt:      number;
    createdAt?:    string;
    updatedAt?:    string;
    userPhoto?:    string;
}