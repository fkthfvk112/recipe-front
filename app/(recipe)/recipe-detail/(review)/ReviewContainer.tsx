import Reviews from "./Reviews";
import WriteReview from "./WriteReview";

export type domainName = "recipe"|"board";
export type domainId = number;
export default function ReviewContainer({ domainId, domainName }: { domainId: number, domainName:domainName }) {

  return (
    <>
      <WriteReview domainId={domainId} domainName={domainName}></WriteReview>
      <Reviews domainId={domainId} domainName={domainName}></Reviews>
    </>
  );
}
