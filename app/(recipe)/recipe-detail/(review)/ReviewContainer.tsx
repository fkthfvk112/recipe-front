import Reviews from "./Reviews";
import WriteReview from "./WriteReview";

export default function ReviewContainer({ recipeId }: { recipeId: number }) {
  return (
    <>
      <WriteReview recipeId={recipeId}></WriteReview>
      <Reviews recipeId={recipeId}></Reviews>
    </>
  );
}
