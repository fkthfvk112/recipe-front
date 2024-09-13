"use client"
import React, { useEffect } from "react";
import { minuteInterval } from "./loginChk";
import { deleteCookie, getCookie, getCookies } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRecoilState } from "recoil";
import { siginInState } from "../(recoil)/recoilAtom";

interface Token{
    sub:string;
    exp:number;
    iat:number;
    roles:string[];
}

function IntervalConfig(){
    const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
    
    useEffect(()=>{
        const idArr:ReturnType<typeof setInterval>[] = [];
        const idZero = minuteInterval(1, ()=>{//1분에 한 번씩 실행
            const refreshTokenStr= getCookie("refresh-token");
            if(refreshTokenStr){
                const refreshToken:Token = jwtDecode(refreshTokenStr);
                const expDate = new Date(refreshToken.exp * 1000);
                if (!isNaN(expDate.getTime()) && expDate.getTime() < Date.now()) { //리프래시 토큰 만료
                    setIsSignIn(false);
                    deleteCookie("refresh-token");
                    deleteCookie("authorization");
                }
                else{
                    setIsSignIn(true);
                }
            }
            // if(!refreshTokenStr){
            //     setIsSignIn(false);
            //     deleteCookie("refresh-token");
            //     deleteCookie("authorization");
            // }
            // if(!isSignIn){ //토큰과 리코일 싱크 맞추기
            //     deleteCookie("refresh-token");
            //     deleteCookie("authorization");
            // }
        });
        

        idArr.push(idZero);

        return()=> idArr.forEach((id)=>clearInterval(id));
    }, []);

    return <></>
}

export default React.memo(IntervalConfig);