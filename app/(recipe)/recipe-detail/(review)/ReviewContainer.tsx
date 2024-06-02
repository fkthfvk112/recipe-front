import Reviews from "./Reviews";
import WriteReview from "./WriteReview";

type domainName = "recipe"|"board";
type domainId = number|string;
export default function ReviewContainer({ domainId, domainName }: { domainId: number, domainName:domainName }) {


  return (
    <>
      <WriteReview domainId={domainId} domainName={domainName}></WriteReview>
      <Reviews domainId={domainId} domainName={domainName}></Reviews>
    </>
  );
}
