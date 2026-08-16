"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { isPwaAtom } from "@/app/(recoil)/pwaAtom";

/**
 * PWAProvider
 * - 마운트 시 standalone 모드(PWA)인지 감지하여 recoil atom에 저장
 */
export default function PWAProvider() {
  const setIsPwa = useSetRecoilState(isPwaAtom);

  useEffect(() => {
    const checkPwa = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsPwa(isStandalone);
    };

    checkPwa();

    // 디스플레이 모드 변경 감지 (PWA 모드 전환 등)
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPwa(e.matches || (window.navigator as any).standalone === true);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [setIsPwa]);

  return null;
}
