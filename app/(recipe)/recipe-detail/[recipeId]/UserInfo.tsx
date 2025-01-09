import Image from "next/image";
import { RecipeOwnerInfo } from "./page";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { extractDeletedUser, isDeletedUser } from "@/app/(utils)/userUtil";

export default function UserInfo({
  recipeOwner,
}: {
  recipeOwner: RecipeOwnerInfo;
}) {
  
  return (
    <div className="flex flex-col justify-center items-start mb-5 mt-5 ps-6">
      <div className="flex justify-center items-center">
        {
          !(recipeOwner?.userPhoto) ? 
          <Avatar />
          :
          <div className="img-wrapper-round w-10 h-10 min-w-10 min-h-10"><Image className="rounded-full" src={recipeOwner.userPhoto} alt ="no img" fill/></div>
        }
        {/* have to :: 수정: 사진 받을 수 있도록 */}
        {
          isDeletedUser(recipeOwner?.userId)?
          <div>
            <h3 className="m-3">{extractDeletedUser(recipeOwner.userNickName)}</h3> 
          </div>
          :
          <Link href={`/userfeed/${recipeOwner?.userId}`}>
            <h3 className="m-3">{extractDeletedUser(recipeOwner.userNickName)}</h3>
          </Link>
        }

      </div>
      <div>{recipeOwner?.userUrl ? recipeOwner?.userUrl : ""}</div>
      <div className="bottom-line w-full"/>
    </div>
  );
}
