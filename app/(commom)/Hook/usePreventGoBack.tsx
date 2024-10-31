"use client";

import { useEffect, useRef } from "react";

//have to :: useCondition이 true일때 뒤로가기 누를 경우 이전 히스토리 사라짐 에러 해결
export default function usePreventGoBack({callback, useCondition}:{callback: () => any, useCondition:boolean}) {
    const isFirstRun = useRef(true); // 첫 번째 실행 여부를 추적하는 ref

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if(useCondition){
                if (!isFirstRun.current) { // 첫 번째 실행이 아닐 때만 콜백 실행
                    if (callback) {
                        callback();
                    }
                }
                history.pushState(null, "", location.href); // 뒤로가기 방지
            }
        };

        window.addEventListener("popstate", handlePopState);
        if(useCondition){
            history.pushState(null, "", location.href);
        }
        isFirstRun.current = false;

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };

    }, [callback, useCondition]);
}
