"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface UseTimerProp{
    initialTime:number;
    callback?:()=>any;
}
const useDecreaseTimer = ({ initialTime, callback }: UseTimerProp): [number, Dispatch<SetStateAction<number>>, () => void] => {
    const [time, setTime] = useState<number>(initialTime);
    const [startSign, setStartSign] = useState<number>(0);

    const startTimer = ()=>{
        setStartSign(prv=>prv+1);
    }

    useEffect(()=>{
        const intervalId = setInterval(()=>{
            setTime(prevCount => {
                if (prevCount <= 1) {
                  clearInterval(intervalId);
                  if (callback) callback();
                  return 0;
                }
                return prevCount - 1;
              });
        }, 1000);

        return ()=> clearInterval(intervalId);
    }, [startSign]);

    return [time, setTime, startTimer];
}

export default useDecreaseTimer;