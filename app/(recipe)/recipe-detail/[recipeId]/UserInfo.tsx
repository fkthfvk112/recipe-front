import Image from "next/image";
import { RecipeOwnerInfo } from "./page";
import Link from "next/link";

export default function UserInfo({
  recipeOwner,
}: {
  recipeOwner: RecipeOwnerInfo;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex">
        <Image
          className="rounded-full"
          src={recipeOwner?.userPhoto ? recipeOwner?.userPhoto : "/cook.webp"}
          width={50}
          height={50}
          alt="Picture of the author"
          loading="lazy"
        />
        {/* have to :: 수정: 사진 받을 수 있도록 */}
        <Link href={`/userfeed/${recipeOwner?.userNickName}`}>
          <h3 className="m-3">{recipeOwner.userNickName}</h3>
        </Link>
      </div>

      <div>{recipeOwner?.userUrl ? recipeOwner?.userUrl : ""}</div>
      
{/*       have to :: 이거 비슷하게 디자인 고치기
      <div className="flex w-full justify-between p-5 bg-gray-200 mt-1 mb-1">
        <div className="text-gray-500">
          <Link href={`/userfeed/${recipeOwner?.userNickName}`}>
            <h3 className="m-3">{recipeOwner.userNickName}</h3>
          </Link>
          <div>{recipeOwner?.userIntro}</div>
        </div>
        <div>
          <Image
            className="rounded-full"
            src={recipeOwner?.userPhoto ? recipeOwner?.userPhoto : "/cook.webp"}
            width={50}
            height={50}
            alt="Picture of the author"
            loading="lazy"
          />
        </div>
      </div> */}
      
    </div>
  );
}
