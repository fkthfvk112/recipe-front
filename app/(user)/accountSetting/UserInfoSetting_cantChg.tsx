"use client";

import React, { useEffect, useState } from "react";
import { Validation, validationPwSameSentence, validationPwSentence } from "../check";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import Link from "next/link";
import CommonModal from "@/app/(commom)/Component/CommonModal";
import { PrimaryButton, CancelButton, OutlineButton } from "@/app/(commom)/Component/Buttons";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export interface UserFeedInfo {
  userId?: string;
  nickName?: string | null;
  email?: string;
  grantType?: string;
  birthDate?: string;
}

function UserInfoSetting_cantChg() {
  const [userData, setUserData] = useState<UserFeedInfo>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [presentPw, setPresentPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");
  const [newPwChk, setNewPwChk] = useState<string>("");

  const [presentPwValid, setPresntNewPwValid] = useState<Validation>({
    isValid: false,
    message: "",
  });

  const [newPwValid, setNewPwValid] = useState<Validation>({
    isValid: false,
    message: "",
  });

  const [veriPwValid, setVeriPwValid] = useState<Validation>({
    isValid: false,
    message: "",
  });

  useEffect(() => {
    axiosAuthInstacne
      .get("feed/myfeed")
      .then((res) => {
        setUserData(res.data);
      });
  }, []);

  const renderSnsBadge = (grantType?: string) => {
    switch (grantType) {
      case "KAKAO":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEE500] text-[#3C1E1E] text-xs font-extrabold rounded-full shadow-2xs">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3C6.47715 3 2 6.47715 2 10.7723C2 13.5601 3.82476 15.9866 6.5746 17.3241L5.59012 20.9575C5.46654 21.4124 5.97541 21.7663 6.36862 21.5057L10.7259 18.6183C11.1448 18.6811 11.569 18.7146 12 18.7146C17.5228 18.7146 22 15.2374 22 10.9423C22 6.64715 17.5228 3 12 3Z"
                fill="#3C1E1E"
              />
            </svg>
            카카오 연동
          </span>
        );
      case "NAVER":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#03C75A] text-white text-xs font-extrabold rounded-full shadow-2xs">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845Z"
                fill="#FFFFFF"
              />
            </svg>
            네이버 연동
          </span>
        );
      case "GOOGLE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-gray-800 text-xs font-extrabold rounded-full border border-gray-200 shadow-2xs">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
              <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853" />
              <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
              <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
            </svg>
            구글 연동
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
            일반 계정
          </span>
        );
    }
  };

  const getSnsIconBox = (grantType?: string) => {
    switch (grantType) {
      case "KAKAO":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#FEE500] flex items-center justify-center shadow-2xs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3C6.47715 3 2 6.47715 2 10.7723C2 13.5601 3.82476 15.9866 6.5746 17.3241L5.59012 20.9575C5.46654 21.4124 5.97541 21.7663 6.36862 21.5057L10.7259 18.6183C11.1448 18.6811 11.569 18.7146 12 18.7146C17.5228 18.7146 22 15.2374 22 10.9423C22 6.64715 17.5228 3 12 3Z"
                fill="#3C1E1E"
              />
            </svg>
          </div>
        );
      case "NAVER":
        return (
          <div className="w-9 h-9 rounded-xl bg-[#03C75A] flex items-center justify-center shadow-2xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        );
      case "GOOGLE":
        return (
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center shadow-2xs">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
              <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853" />
              <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
              <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-500 border border-gray-100 shadow-2xs">
            <ShieldOutlinedIcon sx={{ fontSize: 18 }} />
          </div>
        );
    }
  };

  useEffect(() => {
    if (presentPw === "") {
      setPresntNewPwValid({
        isValid: false,
        message: "",
      });
    } else {
      setPresntNewPwValid(validationPwSentence(presentPw));
    }
  }, [presentPw]);

  useEffect(() => {
    if (newPw === "") {
      setNewPwValid({
        isValid: false,
        message: "",
      });
    } else {
      setNewPwValid(validationPwSentence(newPw));
    }

    if (newPwChk === "") {
      setVeriPwValid({
        isValid: false,
        message: "",
      });
    } else {
      setVeriPwValid(validationPwSameSentence(newPw, newPwChk));
    }
  }, [newPw, newPwChk]);

  const handleOpen = () => {
    setIsOpenModal(true);
  };

  const handleClose = () => {
    setPresntNewPwValid({ isValid: false, message: "" });
    setNewPwValid({ isValid: false, message: "" });
    setVeriPwValid({ isValid: false, message: "" });
    setPresentPw("");
    setNewPw("");
    setNewPwChk("");
    setIsOpenModal(false);
  };

  const allValid = (): boolean => {
    if (!newPwValid.isValid) return false;
    if (!veriPwValid.isValid) return false;
    return true;
  };

  const sendPwChgRequest = () => {
    if (!allValid()) return;

    const pwChgData = {
      presentPw: presentPw,
      newPw: newPw,
    };

    axiosAuthInstacne
      .put(`sign-api/chg-pw`, pwChgData)
      .then(() => {
        Swal.fire({
          title: "업데이트 성공",
          text: "비밀번호가 안전하게 변경되었습니다.",
          icon: "success",
        }).then((res) => {
          if (res.isConfirmed) {
            handleClose();
          }
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "업데이트 실패",
          text: err.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.",
          icon: "warning",
          confirmButtonText: "확인",
          confirmButtonColor: "#d33",
          allowEnterKey: false,
        });
      });
  };

  const presentPwMessage =
    presentPw.length > 1
      ? presentPwValid.isValid
        ? "올바른 비밀번호 형식입니다."
        : "올바르지 않은 비밀번호 형식입니다."
      : "";

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
      {/* 타이틀 및 정보 영역 */}
      <div className="flex flex-col gap-1 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          회원 기본 정보
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          가입 시 등록된 이메일 계정 및 세부 정보입니다.
        </p>
      </div>

      {/* 카드 정보 리스트 */}
      <div className="flex flex-col gap-4">
        {/* 로그인 방식 (SNS 파비콘 및 연동 뱃지) */}
        <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            {getSnsIconBox(userData?.grantType)}
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400">로그인 방식</span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                {userData?.grantType === "KAKAO"
                  ? "카카오 간편 로그인"
                  : userData?.grantType === "NAVER"
                  ? "네이버 간편 로그인"
                  : userData?.grantType === "GOOGLE"
                  ? "구글 간편 로그인"
                  : "일반 계정 (이메일/비밀번호)"}
              </span>
            </div>
          </div>
          {renderSnsBadge(userData?.grantType)}
        </div>

        {/* 이메일 */}
        <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-500 border border-gray-100 shadow-2xs">
              <EmailOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-400">이메일 계정</span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                {userData?.email || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* 생년월일 */}
        {userData?.birthDate && (
          <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-gray-500 border border-gray-100 shadow-2xs">
                <CakeOutlinedIcon sx={{ fontSize: 18 }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-400">생년월일</span>
                <span className="text-xs sm:text-sm font-bold text-gray-800">
                  {userData.birthDate}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 비밀번호 변경 영역 (일반 회원만 노출) */}
        {userData?.grantType === "NORMAL" && (
          <div className="flex items-center justify-between p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-emerald-600 border border-gray-100 shadow-2xs">
                <ShieldOutlinedIcon sx={{ fontSize: 18 }} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-gray-400">보안 설정</span>
                <span className="text-xs sm:text-sm font-bold text-gray-800">비밀번호 변경</span>
              </div>
            </div>

            <OutlineButton size="sm" onClick={handleOpen} className="flex items-center gap-1.5 font-bold px-3.5 py-2 w-16">
              <span>변경</span>
            </OutlineButton>
          </div>
        )}
      </div>

      {/* 회원탈퇴 하단 서틀 링크 */}
      <div className="pt-4 border-t border-gray-100 flex justify-center">
        <Link
          href="/accountSetting/del"
          className="text-xs font-bold text-gray-400 hover:text-rose-600 transition-colors underline underline-offset-4"
        >
          회원 탈퇴하기
        </Link>
      </div>

      {/* 비밀번호 변경 공용 모달 */}
      <CommonModal open={isOpenModal} onClose={handleClose} title="비밀번호 변경" maxWidthClass="max-w-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-xs font-bold text-gray-600">
            <span>현재 비밀번호</span>
            <input
              onChange={(e) => setPresentPw(e.target.value)}
              placeholder="현재 비밀번호 입력"
              name="presentPw"
              type="password"
              maxLength={20}
              value={presentPw}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
            {presentPwMessage && (
              <span className={`text-[11px] font-bold mt-0.5 ${presentPwValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                {presentPwMessage}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 text-xs font-bold text-gray-600">
            <span>새 비밀번호</span>
            <input
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="특수문자, 숫자, 영문 포함 8~20자"
              name="newPW"
              type="password"
              maxLength={20}
              value={newPw}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
            {newPwValid.message && (
              <span className={`text-[11px] font-bold mt-0.5 ${newPwValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                {newPwValid.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 text-xs font-bold text-gray-600">
            <span>새 비밀번호 확인</span>
            <input
              onChange={(e) => setNewPwChk(e.target.value)}
              placeholder="동일한 비밀번호 재입력"
              name="newPwChk"
              type="password"
              maxLength={20}
              value={newPwChk}
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
            />
            {veriPwValid.message && (
              <span className={`text-[11px] font-bold mt-0.5 ${veriPwValid.isValid ? "text-emerald-600" : "text-rose-500"}`}>
                {veriPwValid.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <CancelButton size="md" className="w-full flex justify-center py-3" onClick={handleClose}>
              취소
            </CancelButton>
            <PrimaryButton
              size="md"
              className="w-full flex justify-center py-3"
              disabled={!allValid()}
              onClick={sendPwChgRequest}
            >
              비밀번호 변경
            </PrimaryButton>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}

export default React.memo(UserInfoSetting_cantChg);