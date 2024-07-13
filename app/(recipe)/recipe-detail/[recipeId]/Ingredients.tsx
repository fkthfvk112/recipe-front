import Link from "next/link";
import { Ingredient } from "../../types/recipeType";

export default function Ingredients({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {

  const ingreItems = ingredients.map((data, inx) => {
    return (
      <li className="flex justify-between m-3 pb-2 border-b-[1px]" key={inx}>
        <Link href={`/recipes/1/ingre/${data.name}`} className="font-bold ">{data.name}</Link>
        <div>{data.qqt}</div>
      </li>
    );
  });
  return (
    <div className="w-full mt-10 mb-16 ">
      <div className="flex justify-start border-b-2  border-yellow-900 m-2 mt-6 mb-3">
        <h2 className="text-xl">재료</h2>
      </div>
      <ul>
        {ingreItems}
      </ul>
    </div>
  );
}
