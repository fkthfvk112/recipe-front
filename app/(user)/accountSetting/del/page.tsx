"use client";

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { deleteAuthToken } from "../../signin/utils/authUtil";
import { useRecoilState } from "recoil";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { DangerButton, CancelButton } from "@/app/(commom)/Component/Buttons";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Checkbox from "@mui/material/Checkbox";

export default function DelAccount() {
  const [delCheck, setDelCheck] = useState<boolean>(false);
  const [, setIsSignIn] = useRecoilState(siginInState);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const checkDelAccount = () => {
    if (delCheck !== true) return;
    Swal.fire({
      title: "회원 탈퇴 확인",
      text: "정말로 회원 탈퇴를 진행하시겠습니까? 탈퇴 후에는 데이터를 복구할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "탈퇴 진행",
      cancelButtonText: "취소",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        delAccount();
      }
    });
  };

  const delAccount = () => {
    if (delCheck !== true) return;
    setLoading(true);

    axiosAuthInstacne
      .delete("sign-api")
      .then(() => {
        Swal.fire({
          title: "탈퇴 완료",
          text: "그동안 머그인을 이용해 주셔서 감사합니다.",
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#10b981",
          allowOutsideClick: false,
        }).then(() => {
          deleteAuthToken();
          setIsSignIn(false);
          router.push("/");
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="min-h-screen bg-gray-50/60 py-10 px-4 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col items-center gap-6">
        {/* 상단 뱃지 & 로고 */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-200/60">
            💔 회원 탈퇴
          </div>
          <Image
            width={160}
            height={50}
            src={"/common/logo.png"}
            alt="머그인 로고"
            className="h-auto object-contain my-1"
          />
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            정말로 탈퇴하시겠습니까?
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-sm">
            아래 유의사항을 반드시 확인하시고 동의 후 탈퇴를 진행할 수 있습니다.
          </p>
        </div>

        {/* 유의사항 박스 */}
        <div className="w-full bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex flex-col gap-3 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
          <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs uppercase tracking-wider">
            <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />
            <span>탈퇴 전 유의사항</span>
          </div>

          <ul className="flex flex-col gap-2 list-disc pl-4 text-xs sm:text-sm text-gray-600 font-medium">
            <li>
              작성하신 게시글, 레시피, 댓글은 익명으로 남게 되며 탈퇴 후에는 수정을 하거나 삭제를 처리할 수 없게 됩니다.
            </li>
            <li>
              삭제가 필요한 게시글이나 정보가 있을 경우 회원 탈퇴 이전에 직접 삭제를 진행해 주세요.
            </li>
            <li>
              회원 탈퇴 완료 시 계정의 모든 이용 이력 및 데이터는 복구가 불가능합니다.
            </li>
          </ul>
        </div>

        {/* 동의 체크박스 */}
        <label
          htmlFor="chkDel"
          className="flex items-center gap-2 p-3 bg-gray-50/80 hover:bg-gray-100/80 rounded-2xl border border-gray-100 w-full cursor-pointer transition-colors"
        >
          <Checkbox
            id="chkDel"
            checked={delCheck}
            onChange={(e) => setDelCheck(e.target.checked)}
            color="error"
            size="small"
            sx={{ p: 0.5 }}
          />
          <span className="text-xs sm:text-sm font-bold text-gray-800 select-none">
            안내사항을 모두 확인했으며 회원 탈퇴에 동의합니다.
          </span>
        </label>

        {/* 하단 버튼 */}
        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <CancelButton size="md" className="w-full flex justify-center py-3" onClick={() => router.back()}>
            취소하고 돌아가기
          </CancelButton>

          <DangerButton
            size="md"
            className="w-full flex justify-center py-3"
            disabled={!delCheck || loading}
            loading={loading}
            onClick={checkDelAccount}
          >
            회원 탈퇴하기
          </DangerButton>
        </div>
      </div>
    </main>
  );
}