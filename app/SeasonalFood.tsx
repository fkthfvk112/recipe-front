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
    <div className="w-full max-w-5xl mx-auto px-5 py-8">
      <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">이달의 제철 식재료</h1>
      {/* 스크롤 가능한 식재료 목록 */}
      <div className="mt-4 flex overflow-x-auto space-x-4 p-3 no-scrollbar scroll-smooth">
        {seasonname.map((ele) => (
          <Link
            href={`/recipes/1/ingre/${ele}`}
            key={ele}
            className="min-w-[100px] h-16 bg-white shadow-sm border border-gray-100 
                      rounded-2xl flex justify-center items-center text-center 
                      text-gray-700 font-bold hover:bg-green-50 hover:text-mugin-secondary hover:border-mugin-secondary hover:scale-105 transition-all duration-300"
          >
            <h3 className="text-sm">{ele}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
