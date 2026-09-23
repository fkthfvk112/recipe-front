"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { authEvents } from "@/app/(commom)/ga4/ga4Events";

const GoogleLogin = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      sessionStorage.setItem("prePath", redirect);
    }
  }, [searchParams]);

  const googleLogin = () => {
    authEvents.clickSocialLogin("google");
    const csrfUUID = crypto.randomUUID();
    localStorage.setItem("googleCsrf", csrfUUID);

    const redirect_uri =
      process.env.NODE_ENV === "development"
        ? "https://localhost:3001/signin/google/callback"
        : `${window.location.origin}/signin/google/callback`;

    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "google_client_id_placeholder";

    const scope = encodeURIComponent("openid email profile");

    location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${scope}&state=${csrfUUID}`;
  };

  return (
    <div
      className="mt-3 cursor-pointer w-[50px] h-[50px] transition-transform hover:scale-105 active:scale-95"
      onClick={googleLogin}
      title="구글 로그인"
    >
      <div className="w-[50px] h-[50px] rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-xs">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            fill="#34A853"
          />
          <path
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            fill="#EA4335"
          />
        </svg>
      </div>
    </div>
  );
};

export default GoogleLogin;
