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
    <div className="flex flex-col justify-center items-start mt-5 ps-6">
      <div className="flex justify-center items-center">
        {
          !(recipeOwner?.userPhoto) ? 
          <Avatar sx={{width:60, height:60}} src="/broken-image.jpg" />
          :
          <div className="img-wrapper-round w-[60px] h-[60px] min-w-10 min-h-10"><Image className="rounded-full" src={recipeOwner.userPhoto} alt ="no img" fill/></div>
        }
        {/* have to :: 수정: 사진 받을 수 있도록 */}
        {
          isDeletedUser(recipeOwner?.userId)?
          <div className="ms-3">
            <h3>{extractDeletedUser(recipeOwner.userNickName)}</h3>
          </div>
          :
          <Link className="ms-3" href={`/userfeed/${recipeOwner?.userId}`}>
            <h3>{extractDeletedUser(recipeOwner.userNickName)}</h3>
            <div>{recipeOwner?.userUrl ? recipeOwner?.userUrl : ""}</div>
          </Link>
        }

      </div>
    </div>
  );
}
