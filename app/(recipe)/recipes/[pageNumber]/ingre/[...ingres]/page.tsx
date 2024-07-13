import RecipeCard from "@/app/(commom)/RecipeCard";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Link from "next/link";
import RecipePagination from "../../../RecipePagination";
import CreateIcon from '@mui/icons-material/Create';

export default async function RecipesByIngre({
  params,
}: {
  params: { ingres: string[], pageNumber: string; };
}) {
  let fetchData: Recipe[] = [];
  fetchData = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }recipe/ingres?ingres=${params.ingres.join(",")}&page=${params.pageNumber}`,
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

    //페이지 총 개수
    const pageMaxCnt: number = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}recipe/ingres/cnt?ingres=${params.ingres.join(",")}`,
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

    const pnMaxCnt = Math.floor(
      pageMaxCnt % 10 === 0 ? pageMaxCnt / 10 : pageMaxCnt / 10 + 1
    );

  const recentRecipes = fetchData?.map((recipe, inx) => (
    <div key={inx} className="m-3">
      <Link href={`/recipe-detail/${recipe.recipeId}`}>
        <RecipeCard recipe={recipe}></RecipeCard>
      </Link>
    </div>
  ));

   return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full mb-10">
      <div className="flex flex-wrap justify-center items-center w-full min-h-[300px] mb-16">
        {recentRecipes}
      </div>
      <RecipePagination
        queryStr={`/ingre/${params.ingres.join(",")}`}
        pageNow={Number(params.pageNumber)}
        pageMax={pnMaxCnt}
      ></RecipePagination>
      <Link href={`/create-recipe`} className="fixed bottom-6 right-12 roundRreenBtn">
          <CreateIcon sx={{width:"25px", height:"25px"}}/>
          <span className="ms-2">글쓰기</span>
      </Link>
    </div>);
}
