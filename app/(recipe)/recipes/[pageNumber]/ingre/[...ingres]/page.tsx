import { redirect } from "next/navigation";

export default function RecipesByIngreRedirect({
  params,
}: {
  params: { ingres: string[]; pageNumber: string };
}) {
  const ingreNames = params.ingres.join(",");
  const targetUrl = `/recipes/${params.pageNumber || 1}/ingredientNames=${encodeURIComponent(
    ingreNames
  )}&sortingCondition=POPULARITY`;

  redirect(targetUrl);
}
