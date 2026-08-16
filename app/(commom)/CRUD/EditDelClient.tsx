"use client";

import { useEffect, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Swal from "sweetalert2";
import { Box, Modal } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { DangerButton, CancelButton, OutlineButton } from "@/app/(commom)/Component/Buttons";

const modalStyle = {
  border: "none",
  outline: "none",
  position: "absolute" as "absolute",
  bottom: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  maxWidth: 420,
  p: 2,
};

export interface EditDelClientProps {
  editReturnURl: string;
  delPostUrl: string;
  delReturnUrl: string;
  revalidateTagNames?: string[];
}

export default function EditDelClient({
  editReturnURl,
  delPostUrl,
  delReturnUrl,
  revalidateTagNames,
}: EditDelClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState<boolean>(false);

  // 1. Route change cleanup: URL 변경 시 즉시 모달 닫기 및 컴포넌트 정리
  useEffect(() => {
    setOpenModal(false);
  }, [pathname]);

  // 2. Unmount cleanup: 컴포넌트 언마운트 시 모달 닫기
  useEffect(() => {
    return () => {
      setOpenModal(false);
    };
  }, []);

  const handleClose = () => {
    setOpenModal(false);
  };

  const sendToEditPage = () => {
    handleClose();
    if (editReturnURl === undefined) return;
    router.push(`/${editReturnURl}`);
  };

  const deleteData = () => {
    handleClose();

    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제한 게시물/정보는 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosAuthInstacne
          .delete(delPostUrl)
          .then(() => {
            Swal.fire({
              title: "삭제가 완료되었습니다.",
              icon: "success",
              confirmButtonColor: "#10b981",
            }).then(() => {
              if (revalidateTagNames) {
                revalidateTagNames.forEach((tag) => {
                  revalidateByTagName(tag);
                });
              }
              router.push(delReturnUrl);
            });
          })
          .catch(() => {
            Swal.fire({
              title: "삭제 실패",
              text: "삭제 처리 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonColor: "#ef4444",
            });
          });
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenModal((prev) => !prev)}
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer outline-none border-none flex items-center justify-center"
        aria-label="편집/삭제 메뉴"
      >
        <EditNoteIcon sx={{ fontSize: 24 }} />
      </button>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="edit-del-action-sheet"
      >
        <Box sx={modalStyle}>
          <div className="bg-white rounded-3xl p-4 shadow-2xl flex flex-col gap-2.5 border border-gray-100">
            <DangerButton fullWidth onClick={deleteData}>
              삭제하기
            </DangerButton>

            <OutlineButton fullWidth onClick={sendToEditPage}>
              수정하기
            </OutlineButton>

            <CancelButton fullWidth onClick={handleClose}>
              취소
            </CancelButton>
          </div>
        </Box>
      </Modal>
    </>
  );
}