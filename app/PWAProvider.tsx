"use client";

import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { isPwaAtom } from "@/app/(recoil)/pwaAtom";
import Swal from "sweetalert2";

/**
 * PWAProvider
 * - 마운트 시 standalone 모드(PWA)인지 감지하여 recoil atom에 저장
 * - PWA 모드일 때 history 스택이 바닥나면 "앱을 종료하시겠습니까?" 가드 표시
 */
export default function PWAProvider() {
  const setIsPwa = useSetRecoilState(isPwaAtom);
  const isExitGuardActive = useRef(false);

  useEffect(() => {
    const pwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsPwa(pwa);

    if (!pwa) return;

    // PWA일 때: 최초 history 스택에 sentinel state 하나 push
    // → 이 sentinel이 pop되는 순간이 "더 이상 뒤로 갈 페이지 없음" 신호
    window.history.pushState({ pwaSentinel: true }, "");

    const handlePopState = async (e: PopStateEvent) => {
      // pwaModal state가 pop된 경우는 모달/슬라이드 닫기 훅이 처리하므로 무시
      if (e.state?.pwaModal) return;

      // 중복 방지 (Swal이 이미 열려있으면 스킵)
      if (isExitGuardActive.current) return;
      isExitGuardActive.current = true;

      // sentinel 재push (뒤로가기 방어)
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
        // 사용자가 "종료" 누름 → sentinel 제거 후 앱 닫기
        window.history.back();
        window.close();
        // window.close()가 PWA에서 안 될 경우 대비 (홈으로 이동)
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
