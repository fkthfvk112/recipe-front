"use client";

import { Box, Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import { axiosAuthInstacne } from "../(customAxios)/authAxios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import { PrimaryButton, CancelButton } from "@/app/(commom)/Component/Buttons";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 420,
  bgcolor: "background.paper",
  borderRadius: "24px",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  p: 4,
  outline: "none",
};

interface SaveModalProp<T> {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: string;
  data: T;
  postUrl: string;
  returnUrl: string;
  successCallback?: () => any;
}

function SaveModal<T>({
  open,
  setOpen,
  content,
  data,
  postUrl,
  returnUrl,
  successCallback,
}: SaveModalProp<T>) {
  const router = useRouter();

  const handleSave = () => {
    if (
      postUrl === undefined ||
      postUrl === "" ||
      data === undefined ||
      data === null
    )
      return;

    setOpen(false);

    withReactContent(Swal).fire({
      title: "저장하는 중...",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      html: (
        <div className="overflow-y-hidden py-3">
          <CircularProgress sx={{ color: "#10b981" }} size={32} />
        </div>
      ),
    });

    axiosAuthInstacne
      .post(postUrl, data)
      .then(() => {
        Swal.fire({
          title: "저장되었습니다! 🎉",
          icon: "success",
          confirmButtonColor: "#10b981",
        }).then(() => {
          if (successCallback) {
            successCallback();
          }
          router.push(returnUrl);
        });
      })
      .catch(() => {
        Swal.fire({
          title: "저장 실패",
          text: "저장 처리 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      });
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="save-modal-title"
    >
      <Box sx={modalStyle}>
        <div className="text-center">
          <h2 className="text-base font-black text-gray-900 mb-2">저장 확인</h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
            {content}
          </p>

          <div className="flex gap-2">
            <CancelButton fullWidth onClick={() => setOpen(false)}>
              취소
            </CancelButton>
            <PrimaryButton fullWidth onClick={handleSave}>
              저장하기
            </PrimaryButton>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default React.memo(SaveModal) as typeof SaveModal;