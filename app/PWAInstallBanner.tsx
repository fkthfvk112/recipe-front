"use client";

import { useEffect, useState } from "react";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const DISMISS_KEY = "pwa-banner-dismissed-at";
const DISMISS_DAYS = 7; // 닫으면 7일간 다시 안 뜸

type BannerMode = "android" | "ios" | null;

function isDismissed(): boolean {
  try {
    const val = localStorage.getItem(DISMISS_KEY);
    if (!val) return false;
    const dismissedAt = Number(val);
    const diff = Date.now() - dismissedAt;
    return diff < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export default function PWAInstallBanner() {
  const [bannerMode, setBannerMode] = useState<BannerMode>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 이미 앱으로 실행 중이거나 사용자가 최근에 닫은 경우 → 배너 표시 안 함
    if (isInStandaloneMode()) return;
    if (isDismissed()) return;

    // iOS Safari: beforeinstallprompt 미지원 → 별도 수동 안내 배너
    if (isIOS()) {
      // Safari에서 접속 중일 때만 iOS 배너 표시
      const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
      if (isSafari) {
        // 약간 딜레이 후 표시 (페이지 로드 UX)
        setTimeout(() => {
          setBannerMode("ios");
          setVisible(true);
        }, 2500);
      }
      return;
    }

    // Android/Chrome: beforeinstallprompt 이벤트 캡처
    const handler = (e: Event) => {
      e.preventDefault(); // 브라우저 기본 미니 인포바 차단
      setDeferredPrompt(e);
      setTimeout(() => {
        setBannerMode("android");
        setVisible(true);
      }, 2500);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      handleDismiss();
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setTimeout(() => setBannerMode(null), 400);
  };

  if (!bannerMode || !visible) return null;

  return (
    // 상단 고정 배너 (sticky top bar)
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-white border-b border-emerald-100 shadow-lg px-4 py-3 flex items-center justify-between gap-3 max-w-full">
        
        {/* 왼쪽: 앱 아이콘 + 안내 텍스트 */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shrink-0">
            <Image
              src="/common/favicon.png"
              alt="머그인 앱 아이콘"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-gray-900 truncate">
              머그인 앱으로 더 편리하게!
            </p>
            {bannerMode === "android" ? (
              <p className="text-[11px] text-gray-500 font-medium truncate">
                홈 화면에 추가하여 앱처럼 사용해 보세요.
              </p>
            ) : (
              <p className="text-[11px] text-gray-500 font-medium flex items-center gap-0.5">
                <IosShareIcon sx={{ fontSize: 11 }} />
                <span>공유 버튼 ➔ [홈 화면에 추가]</span>
              </p>
            )}
          </div>
        </div>

        {/* 오른쪽: 버튼 영역 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Android: 직접 설치 버튼 */}
          {bannerMode === "android" && (
            <button
              type="button"
              onClick={handleInstall}
              className="flex items-center gap-1 px-3.5 py-2 text-[12px] font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-xl border-none cursor-pointer transition-all outline-none shadow-sm whitespace-nowrap"
            >
              <GetAppOutlinedIcon sx={{ fontSize: 14 }} />
              앱 설치
            </button>
          )}

          {/* 닫기 버튼 */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="배너 닫기"
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full border-none cursor-pointer transition-all outline-none bg-transparent"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
