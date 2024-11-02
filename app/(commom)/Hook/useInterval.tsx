import React, { useEffect, useRef } from 'react';

export default function useInterval(callback: () => void, delay: number | null, uniqueId?:string) {
  const savedCallback = useRef<(() => void) | undefined>();
  const uniqueIdArr = useRef<string[]>([]);
  
  // 최신 callback을 기억
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 인터벌을 설정
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
        if(uniqueId && !uniqueIdArr.current.includes(uniqueId)){ // 유니크 아이디를 설정했을 경우 
            const id = setInterval(tick, delay);
            uniqueIdArr.current.push(uniqueId);
            return () => {
                uniqueIdArr.current = uniqueIdArr.current.filter(id=>id!==uniqueId);
                clearInterval(id);
            }
        }
        else if(uniqueId === undefined || uniqueId === null){ // 유니크 아이디를 설정하지 않았을 경우
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            }
        }
    }
  }, [delay, uniqueId]);
}
