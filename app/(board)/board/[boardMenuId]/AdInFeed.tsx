"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdInFeed() {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // ins가 아직 없으면 스킵
    if (!insRef.current) return;

    // 이미 광고가 채워진 ins면 스킵 (중복 push 방지)
    // adsbygoogle가 광고를 붙이면 ins에 data-adsbygoogle-status가 붙는 경우가 많음
    const alreadyLoaded =
      insRef.current.getAttribute("data-adsbygoogle-status") === "done";

    if (alreadyLoaded) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      console.error("adsbygoogle push error:", e);
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-4679279476061490"
      data-ad-slot="6995220890"
      data-ad-format="fluid"
      data-ad-layout-key="-h7-2+1k-33+1f"
    />
  );
}
