import { Recipe } from "../(recipe)/types/recipeType";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import { timeDifferenceString } from "../(utils)/timeUtils";
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { truncateString } from "../(utils)/StringUtil";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card variant="outlined" sx={{ aspectRatio:"1 / 1", minWidth:"140px" }}>
      <CardOverflow>
        <AspectRatio sx={{ overflow:"hidden"}} ratio="1/1">
          <Image
            src={recipe.repriPhotos[0]}
            width={300}
            height={300}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography level="title-md"><h2>{truncateString(recipe.recipeName, 12)}</h2></Typography>
        <Typography level="body-sm" sx={{height:"35px"}}>{truncateString(recipe.description, 18)}</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <div className="flex justify-between text-sm pt-2 pb-2 text-[#3b3b3b]">
          <div className="flex">
            <div>
              <FavoriteIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{recipe?.likeCnt}</span>
            </div>
            <div className="ms-2">
              <CommentIcon className="w-[20px] h-[20px]"/><span className="ms-1 text-[12px]">{recipe?.reviewCnt}</span>
            </div>
          </div>
          <div className="text-[10px] flex justify-center items-center">
            {recipe.createdAt &&
            timeDifferenceString(new Date(recipe.createdAt))}
          </div>
        </div>
      </CardOverflow>
    </Card>
  );
}
