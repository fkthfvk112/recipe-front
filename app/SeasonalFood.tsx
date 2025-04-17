import {
  getRandomSeasonalFoodInSameCategory,
  seasonalIngredients,
} from "@/public/seasonalFoods";
import Link from "next/link";

export default function SeasonalFood() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const seasonname: string[] = getRandomSeasonalFoodInSameCategory(
    currentMonth,
    6
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-2xl font-semibold text-gray-800">🌿 이달의 제철 식재료</h1>
      {/* 스크롤 가능한 식재료 목록 */}
      <div className="mt-6 flex overflow-x-auto space-x-4 p-3 scrollbar-hide">
        {seasonname.map((ele) => (
          <Link
            href={`/recipes/1/ingre/${ele}`}
            key={ele}
            className="min-w-[100px] h-20 bg-white shadow-sm border border-gray-300 
                      rounded-xl flex justify-center items-center text-center 
                      text-gray-700 font-medium hover:bg-green-100 hover:scale-105 transition-all"
          >
            <h3>{ele}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
