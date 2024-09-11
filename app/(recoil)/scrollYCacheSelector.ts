import { atomFamily, DefaultValue, selectorFamily } from "recoil";

export const scrollYCacheAtom = atomFamily<number, string>({
    key:"scrollYCache",
    default: (domainId:string)=>0
})

export const scrollYCacheSelector = selectorFamily<number, string>({
    key: "scrollYCacheSelector",
    get: (domainId) => ({ get }) => get(scrollYCacheAtom(domainId)),
    set: (domainId) => ({ set }, nextScrollY:number|DefaultValue) => {
        set(scrollYCacheAtom(domainId), nextScrollY);
    }
});