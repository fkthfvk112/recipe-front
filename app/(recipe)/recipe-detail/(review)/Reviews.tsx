"use server";

import { ReviewWithUserInfo } from "@/app/(type)/review";
import { Avatar, Rating } from "@mui/material";
import Link from "next/link";

export default async function Reviews({ recipeId }: { recipeId: number }) {
  const fetchData: ReviewWithUserInfo[] = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}review/get?recipeId=${recipeId}`,
    {
      next: {
        tags: [`reviews-${recipeId}`],
      },
      cache: "no-cache", //수정
    }
  ).then((res) => {
    if (!res.ok) {
      console.log("Review fetching fetch error!!", res.status);
    } else {
      return res.json();
    }
  });

  const review = fetchData.map((review, inx) => (
    <div key={inx} className="m-5 mb-10">
      <div className="flex justify-start items-center">
        <Avatar />
        <Link href={`/userfeed/${review.userInfo.userNickName}`}>
          <h3 className="ms-2 me-2">{review.userInfo.userNickName}</h3>
        </Link>
        <Rating
          size="small"
          name="half-rating-read"
          value={review.score}
          readOnly
        />
      </div>
      <div className="ms-12">{review.message}</div>
    </div>
  ));

  return (
    <div>
      <div className="font-bold">댓글 <span className="text-orange-400">{fetchData.length}</span></div>
      {review}
    </div>);
}
