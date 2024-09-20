import { atomFamily } from "recoil";


export const userFeedMenuAtom = atomFamily<number, string>({
    key:"userFeedMenuKey",
    default: (userNickName:string)=>(0)
})