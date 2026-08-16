"use client";

import { useEffect, useRef, useState } from "react";
import { Validation, validationEmailSentence } from "../check";
import Swal from "sweetalert2";
import useDecreaseTimer from "@/app/(commom)/Hook/useDecreaseTimer";
import { formatTime_mmss } from "@/app/(utils)/timeUtils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/navigation";
import { defaultAxios } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import Link from "next/link";
import { PrimaryButton, OutlineButton } from "@/app/(commom)/Component/Buttons";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export default function FindId() {
  const [emailCertifNum, setEmailCertifNum] = useState<string>("");
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [time, setTimer, startTimer] = useDecreaseTimer({ initialTime: 0 });
  const [userEmail, setUserEmail] = useState<string>("");
  const [emailCertigLoading, setEmailCertifLoading] = useState<boolean>(false);
  const [emailIsSent, setEmailIsSent] = useState<boolean>(false);
  const [findedId, setFindedId] = useState<string>("");

  const emailRef = useRef<HTMLInputElement>(null);
  const emailCertifRef = useRef<HTMLInputElement>(null);

  const [emailValid, setEmailValid] = useState<Validation>({ isValid: false, message: "" });
  const [emailCertifValid, setEmailCertifValid] = useState<Validation>({ isValid: false, message: "" });

  const router = useRouter();

  useEffect(() => {
    if (userEmail === "") {
      setEmailValid({ isValid: false, message: "" });
    } else {
      setEmailValid(validationEmailSentence(userEmail));
    }
  }, [userEmail]);

  const sendEmailCertifNum = () => {
    if (!emailValid.isValid) {
      emailRef?.current?.focus();
      emailRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setEmailCertifLoading(true);

    defaultAxios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/send/find-id/certif-number`,
        { email: userEmail },
        { withCredentials: true }
      )
      .then(() => {
        Swal.fire({
          title: "인증 번호 발송",
          text: "인증 번호를 발송하였습니다. 이메일을 확인해주세요.",
          icon: "success",
        });
        setTimer(60 * 3);
        startTimer();
        setTimerStarted(true);
        setEmailIsSent(true);
      })
      .catch((err) => {
        Swal.fire({
          title: "발송 실패",
          icon: "error",
          text: err.response?.data?.message || "이메일 발송 오류가 발생했습니다.",
        });
      })
      .finally(() => {
        setEmailCertifLoading(false);
      });
  };

  const chkEmailCertifIsMatch = () => {
    if (!emailValid.isValid || !emailIsSent) return;

    defaultAxios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/find-id`,
        { email: userEmail, certifNum: emailCertifNum },
        { withCredentials: true }
      )
      .then((res) => {
        Swal.fire({
          title: "인증 완료",
          text: "이메일 인증이 완료되었습니다. 일치하는 아이디를 확인하세요.",
          icon: "success",
        });
        setFindedId(res.data);
        setEmailCertifValid({ isValid: true, message: `인증되었습니다. [${userEmail}]` });
      })
      .catch(() => {
        Swal.fire({
          title: "인증 실패",
          text: "유효하지 않거나 만료된 인증번호입니다.",
          icon: "warning",
        });
      })
      .finally(() => {
        setEmailCertifLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-gray-50/60 py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs flex flex-col gap-6">
        
        {/* 상단 뱃지 & 로고 헤더 */}
        <div className="flex flex-col items-center gap-2 text-center pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60">
            <BadgeOutlinedIcon sx={{ fontSize: 16 }} />
            <span>아이디 찾기</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            가입 시 등록하신 이메일 인증을 통해 아이디를 찾을 수 있습니다.
          </p>
        </div>

        {/* 1단계: 이메일 입력 & 인증 */}
        {findedId.length <= 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700">이메일 인증</label>
              <div className="flex gap-2">
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="예: abc123@mymail.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
                />
                <OutlineButton
                  size="sm"
                  disabled={emailCertigLoading}
                  onClick={sendEmailCertifNum}
                  className="shrink-0 px-4 py-2.5 text-xs font-bold"
                >
                  {emailCertigLoading ? "발송 중..." : "인증요청"}
                </OutlineButton>
              </div>
              {emailValid.message && (
                <span className={`text-[11px] font-bold ${emailValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                  {emailValid.message}
                </span>
              )}

              {/* 인증번호 입력 */}
              <div className="flex gap-2 mt-1">
                <input
                  ref={emailCertifRef}
                  placeholder="인증번호 6자리"
                  inputMode="numeric"
                  type="number"
                  maxLength={6}
                  value={emailCertifNum}
                  onChange={(evt) => {
                    if (evt.target.value.length <= 6) setEmailCertifNum(evt.target.value);
                  }}
                  className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
                />
                <OutlineButton
                  size="sm"
                  onClick={chkEmailCertifIsMatch}
                  className="shrink-0 px-4 py-2.5 text-xs font-bold"
                >
                  아이디 확인
                </OutlineButton>
              </div>

              {timerStarted && !emailCertifValid.isValid && (
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-1">
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  <span>남은 시간 {formatTime_mmss(time)}</span>
                </div>
              )}
              {emailCertifValid.message && (
                <span className={`text-[11px] font-bold ${emailCertifValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                  {emailCertifValid.message}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 2단계: 일치하는 아이디 확인 카드 */}
        {findedId.length > 1 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-full bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col items-center gap-2">
              <CheckCircleOutlinedIcon sx={{ fontSize: 36, color: "#10b981" }} />
              <span className="text-xs font-bold text-gray-500">일치하는 가입 아이디</span>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-900 font-mono tracking-wider">
                {findedId}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-2">
              <OutlineButton
                size="md"
                className="w-full flex justify-center py-3 font-bold"
                onClick={() => router.push("/findpw")}
              >
                비밀번호 찾기
              </OutlineButton>
              <PrimaryButton
                size="md"
                className="w-full flex justify-center py-3 font-bold"
                onClick={() => router.push("/signin")}
              >
                로그인하기
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* 하단 링크 */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          <Link href="/findpw" className="hover:text-emerald-600 transition-colors">
            비밀번호 찾기
          </Link>
          <Link href="/signin" className="font-bold text-emerald-600 hover:underline">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}