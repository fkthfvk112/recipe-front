"use client";

import { GrantType, KakaoSignUpDTO } from "@/app/(type)/user";
import { useEffect, useRef, useState } from "react";
import { Validation, validationNickNameSentence } from "../../check";
import TermOfUsage from "@/app/(recipe)/recipes/(common)/document/TermOfUsage";
import PrivacyPolicy from "@/app/(recipe)/recipes/(common)/document/PrivacyPolicy";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { useRecoilState } from "recoil";
import { authEvents } from "@/app/(commom)/ga4/ga4Events";
import CommonModal from "@/app/(commom)/Component/CommonModal";

export default function KakaoSignUp() {
  const [isSignIn, setIsSignIn] = useRecoilState<boolean>(siginInState);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userNickName, setUserNickName] = useState<string>("");
  const [termsModalType, setTermsModalType] = useState<"TERMS" | "PRIVACY" | null>(null);
  const router = useRouter();

  const [nickNameValid, setNickNameValid] = useState<Validation>({
    isValid: false,
    message: "",
  });

  const nickNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userNickName === "") {
      setNickNameValid({
        isValid: false,
        message: "",
      });
    } else {
      setNickNameValid(validationNickNameSentence(userNickName));
    }
  }, [userNickName]);

  useEffect(() => {
    axiosAuthInstacne.post("sns-sign-in/kakao/userinfo").then((res) => {
      if (res.data?.email) {
        setUserEmail(res.data.email);
      }
      if (res.data?.nickname) {
        setUserNickName(res.data.nickname);
      }
    });
  }, []);

  const allValid = (): boolean => {
    return nickNameValid.isValid;
  };

  const kakaoSignIn = () => {
    axiosAuthInstacne
      .post("sns-sign-in/kakao")
      .then((res) => {
        authEvents.signInSuccess("kakao");
        const storage = globalThis?.sessionStorage;
        let pathToGo = "/";

        const prePath = storage?.getItem("prePath");
        if (typeof prePath === "string") {
          pathToGo = prePath;
          storage.removeItem("prePath");
        }

        setIsSignIn(true);
        router.replace(pathToGo);
        router.refresh();
      })
      .catch((err) => {
        Swal.fire({
          title: "에러가 발생하였습니다.",
          text: err.response?.data?.message || "로그인 실패",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          allowEnterKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            router.replace("/signin");
          }
        });
      });
  };

  const sendSignUpRequest = () => {
    if (!nickNameValid.isValid) {
      nickNameRef?.current?.focus();
      nickNameRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const userData: KakaoSignUpDTO = {
      nickName: userNickName,
      grantType: GrantType.KAKAO,
    };

    withReactContent(Swal).fire({
      title: "회원가입 처리 중...",
      showConfirmButton: false,
      html: (
        <div className="overflow-y-hidden py-4 flex justify-center">
          <CircularProgress color="warning" />
        </div>
      ),
    });

    axiosAuthInstacne
      .post("sns-sign-up/kakao", userData)
      .then((res) => {
        authEvents.signUpSuccess("kakao");
        Swal.fire({
          title: "환영합니다!",
          text: "카카오 계정으로 머그인 회원가입이 성공적으로 완료되었습니다.",
          icon: "success",
        }).then(() => {
          const storage = globalThis?.sessionStorage;
          storage.setItem("firstSignUp", "true");
          kakaoSignIn();
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "회원가입 실패",
          text: err.response?.data?.message || "회원가입 정보를 확인해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          allowEnterKey: false,
        });
      });
  };

  return (
    <main className="min-h-screen bg-gray-50/60 py-10 px-4 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200/60">
            <span>카카오 간편 회원가입</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            머그인 계정 만들기
          </h1>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">이메일</label>
            <input
              ref={emailRef}
              type="email"
              value={userEmail}
              readOnly={true}
              placeholder="카카오 계정 이메일"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">닉네임</label>
            <input
              ref={nickNameRef}
              name="userNickName"
              placeholder="2~10자 닉네임 입력"
              value={userNickName}
              onChange={(e) => setUserNickName(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-gray-50/50 transition-all"
            />
            {nickNameValid.message && (
              <span
                className={`text-[11px] font-bold mt-0.5 ${
                  nickNameValid.isValid ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {nickNameValid.message}
              </span>
            )}
          </div>

          <div className="pt-2 flex flex-col items-center w-full">
            <button
              type="button"
              onClick={sendSignUpRequest}
              disabled={!allValid()}
              className={`w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xs border-none outline-none transition-all ${
                allValid()
                  ? "bg-[#FEE500] hover:bg-[#FDD800] text-gray-900 active:scale-[0.99] cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              가입 완료하기
            </button>

            <p className="text-center text-[11px] text-gray-500 mt-3.5 leading-relaxed">
              ※ &apos;가입 완료하기&apos; 시{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setTermsModalType("TERMS")}
                className="font-bold text-gray-800 underline underline-offset-2 hover:text-black cursor-pointer transition-colors"
              >
                이용약관
              </span>{" "}
              및{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setTermsModalType("PRIVACY")}
                className="font-bold text-gray-800 underline underline-offset-2 hover:text-black cursor-pointer transition-colors"
              >
                개인정보처리방침
              </span>
              에 동의한 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>

      <CommonModal
        open={termsModalType !== null}
        onClose={() => setTermsModalType(null)}
        title={termsModalType === "TERMS" ? "서비스 이용약관" : "개인정보 수집 및 이용 동의"}
        maxWidthClass="max-w-2xl"
      >
        <div className="max-h-[60vh] overflow-y-auto p-2 text-xs text-gray-600 leading-relaxed custom-scrollbar border rounded-2xl bg-gray-50/40">
          {termsModalType === "TERMS" ? <TermOfUsage /> : <PrivacyPolicy />}
        </div>
      </CommonModal>
    </main>
  );
}
