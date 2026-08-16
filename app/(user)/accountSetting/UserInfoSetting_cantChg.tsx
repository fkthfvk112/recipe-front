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
      .get(`${process.env.NEXT_PUBLIC_API_URL}feed/myfeed`)
      .then((res) => {
        setUserData(res.data);
      });
  }, []);

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