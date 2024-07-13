"use client"

import React, { useCallback, useEffect, useState } from "react"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { useRecoilValue } from "recoil";
import haveToLoginSwal from "../HaveToLoginSwal";
import { useRouter } from "next/navigation";

function HeartLike({getUrl, putUrl, reqdata}:{getUrl:string, putUrl:string, reqdata:object}){ //have to :: 뭔가 느리고 에러 있음 레디스 도입 후 수정해보기
    const [resetData, setResetData]       = useState<number>(0);
    const [isOn, setIsOn]                 = useState<boolean>(false);
    const isSignIn = useRecoilValue<boolean>(siginInState);
    const router = useRouter();

    useEffect(() => {
        if (isSignIn) {
            axiosAuthInstacne
                .get(getUrl)
                .then((res) => {
                    setIsOn(res.data?.isOn);
                });
        }
    }, [isSignIn, getUrl, resetData]);

    // const handleLikeThis = ()=>{
    //     setHeartLoading(true);
    //     const whenLogInFetch = () => {
    //         axiosAuthInstacne.post(putUrl, reqdata)
    //           .then((res) => {
    //             setResetData(resetData + 1);
    //           })
    //           .finally(()=>{
    //             setHeartLoading(false);
    //           });
    //       };

    //     haveToLoginSwal(()=>router.push("/signin"), whenLogInFetch);
    // }

    const handleLikeThis = useCallback(() => {
        const whenLogInFetch = () => {
            axiosAuthInstacne.post(putUrl, reqdata)
                .then(() => {
                    setResetData((prev) => prev + 1);
                })
        };

        haveToLoginSwal(() => router.push("/signin"), [whenLogInFetch]);
    }, [putUrl, reqdata, router]);

    const heart = isOn? <FavoriteIcon className='hover-pointer m-2'/>
                    :<FavoriteBorderIcon className='hover-pointer m-2'/>
    return(
        <button onClick={handleLikeThis} className="flex justify-center items-center w-12 h-10 border-none">
            {heart}
        </button>
    )
}

export default React.memo(HeartLike);