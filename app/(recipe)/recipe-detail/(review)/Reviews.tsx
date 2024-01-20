"use server";

import { Review } from "@/app/(type)/review";

export default async function Reviews({ recipeId }: { recipeId: number }) {
  const fetchData: Review[] = await fetch(
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
    <div key={inx}>{review.message}</div>
  ));

  console.log(fetchData);
  return <div>{review}</div>;
}
