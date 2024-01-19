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
      {/* 수정: 사진 받을 수 있도록 */}
      {recipeOwner.userId}
    </div>
  );
}
