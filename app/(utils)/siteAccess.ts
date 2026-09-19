import axios from "axios";
import { getCookie } from 'cookies-next';

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return ua.includes("bot") || ua.includes("spider") || ua.includes("crawl");
}

export function sendVisitLog() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  const userAgent = navigator.userAgent;
  const referrer  = document.referrer;
  if (isBot(userAgent)) {
    return;
  }

  if(getCookie("mug-in-visit")){
    return;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:8080/";
  axios.post(`${apiUrl}access/visit`, { userAgent, referrer }, {
    withCredentials: true,
    timeout: 5000,
  }).catch((err) => {
    // 방문자 로그 실패는 사용자 UX에 영향을 주지 않도록 경고 팝업 없이 처리
    console.debug("Failed to send visit log:", err?.message);
  });
}
