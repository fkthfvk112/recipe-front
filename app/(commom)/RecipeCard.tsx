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
    <Card variant="outlined" sx={{ width: 260, height: 260,margin:"5px" }}>
      <CardOverflow>
        <AspectRatio ratio="2">
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
        <Typography className="font-bold" level="title-md">{truncateString(recipe.recipeName, 15)}</Typography>
        <Typography level="body-sm">{truncateString(recipe.description, 18)}</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <div className="flex justify-between text-sm pt-2 pb-2">
          <div className="flex">
            <div>
              <div className="flex">
                <svg width="40" height="23" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13" cy="11" r="8" fill="transparent" stroke="black" stroke-width="3"/>
                  <circle cx="10" cy="11" r="3" fill="black"/>
                  <circle cx="26" cy="11" r="8" fill="transparent" stroke="black" stroke-width="3"/>
                  <circle cx="23" cy="11" r="3" fill="black"/>
                </svg>
                <span>{recipe.views}</span>
              </div>
            </div>
            <div className="ms-2">
            <FavoriteIcon/><span className="ms-1">{recipe?.likeCnt}</span>
            </div>
            <div className="ms-2">
              <CommentIcon/><span className="ms-1">{recipe?.reviewCnt}</span>
            </div>
          </div>
          <div>
            {recipe.createdAt &&
              timeDifferenceString(new Date(recipe.createdAt))}
          </div>
        </div>
      </CardOverflow>
    </Card>
  );
}
