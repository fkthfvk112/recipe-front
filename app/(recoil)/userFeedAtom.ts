import { atom, atomFamily } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const userFeedMenuAtom = atomFamily<number, string>({
    key:"userFeedMenuKey",
    default: (userNickName:string)=>(0)
})

export const ingreNSelectAtom = atom<number>({
  key: "ingreNSelect",
  default: 3,
  effects_UNSTABLE: [persistAtom],
});

export const checkAnonymousAtom = atom<boolean>({
    key: "checkAnonymous ",
    default: false,
    effects_UNSTABLE: [persistAtom],   
})