"use client"

import { useEffect, useRef, useState } from "react";
import { Validation, validationEmailSentence } from "../check";
import axios from "axios";
import Swal from "sweetalert2";
import useDecreaseTimer from "@/app/(commom)/Hook/useDecreaseTimer";
import { formatTime_mmss } from "@/app/(utils)/timeUtils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/navigation";
import { defaultAxios } from "@/app/(customAxios)/authAxios";

export default function FindId(){
    const [emailCertifNum, setEmailCertifNum]                 = useState<string>("");
    const [timerStarted, setTimerStarted] = useState<boolean>(false);
    const [time, setTimer, startTimer] = useDecreaseTimer({initialTime:0});
    const [userEmail, setUserEmail] = useState<string>("");
    const [emailCertigLoading, setEmailCertifLoading] = useState<boolean>(false);
    const [emailIsSent, setEmailIsSent] = useState<boolean>(false);

    const [findedId, setFindedId] = useState<string>("");
    
    const emailRef       = useRef<HTMLInputElement>(null);
    const emailCertifRef = useRef<HTMLInputElement>(null);

    const [emailValid, setEmailValid] = useState<Validation>({
        isValid: false,
        message: "",
      });

    const [emailCertifValid, setEmailCertifValid] = useState<Validation>({
        isValid: false,
        message: "",
    });

    const router = useRouter();

    useEffect(() => {
        if (userEmail === "") {
          setEmailValid({
            isValid: false,
            message: "",
          });
        } else {
          setEmailValid(validationEmailSentence(userEmail));
        }
      }, [userEmail]);
    
    

    const sendEmailCertifNum = ()=>{
        if (!emailValid.isValid) {
          emailRef?.current?.focus();
          emailRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return;
        }
        setEmailCertifLoading(true);
    
        defaultAxios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/send/find-id/certif-number`, {email:userEmail}, {
          withCredentials: true,
        })
        .then((res)=>{
            Swal.fire({
              title: "인증 번호 발송",
              text:"인증 번호를 발송하였습니다. 이메일을 확인해주세요.",
              icon: "success",
            })
            setTimer(60*3);
            startTimer();
            setTimerStarted(true);
            setEmailIsSent(true);
          })
        .finally(()=>{
          setEmailCertifLoading(false);
        })
    }


    const chkEmailCertifIsMatch = ()=>{
        if (!emailValid.isValid || !emailIsSent) {
            return;
        }

        defaultAxios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/find-id`, {email:userEmail, certifNum:emailCertifNum}, {
            withCredentials: true,
        })
        .then((res)=>{
            Swal.fire({
            title: "인증 완료",
            text:"이메일이 인증되었습니다. 아이디를 확인해주세요.",
            icon: "success",
            })
            setFindedId(res.data);
            setEmailCertifValid({isValid:true, message:`인증되었습니다. [${userEmail}]`});
        })
        .catch((err)=>{
            Swal.fire({
            title: "인증 실패",
            text:"유효하지 않은 인증번호입니다.",
            icon: "warning",
            })
        })
        .finally(()=>{
            setEmailCertifLoading(false);
        })
    }


    return (
        <>
            <div className="max-w-2xl min-w-80 w-full p-2 pt-6 pb-6 bg-white px-4 flex flex-col justify-center flex-items-center mt-14 mb-3 shadow-md border border-gray-[#a1a1a1]">
                <div className="text-center p-3 bottom-line">
                    <h1 className="text-2xl">아이디 찾기</h1>
                </div>
                <div className="m-3">
                    <span className="font-bold text-[#3f3f3f]">
                    이메일로 아이디 찾기
                    </span>
                    <div className="grid-cols-4 grid gap-3">
                        <input
                            className="media-col-3-to-4"
                            ref={emailRef}
                            type="email"
                            placeholder="예 - abc123@mymail.com"
                            value={userEmail}
                            onChange={(e: any) => {
                            setUserEmail(e.target.value);
                            }}
                        />
                        <button onClick={()=>{ sendEmailCertifNum()}} className="col-span-1 w-[100px] p-3 ps-3 pe-3 border-2 border-[#a1a1a1]" disabled={emailCertigLoading}>
                            {emailCertigLoading?"loading...":"인증요청"}
                        </button>
                    </div>
                    <p className={emailValid.isValid ? "text-green-400" : "text-red-500"}>
                        {emailValid.message}
                    </p>
                    <div className="grid grid-cols-4 gap-3 mt-6">
                        <input inputMode="numeric" placeholder="인증번호" ref={emailCertifRef} onChange={(evt)=>{evt.target.value.length <= 6&&setEmailCertifNum(evt.target.value)}} 
                                value={emailCertifNum} className="media-col-3-to-4" type="number" maxLength={6} />
                        <button onClick={()=>chkEmailCertifIsMatch()} className="col-span-1 w-[100px] p-3 ps-3 pe-3 border-2 border-[#a1a1a1]">인증</button>
                    </div>
                    {
                    timerStarted && !emailCertifValid.isValid &&
                    <div className="mt-2 flex justify-start items-center">
                        <AccessTimeIcon></AccessTimeIcon><span className="ms-1">{formatTime_mmss(time)}</span>
                    </div>
                    }
                    <p className={emailCertifValid.isValid ? "text-green-400" : "text-red-500"}>
                        {emailCertifValid.message}
                    </p>
                </div>
                <div className="flex justify-center items-center w-full">
                </div>
            </div>

            {
            findedId.length > 1 && 
            <div className="max-w-2xl min-w-80 w-full p-2 pt-6 pb-6 bg-white px-4 flex flex-col justify-center flex-items-center mt-3 mb-14 shadow-md border border-gray-[#a1a1a1]">
                <div className="p-3 bottom-line">
                    <h2 className="text-xl">아이디 확인</h2>
                </div>
                <p>고객님의 정보와 일치하는 아이디를 찾았습니다.</p>
                <h2 className="text-xl text-center mt-10 mb-5">
                    {findedId}
                </h2>
                <div className="flex">
                  <button onClick={()=>{
                      router.push("/signin");
                  }} className={`greenBtn w-full h-12 mt-8 me-1`}>로그인</button>
                  <button onClick={()=>{
                      router.push("/findpw");
                  }} className={`greenBtn w-full h-12 mt-8 ms-1`}>비밀번호 찾기</button>
                </div>
            </div>
            }
        </>
      );
}