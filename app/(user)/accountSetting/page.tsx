"use client";

import UserInfoSetting_cantChg from "./UserInfoSetting_cantChg";

export default function UserSetting() {
  return (
    <main className="min-h-screen bg-gray-50/60 py-8 px-4 flex flex-col items-center">
      <div className="max-w-xl w-full flex flex-col items-center gap-6">
        {/* 상단 타이틀 Header */}
        <div className="w-full text-left flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 w-fit">
            ⚙️ 계정 설정
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            내 계정 관리
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            이메일 정보 확인 및 비밀번호 변경 등 보안 설정을 진행할 수 있습니다.
          </p>
        </div>

        {/* 메인 계정 설정 카드 */}
        <UserInfoSetting_cantChg />
      </div>
    </main>
  );
}