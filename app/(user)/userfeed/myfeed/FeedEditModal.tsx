"use client";

import { CircularProgress } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { UserFeedInfo } from "./UserInfo";
import Image from "next/image";
import ClearIcon from "@mui/icons-material/Clear";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { PrimaryButton, CancelButton } from "@/app/(commom)/Component/Buttons";
import CommonModal from "@/app/(commom)/Component/CommonModal";

interface UpdatedUser {
  userPhoto: string;
  nickName: string;
  userUrl: string;
  userIntro: string;
}

export default function FeedEditModal({
  isOpenModal,
  setIsOpenModal,
  userInfo,
  setUpdateData,
  updateData,
}: {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  userInfo: UserFeedInfo;
  setUpdateData: Dispatch<SetStateAction<number>>;
  updateData: number;
}) {
  const [updatedUser, setUpdatedUser] = useState<UpdatedUser>({
    nickName: userInfo.nickName ? userInfo.nickName : "",
    userUrl: userInfo.userUrl ? userInfo.userUrl : "",
    userPhoto: userInfo.userPhoto ? userInfo.userPhoto : "",
    userIntro: userInfo.userIntro ? userInfo.userIntro : "",
  });
  const [loading, setLoading] = useState(false);

  const handleClose = () => setIsOpenModal(false);

  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const checkValid = (): boolean => {
    if (updatedUser.nickName.length < 2 || updatedUser.nickName.length > 10) {
      Swal.fire({
        title: "입력 오류",
        icon: "warning",
        text: "닉네임은 2자 이상 10자 이하만 가능합니다.",
      });
      return false;
    }

    if (updatedUser.userIntro.length > 100) {
      Swal.fire({
        title: "입력 오류",
        icon: "warning",
        text: "자기소개는 100자 이하만 가능합니다.",
      });
      return false;
    }

    const nickNameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nickNameRegex.test(updatedUser.nickName)) {
      Swal.fire({
        title: "입력 오류",
        icon: "warning",
        text: "닉네임은 한글, 영문, 숫자만 사용 가능합니다.",
      });
      return false;
    }

    const urlRegex = /^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|)$/;
    if (!urlRegex.test(updatedUser.userUrl)) {
      Swal.fire({
        title: "입력 오류",
        icon: "warning",
        text: "올바른 URL 형식(예: https://example.com)으로 입력하세요.",
      });
      return false;
    }

    return true;
  };

  const updateDbData = () => {
    if (!checkValid()) return;

    const userData: UpdatedUser = { ...updatedUser };
    if (updatedUser.userPhoto === userInfo.userPhoto) {
      userData.userPhoto = "";
    }

    setLoading(true);
    withReactContent(Swal).fire({
      title: "프로필 수정 중...",
      showConfirmButton: false,
      allowOutsideClick: false,
      html: (
        <div className="overflow-y-hidden flex justify-center py-4">
          <CircularProgress color="success" />
        </div>
      ),
    });

    axiosAuthInstacne
      .post("feed/update", userData)
      .then(() => {
        setUpdateData(updateData + 1);
        Swal.fire({
          title: "프로필이 수정되었습니다!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          setIsOpenModal(false);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        try {
          const base64String = (await resizeFileToBase64(file, 1200, 1200)) as string;
          setUpdatedUser({
            ...updatedUser,
            userPhoto: base64String,
          });
        } catch (error) {
          alert("파일 변환 오류 발생 " + error);
        }
      }
    }
  };

  const image =
    updatedUser.userPhoto !== "" && updatedUser.userPhoto !== "del" ? (
      <Image className="rounded-full object-cover" src={updatedUser.userPhoto} alt="profile" fill />
    ) : (
      <div className="w-full h-full bg-emerald-50 rounded-full flex flex-col justify-center items-center text-emerald-600 border border-emerald-200/60">
        <AddAPhotoIcon sx={{ fontSize: 32 }} />
      </div>
    );

  const deletePhoto = (evt: React.MouseEvent<HTMLButtonElement>) => {
    setUpdatedUser({
      ...updatedUser,
      userPhoto: "del",
    });
    evt.stopPropagation();
  };

  return (
    <CommonModal
      open={isOpenModal}
      onClose={handleClose}
      title="프로필 편집"
      maxWidthClass="max-w-md"
    >
      <div className="flex flex-col gap-4">
        {/* 프로필 이미지 변경 */}
        <div className="flex justify-center my-1">
          <input
            onChange={handleFileChange}
            id="editingFeedPhoto"
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            className="hidden"
          />
          <div className="relative w-24 h-24">
            {updatedUser.userPhoto.length > 1 && updatedUser.userPhoto !== "del" && (
              <button
                onClick={(evt) => deletePhoto(evt)}
                className="absolute -top-1 -right-1 z-10 w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center border-none cursor-pointer shadow-md hover:bg-rose-600 transition-colors"
              >
                <ClearIcon sx={{ fontSize: 14 }} />
              </button>
            )}
            <label htmlFor="editingFeedPhoto" className="cursor-pointer block w-full h-full">
              <div className="relative w-full h-full rounded-full border-2 border-emerald-200/80 p-0.5 overflow-hidden shadow-xs">
                {image}
              </div>
            </label>
          </div>
        </div>

        {/* 닉네임 입력 */}
        <div className="flex flex-col gap-1 text-xs font-bold text-gray-600">
          <span>닉네임</span>
          <input
            placeholder="2자 이상 10자 이하 (한글, 영문, 숫자)"
            name="nickName"
            onChange={changeHandler}
            value={updatedUser.nickName}
            type="text"
            className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
          />
        </div>

        {/* 대표 링크 */}
        <div className="flex flex-col gap-1 text-xs font-bold text-gray-600">
          <span>대표 링크 / 블로그 URL</span>
          <input
            name="userUrl"
            placeholder="예: https://mug-in.com"
            onChange={changeHandler}
            value={updatedUser.userUrl}
            type="text"
            className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all"
          />
        </div>

        {/* 자기소개 */}
        <div className="flex flex-col gap-1 text-xs font-bold text-gray-600">
          <span>자기소개</span>
          <textarea
            placeholder="자신을 소개하는 문구를 작성해 보세요 (100자 이하)"
            maxLength={100}
            name="userIntro"
            onChange={changeHandler}
            value={updatedUser.userIntro}
            className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 bg-gray-50/50 transition-all resize-none h-20"
          />
        </div>

        {/* 하단 버튼 */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <CancelButton size="md" className="w-full flex justify-center py-3" onClick={handleClose}>
            취소
          </CancelButton>
          <PrimaryButton size="md" className="w-full flex justify-center py-3" loading={loading} onClick={updateDbData}>
            수정 완료
          </PrimaryButton>
        </div>
      </div>
    </CommonModal>
  );
}
