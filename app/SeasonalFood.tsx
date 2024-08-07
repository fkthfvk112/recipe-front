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

  const seasonIngres = seasonname.map((ele) => {
    return (
      <Link
        href={`/recipes/1/ingre/${ele}`}
        className="w-24 min-w-24 h-16 ms-3 border-2 rounded-md m-3 flex flex-row justify-center items-center border-slate-400"
        key={ele}
      >
        <h3>{ele}</h3>
      </Link>
    );
  });

  return (
    <div className="w-full m-10 max-w-5xl p-5">
      <h1 className="text-xl">이달의 식재료</h1>
      <div className="flex justify-center items-center mt-6 w-full ">
        <section className="flex flex-row overflow-x-scroll">{seasonIngres}</section>
      </div>
    </div>
  );
}
