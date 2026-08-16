"use client";

import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { isPwaAtom } from "@/app/(recoil)/pwaAtom";

/**
 * 현재 history에 push된 모달/패널 수를 추적하는 카운터
 */
export let activePwaModalCount = 0;

/**
 * 모달이 X버튼이나 배경 클릭 등 UI로 닫혀서 history.back()이 트리거될 때
 * PWAProvider가 이 popstate를 앱 뒤로가기로 오인하지 않도록 방지하는 플래그
 */
export let isClosingPwaModalHistory = false;

export function resetClosingPwaModalFlag() {
  isClosingPwaModalHistory = false;
}

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

    if (open && !pushedRef.current) {
      // 모달 열림 → history push + 카운터 증가
      window.history.pushState({ pwaModal: true }, "");
      pushedRef.current = true;
      activePwaModalCount++;
    }

    if (!open) {
      pushedRef.current = false;
      return;
    }

    const handlePopState = () => {
      // 폰 뒤로가기로 모달이 닫힌 경우
      if (pushedRef.current) {
        activePwaModalCount = Math.max(0, activePwaModalCount - 1);
        pushedRef.current = false;
      }
      onClose();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isPwa, open, onClose]);

  // 모달이 뒤로가기가 아닌 UI(X버튼, 배경 등)로 닫힐 때 → 쌓아둔 history 1개 정리
  useEffect(() => {
    if (!isPwa) return;
    if (!open && pushedRef.current) {
      activePwaModalCount = Math.max(0, activePwaModalCount - 1);
      isClosingPwaModalHistory = true;
      window.history.back();
      pushedRef.current = false;
    }
  }, [isPwa, open]);
}
