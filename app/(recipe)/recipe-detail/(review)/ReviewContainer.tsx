import { Suspense } from "react";
import Reviews from "./Reviews";
import WriteReview from "./WriteReview";
import ReviewSkeletion from "./ReviewSkeleton";

export type domainName = "recipe"|"board";
export type domainId = number;
export default function ReviewContainer({ domainId, domainName }: { domainId: number, domainName:domainName }) {

  const reviewSkeleton = [1, 2, 3, 4, 5].map((ele, inx)=><ReviewSkeletion key={inx}/>)
  return (
    <>
      <WriteReview domainId={domainId} domainName={domainName}></WriteReview>
      <Suspense fallback={
        <div>{reviewSkeleton}</div>
      }>
        <Reviews domainId={domainId} domainName={domainName}></Reviews>
      </Suspense>
    </>
  );
}
