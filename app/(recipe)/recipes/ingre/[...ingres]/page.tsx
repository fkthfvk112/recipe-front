import { Recipe } from "@/app/(recipe)/types/recipeType";

export default async function RecipesByIngre({
  params,
}: {
  params: { ingres: string[] };
}) {
  let fetchData: Recipe[] = [];
  fetchData = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }recipe/ingres?ingres=${params.ingres.join(",")}`,
    {
      cache: "no-cache", //수정
    }
  ).then((res) => {
    if (!res.ok) {
      console.log("RecipeDetail fetch error!!", res.status);
    } else {
      return res.json();
    }
  });

  return <div>재료 페이지</div>;
}
