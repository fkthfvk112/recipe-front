/**
 * 색인 가능한 레시피 카테고리 허브.
 * 임의 검색/필터 URL은 noindex를 유지하고, 이 목록의 순수 카테고리 1페이지만 index.
 */
export const RECIPE_CATEGORY_HUBS = [
  "한식",
  "양식",
  "중식",
  "일식",
  "분식",
  "후식",
  "건강식",
  "기타",
] as const;

export type RecipeCategoryHub = (typeof RECIPE_CATEGORY_HUBS)[number];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mug-in.com";

const HUB_DESCRIPTIONS: Record<RecipeCategoryHub, string> = {
  한식: "집에서 해먹기 좋은 한식 레시피. 국·찌개·반찬부터 덮밥까지 머그인에서 찾아보세요.",
  양식: "파스타·스테이크·오븐 요리 등 양식 레시피 모음. 재료와 칼로리까지 함께 확인하세요.",
  중식: "집에서도 만들기 쉬운 중식 레시피. 볶음·면·덮밥 요리를 모아봤어요.",
  일식: "담백한 일식 레시피 모음. 덮밥·전골·간단 반찬까지 머그인에서 골라보세요.",
  분식: "떡볶이·김밥·라면 등 분식 레시피. 집에서도 분식집 맛을 내보세요.",
  후식: "디저트·간식 레시피 모음. 케이크부터 간단한 후식까지.",
  건강식: "부담 없이 즐기는 건강식 레시피. 가벼운 한 끼와 영양 균형을 챙겨보세요.",
  기타: "분류를 넘어선 다양한 레시피. 머그인에서 새로운 요리를 발견해보세요.",
};

export function isRecipeCategoryHub(value: string | null | undefined): value is RecipeCategoryHub {
  if (!value) return false;
  return (RECIPE_CATEGORY_HUBS as readonly string[]).includes(value);
}

/** 내부 링크·사이트맵·canonical용 정본 허브 경로 */
export function getCategoryHubPath(category: RecipeCategoryHub): string {
  return `/recipes/1/cookCategory=${encodeURIComponent(category)}`;
}

export function getCategoryHubAbsoluteUrl(category: RecipeCategoryHub): string {
  return `${SITE_URL}${getCategoryHubPath(category)}`;
}

export function getCategoryHubTitle(category: RecipeCategoryHub): string {
  return `${category} 레시피 - 머그인`;
}

export function getCategoryHubDescription(category: RecipeCategoryHub): string {
  return HUB_DESCRIPTIONS[category];
}

/**
 * /recipes/:page/:queryString 이 카테고리 허브(1페이지, cookCategory만)인지 판별.
 * sortingCondition만 추가로 있어도 허브로 인정하고 canonical은 cookCategory만 사용.
 */
export function parseCategoryHub(
  pageNumber: string,
  queryString: string
): RecipeCategoryHub | null {
  if (pageNumber !== "1") return null;

  let decoded = queryString;
  try {
    decoded = decodeURIComponent(queryString);
  } catch {
    // keep raw
  }

  const params = new URLSearchParams(decoded.replace(/^\/+/, ""));
  const allowed = new Set(["cookCategory", "sortingCondition"]);
  const keys = Array.from(params.keys());
  for (let i = 0; i < keys.length; i++) {
    if (!allowed.has(keys[i])) return null;
  }

  const rawCategory = params.get("cookCategory");
  if (!rawCategory) return null;

  let category = rawCategory;
  try {
    category = decodeURIComponent(rawCategory);
  } catch {
    // keep
  }

  return isRecipeCategoryHub(category) ? category : null;
}
