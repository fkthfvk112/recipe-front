"use client";

import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { isPwaAtom } from "@/app/(recoil)/pwaAtom";

/**
 * PWA 환경에서 모달/슬라이드 패널이 열렸을 때
 * history에 state를 push하여, 뒤로가기 시 페이지 이동 대신 onClose()가 호출되도록 합니다.
 */
export function usePwaBackHandler(open: boolean, onClose: () => void) {
  const isPwa = useRecoilValue(isPwaAtom);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!isPwa) return;

    if (open && !pushedRef.current) {
      window.history.pushState({ pwaModal: true }, "");
      pushedRef.current = true;
    }

    if (!open) {
      pushedRef.current = false;
      return;
    }

    const handlePopState = () => {
      if (pushedRef.current) {
        pushedRef.current = false;
      }
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isPwa, open, onClose]);

  // 모달이 UI(X버튼, 배경 터치 등)로 닫힐 때 → push했던 history 정리
  useEffect(() => {
    if (!isPwa) return;
    if (!open && pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    }
  }, [isPwa, open]);
}
