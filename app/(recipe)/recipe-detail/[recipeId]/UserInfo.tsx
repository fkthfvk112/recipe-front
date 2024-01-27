import Image from "next/image";
import { RecipeOwnerInfo } from "./page";
import { Avatar } from "@mui/material";
import UserImg from "./UserImg";
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
        {/* 수정: 사진 받을 수 있도록 */}
        <Link href={`/userfeed/${recipeOwner?.userNickName}`}>
          <h3 className="m-3">{recipeOwner.userNickName}</h3>
        </Link>
      </div>

      <div>{recipeOwner?.userUrl ? recipeOwner?.userUrl : ""}</div>
    </div>
  );
}
