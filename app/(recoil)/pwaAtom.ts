import { atom } from "recoil";

/** PWA(standalone) 모드로 실행 중인지 여부 */
export const isPwaAtom = atom<boolean>({
  key: "isPwaAtom",
  default: false,
});
