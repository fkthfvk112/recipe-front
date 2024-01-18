import Image from "next/image";
import { RecipeOwnerInfo } from "./page";

export default function UserInfo({
  recipeOwner,
}: {
  recipeOwner: RecipeOwnerInfo;
}) {
  return (
    <div className="flex justify-center items-center">
      <Image src="" width={100} height={100} alt="Picture of the author" />
      {recipeOwner.userId}
    </div>
  );
}
