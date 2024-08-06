"use client"

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { Checkbox, Modal } from "@mui/material";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { useRecoilState } from "recoil";


const modalstyle = {
    position: "absolute" as "absolute",
    bottom: "5%",
    left: "50%",
    maxHeight:"300px",
    transform: "translate(-50%, -50%)",
    width: "80%",
    backgroundColor: "white",
    padding:"1em",
    maxWidth:"700px",
    minWidth:"275px"
  };

  interface commonReviewReply{
    parentReviewId:number|string,
    message:string,
    checkAnonymous?:boolean,
  }

  const domainReviewUrl = {
    board:  "review/board-reply/create"
  } as const;
  
function WriteReviewReply({domainName, domainId, parentReviewId}:{domainName:string, domainId:number|string, parentReviewId:number|string}){
    const [isSignIn] = useRecoilState(siginInState);
    const [open, setOpen] = useState<boolean>(false);
    const [checkAnonymous, setCheckAnonymous] = useState<boolean>(false);
    const [reply, setReply] = useState<commonReviewReply>({
        parentReviewId:parentReviewId,
        message:"",
      })

    const reviewKey = `${domainName}Id`;

    const handleSaveReply = ()=>{
        const domainUrl = domainReviewUrl[domainName as keyof typeof domainReviewUrl];

        let postData = {
          [reviewKey]:domainId,
          ...reply,
          checkAnonymous:checkAnonymous
        }

        switch(domainName){
            case "board":
              axiosAuthInstacne
              .post(domainUrl, postData)
              .then((res) => {
                revalidateByTagName(`reviews-${domainId}`);
              })
              .catch((e) => {
                console.log(e);
              });
            break;
          }
    }

    const handleChangeData = (evt:ChangeEvent<HTMLTextAreaElement>)=>{
      const messageNow = evt.target.value;
      if(messageNow.length > 200) return;
      setReply({
        ...reply,
        message: messageNow,
      });
    }

    return(
        <>
        <div onClick={()=>{
            setOpen(true);
        }} className="text-[#a1a1a1] cursor-pointer">대댓글</div>
            <Modal
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <div style={modalstyle}>
                {
                isSignIn?
                (
                    <div className="w-full border border-slate-400">
                      <textarea
                        className="w-full h-30 p-3 border-none bottom-line-noM"
                        placeholder="대댓글을 작성해주세요."
                        value={reply.message}
                        onChange={(e)=>handleChangeData(e)}
                      />
                      <div className="flex justify-between flex-wrap items-center p-2">
                        <div className="felx justify-center items-center">
                          <Checkbox checked={checkAnonymous} value={checkAnonymous} onClick={()=>{setCheckAnonymous(!checkAnonymous)}} className="p-0 mb-1" defaultChecked color="success" />
                          <span className="font-bold text-[#31853c] ms-1 me-1 whitespace-nowrap">
                            익명
                          </span>
                        </div>
                        <div className="flex justify-center items-center">
                          <div className="me-5">{reply.message.length}/200</div>
                          {
                            reply.message.length >= 1 && reply.message.length <= 200?
                            <button className="greenBtn" onClick={() => handleSaveReply()}>
                              댓글 쓰기
                            </button>:
                            <button className="grayBtn cursor-default">
                              댓글 쓰기
                            </button>
                          }
                        </div>
                    </div>
                    </div>
                    ):
                    (
                      <Link href={"/signin"}>
                        <div  className="w-full p-2 border rounded-md text-gray-500">댓글을 남기려면 로그인을 해주세요</div>
                      </Link>
                    )
                  }
                </div>
            </Modal>
        </>
    )
}


export default React.memo(WriteReviewReply);