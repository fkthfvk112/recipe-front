"use client"

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { checkAnonymousAtom } from "@/app/(recoil)/userFeedAtom";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { Checkbox, Modal } from "@mui/material";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { useRecoilState } from "recoil";
import Button from "@/app/(commom)/Component/Button";
import { PrimaryButton } from "@/app/(commom)/Component/Buttons";


const modalstyle = {
    position: "absolute" as "absolute",
    bottom: "5%",
    left: "50%",
    maxHeight:"300px",
    transform: "translate(-50%, -50%)",
    width: "80%",
    backgroundColor: "white",
    borderRadius: "1.25rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    padding:"1.25rem",
    maxWidth:"700px",
    minWidth:"275px",
    border: "none",
    outline: "none"
  };

  interface commonReviewReply{
    parentReviewId:number|string,
    message:string,
    checkAnonymous?:boolean,
  }

  const domainReviewUrl = {
    board:  "review/board-reply/create",
    recipe: "review/recipe-reply/create"
  } as const;
  
function WriteReviewReply({domainName, domainId, parentReviewId}:{domainName:string, domainId:number|string, parentReviewId:number|string}){
    const [isSignIn] = useRecoilState(siginInState);
    const [open, setOpen] = useState<boolean>(false);
    const [checkAnonymous, setCheckAnonymous] = useRecoilState<boolean>(checkAnonymousAtom);

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

        
        axiosAuthInstacne
          .post(domainUrl, postData)
          .then((res) => {
            revalidateByTagName(`reviews-${domainId}-${domainName}`);
          })
          .catch((e) => {
            console.log(e);
          });          
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
        }} className="text-gray-400 hover:text-mugin-primary transition-colors cursor-pointer text-xs font-bold whitespace-nowrap">대댓글</div>
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
                    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden focus-within:border-mugin-primary focus-within:ring-2 focus-within:ring-orange-100 transition-all shadow-sm bg-white">
                      <textarea
                        className="w-full h-24 p-3 border-none resize-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                        placeholder="대댓글을 작성해주세요."
                        value={reply.message}
                        onChange={(e)=>handleChangeData(e)}
                      />
                      <div className="flex justify-between flex-wrap items-center p-3 bg-gray-50/50 border-t border-gray-50">
                        <div className="flex justify-center items-center">
                          <Checkbox 
                            checked={checkAnonymous} 
                            value={checkAnonymous} 
                            onClick={()=>{setCheckAnonymous(!checkAnonymous)}} 
                            className="p-0 mb-0.5" 
                            sx={{
                              color: "#9CA3AF",
                              '&.Mui-checked': {
                                color: "#588B8B",
                              },
                            }}
                          />
                          <span className="font-bold text-mugin-secondary text-xs ms-1 me-1 whitespace-nowrap">
                            익명
                          </span>
                        </div>
                        <div className="flex justify-center items-center gap-3">
                          <div className="text-xs text-gray-400">{reply.message.length}/200</div>
                          {
                            reply.message.length >= 2 && reply.message.length <= 200?
                            <PrimaryButton size="sm" onClick={() => { handleSaveReply(); setOpen(false); }}>
                              댓글 쓰기
                            </PrimaryButton>:
                            <PrimaryButton size="sm" disabled>
                              댓글 쓰기
                            </PrimaryButton>
                          }
                        </div>
                    </div>
                    </div>
                    ):
                    (
                      <Link href={"/signin"}>
                        <div className="w-full p-4 border border-dashed border-gray-200 rounded-2xl text-center text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-mugin-primary hover:border-mugin-primary transition-all cursor-pointer">댓글을 남기려면 로그인을 해주세요</div>
                      </Link>
                    )
                  }
                </div>
            </Modal>
        </>
    )
}


export default React.memo(WriteReviewReply);