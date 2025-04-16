import { defaultAxios } from "../(customAxios)/authAxios";
import { getCookie } from 'cookies-next';

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return ua.includes("bot") || ua.includes("spider") || ua.includes("crawl");
}

export function sendVisitLog() {
  const userAgent = navigator.userAgent;
  const referrer  = document.referrer;
  if (isBot(userAgent)) {
    console.log("봇")
    return;
  }

  if(getCookie("mug-in-visit")){
    console.log("이미 방문")
    return;
  }
1
  defaultAxios.post("/access/visit", {userAgent, referrer});
}
