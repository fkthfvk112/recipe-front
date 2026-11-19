"use server";

import RecipeCard from "@/app/(commom)/RecipeCard";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import Link from "next/link";
import RecipePagination from "../../RecipePagination";
import NoContent_Recipe from "../../(common)/NoContent_Recipe";
import { Metadata } from "next";
import { getRecipeDetailUrl } from "@/app/(utils)/slugUtil";
import {
  getCategoryHubAbsoluteUrl,
  getCategoryHubDescription,
  getCategoryHubTitle,
  parseCategoryHub,
} from "@/app/(utils)/recipeCategoryHub";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mug-in.com";

type PageParams = { pageNumber: string; queryString: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const hub = parseCategoryHub(params.pageNumber, params.queryString);

  if (hub) {
    const title = getCategoryHubTitle(hub);
    const description = getCategoryHubDescription(hub);
    const canonical = getCategoryHubAbsoluteUrl(hub);
    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "머그인",
        type: "website",
      },
      icons: {
        icon: "/common/favicon.png",
      },
    };
  }

  return {
    title: "레시피 검색 - 머그인",
    description: "입맛에 맞는 다양한 레시피를 검색해보세요.",
    robots: {
      index: false,
      follow: true,
    },
    icons: {
      icon: "/common/favicon.png",
    },
    openGraph: {
      title: "레시피 검색 - 머그인",
      description: "입맛에 맞는 다양한 레시피를 검색해보세요.",
    },
  };
}

export default async function SearchingByCondition({
  params,
}: {
  params: PageParams;
}) {
  const decodedUrl = decodeURIComponent(params.queryString);
  const hub = parseCategoryHub(params.pageNumber, params.queryString);

  const [fetchData, pageMaxCnt] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}recipe/conditions?${decodedUrl}&page=${params.pageNumber}`,
      {
        next: { revalidate: hub ? 3600 : 30 },
      }
    )
      .then((res) => (res.ok ? res.json() : []))
      .catch((err) => {
        console.error("Recipe list fetch error:", err);
        return [];
      }),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}recipe/conditions/cnt?${decodedUrl}`,
      {
        next: { revalidate: hub ? 3600 : 30 },
      }
    )
      .then((res) => (res.ok ? res.json() : 0))
      .catch((err) => {
        console.error("Recipe count fetch error:", err);
        return 0;
      }),
  ]);

  const recipes: Recipe[] = Array.isArray(fetchData) ? fetchData : [];

  const pnMaxCnt = Math.floor(
    pageMaxCnt % 10 === 0 ? pageMaxCnt / 10 : pageMaxCnt / 10 + 1
  );

  const recentRecipes = recipes.map((recipe: Recipe, inx: number) => (
    <div key={inx}>
      <Link href={getRecipeDetailUrl(recipe.recipeId, recipe.recipeName)} prefetch={false}>
        <RecipeCard recipe={recipe} />
      </Link>
    </div>
  ));

  const collectionSchema = hub
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: getCategoryHubTitle(hub),
        description: getCategoryHubDescription(hub),
        url: getCategoryHubAbsoluteUrl(hub),
        isPartOf: {
          "@type": "WebSite",
          name: "머그인",
          url: SITE_URL,
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: recipes.slice(0, 10).map((recipe, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}${getRecipeDetailUrl(recipe.recipeId, recipe.recipeName)}`,
            name: recipe.recipeName,
          })),
        },
      }
    : null;

  return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full min-h-[300px] mb-10 px-4 sm:px-0">
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      )}

      {hub && (
        <nav
          aria-label="breadcrumb"
          className="w-full text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5"
        >
          <Link href="/" className="hover:text-emerald-700 no-underline">
            홈
          </Link>
          <span>/</span>
          <Link
            href="/recipes/1/sortingCondition=POPULARITY"
            className="hover:text-emerald-700 no-underline"
          >
            레시피
          </Link>
          <span>/</span>
          <span className="text-emerald-800">{hub}</span>
        </nav>
      )}

      {hub && (
        <div className="w-full mb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {hub} 레시피
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
            {getCategoryHubDescription(hub)}
          </p>
        </div>
      )}

      <div className="grid media-gridcol-3-to-2 w-full gap-4 sm:gap-6 py-4">
        {recentRecipes}
      </div>
      {recipes.length <= 0 && <NoContent_Recipe />}
      {pnMaxCnt >= 1 && (
        <RecipePagination
          queryStr={decodedUrl}
          pageNow={Number(params.pageNumber)}
          pageMax={pnMaxCnt}
        ></RecipePagination>
      )}
    </div>
  );
}
