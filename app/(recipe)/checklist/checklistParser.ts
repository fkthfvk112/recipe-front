/**
 * 장보기 체크리스트 입력 문자열 파서
 * 식재료명과 수량/단위를 지능적으로 분리합니다.
 *
 * 예시:
 * - "삼겹살 500g" -> { name: "삼겹살", unit: "500g" }
 * - "삼겹살500g"  -> { name: "삼겹살", unit: "500g" }
 * - "양파 2개"    -> { name: "양파", unit: "2개" }
 * - "대파"        -> { name: "대파", unit: "" } (단위 생략 허용)
 * - "3분 카레 2개" -> { name: "3분 카레", unit: "2개" }
 * - "3분 카레"    -> { name: "3분 카레", unit: "" }
 */
export function parseIngredientInput(input: string): { name: string; unit: string } {
  const trimmed = input.trim();
  if (!trimmed) return { name: "", unit: "" };

  // 숫자가 전혀 없으면 단위 없음
  const hasDigit = /\d/.test(trimmed);
  if (!hasDigit) {
    return { name: trimmed, unit: "" };
  }

  // 숫자로 시작하지 않는 일반적인 경우 (예: "삼겹살 500g", "양파 2개", "삼겹살500g")
  if (!/^\d/.test(trimmed)) {
    const firstDigitIndex = trimmed.search(/\d/);
    const name = trimmed.slice(0, firstDigitIndex).trim();
    const unit = trimmed.slice(firstDigitIndex).trim();
    return { name, unit };
  }

  // 첫 글자부터 숫자로 시작하는 경우 (예: "3분 카레 2개" 또는 "3분 카레")
  // 마지막 공백 뒤에 오는 부분이 숫자로 시작하는 단위인지 확인
  const lastSpaceIndex = trimmed.lastIndexOf(" ");
  if (lastSpaceIndex !== -1) {
    const candidateUnit = trimmed.slice(lastSpaceIndex + 1).trim();
    if (/^\d/.test(candidateUnit)) {
      return {
        name: trimmed.slice(0, lastSpaceIndex).trim(),
        unit: candidateUnit,
      };
    }
  }

  // 그 외의 경우 (예: "3분 카레", "1번 재료") 전체를 이름으로 취급
  return { name: trimmed, unit: "" };
}
