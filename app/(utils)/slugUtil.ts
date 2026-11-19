/**
 * 레시피 및 콘텐츠 제목을 SEO 친화적인 한글/영문 슬러그로 변환합니다.
 * - 특수문자, 괄호 제거
 * - 공백을 하이픈(-)으로 치환
 * - 연속된 하이픈 단일화 및 앞뒤 하이픈 정리
 */
export function generateSlug(title: string): string {
  if (!title) return "recipe";

  const slug = title
    .normalize("NFC")
    .trim()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "recipe";
}

/**
 * 레시피 상세 페이지 URL을 생성합니다.
 * - recipeName이 있으면 한글 슬러그가 포함된 URL 반환 (/recipe-detail/123/슬러그)
 * - recipeName이 없으면 기본 URL 반환 (/recipe-detail/123)
 */
export function getRecipeDetailUrl(
  recipeId: number | string | undefined | null,
  recipeName?: string | null
): string {
  if (!recipeId) return "/";
  if (!recipeName || !recipeName.trim()) return `/recipe-detail/${recipeId}`;
  return `/recipe-detail/${recipeId}/${encodeURIComponent(generateSlug(recipeName))}`;
}

/**
 * 검색/OG용 타이틀. 이름에 이미 '만드는 법' 등이 있으면 중복 접미사를 붙이지 않는다.
 */
export function buildRecipeSeoTitle(
  recipeName?: string | null,
  servings?: number | null
): string {
  const name = (recipeName || "").trim();
  if (!name) return "머그인 레시피";

  const servingsLabel = `${servings && servings > 0 ? servings : 1}인분`;
  const hasHowtoOrRecipeWord =
    /만드는\s*법|만들기|황금레시피|레시피/.test(name);

  if (hasHowtoOrRecipeWord) {
    return `${name} (${servingsLabel}) - 머그인`;
  }
  return `${name} 만드는 법 (${servingsLabel} 레시피) - 머그인`;
}

/** 메타 keywords에서 이름과 겹치는 접미사 키워드를 걸러낸다. */
export function buildRecipeSeoKeywords(
  recipeName: string,
  tags: string[] = [],
  ingredientNames: string[] = []
): string[] {
  const name = recipeName.trim();
  const hasHowto = /만드는\s*법|만들기|황금레시피|레시피/.test(name);

  return [
    name,
    !hasHowto && name ? `${name} 황금레시피` : "",
    !hasHowto && name ? `${name} 만들기` : "",
    name ? `${name} 칼로리` : "",
    name ? `${name} 영양성분` : "",
    ...tags,
    ...ingredientNames,
    "요리 레시피",
    "영양성분",
    "칼로리",
  ].filter(Boolean);
}
