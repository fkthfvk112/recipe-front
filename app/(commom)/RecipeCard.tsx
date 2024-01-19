import { Recipe } from "../(recipe)/types/recipeType";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Image from "next/image";
import { timeDifferenceString } from "../(utils)/timeUtils";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card variant="outlined" sx={{ width: 320 }}>
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
        <Typography level="title-md">{recipe.recipeName}</Typography>
        <Typography level="body-sm">{recipe.description}</Typography>
      </CardContent>
      <CardOverflow variant="soft" sx={{ bgcolor: "background.level1" }}>
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Typography
            level="body-xs"
            fontWeight="md"
            textColor="text.secondary"
          >
            조회수 {recipe.views}
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body-xs"
            fontWeight="md"
            textColor="text.secondary"
          >
            {recipe.createdAt &&
              timeDifferenceString(new Date(recipe.createdAt))}
          </Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  );
}
