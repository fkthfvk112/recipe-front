/**
 * 레시피 및 콘텐츠 제목을 SEO 친화적인 한글/영문 슬러그로 변환합니다.
 * - 특수문자, 괄호 제거
 * - 공백을 하이픈(-)으로 치환
 * - 연속된 하이픈 단일화 및 앞뒤 하이픈 정리
 */
export function generateSlug(title: string): string {
  if (!title) return "recipe";

  const slug = title
    .trim()
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "recipe";
}
