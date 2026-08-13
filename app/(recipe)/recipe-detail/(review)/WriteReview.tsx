"use client";

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";;
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { Checkbox, Rating } from "@mui/material";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { domainId, domainName } from "./ReviewContainer";
import { checkAnonymousAtom } from "@/app/(recoil)/userFeedAtom";
import Button from "@/app/(commom)/Component/Button";

const domainReviewUrl = {
  recipe: "review/recipe/create",
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

  const [checkAnonymous, setCheckAnonymous] = useRecoilState<boolean>(checkAnonymousAtom);
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

    postData = {
      ...postData, 
      checkAnonymous:checkAnonymous
    };

    axiosAuthInstacne
      .post(domainUrl, postData)
      .then((res) => {
        revalidateByTagName(`reviews-${domainId}-${domainName}`);
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
        <div className="text-start w-full mb-2">
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
            sx={{ color: '#FFB703' }}
          />
          }
        </div>
        <div className="w-full border border-gray-200 rounded-2xl overflow-hidden focus-within:border-mugin-primary focus-within:ring-2 focus-within:ring-orange-100 transition-all shadow-sm bg-white">
          <textarea
            className="w-full h-24 p-3 border-none resize-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="따뜻한 격려의 댓글을 작성해주세요."
            value={review.message}
            onChange={(e) => {
              handleChangeData(e);
            }}
          />
          <div className="flex justify-between items-center p-3 bg-gray-50/50 border-t border-gray-50">
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
              <span className="font-bold text-mugin-secondary text-xs ms-1">
                익명
              </span>
            </div>
            <div className="flex justify-center items-center gap-3">
              <div className="text-xs text-gray-400">{review.message.length}/200</div>
              {
                review.message.length >= 2 && review.message.length <= 200?
                <Button type="button" variant="secondary" size="sm" onClick={() => saveReview()}>
                  댓글 쓰기
                </Button>:
                <Button type="button" variant="neutral" size="sm" disabled>
                  댓글 쓰기
                </Button>
              }
            </div>
          </div>
        </div>
      </div>
    ) : (
      <Link href={"/signin"}>
        <div className="w-full p-4 border border-dashed border-gray-200 rounded-2xl text-center text-sm font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-mugin-primary hover:border-mugin-primary transition-all cursor-pointer">댓글을 남기려면 로그인을 해주세요</div>
      </Link>
    );
  return <>{reviewInput}</>;
}
