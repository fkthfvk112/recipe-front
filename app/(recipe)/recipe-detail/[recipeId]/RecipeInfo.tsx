import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

export interface RecipeInfoProp {
  recipeName: string;
  categorie: string;
  servings: number;
  description: string;
  timeSum: number;
}

export default function RecipeInfo({
  recipeInfoProp,
}: {
  recipeInfoProp: RecipeInfoProp;
}) {
  const timeText =
    recipeInfoProp.timeSum > 0
      ? recipeInfoProp.timeSum + "분"
      : "시간 정보 없음";

  return (
    <div className="w-full flex flex-col">
      <div>
        <h2 className="m-5">{recipeInfoProp.recipeName}</h2>
      </div>
      <div className="w-full flex justify-start flex-wrap">
        <div className="ml-3 mr-3">
          <RestaurantIcon className="mr-2" />
          {recipeInfoProp.categorie}
        </div>
        <div className="ml-3 mr-3">
          <PersonIcon className="mr-2" />
          {recipeInfoProp.servings}인분
        </div>
        <div className="ml-3 mr-3">
          <AccessTimeIcon className="mr-2" />
          {timeText}
        </div>
      </div>
      <div className="p-2 mt-3 mb-3 bg-stone-100 rounded-xl">
        <p>{recipeInfoProp.description}</p>
      </div>
    </div>
  );
}
