import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Validation, validationPwSameSentence, validationPwSentence } from "../check";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import { UserFeedInfo } from "../userfeed/[userNickName]/UserInfo";

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

function UserInfoSetting_cantChg(){
    const [userData, setUserData] = useState<UserFeedInfo>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    const [presentPw, setPresentPw] = useState<string>("");
    const [newPw, setNewPw]         = useState<string>("");
    const [newPwChk, setNewPwChk]   = useState<string>("");

    const [presentPwValid, setPresntNewPwValid]     = useState<Validation>({
        isValid: false,
        message: "",
    });

    const [newPwValid, setNewPwValid]     = useState<Validation>({
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
          })
          .catch((e) => {
            alert(e);
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

    useEffect(()=>{
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
    }, [newPw, newPwChk])

    const handleOpen = ()=>{
        setIsOpenModal(true);
    }
    const handleClose = ()=>{
        setPresntNewPwValid({
            isValid: false,
            message: "",
        })
        setNewPwValid({
            isValid: false,
            message: "",
        })
        setVeriPwValid({
            isValid: false,
            message: "",
        })
        setPresentPw("")
        setNewPw("")
        setNewPwChk("")

        setIsOpenModal(false);
    }

    const allValid = ():boolean=>{
        if(!newPwValid.isValid) return false;
        if(!veriPwValid.isValid) return false;
        return true;
      }

    const sendPwChgRequest = ()=>{
        if(!allValid()) return;
        
        const pwChgData = {
            presentPw:presentPw,
            newPw:newPw
        }

        axiosAuthInstacne.put(`sign-api/chg-pw`, pwChgData)
            .then((res) => {
                Swal.fire({
                title:"업데이트 성공",
                text:"비밀번호가 변경되었습니다.",
                icon: "success",
                })
                .then((res)=>{
                    if(res.isConfirmed){
                        handleClose();
                    }
                });
            })
            .catch((err) => {
                Swal.fire({
                    title: "업데이트 실패",
                    text: err.response.data.message,
                    icon: "warning",
                    confirmButtonText: "확인",
                    confirmButtonColor: '#d33',
                    allowEnterKey:false
                })
            });
    };

    const presentPwMessage = presentPw.length > 1 ? 
        presentPwValid.isValid?
            "올바른 비밀번호 형식입니다."
            :
            "올바르지 않은 비밀번호 형식입니다."
    :
    "";

    return(
        <div className="grid grid-cols-3 gap-2 p-6 mt-3 border rounded-m pt-6 pb-6 bg-white">
            <span className="col-span-1">이메일</span>
            <p className="col-span-2 h-7">{userData?.email}</p> 
            <span className="col-span-1">생년월일</span>
            <p className="col-span-2 h-7">{userData?.birthDate}</p> 
            <span className="col-span-1">비밀번호</span>
            <button onClick={handleOpen} className="col-span-2 h-7 p-0 btn-outline-gray">비밀번호변경</button>
            <Modal
                open={isOpenModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    비밀번호 변경
                    </Typography>
                        <div className="flex flex-col mt-3 justify-center items-center">
                            <div className="mt-3 w-full text-gray-500">
                                이전 비밀번호
                                <input onChange={(e)=>{setPresentPw(e.target.value)}} placeholder="현재 비밀번호 입력" 
                                name="nickName" type="password" maxLength={20}/>
                                <p className={presentPwValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
                                    {presentPwMessage}
                                </p>
                            </div>
                            <div className="mt-3 w-full text-gray-500">
                                새 비밀번호
                                <input onChange={(e)=>{setNewPw(e.target.value)}} placeholder="특수문자, 숫자, 영어를 포함하는 8~20자"
                                name="newPW" type="password" maxLength={20}/>
                                <p className={newPwValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
                                    {newPwValid.message}
                                </p>
                            </div>
                            <div className="mt-3 w-full text-gray-500">
                                새 비밀번호 확인
                                <input onChange={(e)=>{setNewPwChk(e.target.value)}} placeholder="동일한 비밀번호 입력"
                                name="newPwChk" type="password" maxLength={20}/>
                                <p className={veriPwValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
                                    {veriPwValid.message}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-around p-3">
                            <button className="grayBtn" onClick={handleClose}>취소</button>
                            <button className={`${allValid()?"greenBtn":"grayBtn-noHover"}`} onClick={sendPwChgRequest}>변경</button>
                        </div>
                    </Box>
                </Modal>
        </div>
    )
}

export default React.memo(UserInfoSetting_cantChg);