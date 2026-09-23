"use client";

import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";
import { authEvents } from "@/app/(commom)/ga4/ga4Events";

export default function GoogleCallback() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignIn, setIsSignIn] = useRecoilState<boolean>(siginInState);

  const googleSignIn = () => {
    setIsLoading(true);
    axiosAuthInstacne
      .post("sns-sign-in/google")
      .then((res) => {
        setIsSignIn(true);
        authEvents.signInSuccess("google");
        const storage = globalThis?.sessionStorage;
        let pathToGo = "/";

        const prePath = storage?.getItem("prePath");
        if (typeof prePath === "string") {
          pathToGo = prePath;
          storage.removeItem("prePath");
        }
        router.replace(pathToGo);
        router.refresh();
      })
      .catch((err) => {
        authEvents.signInFailure(err.response?.data?.message || "구글 로그인 실패", "google");
        Swal.fire({
          title: "에러가 발생하였습니다.",
          text: err.response?.data?.message || "구글 로그인 연동 실패",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          allowEnterKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            router.replace("/signin");
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const googleLogInOrSignUp = (code: string) => {
    const redirect_uri =
      process.env.NODE_ENV === "development"
        ? "https://localhost:3001/signin/google/callback"
        : `${window.location.origin}/signin/google/callback`;

    defaultAxios
      .get(`sns-sign-in/google/auth-chk?code=${code}&redirectUri=${encodeURIComponent(redirect_uri)}`)
      .then((res) => {
        if (res.data === "ID_NOT_EXIST") {
          router.replace("/signup/google");
        } else if (res.data === "ID_EXIST") {
          googleSignIn();
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "구글 인증 실패",
          text: err.response?.data?.message || "인증 처리 중 오류가 발생하였습니다.",
          icon: "error",
        }).then(() => {
          router.replace("/signin");
        });
      });
  };

  const hasCalled = useRef<boolean>(false);

  useEffect(() => {
    if (hasCalled.current) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    const csrfUUID = localStorage.getItem("googleCsrf");
    localStorage.removeItem("googleCsrf");

    if (code != null) {
      hasCalled.current = true;
      googleLogInOrSignUp(code);
    } else {
      router.replace("/");
    }
  }, []);

  return (
    <div className="w-full h-lvh flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress color="primary" />
        <p className="text-sm font-bold text-gray-600">구글 로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}
