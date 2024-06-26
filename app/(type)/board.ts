import { Recipe } from "../(recipe)/types/recipeType";
import { DietDay } from "./diet";

export interface BoardPreview{
    boardId: number
    boardName: string;
    BoardMstName: string;
    content:string;
    viewCnt: number;
    heartCnt: number;
    reviewCnt: number;
    createdAt: string;
}

export interface Board{
    boardId:      number;
    userId:       string; //have to :: encrypt
    userNickName: string;
    boardUUID:    string;
    boardMstUUID: string;
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