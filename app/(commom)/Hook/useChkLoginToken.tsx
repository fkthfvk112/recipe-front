import { siginInState } from "@/app/(recoil)/recoilAtom";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";

interface Token{
    sub:string;
    exp:number;
    iat:number;
    roles:string[];
}

export type checkMode =  'refreshNeed'|'refreshNoNeed'

export default function useChkLoginToken(checkMode:checkMode):boolean{
    const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
    // const [checkingDone, setChkcingDone] = useState<boolean>(false);
    const [isVald, setIsValid] = useState<boolean>(false);
    const router = useRouter();

    const setLogOut = ()=>{
        deleteCookie("mugin-refreshtoken");
        deleteCookie("mugin-authtoken");
        setIsSignIn(false);
    }
      
    useEffect(()=>{
        const setValid = ()=>{
            if(checkMode === 'refreshNeed'){ //토큰이 필요한 경우 valid하지 않음
                setIsValid(false);
            }else{
                setIsValid(true);//토큰이 필요하지 않을 경우 항상 valid
            }
        }

        try{
            const refreshTokenStr = getCookie("mugin-refreshtoken");
            if(refreshTokenStr){
                const refreshToken:Token = jwtDecode(refreshTokenStr);
                const expDate = new Date(refreshToken.exp * 1000);
                if(isNaN(expDate.getTime()) || expDate.getTime() < Date.now()){
                    setLogOut();
                    setValid();
                    Swal.fire({
                        title: "로그인 에러",
                        text:"로그인 유효시간이 만료되었습니다. 로그인 페이지로 이동하시겠습니까?.",
                        icon: "info",
                        confirmButtonText: "확인",
                        allowOutsideClick:false,
                    }).then((result) => {
                        if(result.isConfirmed){
                            router.push("/signin")
                        }
                    })
                }else{
                    setIsValid(true);
                }
            }else{
                setLogOut();
                setValid()
                if(checkMode === 'refreshNeed'){
                    console.log("토큰 에러")
                    Swal.fire({
                        title: "로그인 에러",
                        text:"로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?.",
                        icon: "info",
                        confirmButtonText: "확인",
                        allowOutsideClick:false,
                    }).then((result) => {
                        if(result.isConfirmed){
                            router.push("/signin")
                        }
                    })
                }
            }
        } catch(e){
            setLogOut();
            setValid();
            Swal.fire({
                title: "로그인 정보 오류",
                text: "로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.",
                icon: "error",
                confirmButtonText: "확인",
                allowOutsideClick:false,
            }).then((result) => {
                if(result.isConfirmed){
                    router.push("/signin")
                }
            });
        }
        
    }, [checkMode])

    return isVald;
}