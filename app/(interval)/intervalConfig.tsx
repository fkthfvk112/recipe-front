"use client"
import React from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRecoilState } from "recoil";
import { siginInState } from "../(recoil)/recoilAtom";
import Swal from "sweetalert2";
import useInterval from "../(commom)/Hook/useInterval";

interface Token{
    sub:string;
    exp:number;
    iat:number;
    roles:string[];
}

function IntervalConfig(){
    const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
    function loginChk(){
        const refreshTokenStr = getCookie("mugin-refreshtoken");

        const setLogOut = ()=>{
            setIsSignIn(false);
            deleteCookie("mugin-refreshtoken");
            deleteCookie("mugin-authtoken");
        }

        if(refreshTokenStr){
            const refreshToken:Token = jwtDecode(refreshTokenStr);
            const expDate = new Date(refreshToken.exp * 1000);

            if(isNaN(expDate.getTime())){
                setLogOut();
                return;
            }

            if (expDate.getTime() < Date.now()) { //리프래시 토큰 만료
                setLogOut();
                Swal.fire({
                    title: "로그인 에러",
                    text:"로그인 유효시간이 만료되었습니다.",
                    icon: "info",
                    confirmButtonText: "확인",
                    allowEnterKey:false
                  })
                return;
            }
            
            setIsSignIn(true); //모두 해당 없으면 로그인 상태 유지
        }else{
            if(isSignIn){
                setIsSignIn(false);
            }
        }
    }

    useInterval(loginChk, 3 * 60 * 1000, "intervalKey#loginChk")
    
    return <></>
}

export default React.memo(IntervalConfig);