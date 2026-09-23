"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { authEvents } from "@/app/(commom)/ga4/ga4Events";

const KakaoLogin = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      sessionStorage.setItem("prePath", redirect);
    }
  }, [searchParams]);

  const kakaoLogin = () => {
    authEvents.clickSocialLogin("kakao");
    const csrfUUID = crypto.randomUUID();
    localStorage.setItem("kakaoCsrf", csrfUUID);

    const redirect_uri =
      process.env.NODE_ENV === "development"
        ? "https://localhost:3001/signin/kakao/callback"
        : `${window.location.origin}/signin/kakao/callback`;

    const clientId =
      process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || "kakao_client_id_placeholder";

    location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&state=${csrfUUID}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}`;
  };

  return (
    <div
      className="mt-3 cursor-pointer w-[50px] h-[50px] transition-transform hover:scale-105 active:scale-95"
      onClick={kakaoLogin}
      title="카카오 로그인"
    >
      <div className="w-[50px] h-[50px] rounded-full bg-[#FEE500] flex items-center justify-center shadow-xs">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3C6.47715 3 2 6.47715 2 10.7723C2 13.5601 3.82476 15.9866 6.5746 17.3241L5.59012 20.9575C5.46654 21.4124 5.97541 21.7663 6.36862 21.5057L10.7259 18.6183C11.1448 18.6811 11.569 18.7146 12 18.7146C17.5228 18.7146 22 15.2374 22 10.9423C22 6.64715 17.5228 3 12 3Z"
            fill="#000000"
          />
        </svg>
      </div>
    </div>
  );
};

export default KakaoLogin;
