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
    <div className="flex flex-col justify-center items-start mt-2 mb-6">
      <div className="flex justify-center items-center">
        {
          !(recipeOwner?.userPhoto) ? 
          <Avatar sx={{width:54, height:54, boxShadow: "0 2px 8px rgba(0,0,0,0.05)"}} src="/broken-image.jpg" />
          :
          <div className="relative w-[54px] h-[54px] min-w-[54px] min-h-[54px] rounded-full overflow-hidden border border-gray-100 shadow-sm">
            <Image className="object-cover" src={recipeOwner.userPhoto} alt="user photo" fill />
          </div>
        }
        {
          isDeletedUser(recipeOwner?.userId)?
          <div className="ms-3.5">
            <h3 className="text-base font-bold text-gray-800">{extractDeletedUser(recipeOwner.userNickName)}</h3>
          </div>
          :
          <Link className="ms-3.5 group flex flex-col" href={`/userfeed/${recipeOwner?.userId}`}>
            <h3 className="text-base font-bold text-gray-800 group-hover:text-mugin-primary transition-colors duration-200">
              {extractDeletedUser(recipeOwner.userNickName)}
            </h3>
            {recipeOwner?.userUrl && (
              <div className="text-xs text-gray-400 group-hover:text-darkGreen transition-colors duration-200">
                {recipeOwner.userUrl}
              </div>
            )}
          </Link>
        }

      </div>
    </div>
  );
}
