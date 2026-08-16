"use client";

import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { isPwaAtom } from "@/app/(recoil)/pwaAtom";

/**
 * PWA 환경에서 모달/슬라이드 패널이 열렸을 때
 * history에 가짜 state를 push하여, 뒤로가기 시 onClose()가 호출되도록 합니다.
 * 비즈니스 로직과 완전히 독립된 순수 훅입니다.
 */
export function usePwaBackHandler(open: boolean, onClose: () => void) {
  const isPwa = useRecoilValue(isPwaAtom);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isPwa) return;
    if (!open) {
      pushedRef.current = false;
      return;
    }

    // open=true 시점에 가짜 history state push
    if (!pushedRef.current) {
      window.history.pushState({ pwaModal: true }, "");
      pushedRef.current = true;
    }

    const handlePopState = () => {
      // 뒤로가기 감지 → onClose 호출 (페이지 이동 방지)
      onClose();
      pushedRef.current = false;
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isPwa, open, onClose]);

  // 모달이 외부에서 닫힐 때(onClose가 아닌 직접 state 변경) 쌓인 history 정리
  useEffect(() => {
    if (!isPwa) return;
    if (!open && pushedRef.current) {
      window.history.back();
      pushedRef.current = false;
    }
  }, [isPwa, open]);
}
