import { Box, Modal } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import styles from "./adminUser.module.css"
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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
    maxWidth:512,
    minWidth:280,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };


type BanType = 'UNBLOCK'|'CREATE_BLOCK_ALL'|'LOGIN_BLOCKED'

export default function BanModal({userId, open, setOpen}:{userId:string, open:boolean, setOpen:(data:any)=>void}){
    const [bantype, setBanType] = useState<BanType>();
    const [blockUntil, setBlockUntil] = useState<string>();
    const router = useRouter();

    const saveBan = ()=>{

        const blockDto = {
            userId:userId,
            blockEnum:bantype,
            blockUntil:blockUntil
        }
    
        Swal.fire({
            title: "변경사항을 저장하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "저장하기",
            cancelButtonText: "취소",
            confirmButtonColor: '#38c54b',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosAuthInstacne
                    .put(`admin/user/block`, blockDto)
                    .then((res) => {
                        Swal.fire({
                            title: "수정이 완료되었습니다!",
                            icon: "success",
                        }).then(() => {
                            setOpen(false);
                            router.refresh();
                        });
                    });
            }
        });      
    }

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
            <section className="flex flex-col justify-center items-center">   
                <h1>{userId}</h1>
                <div className="grid grid-cols-3">
                    <div className="col-span-2 p-1">
                        벤 해제
                    </div>
                    <div className="flex justify-center items-center col-span-1 p-1">
                        <input className="w-4 h-4" type="radio" name="ban" value={bantype} onChange={()=>{setBanType("UNBLOCK"); setBlockUntil("")}} />
                    </div>
                    <div className="col-span-2  p-1">
                        글쓰기 금지(리뷰, 게시글, 레시피)
                    </div>
                    <div className="flex justify-center items-center col-span-1  p-1">
                        <input className="w-4 h-4" type="radio" name="ban" value={bantype} onChange={()=>{setBanType("CREATE_BLOCK_ALL")}} />
                    </div>
                    <div className="col-span-2  p-1">
                        로그인 금지
                    </div>
                    <div className="flex justify-center items-center col-span-1 p-1">
                        <input className="w-4 h-4" type="radio" name="ban" value={bantype} onChange={()=>{setBanType("LOGIN_BLOCKED")}} />
                    </div>
                    <div className="col-span-2">
                        벤 기간
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                        <input type="date" value={blockUntil} onChange={(evt)=>setBlockUntil(evt.target.value)} /><p className="text-nowrap">까지</p>
                    </div>
                </div>
            </section>
            <div className="w-full text-center mt-6">
                <button onClick={saveBan} className="greenBtn">수정</button>
            </div>
        </Box>
    </Modal>
    )
}