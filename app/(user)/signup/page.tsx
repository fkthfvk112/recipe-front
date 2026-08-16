"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Validation,
  validationEmailSentence,
  validationIdSentence,
  validationNickNameSentence,
  validationPwSameSentence,
  validationPwSentence,
} from "../check";
import axios from "axios";
import { SexEnum, UserSignUpDTO } from "@/app/(type)/user";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { CircularProgress, Checkbox } from "@mui/material";
import DateSelector from "./BirthdateSelection";
import useDecreaseTimer from "@/app/(commom)/Hook/useDecreaseTimer";
import { formatTime_mmss } from "@/app/(utils)/timeUtils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TermOfUsage from "@/app/(recipe)/recipes/(common)/document/TermOfUsage";
import PrivacyPolicy from "@/app/(recipe)/recipes/(common)/document/PrivacyPolicy";
import { PrimaryButton, OutlineButton } from "@/app/(commom)/Component/Buttons";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

export default function SignUp() {
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [time, setTimer, startTimer] = useDecreaseTimer({ initialTime: 0 });
  const [emailCertigLoading, setEmailCertifLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [userVeriPw, setUserVeriPw] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userNickName, setUserNickName] = useState<string>("");
  const [userBirthDate, setUserBirthDate] = useState<string>("");
  const [userSex, setUserSex] = useState<SexEnum | string>("");
  const [policyChk1, setPolicyChk1] = useState<boolean>(false);
  const [policyChk2, setPolicyChk2] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [idValid, setIdValid] = useState<Validation>({ isValid: false, message: "" });
  const [nickNameValid, setNickNameValid] = useState<Validation>({ isValid: false, message: "" });
  const [pwValid, setPwValid] = useState<Validation>({ isValid: false, message: "" });
  const [veriPwValid, setVeriPwValid] = useState<Validation>({ isValid: false, message: "" });
  const [emailValid, setEmailValid] = useState<Validation>({ isValid: false, message: "" });
  const [emailCertifValid, setEmailCertifValid] = useState<Validation>({ isValid: false, message: "" });
  const [sexValid, setSexValid] = useState<Validation>({ isValid: false, message: "" });

  const [emailCertifNum, setEmailCertifNum] = useState<string>("");
  const [encodedEmail, setEncodedEmail] = useState<string>("");

  const idRef = useRef<HTMLInputElement>(null);
  const nickNameRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const veriPwRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const emailCertifRef = useRef<HTMLInputElement>(null);

  const route = useRouter();

  const allValid = (): boolean => {
    if (!idValid.isValid) return false;
    if (!pwValid.isValid) return false;
    if (!veriPwValid.isValid) return false;
    if (!emailValid.isValid) return false;
    if (!nickNameValid.isValid) return false;
    if (!emailCertifValid.isValid) return false;
    if (!policyChk1 || !policyChk2) return false;
    return true;
  };

  useEffect(() => {
    if (userId === "") {
      setIdValid({ isValid: false, message: "" });
    } else {
      setIdValid(validationIdSentence(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (userPw === "") {
      setPwValid({ isValid: false, message: "" });
    } else {
      setPwValid(validationPwSentence(userPw));
    }

    if (userVeriPw === "") {
      setVeriPwValid({ isValid: false, message: "" });
    } else {
      setVeriPwValid(validationPwSameSentence(userPw, userVeriPw));
    }
  }, [userPw, userVeriPw]);

  useEffect(() => {
    if (userEmail === "") {
      setEmailValid({ isValid: false, message: "" });
    } else {
      setEmailValid(validationEmailSentence(userEmail));
    }
  }, [userEmail]);

  useEffect(() => {
    if (userNickName === "") {
      setNickNameValid({ isValid: false, message: "" });
    } else {
      setNickNameValid(validationNickNameSentence(userNickName));
    }
  }, [userNickName]);

  const sendSignUpRequest = () => {
    if (!idValid.isValid) {
      idRef?.current?.focus();
      idRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!nickNameValid.isValid) {
      nickNameRef?.current?.focus();
      nickNameRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!pwValid.isValid) {
      pwRef?.current?.focus();
      pwRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!veriPwValid.isValid) {
      veriPwRef?.current?.focus();
      veriPwRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (userSex !== SexEnum.FEMAIL && userSex !== SexEnum.MALE) {
      setSexValid({ isValid: false, message: "성별을 선택해주세요." });
      return;
    } else {
      setSexValid({ isValid: true, message: "" });
    }

    if (!emailValid.isValid) {
      emailRef?.current?.focus();
      emailRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (userBirthDate.length !== 8) {
      return;
    }

    const userData: UserSignUpDTO = {
      userId: userId,
      userPassword: userPw,
      email: userEmail,
      nickName: userNickName,
      grantType: "NORMAL",
      encodedEmail: encodedEmail,
      sex: userSex as SexEnum,
      birthDate: userBirthDate,
    };

    withReactContent(Swal).fire({
      title: "회원가입 처리 중...",
      showConfirmButton: false,
      allowOutsideClick: false,
      html: (
        <div className="overflow-y-hidden flex justify-center py-4">
          <CircularProgress color="success" />
        </div>
      ),
    });

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/sign-up`, userData)
      .then(() => {
        Swal.fire({
          title: "회원가입 완료",
          text: "머그인 회원가입이 성공적으로 완료되었습니다.",
          icon: "success",
        }).then(() => {
          const storage = globalThis?.sessionStorage;
          storage.setItem("firstSignUp", "true");
          route.push(
            redirect
              ? `/signin?redirect=${encodeURIComponent(redirect)}`
              : "/signin"
          );
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "회원가입 실패",
          text: err.response?.data?.message || "회원가입 정보를 확인해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#10b981",
          allowEnterKey: false,
        });
      });
  };

  const sendEmailCertifNum = () => {
    if (!emailValid.isValid) {
      emailRef?.current?.focus();
      emailRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setEmailCertifLoading(true);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/send-certif-number`,
        { email: userEmail },
        { withCredentials: true }
      )
      .then(() => {
        Swal.fire({
          title: "인증 번호 발송",
          text: "입력하신 이메일로 인증 번호를 발송하였습니다.",
          icon: "success",
        });
        setTimer(60 * 3);
        startTimer();
        setTimerStarted(true);
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
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}sign-api/certifnum-chk`,
        { email: userEmail, certifNum: emailCertifNum },
        { withCredentials: true }
      )
      .then((res) => {
        Swal.fire({
          title: "인증 완료",
          text: "이메일 인증이 성공적으로 완료되었습니다.",
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
      });
  };

  return (
    <main className="min-h-screen bg-gray-50/60 py-10 px-4 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs flex flex-col gap-6">
        
        {/* 상단 뱃지 & 브랜딩 */}
        <div className="flex flex-col items-center gap-2 text-center pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60">
            <PersonAddOutlinedIcon sx={{ fontSize: 16 }} />
            <span>신규 회원가입</span>
          </div>
          <Image
            src="/common/logo.png"
            alt="머그인 로고"
            width={160}
            height={50}
            className="h-auto object-contain my-1"
            priority
          />
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            머그인 계정 만들기
          </h1>
        </div>

        {/* 폼 구성 */}
        <div className="flex flex-col gap-5">
          {/* 아이디 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">아이디</label>
            <input
              ref={idRef}
              name="userId"
              placeholder="6~12자의 영문 소문자, 숫자"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
            {idValid.message && (
              <span className={`text-[11px] font-bold mt-0.5 ${idValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                {idValid.message}
              </span>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">비밀번호</label>
            <input
              ref={pwRef}
              name="userPw"
              placeholder="특수문자, 숫자, 영문 포함 8~20자"
              type="password"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
            {pwValid.message && (
              <span className={`text-[11px] font-bold mt-0.5 ${pwValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                {pwValid.message}
              </span>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">비밀번호 확인</label>
            <input
              ref={veriPwRef}
              placeholder="동일한 비밀번호 재입력"
              type="password"
              value={userVeriPw}
              onChange={(e) => setUserVeriPw(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
            {veriPwValid.message && (
              <span className={`text-[11px] font-bold mt-0.5 ${veriPwValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                {veriPwValid.message}
              </span>
            )}
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-700">닉네임</label>
            <input
              ref={nickNameRef}
              name="userNickName"
              placeholder="2~10자 한글, 영문, 숫자"
              type="text"
              value={userNickName}
              onChange={(e) => setUserNickName(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
            {nickNameValid.message && (
              <span className={`text-[11px] font-bold mt-0.5 ${nickNameValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                {nickNameValid.message}
              </span>
            )}
          </div>

          {/* 성별 선택 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">성별</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserSex(SexEnum.FEMAIL)}
                className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  userSex === SexEnum.FEMAIL
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                    : "bg-gray-50/70 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                여성
              </button>
              <button
                type="button"
                onClick={() => setUserSex(SexEnum.MALE)}
                className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  userSex === SexEnum.MALE
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs"
                    : "bg-gray-50/70 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                남성
              </button>
            </div>
            {sexValid.message && (
              <span className="text-[11px] font-bold text-rose-500 mt-0.5">{sexValid.message}</span>
            )}
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700">생년월일</label>
            <DateSelector setUserBirthDate={setUserBirthDate} />
          </div>

          {/* 이메일 및 인증 */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
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

          {/* 약관 동의 영역 */}
          <div className="flex flex-col gap-4 pt-3 border-t border-gray-100">
            {/* 약관 1 */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-bold text-gray-700">
                  이용약관 동의 <span className="text-rose-500 font-extrabold">(필수)</span>
                </span>
                <Checkbox
                  checked={policyChk1}
                  onChange={() => setPolicyChk1((prev) => !prev)}
                  color="success"
                  size="small"
                  sx={{ p: 0 }}
                />
              </label>
              <div className="h-32 overflow-y-auto bg-gray-50/80 rounded-2xl p-4 border border-gray-200/70 text-xs leading-relaxed text-gray-600">
                <TermOfUsage />
              </div>
            </div>

            {/* 약관 2 */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-bold text-gray-700">
                  개인정보 수집 및 이용 동의 <span className="text-rose-500 font-extrabold">(필수)</span>
                </span>
                <Checkbox
                  checked={policyChk2}
                  onChange={() => setPolicyChk2((prev) => !prev)}
                  color="success"
                  size="small"
                  sx={{ p: 0 }}
                />
              </label>
              <div className="h-32 overflow-y-auto bg-gray-50/80 rounded-2xl p-4 border border-gray-200/70 text-xs leading-relaxed text-gray-600">
                <PrivacyPolicy />
              </div>
            </div>
          </div>
        </div>

        {/* 회원가입 제출 버튼 */}
        <div className="mt-4 w-full">
          <PrimaryButton
            size="lg"
            fullWidth
            disabled={!allValid()}
            onClick={sendSignUpRequest}
            className="py-3.5 text-base font-extrabold shadow-md"
          >
            회원가입 완료
          </PrimaryButton>
        </div>
      </div>
    </main>
  );
}
