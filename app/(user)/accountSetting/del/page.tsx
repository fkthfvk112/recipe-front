"use client"

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { deleteAuthToken } from "../../signin/utils/authUtil";
import { useRecoilState } from "recoil";
import { siginInState } from "@/app/(recoil)/recoilAtom";

export default function DelAccount(){
    const [delCheck, setDelCheck] = useState<boolean>(false);
    const [isSignIn, setIsSignIn] = useRecoilState(siginInState);

    const router = useRouter();

    const checkDelAccount = ()=>{
        if(delCheck !== true) return;
        Swal.fire({
            title: "회원 탈퇴",
            text: "정말로 회원을 탈퇴하시겠습니까?",
            icon: "question",
            confirmButtonText: "확인",
            cancelButtonText:"취소",
            showCancelButton:true,
            allowOutsideClick:false,
        }).then((result) => {
            if(result.isConfirmed){
                delAccount()
            }
        });
    }

    const delAccount = () =>{
        if(delCheck !== true) return;

        axiosAuthInstacne.delete("sign-api")
            .then(()=>{
                Swal.fire({
                    title: "회원 탈퇴 완료",
                    text: "회원탈퇴가 완료되었습니다.",
                    icon: "success",
                    confirmButtonText: "확인",
                    allowOutsideClick:false,
                }).then(() => {
                    deleteAuthToken();
                    setIsSignIn(false);
                    router.push('/');
                });
            })
    }

    return (
        <div className="p-5 max-w-xl w-dvw m-3 mt-12 mb-16 bg-[white] px-4 flex flex-col justify-center items-center shadow-xl border border-[#1e1e1]">
            <Image className="mt-6" width={200} height={200}  src={"/common/logo.png"} alt=""></Image>
            <div className="max-w-[360px] text-center">
                <h1 className="mt-10 text-xl">정말로 탈퇴하시겠습니까?</h1>
            </div>
            <div className="w-[90%] mt-5 bg-[#f0f0f0] p-5">
                <ul>
                    <li>· 작성하신 게시글/레시피/댓글은 익명으로 남게 되며 탈퇴시에는 수정/삭제 처리할 수 없게 됩니다.</li>
                    <li className="mt-5">· 삭제해야할 내용이 있을 경우 회원 탈퇴 이전에 삭제 처리해주시기를 바랍니다.</li>
                    <li className="mt-5">· 회원 탈퇴시 모든 데이터는 복구가 불가능합니다.</li>
                </ul>
            </div>
            <div className="flex w-full justify-start items-center mt-5 p-5">
            <input 
                id="chkDel"
                onChange={(e) => setDelCheck(e.target.checked)} 
                className="w-4 h-4 me-3 ms-3" 
                type="checkbox" 
                checked={delCheck} 
            />                
            <label htmlFor="chkDel">안내사항을 모두 확인했으며 이에 동의합니다.</label>
            </div>
            <button onClick={checkDelAccount} className={`${delCheck?"greenBtn":"grayBtn-noHover cursor-default"} mt-6 mb-6`}>탈퇴하기</button>
        </div>
    )
}