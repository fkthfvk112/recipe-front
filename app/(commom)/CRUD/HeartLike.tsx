"use client"

import React, { useEffect, useState } from "react"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { useRecoilValue } from "recoil";

interface ToggleState{
    isOn:boolean;
}
function HeartLike({getUrl, putUrl, reqdata}:{getUrl:string, putUrl:string, reqdata:object}){ //have to :: 뭔가 느리고 에러 있음 레디스 도입 후 수정해보기
    const [resetData, setResetData] = useState<number>(0);
    const [isOn, setIsOn] = useState<boolean>(false);
    const isSignIn = useRecoilValue<boolean>(siginInState);

    useEffect(() => {
        if (isSignIn) {
          axiosAuthInstacne
            .get(getUrl)
            .then((res) => {
              setIsOn(res.data?.isOn);
            });
        }
      }, [resetData]);

    const handleLikeThis = ()=>{
        axiosAuthInstacne.post(putUrl, reqdata)
            .then((res) => {
                setResetData(resetData + 1);
            });
    }

    const heart = isOn? <FavoriteIcon className='hover-pointer m-2' onClick={()=>handleLikeThis()}/>
                    :<FavoriteBorderIcon className='hover-pointer m-2' onClick={()=>handleLikeThis()}/>
    return(
        <button onClick={()=>handleLikeThis()} className="flex justify-center items-center w-12 h-10 border-none">
            {heart}
        </button>
    )
}

export default React.memo(HeartLike);