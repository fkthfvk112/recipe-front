import Link from "next/link";
import RecipeCard from "@/app/(commom)/RecipeCard";
import { Recipe } from "@/app/(recipe)/types/recipeType";
import { getRecipeDetailUrl } from "@/app/(utils)/slugUtil";

type RelatedRecipeItem = Partial<Recipe> & {
  recipeId?: number | null;
  recipeName?: string;
  repriPhotos?: string[];
};

async function fetchRelatedRecipes(recipeId: string | number): Promise<RelatedRecipeItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}recipe/related?recipeId=${recipeId}&size=6`,
      {
        next: {
          revalidate: 3600,
          tags: [`recipeRelated-${recipeId}`],
        },
      }
    );
    if (!res.ok) {
      console.error("Related recipes fetch error", res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Related recipes fetch failed", err);
    return [];
  }
}

export default async function RelatedRecipes({
  recipeId,
}: {
  recipeId: string | number;
}) {
  const related = await fetchRelatedRecipes(recipeId);
  if (related.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight mb-4">
        함께 보면 좋은 레시피
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
        {related.map((recipe, inx) => {
          if (!recipe.recipeId || !recipe.recipeName) return null;
          return (
            <Link
              key={`${recipe.recipeId}-${inx}`}
              href={getRecipeDetailUrl(recipe.recipeId, recipe.recipeName)}
              prefetch={false}
              className="no-underline"
            >
              <RecipeCard recipe={recipe as Recipe} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
