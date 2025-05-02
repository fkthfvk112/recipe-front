"use client"

import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil";
import Swal from "sweetalert2";

export default function NaverCallback(){
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSignIn, setIsSignIn] = useRecoilState<boolean>(siginInState);

    const naverLogInOrSignUp = (code:string)=>{
        defaultAxios.get(`sns-sign-in/naver/auth-chk?code=${code}`).then((res)=>{
            if(res.data == 'ID_NOT_EXIST'){
                //sign up
                router.replace("/signup/naver")

            }else if(res.data == 'ID_EXIST'){
                //sign in
                axiosAuthInstacne
                    .post('sns-sign-in/naver')
                    .then((res)=>{
                    setIsSignIn(true);
                        const storage = globalThis?.sessionStorage;
                        let pathToGo = "/";
                        const prePath = storage.getItem("prePath");
                        if (storage && typeof prePath === "string") {
                            pathToGo = storage.getItem("prePath") as string;
                            storage.removeItem("prePath");
                        }
                        //location.href = pathToGo;
                        router.replace("/")
                    })
                    .catch((err)=>{
                        Swal.fire({
                            title: "에러가 발생하였습니다.",
                            text: err.response.data.message,
                            icon: "warning",
                            confirmButtonText: "확인",
                            confirmButtonColor: '#d33',
                            allowEnterKey:false
                        }).then((result) => {
                            if(result.isConfirmed){
                                router.push("/signin")
                            }
                        });
                    })
                    .finally(()=>{
                        setIsLoading(false);
                })
            }
        })
    }

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        
        const code = params.get('code');
        const state = params.get('state');

        const csrfUUID = localStorage.getItem('naverCsrf');
        localStorage.removeItem('naverCsrf');

        if(state === csrfUUID && code != null){
            naverLogInOrSignUp(code);
        }else{
            router.replace("/")
        }

        
    }, [])

    
    return (
        <div className="w-full h-lvh flex-center">
            <CircularProgress />
        </div>
    )
}