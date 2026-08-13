import RestaurantIcon from "@mui/icons-material/Restaurant";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EmblaCarousel from "@/app/(commom)/EmbalCarousel/EmblaCarousel";
import BookMark from "./BookMark";
import StarIcon from '@mui/icons-material/Star';
import { roundToNPlaces } from "@/app/(utils)/NumberUtil";

export interface RecipeInfoProp {
  recipeId: number;
  recipeName: string;
  categorie: string;
  servings: number;
  description: string;
  repriPhotos: string[];
  timeSum: number;
  reviewAvg:number;
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
      <div className="w-full overflow-hidden">
        <EmblaCarousel
          slides={Array.from(Array(recipeInfoProp?.repriPhotos?.length).keys())}
          options={{ loop: true }}
          imgUrls={recipeInfoProp.repriPhotos}
        ></EmblaCarousel>
      </div>
      
      <div className="border-t border-gray-100 mt-6 pt-4">
        <div className="flex justify-between items-center w-full mb-4 px-2">
          <h1 className="text-2xl font-black text-gray-800 tracking-tight leading-snug">{recipeInfoProp.recipeName}</h1>
          <BookMark recipeId={recipeInfoProp.recipeId}></BookMark>
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-2.5 px-2 mb-2">
        <div className="inline-flex items-center bg-gray-50 border border-gray-100 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-gray-600 shadow-sm">
          <RestaurantIcon sx={{ fontSize: 16, marginRight: "4px", color: "#6B7280" }} />
          {recipeInfoProp.categorie}
        </div>
        <div className="inline-flex items-center bg-gray-50 border border-gray-100 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-gray-600 shadow-sm">
          <PersonIcon sx={{ fontSize: 16, marginRight: "4px", color: "#6B7280" }} />
          {recipeInfoProp.servings}인분
        </div>
        <div className="inline-flex items-center bg-gray-50 border border-gray-100 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-gray-600 shadow-sm">
          <AccessTimeIcon sx={{ fontSize: 16, marginRight: "4px", color: "#6B7280" }} />
          {timeText}
        </div>
        <div className="inline-flex items-center bg-gray-50 border border-gray-100 rounded-full px-3.5 py-1.5 text-[12px] font-bold text-gray-600 shadow-sm">
          <StarIcon sx={{ fontSize: 16, marginRight: "2px", color: "#FFB703" }} />
          {recipeInfoProp.reviewAvg ? roundToNPlaces(recipeInfoProp.reviewAvg, 2) : "-"}
        </div>
      </div>

      <div className="p-4 mt-4 mb-4 bg-gray-50 border border-gray-100 rounded-2xl break-words break-keep whitespace-pre-wrap text-[14px] text-gray-600 leading-relaxed">
        <p>{recipeInfoProp.description}</p>
      </div>
    </div>
  );
}
