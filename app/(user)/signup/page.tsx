"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Validation,
  validationEmailSentence,
  validationIdSentence,
  validationNickNameSentence,
  validationPwSameSentence,
  validationPwSentence,
} from "../check";
import axios from "axios";
import { UserSignUpDTO } from "@/app/(type)/user";
import withReactContent from 'sweetalert2-react-content'
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";

export default function SignUp() {
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [userVeriPw, setUserVeriPw] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userNickName, setUserNickName] = useState<string>("");

  const [idValid, setIdValid] = useState<Validation>({
    isValid: false,
    message: "",
  });
  const [nickNameValid, setNickNameValid] = useState<Validation>({
    isValid: false,
    message: "",
  });

  const [pwValid, setPwValid] = useState<Validation>({
    isValid: false,
    message: "",
  });
  const [veriPwValid, setVeriPwValid] = useState<Validation>({
    isValid: false,
    message: "",
  });
  const [emailValid, setEmailValid] = useState<Validation>({
    isValid: false,
    message: "",
  });

  const idRef = useRef<HTMLInputElement>(null);
  const nickNameRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const veriPwRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const route = useRouter();

  const allValid = ():boolean=>{
    if (!idValid.isValid) return false;
    if (!pwValid.isValid) return false;
    if (!veriPwValid.isValid) return false;
    if (!emailValid.isValid) return false;
    if (!nickNameValid.isValid) return false;
    return true;
  }

  useEffect(() => {
    console.log(idValid);
    if (userId === "") {
      setIdValid({
        isValid: false,
        message: "",
      });
    } else {
      console.log("히어");
      setIdValid(validationIdSentence(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (userPw === "") {
      setPwValid({
        isValid: false,
        message: "",
      });
    } else {
      setPwValid(validationPwSentence(userPw));
    }
  }, [userPw]);

  useEffect(() => {
    if (userVeriPw === "") {
      setVeriPwValid({
        isValid: false,
        message: "",
      });
    } else {
      setVeriPwValid(validationPwSameSentence(userPw, userVeriPw));
    }
  }, [userVeriPw]);

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
    if (userNickName === "") {
      setNickNameValid({
        isValid: false,
        message: "",
      });
    } else {
      setNickNameValid(validationNickNameSentence(userNickName));
    }
  }, [userNickName]);

  const sendSignUpRequest = () => {
    if (!idValid.isValid) {
      idRef?.current?.focus();
      idRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }
    if (!pwValid.isValid) {
      pwRef?.current?.focus();
      pwRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!veriPwValid.isValid) {
      veriPwRef?.current?.focus();
      veriPwRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (!emailValid.isValid) {
      emailRef?.current?.focus();
      emailRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if (!nickNameValid.isValid) {
      nickNameRef?.current?.focus();
      nickNameRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }


    const userData: UserSignUpDTO = {
      userId: userId,
      userPassword: userPw,
      email: userEmail,
      nickName: userNickName,
      grantType: "NORMAL",
    };
    
    withReactContent(Swal).fire({
      title:"회원가입중...",
      showConfirmButton:false,
      allowOutsideClick:false,
      html:<div className="overflow-y-hidden"><CircularProgress /></div>
  })

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/sign-up-request`, userData)
      .then((res) => {
        console.log("레스레스", res);
          Swal.fire({
            title: "발송된 메일을 확인해주세요!",
            icon: "success",
          }).then(() => {
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
    <div className="max-w-md w-96 p-2 bg-white px-4 flex flex-col justify-center flex-items-center mt-16 shadow-md border border-gray-[#a1a1a1]">
      <div className="text-center p-3 bottom-line">
        <h1 className="text-2xl">회원가입</h1>
      </div>
      <div className="m-3">
        <span className="font-bold text-[#3f3f3f]">
          아이디
        </span>
        <input
          ref={idRef}
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
        <p
          className={
            nickNameValid.isValid ? "text-[#38c54b]" : "text-red-500"
          }
        >
          {nickNameValid.message}
        </p>
      </div>
      <div className="m-3">
        <span className="font-bold text-[#3f3f3f]">
          비밀번호
        </span>
        <input
          ref={pwRef}
          name="userPw"
          placeholder="특수문자, 숫자, 영어를 포함하는 8~20자"
          type="password"
          value={userPw}
          onChange={(e: any) => {
            setUserPw(e.target.value);
          }}
        />
        <p className={pwValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
          {pwValid.message}
        </p>
      </div>
      <div className="m-3">
        <span className="font-bold text-[#3f3f3f]">
          비밀번호 확인
        </span>
        <input
          ref={veriPwRef}
          placeholder="동일한 비밀번호 입력"
          type="password"
          value={userVeriPw}
          onChange={(e: any) => {
            setUserVeriPw(e.target.value);
          }}
        />
        <p className={veriPwValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
          {veriPwValid.message}
        </p>
      </div>
      <div className="m-3">
        <span className="font-bold text-[#3f3f3f]">
          이메일
        </span>
        <div className="flex">
          <input
            ref={emailRef}
            type="text"
            placeholder="예 - abc123@mymail.com"
            value={userEmail}
            onChange={(e: any) => {
              setUserEmail(e.target.value);
            }}
          />
        </div>
        <p className={emailValid.isValid ? "text-green-400" : "text-red-500"}>
          {emailValid.message}
        </p>
      </div>
      <div className="flex justify-center items-center w-full">
        <button className={`${allValid()?"greenBtn":"grayBtn"} w-full h-12 mt-8`} onClick={sendSignUpRequest}>회원가입</button>
      </div>
    </div>
  );
}
