import { Avatar, Box, Modal, Typography } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { UserFeedInfo } from "./UserInfo";
import Image from "next/image";
import fileToBase64 from "@/app/(utils)/fileToBase64";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";

interface UpdatedUser {
  userPhoto: string;
  nickName: string;
  userUrl: string;
  userIntro:string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
    userIntro: userInfo.userIntro?userInfo.userIntro:"",
  });

  const handleClose = () => setIsOpenModal(false);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const updateDbData = () => {
    const userData: UpdatedUser = { ...updatedUser };
    if (updatedUser.userPhoto === userInfo.userPhoto) {
      userData.userPhoto = "";
    }

    axiosAuthInstacne
      .post("feed/update", userData)
      .then((res) => {
        setUpdateData(updateData + 1);
        alert("수정되었습니다.");
        setIsOpenModal(false);
        console.log(res);
      })
      .catch((err) => {
        const errRes = err.response;
        if (errRes.data.error === "MethodArgumentNotValidException") {
          alert("유효하지 않은 입력입니다. \n" + err.message);
        } else {
          alert("에러가 발생하였습니다. " + err.message);
        }
        console.log(err);
      });
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        console.log("파일 있음");
        try {
          const base64String = await fileToBase64(file);
          console.log("베이스64", base64String);
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
    updatedUser.userPhoto !== "" ? (
      <Image
        className="rounded-full"
        width={128}
        height={128}
        src={updatedUser.userPhoto}
        alt="no img"
      ></Image>
    ) : (
      <Avatar className="w-32 h-32" />
    );

  return (
    <Modal
      open={isOpenModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          회원 정보 수정
        </Typography>
        <div className="flex flex-col justify-center items-center">
          <div>
            <label htmlFor="editingFeedPhoto" className="cursor-pointer">
              <input
                className="border border-slate-500"
                onChange={handleFileChange}
                id="editingFeedPhoto"
                type="file"
                hidden
              />
              <div>{image}</div>
            </label>
          </div>
          <div className="mt-3 w-full text-gray-500">
            닉네임
            <input
              name="nickName"
              onChange={(e) => {
                changeHandler(e);
              }}
              value={updatedUser.nickName}
              type="text"
            />
          </div>
          <div className="mt-3 w-full text-gray-500">
            내 주소(블로그, 인스타, 유튜브 등!)
            <input
              name="userUrl"
              onChange={(e) => {
                changeHandler(e);
              }}
              value={updatedUser.userUrl}
              type="text"
            />
          </div>
          <div className="mt-3 w-full text-gray-500">
            자기소개
            <textarea
              name="userIntro"
              onChange={(e) => {
                changeHandler(e);
              }}
              value={updatedUser.userIntro}
            />
          </div>
        </div>
        <div className="flex justify-center p-3 m-3">
          <button onClick={handleClose}>취소</button>
          <button onClick={updateDbData}>수정</button>
        </div>
      </Box>
    </Modal>
  );
}
