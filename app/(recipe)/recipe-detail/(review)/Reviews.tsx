"use server";

import serverFetch from "@/app/(commom)/serverFetch";
import { BoardReviewWithUserInfo, ReviewWithUserInfo } from "@/app/(type)/review";
import { Avatar, Rating } from "@mui/material";
import Link from "next/link";
import WriteReviewReply from "./WriteReviewReply";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ReviewEtcBtn from "./ReviewEtcBtn";
import Image from "next/image";
import { domainId, domainName } from "./ReviewContainer";
import TimeDiff from "./TimeDiff";

const domainReviewUrl = {
  recipe:"review/recipe",
  board: "review/board"
} as const;

export default async function Reviews({ domainId, domainName }: { domainId: domainId, domainName:domainName  }) {
  const reviewKey = `${domainName}Id`;

  const fetchData: ReviewWithUserInfo[]|BoardReviewWithUserInfo[] = await serverFetch({
    url:domainReviewUrl[domainName as keyof typeof domainReviewUrl],
    queryParams:{
      [reviewKey]:domainId
    },
    option:{
        cache:"no-cache",
        next: {
          tags: [`reviews-${domainId}`],
        },
    }
  })   
  const isBoardReview = (review: ReviewWithUserInfo | BoardReviewWithUserInfo): review is BoardReviewWithUserInfo => {
    return (review as BoardReviewWithUserInfo) !== undefined;
  }
  
  const isRecipeReview = (review: ReviewWithUserInfo | BoardReviewWithUserInfo): review is ReviewWithUserInfo =>{
    return (review as ReviewWithUserInfo) !== undefined;
  }

  const review = fetchData.map((review, inx) => (
    <div key={inx} className={`m-5 mb-10 ${review.parentReviewId != null&&"ms-16"}`}>
      <div className="flex justify-start items-center">
        {review.parentReviewId && <SubdirectoryArrowRightIcon/>}
        {
          !(review?.userInfo?.userPhoto) || review.isDel ? 
          <Avatar />
          :
          <div className="img-wrapper-round w-10 h-10 min-w-10 min-h-10"><Image className="rounded-full" src={review.userInfo.userPhoto} alt ="no img" fill/></div>
        }
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
          {
            review.isDel ? (
              <div>
                <h3 className="ms-2 me-2">삭제</h3>
              </div>
            ) : (
              review?.checkAnonymous === true ? (
                <div>
                  <h3 className="ms-2 whitespace-nowrap">익명</h3>
                </div>
              ) : (
                <Link className="flex flex-wrap justify-start items-center" href={`/userfeed/${review.userInfo?.userId}`}>
                  <h3 className="ms-2">{review.userInfo?.userNickName}</h3>
                  <TimeDiff time={review.createdAt as string}/>
                </Link>
              )
            )
          }
          {
            domainName === "recipe" && 
            isRecipeReview(review) && 
            review?.score !== undefined && 
            review.score !== 0 &&
            <Rating
              className="ms-1.5"
              size="small"
              name="half-rating-read"
              value={review.score}
              readOnly
            />
          }
          </div>
          {review.parentReviewId===null&& (
            <WriteReviewReply domainName={domainName} domainId={domainId} parentReviewId={review.reviewId}/>
          )}
        </div>
        <ReviewEtcBtn reviewId={review.reviewId} reviewOwnerId={review.userInfo.userId} domainId={domainId} domainName={domainName} isDel={review.isDel}/>
      </div>
      <div className="ms-12 break-words break-keep whitespace-pre-wrap">
        {
          review.isDel?"삭제된 댓글입니다."
          :
          review.message
        }
      </div>
    </div>
  ));

  return (
    <div>
      <div className="font-bold mt-5">댓글 <span className="text-orange-400">{fetchData.length}</span></div>
      {review}
    </div>);
}
