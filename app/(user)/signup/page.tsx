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
import { SexEnum, UserSignUpDTO } from "@/app/(type)/user";
import withReactContent from 'sweetalert2-react-content'
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
import DateSelector from "./BirthdateSelection";


export default function SignUp() {
  const [emailCertigLoading, setEmailCertifLoading] = useState<boolean>(false);

  const [userId, setUserId]                         = useState<string>("");
  const [userPw, setUserPw]                         = useState<string>("");
  const [userVeriPw, setUserVeriPw]                 = useState<string>("");
  const [userEmail, setUserEmail]                   = useState<string>("");
  const [userNickName, setUserNickName]             = useState<string>("");
  const [userBirthDate, setUserBirthDate]           = useState<string>("");
  const [userSex, setUserSex]                       = useState<SexEnum|String>("");

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
  const [emailCertifValid, setEmailCertifValid] = useState<Validation>({
    isValid: false,
    message: "",
  });
  const [sexValid, setSexValid] = useState<Validation>({
    isValid: false,
    message:"",
  })


  //이메일 인증
  const [emailCertifNum, setEmailCertifNum]                 = useState<string>("");
  const [encodedEmail, setEncodedEmail]                     = useState<string>("");

  const idRef          = useRef<HTMLInputElement>(null);
  const nickNameRef    = useRef<HTMLInputElement>(null);
  const pwRef          = useRef<HTMLInputElement>(null);
  const veriPwRef      = useRef<HTMLInputElement>(null);
  const emailRef       = useRef<HTMLInputElement>(null);
  const emailCertifRef = useRef<HTMLInputElement>(null);

  const route = useRouter();

  const allValid = ():boolean=>{
    if (!idValid.isValid) return false;
    if (!pwValid.isValid) return false;
    if (!veriPwValid.isValid) return false;
    if (!emailValid.isValid) return false;
    if (!nickNameValid.isValid) return false;
    if (!emailCertifValid.isValid) return false;
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

    if (!nickNameValid.isValid) {
      nickNameRef?.current?.focus();
      nickNameRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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

    if(userSex !== SexEnum.FEMAIL && userSex !== SexEnum.MALE){
      setSexValid({
        isValid:false,
        message:"성별을 선택해주세요."
      })
      return;
    }else{
      setSexValid({
        isValid:true,
        message:""
      })
    }

    if (!emailValid.isValid) {
      emailRef?.current?.focus();
      emailRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    if(userBirthDate.length !== 8){
      return;
    }
      
    const userData: UserSignUpDTO = {
      userId: userId,
      userPassword: userPw,
      email: userEmail,
      nickName: userNickName,
      grantType: "NORMAL",
      encodedEmail:encodedEmail,
      sex:userSex as SexEnum,
      birthDate:userBirthDate
    };
    
    withReactContent(Swal).fire({
      title:"회원가입중...",
      showConfirmButton:false,
      //allowOutsideClick:false,
      html:<div className="overflow-y-hidden"><CircularProgress /></div>
    })

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/sign-up`, userData)
      .then((res) => {
          Swal.fire({
            title: "회원가입에 성공했습니다.",
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
 
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/send-certif-number`, {email:userEmail}, {
      withCredentials: true,
    })
    .then((res)=>{
      setEmailCertifLoading(false);
      Swal.fire({
        title: "인증 번호 발송",
        text:"인증 번호를 발송하였습니다. 이메일을 확인해주세요.",
        icon: "success",
      })
      })
    .catch((err)=>{
      setEmailCertifLoading(false);
      Swal.fire({
        title: "에러가 발생하였습니다.",
        icon: "error",
        text:err.response.data.message
      });
    })
  }

  const chkEmailCertifIsMatch = ()=>{
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}sign-api/certifnum-chk`, {email:userEmail, certifNum:emailCertifNum}, {
      withCredentials: true,
    })
    .then((res)=>{
      Swal.fire({
        title: "인증 완료",
        text:"이메일이 인증되었습니다.",
        icon: "success",
      })
      setEncodedEmail(res.data.emailCertifEncoded);
      setEmailCertifValid({isValid:true, message:`인증되었습니다. [${userEmail}]`});
    })
    .catch((err)=>{
      console.log("에러 err", err);
      Swal.fire({
        title: "인증 실패",
        text:"유효하지 않은 인증번호입니다.",
        icon: "warning",
      })
    })
  }

  return (
    <div className="max-w-2xl min-w-80 w-full p-2 bg-white px-4 flex flex-col justify-center flex-items-center mt-14 shadow-md border border-gray-[#a1a1a1]">
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
      <div className="m-3 mt-5">
        <div className="flex justify-between items-center">
          <span className="font-bold text-[#3f3f3f]">
            성별
          </span>
          <div className="flex">
            <div className={`p-3 ps-8 pe-8 border-2 ${userSex===SexEnum.FEMAIL?"border-[#38c54b]":"border-[#f5f2f2]"} cursor-pointer`} 
              onClick={()=>setUserSex(SexEnum.FEMAIL)}>여자</div>
            <div className={`p-3 ps-8 pe-8 border-2 ${userSex===SexEnum.MALE?"border-[#38c54b]":"border-[#f5f2f2]"} cursor-pointer`} 
              onClick={()=>setUserSex(SexEnum.MALE)}>남자</div>
          </div>
        </div>
        <p className={sexValid.isValid ? "text-[#38c54b]" : "text-red-500"}>
          {sexValid.message}
        </p>
      </div>
      <div className="m-3 mt-5">
        <span className="font-bold text-[#3f3f3f]">
          생년월일
        </span>
        <DateSelector setUserBirthDate={setUserBirthDate}/>
      </div>
      <div className="m-3">
        <span className="font-bold text-[#3f3f3f]">
          이메일
        </span>
        <div className="grid-cols-4 grid gap-3">
          <input
            className="media-col-3-to-4"
            ref={emailRef}
            type="text"
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
          <input placeholder="인증번호" ref={emailCertifRef} onChange={(evt)=>{evt.target.value.length <= 4&&setEmailCertifNum(evt.target.value)}} 
                    value={emailCertifNum} className="media-col-3-to-4" type="number" maxLength={4} />
          <button onClick={()=>chkEmailCertifIsMatch()} className="col-span-1 w-[100px] p-3 ps-3 pe-3 border-2 border-[#a1a1a1]">인증</button>
        </div>
        <p className={emailCertifValid.isValid ? "text-green-400" : "text-red-500"}>
          {emailCertifValid.message}
        </p>
      </div>
      <div className="flex justify-center items-center w-full">
        <button className={`${allValid()?"greenBtn":"grayBtn"} w-full h-12 mt-8`} onClick={sendSignUpRequest}>회원가입</button>
      </div>
    </div>
  );
}
