import Link from "next/link";
import { Ingredient } from "../../types/recipeType";
import GoFridgeBtn from "@/app/(commom)/Component/GoFridgeBtn";

export default function Ingredients({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {

  const ingreItems = ingredients.map((data, inx) => {
    return (
      <li className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0" key={inx}>
        <Link href={`/recipes/1/ingre/${data.name}`} className="font-bold text-gray-700 hover:text-mugin-primary transition-colors duration-200 text-sm sm:text-base">
          {data.name}
        </Link>
        <div className="text-sm text-gray-500 font-medium">{data.qqt}</div>
      </li>
    );
  });
  return (
    <div className="w-full mt-10 mb-10 px-2">
      <div className="flex justify-start border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-lg font-black text-gray-800 tracking-tight">재료</h2>
      </div>
      <ul className="w-full mb-6">
        {ingreItems}
      </ul>
      <GoFridgeBtn></GoFridgeBtn>
    </div>
  );
}
