import { siginInState } from "@/app/(recoil)/recoilAtom";
import { getCookie } from "cookies-next";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";

export default function useSyncLogin() {
    const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
    const [trigger, setTrigger] = useState(false); // 상태 변경을 위한 trigger 추가

    useEffect(() => {
        const refreshTokenStr = getCookie("refresh-token");
        if (!refreshTokenStr) {
            setIsSignIn(false);
        }
    }, [trigger, setIsSignIn]); // trigger 상태가 변경될 때마다 useEffect가 실행됨

    // useEffect를 재실행할 수 있도록 하는 함수 반환
    const syncTrigger = () => {
        setTrigger(prev => !prev); // trigger 상태를 반전시켜서 useEffect 실행
    };

    return { syncTrigger }; // 이 함수는 외부에서 호출할 수 있습니다.
}
