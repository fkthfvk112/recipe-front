"use client";

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";;
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { Checkbox, Rating } from "@mui/material";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { domainId, domainName } from "./ReviewContainer";

const domainReviewUrl = {
  recipe: "review/create",
  board:  "review/board/create"
} as const;

interface commonReview{
  message:string,
  score?:number,
  checkAnonymous?:boolean
}

export default function WriteReview({ domainId, domainName }: { domainId: domainId, domainName:domainName }) {
  const reviewKey = `${domainName}Id`;
  
  //domain name이 유효하지 않으면 에러를 뱉자
  const [review, setReview] = useState<commonReview>({ //handler로 도메인에 따라서 세팅을 변경하자!!!
    score:5,
    message: "",
  });

  const [checkAnonymous, setCheckAnonymous] = useState<boolean>(false);
  const [isSignIn] = useRecoilState(siginInState);
  const [isClient, setIsClient] = useState(false);


  useEffect(() => {
    setIsClient(true);
  }, [isSignIn]);

  const saveReview = ()=>{
    const domainUrl = domainReviewUrl[domainName as keyof typeof domainReviewUrl];
    let postData = {
      [reviewKey]:domainId,
      ...review
    }

    if(domainName === "board"){
      postData = {
        ...postData, 
        checkAnonymous:checkAnonymous
      };
    }

    axiosAuthInstacne
      .post(domainUrl, postData)
      .then((res) => {
        console.log(res.data);
        revalidateByTagName(`reviews-${domainId}`);
        setReview({...review, message:""});
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const handleChangeData = (evt:ChangeEvent<HTMLTextAreaElement>)=>{
    const messageNow = evt.target.value;
    if(messageNow.length > 200) return;
    setReview({
      ...review,
      message: messageNow,
    });
  }

  const reviewInput =
    isClient && isSignIn ? (
      <div className="flex justify-center flex-col items-center">
        <div className="text-start w-full">
          {
            domainName === "recipe"&&
          <Rating
            size="large"
            onChange={(e, newValue) => {
              setReview({
                ...review,
                score: newValue !== null ? newValue : 5,
              });
            }}
            name="half-rating"
            value={review.score}
            precision={1}
          />
          }
        </div>
        {/* have to ...textarea와 그 바로 밑 div의 height조절해서 부모 div에 꽉 차도록 설정 익명 토글 버튼 설정 */}
        <div className="w-full border border-slate-400">
          <textarea
            className="w-full h-30 p-3 border-none bottom-line-noM"
            placeholder="댓글을 작성해주세요."
            value={review.message}
            onChange={(e) => {
              handleChangeData(e);
            }}
          />
          <div className="flex justify-between items-center p-2">
            <div className="felx justify-center items-center">
              <Checkbox checked={checkAnonymous} value={checkAnonymous} onClick={()=>{setCheckAnonymous(!checkAnonymous)}} className="p-0 mb-1" defaultChecked color="success" />
              <span className="font-bold text-[#31853c] ms-1">
                익명
              </span>
            </div>
            <div className="flex justify-center items-center">
              <div className="me-5">{review.message.length}/200</div>
              {
                review.message.length >= 1 && review.message.length <= 200?
                <button className="greenBtn" onClick={() => saveReview()}>
                  댓글 쓰기
                </button>:
                <button className="grayBtn cursor-default">
                  댓글 쓰기
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Link href={"/signin"}>
        <div  className="w-full p-2 border rounded-md text-gray-500">댓글을 남기려면 로그인을 해주세요</div>
      </Link>
    );
  return <>{reviewInput}</>;
}
