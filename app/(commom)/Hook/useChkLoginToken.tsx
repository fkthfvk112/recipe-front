import { siginInState } from "@/app/(recoil)/recoilAtom";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
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
    const [checkingDone, setChkcingDone] = useState<boolean>(false);

    const setLogOut = ()=>{
        deleteCookie("refresh-token");
        deleteCookie("authorization");
        setIsSignIn(false);
      }

    useEffect(()=>{
        try{
            const refreshTokenStr = getCookie("refresh-token");
            console.log("여기 들어옴");
            if(refreshTokenStr){
                const refreshToken:Token = jwtDecode(refreshTokenStr);
                const expDate = new Date(refreshToken.exp * 1000);
                
                if(isNaN(expDate.getTime()) || expDate.getTime() < Date.now()){
                setLogOut();
                Swal.fire({
                    title: "로그인 유효시간",
                    text:"로그인 유효시간이 만료되었습니다.",
                    icon: "info",
                    confirmButtonText: "확인",
                    allowEnterKey:false
                })
                }
            }else{
                setLogOut();
                if(checkMode === 'refreshNeed'){
                    Swal.fire({
                        title: "로그인 유효시간",
                        text:"로그인 유효시간이 만료되었습니다.",
                        icon: "info",
                        confirmButtonText: "확인",
                        allowEnterKey:false
                    })
                }
            }
        } catch(e){
            setLogOut();
            Swal.fire({
                title: "로그인 정보 오류",
                text: "로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.",
                icon: "error",
                confirmButtonText: "확인",
                allowEnterKey: false,
            });
        }
        setChkcingDone(true)
        
    }, [checkMode])

    return checkingDone;
}