"use client";

import { useEffect, useState } from "react";
import { Validation, validationEmailSentence, validationIdSentence } from "../check";
import Swal from "sweetalert2";
import useDecreaseTimer from "@/app/(commom)/Hook/useDecreaseTimer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTime_mmss } from "@/app/(utils)/timeUtils";
import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrimaryButton, OutlineButton } from "@/app/(commom)/Component/Buttons";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

export default function FindPw() {
  const [userId, setUserId] = useState<string>("");
  const [emailCertifNum, setEmailCertifNum] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [maskedEmail, setMaskedEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [time, setTimer, startTimer] = useDecreaseTimer({ initialTime: 0 });

  const [validId, setValidId] = useState<string>("");

  const [idValid, setIdValid] = useState<Validation>({ isValid: false, message: "" });
  const [emailValid, setEmailValid] = useState<Validation>({ isValid: false, message: "" });
  const [emailCertifValid, setEmailCertifValid] = useState<Validation>({ isValid: false, message: "" });

  const [isNewPwLoading, setIsNewPwLoading] = useState<boolean>(false);
  const [encodedEmail, setEncodedEmail] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (userEmail === "") {
      setEmailValid({ isValid: false, message: "" });
    } else {
      setEmailValid(validationEmailSentence(userEmail));
    }
  }, [userEmail]);

  useEffect(() => {
    if (userId === "") {
      setIdValid({ isValid: false, message: "" });
    } else {
      setIdValid(validationIdSentence(userId));
    }
  }, [userId]);

  const chkIdValid = () => {
    if (!idValid.isValid) return;
    const validIdTemp = userId;
    defaultAxios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/get-masking-email`,
        { userId: validIdTemp },
        { withCredentials: true }
      )
      .then((res) => {
        setMaskedEmail(res.data);
        setValidId(validIdTemp);
      })
      .catch((err) => {
        Swal.fire({
          title: "확인 실패",
          text: err.response?.data?.message || "존재하지 않는 아이디입니다.",
          icon: "warning",
          confirmButtonColor: "#10b981",
        });
      });
  };

  const sendEmailCertifNum = () => {
    if (!emailValid.isValid || !(validId.length > 2)) return;
    setIsLoading(true);

    defaultAxios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/send/find-pw/certif-number`,
        { email: userEmail, userId: validId },
        { withCredentials: true }
      )
      .then(() => {
        Swal.fire({
          title: "인증 번호 발송",
          text: "인증 번호를 발송하였습니다. 이메일을 확인해 주세요.",
          icon: "success",
        });
        setTimer(60 * 3);
        startTimer();
        setTimerStarted(true);
      })
      .catch((err) => {
        Swal.fire({
          title: "발송 실패",
          text: err.response?.data?.message || "이메일 발송에 실패했습니다.",
          icon: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const chkEmailCertifIsMatch = () => {
    if (!emailValid.isValid || !(validId.length > 2) || time <= 1 || encodedEmail.length >= 2) {
      return;
    }
    defaultAxios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/find-pw/certifnum-chk`,
        { email: userEmail, certifNum: emailCertifNum },
        { withCredentials: true }
      )
      .then((res) => {
        Swal.fire({
          title: "인증 완료",
          text: "이메일 인증이 완료되었습니다. 임시 비밀번호를 발급받으세요.",
          icon: "success",
        });
        setEncodedEmail(res.data.emailCertifEncoded);
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
        setIsLoading(false);
      });
  };

  const sendNewPw = () => {
    setIsNewPwLoading(true);
    defaultAxios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/send/new-pw`,
        { email: encodedEmail, userId: validId },
        { withCredentials: true }
      )
      .then(() => {
        Swal.fire({
          title: "발급 완료",
          text: "임시 비밀번호가 가입 이메일로 발급되었습니다.",
          icon: "success",
        }).then((res) => {
          if (res.isConfirmed) {
            router.push("/signin");
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "발급 실패",
          text: err.response?.data?.message || "비밀번호 발급 중 오류가 발생했습니다.",
          icon: "error",
        });
      })
      .finally(() => {
        setIsNewPwLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-gray-50/60 py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs flex flex-col gap-6">
        {/* 헤더 브랜딩 */}
        <div className="flex flex-col items-center gap-2 text-center pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60">
            <LockResetOutlinedIcon sx={{ fontSize: 16 }} />
            <span>비밀번호 찾기</span>
          </div>
          <Image
            src="/common/logo.png"
            alt="머그인 로고"
            width={150}
            height={48}
            className="h-auto object-contain my-1"
            priority
          />
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            가입하신 계정 및 이메일 인증을 통해 임시 비밀번호를 발급해 드립니다.
          </p>
        </div>

        {/* 1단계: 아이디 입력 */}
        {validId === "" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-700">아이디 입력</label>
              <input
                name="userId"
                placeholder="가입 시 등록한 아이디 (6~12자)"
                type="text"
                value={userId}
                onKeyDown={(evt) => {
                  if (evt.key === "Enter") chkIdValid();
                }}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
              />
              {idValid.message && (
                <span className={`text-[11px] font-bold mt-0.5 ${idValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                  {idValid.message}
                </span>
              )}
            </div>

            <PrimaryButton
              size="lg"
              fullWidth
              disabled={!idValid.isValid}
              onClick={chkIdValid}
              className="mt-2 py-3.5 text-sm font-extrabold shadow-md"
            >
              다음 단계로
            </PrimaryButton>
          </div>
        )}

        {/* 2단계: 이메일 인증 및 임시 비밀번호 발급 */}
        {validId.length >= 6 && (
          <div className="flex flex-col gap-4">
            {/* 마스킹 이메일 가이드 카드 */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-1 text-center">
              <span className="text-[11px] font-bold text-emerald-700">가입된 이메일 힌트</span>
              <span className="text-sm font-black text-emerald-900 font-mono tracking-wide">
                {maskedEmail}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700">이메일 인증</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="가입 이메일 전체 주소"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
                />
                <OutlineButton
                  size="sm"
                  disabled={isLoading}
                  onClick={sendEmailCertifNum}
                  className="shrink-0 px-4 py-2.5 text-xs font-bold"
                >
                  {isLoading ? "발송 중..." : "인증요청"}
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
                  인증확인
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

            <PrimaryButton
              size="lg"
              fullWidth
              loading={isNewPwLoading}
              disabled={encodedEmail.length <= 2 || isNewPwLoading}
              onClick={sendNewPw}
              className="mt-2 py-3.5 text-sm font-extrabold shadow-md"
            >
              <MarkEmailReadOutlinedIcon sx={{ fontSize: 18 }} />
              <span>임시 비밀번호 발급</span>
            </PrimaryButton>
          </div>
        )}

        {/* 하단 링크 */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          <Link href="/findid" className="hover:text-emerald-600 transition-colors">
            아이디 찾기
          </Link>
          <Link href="/signin" className="font-bold text-emerald-600 hover:underline">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}