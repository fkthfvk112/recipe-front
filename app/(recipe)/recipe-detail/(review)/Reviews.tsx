"use server";

import serverFetch from "@/app/(commom)/serverFetch";
import { BoardReviewWithUserInfo, ReviewWithUserInfo } from "@/app/(type)/review";
import { Avatar, Rating } from "@mui/material";
import Link from "next/link";
import WriteReviewReply from "./WriteReviewReply";
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import ReviewEtcBtn from "./ReviewEtcBtn";
import Image from "next/image";

const domainReviewUrl = {
  recipe:"review/get",
  board: "review/board"
} as const;

export default async function Reviews({ domainId, domainName }: { domainId: number|string, domainName:string  }) {
  const reviewKey = `${domainName}Id`;

  const fetchData: ReviewWithUserInfo[]|BoardReviewWithUserInfo[] =await serverFetch({
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

  console.log("리뷰 패치", fetchData);
  
  const isBoardReview = (review: ReviewWithUserInfo | BoardReviewWithUserInfo): review is BoardReviewWithUserInfo => {
    return (review as BoardReviewWithUserInfo) !== undefined;
  }
  
  const isRecipeReview = (review: ReviewWithUserInfo | BoardReviewWithUserInfo): review is ReviewWithUserInfo =>{
    return (review as ReviewWithUserInfo) !== undefined;
  }

  const review = fetchData.map((review, inx) => (
    // have to 앞에 화살표 넣기
    <div key={inx} className={`m-5 mb-10 ${review.parentReviewId != null&&"ms-16"}`}>
      <div className="flex justify-start items-center">
        {review.parentReviewId && <SubdirectoryArrowRightIcon/>}
        {
          review?.userInfo?.userPhoto ? 
          <div className="img-wrapper-round w-10 h-10"><Image className="rounded-full" src={review.userInfo.userPhoto} alt ="no img" fill/></div>
          :
          <Avatar />
        }
        <div className="flex justify-between w-full">
          {
          isBoardReview(review)&&review?.checkAnonymous === true ?
          <div>
            <h3 className="ms-2 me-2">익명</h3>
          </div>:
          <Link href={`/userfeed/${review.userInfo?.userNickName}`}>
            <h3 className="ms-2 me-2">{review.userInfo?.userNickName}</h3>
          </Link>
          }
          {domainName === "board" && isBoardReview(review) && review.parentReviewId===null&& (
            <WriteReviewReply domainName="board" domainId={domainId} parentReviewId={review.reviewId}/>
          )}
        </div>
        {
        domainName==="recipe"&& isRecipeReview(review) &&
        <Rating
          size="small"
          name="half-rating-read"
          value={review?.score}
          readOnly
        />
        }
        <ReviewEtcBtn reviewId={review.reviewId} reviewOwnerId={review.userInfo.userId}/>
      </div>
      <div className="ms-12 break-words break-keep">
        {review.message}
      </div>
    </div>
  ));

  return (
    <div>
      <div className="font-bold mt-5">댓글 <span className="text-orange-400">{fetchData.length}</span></div>
      {review}
    </div>);
}
