import { Ingredient } from "../../types/recipeType";

export default function Ingredients({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {

  const ingreItems = ingredients.map((data, inx) => {
    return (
      <div className="flex justify-between mt-3 mb-3" key={inx}>
        <div className="font-bold">{data.name}</div>
        <div>{data.qqt}</div>
      </div>
    );
  });
  return (
    <div className="w-full mt-10 mb-16">
      <div className="flex justify-start border-b-2  border-yellow-900 m-2 mt-6 mb-3">
        <h2 className="text-xl">재료</h2>
      </div>
      {ingreItems}
    </div>
  );
}
