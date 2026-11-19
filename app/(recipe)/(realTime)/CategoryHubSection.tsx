import Link from "next/link";
import {
  RECIPE_CATEGORY_HUBS,
  getCategoryHubPath,
} from "@/app/(utils)/recipeCategoryHub";

export default function CategoryHubSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-6 box-border">
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
            카테고리별 레시피
          </h2>
          <Link
            href="/recipes/1/sortingCondition=POPULARITY"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 no-underline"
          >
            전체 보기
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {RECIPE_CATEGORY_HUBS.map((category) => (
            <Link
              key={category}
              href={getCategoryHubPath(category)}
              className="inline-flex items-center justify-center min-w-[72px] px-4 py-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 text-sm font-extrabold text-emerald-800 no-underline hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
