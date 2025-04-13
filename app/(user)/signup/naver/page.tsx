"use client"

import { NaverSignUpDTO, SexEnum, UserSignUpDTO } from "@/app/(type)/user";
import { useEffect, useRef, useState } from "react";
import { Validation, validationNickNameSentence } from "../../check";
import TermOfUsage from "@/app/(recipe)/recipes/(common)/document/TermOfUsage";
import PrivacyPolicy from "@/app/(recipe)/recipes/(common)/document/PrivacyPolicy";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NaverSignUp(){
    const [userEmail, setUserEmail]                   = useState<string>("");
    const [userNickName, setUserNickName]             = useState<string>("");
    const [userBirthDate, setUserBirthDate]           = useState<string>("");
    const [userSex, setUserSex]                       = useState<SexEnum|String>("");
    const [policyChk1, setPolicyChk1]                 = useState<boolean>(false);
    const [policyChk2, setPolicyChk2]                 = useState<boolean>(false);
    const route = useRouter();

    const [nickNameValid, setNickNameValid] = useState<Validation>({
        isValid: false,
        message: "",
    });

    const nickNameRef    = useRef<HTMLInputElement>(null);
    const emailRef       = useRef<HTMLInputElement>(null);

    useEffect(() => {
    if (userNickName === "") {
        setNickNameValid({
        isValid: false,
        message: "",
        });
    } else {
        setNickNameValid(validationNickNameSentence(userNickName));
    }
    }, [userNickName]);

    useEffect(()=>{
        axiosAuthInstacne.post("sns-sign-in/naver/userinfo").then((res)=>{
            setUserEmail(res.data.email)
        })
    }, [])

    const allValid = ():boolean=>{
        if (!nickNameValid.isValid) return false;
        if (!policyChk1 || !policyChk2) return false;
        return true;
    }

    const sendSignUpRequest = () => {
        if (!nickNameValid.isValid) {
          nickNameRef?.current?.focus();
          nickNameRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          return;
        }

        const userData: NaverSignUpDTO = {
          nickName: userNickName,
          grantType: "NAVER",
        };
        
        withReactContent(Swal).fire({
          title:"회원가입중...",
          showConfirmButton:false,
          //allowOutsideClick:false,
          html:<div className="overflow-y-hidden"><CircularProgress /></div>
        })
    
        axiosAuthInstacne
          .post(`${process.env.NEXT_PUBLIC_API_URL}sns-sign-up/naver`, userData)
          .then((res) => {
              Swal.fire({
                title:"환영합니다!!",
                text:"회원가입에 성공했습니다.",
                icon: "success",
              }).then(() => {
                const storage = globalThis?.sessionStorage;
                storage.setItem("firstSignUp", "true");                
                route.push("/signin");
              });
            
          })
          .catch((err) => {
            Swal.fire({
              title: "회원가입 실패",
              text: err.response.data.message,
              icon: "warning",
              confirmButtonText: "확인",
              confirmButtonColor: '#d33',
              allowEnterKey:false
            });
          });
      };

    return (
        <div className="max-w-2xl min-w-80 w-full p-2 pt-6 pb-6 bg-white px-4 flex flex-col justify-center flex-items-center mt-14 mb-14 shadow-md border border-gray-[#a1a1a1]">
          <div className="text-center p-3 bottom-line">
            <h1 className="text-2xl">회원가입</h1>
          </div>
          <div className="m-3">
            <span className="font-bold text-[#3f3f3f]">
              이메일
            </span>
            <div>
              <input
                className="bg-slate-100"
                ref={emailRef}
                type="email"
                placeholder="예 - abc123@mymail.com"
                value={userEmail}
                readOnly={true}
              />
            </div>
          </div>
          <div className="m-3">
            <span className="font-bold text-[#3f3f3f]">
              닉네임
            </span>
            <input
              ref={nickNameRef}
              name="userNickName"
              placeholder="2~10 글자 닉네임 입력"
              value={userNickName}
              onChange={(e: any) => {
                setUserNickName(e.target.value);
              }}
            />
            <p className={nickNameValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
              {nickNameValid.message}
            </p>
          </div>
          <div className="m-3 mt-6">
            <div className="flex justify-between items-center mb-3">
              <div>이용약관 동의 <span className="text-red-500">(필수)</span></div>
              <input checked={policyChk1} onChange={()=>setPolicyChk1((prev)=>!prev)}  className="w-5 h-5" type="checkbox" />
            </div>
            
            <section className="h-[200px] overflow-y-scroll border">
              <TermOfUsage/>
            </section>
          </div>
          <div className="m-3 mt-6">
            <div className="flex justify-between items-center mb-3">
              <div>개인정보 수집 및 이용 동의 <span className="text-red-500">(필수)</span></div>
              <input checked={policyChk2} onChange={()=>setPolicyChk2((prev)=>!prev)}  className="w-5 h-5" type="checkbox" />
            </div>
            <section className="h-[200px] overflow-y-scroll border">
              <PrivacyPolicy/>
            </section>
          </div>
          <div className="flex justify-center items-center w-full">
            <button className={`${allValid()?"greenBtn":"grayBtn-noHover"} w-full h-12 mt-8`} onClick={sendSignUpRequest} disabled={!allValid()}>회원가입</button>
          </div>
        </div>
      );
}