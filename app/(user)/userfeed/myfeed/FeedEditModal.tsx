import { Avatar, Box, CircularProgress, Modal, Typography } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { UserFeedInfo } from "./UserInfo";
import Image from "next/image";
import ClearIcon from '@mui/icons-material/Clear';
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { resizeFileToBase64 } from "@/app/(commom)/ImgResizer";
import Swal from "sweetalert2";
import withReactContent from 'sweetalert2-react-content'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

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
  width: '95%',
  maxWidth:450,
  minWidth:280,
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

  const changeHandler = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const checkValid = ():boolean=>{
    if(updatedUser.nickName.length < 2 || updatedUser.nickName.length > 10){
      Swal.fire({
        title: "에러가 발생하였습니다.",
        icon: "warning",
        text:"닉네임은 2자 이상 10자만 가능합니다."
      });
      return false;
    }

    if(updatedUser.userIntro.length > 100){
      Swal.fire({
        title: "에러가 발생하였습니다.",
        icon: "warning",
        text:"자기소개는 100자 이하만 가능합니다."
      });
      return false;
    }

    const nickNameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if(!nickNameRegex.test(updatedUser.nickName)){
      Swal.fire({
        title: "에러가 발생하였습니다.",
        icon: "warning",
        text:"올바르지 않은 닉네임 형식입니다."
      });
      return false;
    }

    const urlRegex = /^(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|)$/;
    if(!urlRegex.test(updatedUser.userUrl)){
      Swal.fire({
        title: "에러가 발생하였습니다.",
        icon: "warning",
        text:"올바르지 않은 URL형식입니다."
      });
      return false;
    }

    return true
  }

  const updateDbData = () => {
    if(!checkValid()) return;

    const userData: UpdatedUser = { ...updatedUser };
    if (updatedUser.userPhoto === userInfo.userPhoto) {
      userData.userPhoto = "";
    }

    withReactContent(Swal).fire({
      title:"수정 중...",
      showConfirmButton:false,
      allowOutsideClick:false,
      html:<div className="overflow-y-hidden"><CircularProgress /></div>
    })

    axiosAuthInstacne
      .post("feed/update", userData)
      .then((res) => {
        setUpdateData(updateData + 1);
        Swal.fire({
          title: "수정되었습니다!",
          icon: "success",
        }).then(() => {
          setIsOpenModal(false);
        });
      })
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        try {
          const base64String = await resizeFileToBase64(file, 1200, 1200) as string;

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
    (updatedUser.userPhoto !== "" && updatedUser.userPhoto !== "del") ? (
      <Image
        className="rounded-full"
        src={updatedUser.userPhoto}
        alt="no img"
        fill
      ></Image>
    ) : (
      <div className="w-[110px] h-[110px] flex justify-center items-center">
        <AddAPhotoIcon className="w-[110px] h-[110px]" />
      </div>
      
    );

  const deletePhoto = (evt:React.MouseEvent<HTMLButtonElement>)=>{
    setUpdatedUser({
      ...updatedUser,
      userPhoto:"del"
    });
    evt.stopPropagation();
  }

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
        <div className="flex flex-col mt-3 justify-center items-center">
          <div>
              <input
                className="border border-slate-500"
                onChange={handleFileChange}
                id="editingFeedPhoto"
                type="file"
                accept=".jpg, .jpeg, .png, .gif, .webp"
                hidden
              />
              <div className="relative w-[130px] h-[130px]">
                 { 
                  updatedUser.userPhoto.length > 1 &&
                  <button onClick={(evt)=>deletePhoto(evt)} className="border-none w-5 h-5 mr-2 absolute -top-3 right-0 z-50">
                    <ClearIcon/>
                  </button>
                 }
                 <label htmlFor="editingFeedPhoto" className="cursor-pointer">
                    <div className="img-wrapper-round w-[100px] h-[100px]">
                      {image}
                    </div>
                </label>
              </div>
          </div>
          <div className="mt-3 w-full text-gray-500">
            닉네임
            <input
              placeholder="2자 이상 10자 이하(한글, 숫자, 영문)"
              name="nickName"
              onChange={(e) => {
                changeHandler(e);
              }}
              value={updatedUser.nickName}
              type="text"
            />
          </div>
          <div className="mt-3 w-full text-gray-500">
            내 주소 (블로그, 유튜브 등)
            <input
              name="userUrl"
              placeholder="올바른 URL형식(ex-https://mug-in.com)"
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
              className="p-2"
              placeholder="100자 이하"
              maxLength={100}
              name="userIntro"
              onChange={(e) => {
                changeHandler(e);
              }}
              value={updatedUser.userIntro}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-2 mt-5">
          <button className="grayBtn col-span-1 w-full" onClick={handleClose}>취소</button>
          <button className="greenBtn col-span-1 w-full" onClick={updateDbData}>수정</button>
        </div>
      </Box>
    </Modal>
  );
}
