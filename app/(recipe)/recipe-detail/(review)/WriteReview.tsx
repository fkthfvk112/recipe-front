"use client";

import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import { Review } from "@/app/(type)/review";
import { revalidateByTagName } from "@/app/(utils)/revalidateServerTag";
import { Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function WriteReview({ recipeId }: { recipeId: number }) {
  const [review, setReview] = useState<Review>({
    userId: 0,
    message: "",
    recipeId: recipeId,
    score: 0,
  });

  const [isSignIn] = useRecoilState(siginInState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [isSignIn]);

  const creaeteReview = (review: Review) => {
    axiosAuthInstacne
      .post("review/create", review)
      .then((res) => {
        console.log(res.data);
        revalidateByTagName(`reviews-${recipeId}`);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  console.log(review);

  const reviewInput =
    isClient && isSignIn ? (
      <div className="flex justify-center flex-col items-center">
        <div className="text-start w-full">
          <Rating
            onChange={(e, newValue) => {
              setReview({
                ...review,
                score: newValue !== null ? newValue : 1,
              });
            }}
            name="half-rating"
            value={review.score}
            defaultValue={2.5}
            precision={0.5}
          />
        </div>
        <textarea
          className="h-24 w-full border border-slate-400"
          value={review.message}
          onChange={(e) => {
            setReview({
              ...review,
              message: e.target.value,
            });
          }}
        />
        <button onClick={() => creaeteReview(review)} className="m-3">
          댓글 쓰기
        </button>
      </div>
    ) : (
      <input
        className="text-gray-500"
        type="text"
        value="댓글을 남기려면 로그인을 해주세요"
        disabled={true}
      />
    );
  return <div className="w-full">{reviewInput}</div>;
}
