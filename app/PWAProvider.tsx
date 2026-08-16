"use client";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { usePathname } from "next/navigation";
import { isPwaAtom } from "@/app/(recoil)/pwaAtom";
import {
  activePwaModalCount,
  isClosingPwaModalHistory,
  resetClosingPwaModalFlag,
} from "@/app/(commom)/Hook/usePwaBackHandler";
import Swal from "sweetalert2";

/**
 * PWAProvider
 * - standalone 모드 감지 → recoil atom 저장
 * - usePathname으로 페이지 이동 깊이(pageDepth) 추적
 *   - forward 이동: pageDepth++
 *   - back 이동: popstate에서 pageDepth--, usePathname 변경은 isHandlingBack 플래그로 스킵
 * - pageDepth = 0 + activePwaModalCount = 0 → 종료 가드 표시
 */
export default function PWAProvider() {
  const setIsPwa = useSetRecoilState(isPwaAtom);
  const pathname = usePathname();

  const isPwaRef = useRef(false);
  const pageDepth = useRef(0);
  const isFirstRender = useRef(true);
  const isHandlingBack = useRef(false);
  const isExitGuardActive = useRef(false);

  // pathname 변경 감지 → forward 이동만 pageDepth 증가
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isPwaRef.current) return;

    // 뒤로가기로 인한 pathname 변경은 스킵 (popstate에서 이미 pageDepth 감소 처리)
    if (isHandlingBack.current) {
      isHandlingBack.current = false;
      return;
    }

    pageDepth.current++;
  }, [pathname]);

  useEffect(() => {
    const pwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsPwa(pwa);
    isPwaRef.current = pwa;

    if (!pwa) return;

    // 루트 기준점 sentinel push
    window.history.pushState({ pwaSentinel: true }, "");

    const handlePopState = async () => {
      // 1. 모달이 UI(X버튼/배경)로 닫히면서 발생한 history.back()이면 스킵
      if (isClosingPwaModalHistory) {
        resetClosingPwaModalFlag();
        return;
      }

      // 2. 현재 열려있는 모달/패널이 있으면 그쪽 훅이 처리하므로 스킵
      if (activePwaModalCount > 0) {
        return;
      }

      // 3. 페이지 히스토리가 남아있으면 → 이전 페이지로 이동
      if (pageDepth.current > 0) {
        pageDepth.current--;
        isHandlingBack.current = true; // usePathname 증가 방지 플래그
        return; // Next.js 라우터가 자연스럽게 이전 페이지 렌더링
      }

      // 4. pageDepth = 0 → 루트에서 뒤로가기 시도 → 종료 가드 표시
      if (isExitGuardActive.current) return;
      isExitGuardActive.current = true;

      // 취소 시 복귀용 sentinel 재push
      window.history.pushState({ pwaSentinel: true }, "");

      const result = await Swal.fire({
        title: "앱을 종료하시겠습니까?",
        text: "확인을 누르면 앱이 닫힙니다.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "종료",
        cancelButtonText: "취소",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        reverseButtons: true,
        customClass: {
          popup: "rounded-3xl font-pyeojin",
          confirmButton: "rounded-xl font-extrabold",
          cancelButton: "rounded-xl font-extrabold",
        },
      });

      if (result.isConfirmed) {
        window.history.back();
        window.close();
        setTimeout(() => {
          window.location.href = "about:blank";
        }, 200);
      }

      isExitGuardActive.current = false;
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setIsPwa]);

  return null;
}
