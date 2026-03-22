"use client"
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const NaverLogin = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
      const redirect = searchParams.get("redirect");
      if (redirect) {
        sessionStorage.setItem("prePath", redirect);
      }
    }, [searchParams]);
        
    const naverLogin = ()=>{
      const csrfUUID = crypto.randomUUID();
      localStorage.setItem('naverCsrf', csrfUUID);
      const redirect_uri = process.env.NODE_ENV === 'development' ? 'https://localhost:3001/signin/naver/callback' : 'https://mug-in.com/signin/naver/callback';

      location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=683zYUF6rA106NQeQTNm&state=${csrfUUID}&redirect_uri=${redirect_uri}&auth_type=reauthenticate`
    }
  
    return <div className="mt-3 cursor-pointer w-[50px] h-[50px]" onClick={naverLogin}>
      <Image 
        src={'/sns/naverLoginRoundBtn.png'}
        width={50}
        height={50}
        alt="네이버 로그인"
      />
    </div>;
  };
  
  export default NaverLogin;