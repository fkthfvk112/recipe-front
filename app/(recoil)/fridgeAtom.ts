import { atom, selector } from "recoil";
import { Fridge } from "../(type)/fridge";

export const fridgeDataAtom = atom<Fridge|undefined>({
    key: "fridgeData",
    default: undefined,
  });

/** fridgeDataAtom 데이터를 새로 받아와야한다고 알림, 숫자를 1올려서 사용*/
export const fridgeDataRefetcher = atom<number>({
    key: "fridgeDataRefetcher",
    default: 0,
  });
  

/** fridgeData 리패쳐 업데이트 */
export const fridgeDataRefetcherSelector = selector({
    key: 'fridgeDataRefetcherSelector',
    get: ({ get }) => {
        return get(fridgeDataRefetcher);
    },
    set: ({ set }) => {
        set(fridgeDataRefetcher, (prev) => prev + 1); // 기존 값에 1을 더함
    },
});