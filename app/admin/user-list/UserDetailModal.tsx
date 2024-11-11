import { Box, Modal } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import styles from "./adminUser.module.css"
import Image from "next/image";

interface UserDetail {
    userId: string;
    nickName: string;
    email: string;
    roles: string[];
    grantType: string;
    createDate: string;
    userPhoto: string;
    userUrl: string;
    userIntro: string; 
    birthDate: string;
    sex: string;
    pwChgAt: string;
    userBlock: string;  
}

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '95%',
    maxWidth:1024,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

export default function UserDetailModal({userId, open, setOpen}:{userId:string, open:boolean, setOpen:(data:any)=>void}){
    const [userData, setUserDate] = useState<UserDetail>();

    useEffect(()=>{
        if(open && userId && userId.length >= 2){
            axiosAuthInstacne.get(`admin/user?userId=${userId}`)
                .then((res)=>{
                    console.log(res.data);
                    setUserDate(res.data);
                })
        }
    }, [userId, open, setOpen])


    return (
        <Modal
        open={open}
        onClose={() => {
            setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={style}>
            <div className="absolute right-3 top-2 cursor-pointer" onClick={()=>setOpen(false)}>
                <ClearIcon/>
            </div>
            <table className={`w-full ${styles.searchTalble}`} >
                <tr>
                    <td>아이디</td>
                    <td>{userData?.userId}</td>
                    <td>닉네임</td>
                    <td>{userData?.nickName}</td>
                    <td>이메일</td>
                    <td>{userData?.email}</td>
                </tr>
                <tr>
                    <td>사진</td>
                    <td>
                        {
                        userData?.userPhoto && 
                        <Image
                            src={userData?.userPhoto}
                            width={100}
                            height={100}
                            loading="lazy"
                            alt=""
                        />
                        }
                    </td>
                    <td>URL</td>
                    <td>{userData?.userUrl}</td>
                    <td>소개</td>
                    <td>{userData?.userIntro}</td>
                </tr>
                <tr>
                    <td>생일</td>
                    <td>{userData?.birthDate}</td>
                    <td>성별</td>
                    <td>{userData?.sex}</td>
                    <td>역할</td>
                    <td>{}</td>
                </tr>
                <tr>
                    <td>로그인 티입</td>
                    <td>{userData?.grantType}</td>
                    <td>회원가입 일자</td>
                    <td>{userData?.createDate}</td>
                    <td>상태</td>
                    <td>{userData?.userBlock}</td>
                </tr>

            </table>
        </Box>
    </Modal>
    )
}