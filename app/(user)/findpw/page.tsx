"use client";

import { useEffect, useState } from "react";
import { Validation, validationEmailSentence, validationIdSentence } from "../check";
import axios from "axios";
import Swal from "sweetalert2";
import useDecreaseTimer from "@/app/(commom)/Hook/useDecreaseTimer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTime_mmss } from "@/app/(utils)/timeUtils";
import { defaultAxios } from "@/app/(customAxios)/authAxios";
import { useRouter } from "next/navigation";

export default function FindPw(){
    const [userId, setUserId] = useState<string>("");
    const [emailCertifNum, setEmailCertifNum] = useState<string>("");

    const [userEmail, setUserEmail] = useState<string>("");

    const [maskedEmail, setMaskedEmail] = useState<string>("");
 
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [timerStarted, setTimerStarted] = useState<boolean>(false);
    const [time, setTimer, startTimer] = useDecreaseTimer({initialTime:0});

    const [validId, setValidId] = useState<string>("");


    const [idValid, setIdValid] = useState<Validation>({
        isValid: false,
        message: "",
      });
    
    const [emailValid, setEmailValid] = useState<Validation>({
        isValid: false,
        message: "",
    });

    const [emailCertifValid, setEmailCertifValid] = useState<Validation>({
        isValid: false,
        message: "",
    });

    const [isNewPwLoading, setIsNewPwLoading] = useState<boolean>(false);

    const [encodedEmail, setEncodedEmail]                     = useState<string>("");
    
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

    useEffect(() => {
        if (userId === "") {
          setIdValid({
            isValid: false,
            message: "",
          });
        } else {
          setIdValid(validationIdSentence(userId));
        }
      }, [userId]);
    

    const chkIdValid = ()=>{ //아이디 입력 후 다음 버튼
        if(!idValid.isValid) return;

        const validIdTemp = userId;
        defaultAxios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/get-masking-email`, {userId:validIdTemp}, {
            withCredentials: true,
        })
        .then((res)=>{
            setMaskedEmail(res.data);
            setValidId(validIdTemp);
        })
    }

    const sendEmailCertifNum = ()=>{ //이메일 입력 후 인증요청
        if (!emailValid.isValid || !(validId.length > 2)) {
          return;
        }
        setIsLoading(true);
    
        defaultAxios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/send/find-pw/certif-number`, {email:userEmail, userId:validId}, {
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
          })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    
    const chkEmailCertifIsMatch = ()=>{ //이메일 입력 후 인증
        if (!emailValid.isValid || !(validId.length > 2) || time <= 1 || encodedEmail.length >= 2) {
            return;
        }
        defaultAxios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/find-pw/certifnum-chk`, {email:userEmail, certifNum:emailCertifNum}, {
            withCredentials: true,
        })
        .then((res)=>{
            Swal.fire({
            title: "인증 완료",
            text:"이메일이 인증되었습니다. 비밀번호 발급 버튼을 눌러주세요.",
            icon: "success",
            })
            setEncodedEmail(res.data.emailCertifEncoded);
            setEmailCertifValid({isValid:true, message:`인증되었습니다. [${userEmail}]`});
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    const sendNewPw = ()=>{ //인증 후 임시 비밀번호 발급        
        setIsNewPwLoading(true);
        defaultAxios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/send/new-pw`,  {email:encodedEmail, userId:validId}, {
            withCredentials: true,
        })
        .then((res)=>{
            Swal.fire({
                title: "인증 완료",
                text:"새로운 비밀번호가 발급되었습니다. 이메일을 확인해주세요.",
                icon: "success",
            }).then((res)=>{
                if(res.isConfirmed){
                    router.push("/signin");
                }
            });
        })
        .finally(()=>{
            setIsNewPwLoading(false);
        })
    }
 
    return (
        <>
        {
        validId === "" &&
        <div className="max-w-2xl min-w-80 w-full p-2 pt-6 pb-6 bg-white px-4 flex flex-col justify-center flex-items-center mt-14 mb-3 shadow-md border border-gray-[#a1a1a1]">
            <div className="text-center p-3 bottom-line">
                <h1 className="text-2xl">비밀번호 찾기</h1>
            </div>
            <div className="m-3">
                <span className="font-bold text-[#3f3f3f]">
                아이디
                </span>
                <input
                name="userId"
                placeholder="6~12자의 영문, 숫자"
                type="text"
                value={userId}
                onChange={(e: any) => {
                    setUserId(e.target.value);
                }}
                />
                <p className={idValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
                {idValid.message}
                </p>
            </div>
            <div className="flex justify-center items-center w-full">
                <button className={`${idValid.isValid?"greenBtn":"grayBtn-noHover"} w-full h-12 mt-8`} onClick={chkIdValid} disabled={!idValid.isValid}>다음</button>
            </div>
        </div>
        }

        {
        validId.length >= 6 &&
        <div className="max-w-2xl min-w-80 w-full p-2 pt-6 pb-6 bg-white px-4 flex flex-col justify-center flex-items-center mt-14 mb-3 shadow-md border border-gray-[#a1a1a1]">
        <div className="p-3 bottom-line">
                <h2 className="text-xl">이메일 인증</h2>
            </div>
            <p>신규 비밀번호 발급을 위해 가입한 이메일로 인증해주세요.</p>
            <div className="m-3 mt-10">
                <span className="font-bold text-[#3f3f3f]">
                이메일
                <p className="text-[#52CF63]">{maskedEmail}</p>
                </span>
                <div className="grid-cols-4 grid gap-3">
                    <input
                        className="media-col-3-to-4"
                        type="email"
                        placeholder="예 - abc123@mymail.com"
                        value={userEmail}
                        onChange={(e: any) => {
                        setUserEmail(e.target.value);
                        }}
                    />
                    <button onClick={()=>{ sendEmailCertifNum()}} className="col-span-1 w-[100px] p-3 ps-3 pe-3 border-2 border-[#a1a1a1]" disabled={isLoading}>
                        {isLoading?"loading...":"인증요청"}
                    </button>
                </div>
                <p className={emailValid.isValid ? "text-green-400" : "text-red-500"}>
                    {emailValid.message}
                </p>
                    <div className="grid grid-cols-4 gap-3 mt-6">
                        <input inputMode="numeric" placeholder="인증번호" onChange={(evt)=>{evt.target.value.length <= 6&&setEmailCertifNum(evt.target.value)}} 
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
                <button className={`${encodedEmail.length>2?"greenBtn":"grayBtn-noHover"} w-full h-12 mt-8`} onClick={sendNewPw} disabled={isNewPwLoading}>
                    {isNewPwLoading?"loading...":"임시 비밀번호 발급"}
                </button>
            </div>
        </div>
        }
    </>
    )
}