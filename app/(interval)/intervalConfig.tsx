"use client"
import React, { useEffect } from "react";
import { minuteInterval } from "./loginChk";
import { deleteCookie, getCookie, getCookies } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRecoilState } from "recoil";
import { siginInState } from "../(recoil)/recoilAtom";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Token{
    sub:string;
    exp:number;
    iat:number;
    roles:string[];
}

function IntervalConfig(){
    const router = useRouter();

    const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
    
    useEffect(()=>{
        const idArr:ReturnType<typeof setInterval>[] = [];
        const idZero = minuteInterval(3, ()=>{//3분에 한 번씩 실행

            const refreshTokenStr= getCookie("refresh-token");

            const setLogOut = ()=>{
                setIsSignIn(false);
                deleteCookie("refresh-token");
                deleteCookie("authorization");
            }

            if(refreshTokenStr){
                const refreshToken:Token = jwtDecode(refreshTokenStr);
                const currentTime = Date.now();

                const expDate = new Date(refreshToken.exp * 1000);
                if(isNaN(expDate.getTime())){
                    setLogOut();
                    return;
                }

                if (expDate.getTime() < Date.now()) { //리프래시 토큰 만료
                    setLogOut();
                    Swal.fire({
                        title: "로그인 유효시간",
                        text:"로그인 유효시간이 만료되었습니다.",
                        icon: "info",
                        confirmButtonText: "확인",
                        allowEnterKey:false
                      })
                    return;
                }
                
                setIsSignIn(true); //모두 해당 없으면 로그인 상태 유지
            }
        });
        

        idArr.push(idZero);

        return()=> idArr.forEach((id)=>clearInterval(id));
    }, []);

    return <></>
}

export default React.memo(IntervalConfig);