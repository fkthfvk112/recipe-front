"use client";

import { useState } from "react";
import { Ingredient, RecipeNutrition, Ingredient100g } from "@/app/(recipe)/types/recipeType";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PieChartOutlineIcon from "@mui/icons-material/PieChartOutline";

interface RecipeNutritionSectionProps {
  nutrition?: RecipeNutrition;
  ingredients?: Ingredient[];
  ingredientNutritions?: Record<string, Ingredient100g>;
  servings?: number;
  aiComment?: string;
}

/** 소수점 1자리 반올림 헬퍼 (부동소수점 오차 방지) */
function round1(val: number): number {
  return Math.round((val + Number.EPSILON) * 10) / 10;
}

/** 숫자 추출 헬퍼 (예: "420.5 kcal" -> 420.5, "28 g" -> 28.0) */
function parseNumeric(val?: string | number): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return val;
  const match = val.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

/** 재료 분량 텍스트에서 중량(g) 추출 헬퍼 (예: "200g" -> 200, "0.5kg" -> 500, "1근" -> 600, "3알" -> 150) */
function parseGramsFromQqt(qqt?: string): number | null {
  if (!qqt) return null;
  const clean = qqt.trim().toLowerCase();

  const kgMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:kg|킬로그램)/);
  if (kgMatch) return parseFloat(kgMatch[1]) * 1000;

  const gMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:g|gram|그램)/);
  if (gMatch) return parseFloat(gMatch[1]);

  const mlMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:ml|밀리리터)/);
  if (mlMatch) return parseFloat(mlMatch[1]);

  const lMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:l|리터)/);
  if (lMatch) return parseFloat(lMatch[1]) * 1000;

  // 근 (600g)
  const geunMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:근)/);
  if (geunMatch) return parseFloat(geunMatch[1]) * 600;

  // 알 / 개 / 개수 (개당 평균 50g 추정)
  const pieceMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:알|개|개수)/);
  if (pieceMatch) return parseFloat(pieceMatch[1]) * 50;

  // 큰술 / T / tbsp (15g)
  const tbspMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:큰술|tbsp)/i);
  if (tbspMatch) return parseFloat(tbspMatch[1]) * 15;

  // 작은술 / t / tsp (5g)
  const tspMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:작은술|tsp)/i);
  if (tspMatch) return parseFloat(tspMatch[1]) * 5;

  // 컵 / cup (200g)
  const cupMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:컵|cup)/i);
  if (cupMatch) return parseFloat(cupMatch[1]) * 200;

  return null;
}

/** 유저 입력 수치 텍스트와 환산된 그램(g) 표기 생성 헬퍼 (예: "1근" + 600 -> "1근 (약 600g)") */
function formatQuantityWithGrams(qqt?: string, parsedGrams?: number | null): string {
  if (!qqt || !qqt.trim()) return "100g 기준";
  const clean = qqt.trim();

  // 이미 g, kg, ml, l 단위인 경우 중복 표기 생략
  const isDirectUnit = /^\d+(?:\.\d+)?\s*(g|gram|그램|kg|킬로그램|ml|밀리리터|l|리터)$/i.test(clean);
  if (isDirectUnit || parsedGrams == null || parsedGrams <= 0) {
    return clean;
  }

  const formattedGramStr = parsedGrams >= 1000
    ? `${(parsedGrams / 1000).toFixed(1)}kg`
    : `${Math.round(parsedGrams)}g`;

  return `${clean} (약 ${formattedGramStr})`;
}

/** JSON 형태의 aiComment 문자열에서 순수 문장 텍스트만 파싱 추출 헬퍼 */
function cleanAiCommentText(comment?: string): string | null {
  if (!comment || !comment.trim()) return null;
  const raw = comment.trim();
  if (raw.includes("aiComment")) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.aiComment) return parsed.aiComment;
    } catch (e) {
      const match = raw.match(/"aiComment"\s*:\s*"([^"]+)"/);
      if (match) return match[1];
    }
  }
  return raw.replace(/^"+|"+$/g, "");
}

export default function RecipeNutritionSection({
  nutrition,
  ingredients = [],
  ingredientNutritions = {},
  servings = 1,
  aiComment,
}: RecipeNutritionSectionProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const effectiveServings = servings > 0 ? servings : 1;

  // 식재료 100g DB 기준 실질 총합 수치 연산 (화면에 표시되는 소수점 1자리 개별 수치를 선-반올림 후 합산하여 상단 요약 카드와 100% 산술 일치 보장)
  const ingredientTotals = ingredients.reduce(
    (acc, ing) => {
      const ingName = ing.name?.trim() || "";
      const noSpaceName = ingName.replace(/\s+/g, "");
      const master = ingredientNutritions[ingName]
        || ingredientNutritions[noSpaceName]
        || Object.entries(ingredientNutritions).find(
            ([k]) => k.replace(/\s+/g, "").toLowerCase() === noSpaceName.toLowerCase()
          )?.[1];

      const parsedGrams = parseGramsFromQqt(ing.qqt);
      const isGramsKnown = parsedGrams !== null && parsedGrams > 0;
      const ratio = isGramsKnown ? parsedGrams / 100.0 : 1.0;

      if (master) {
        acc.calories += round1((master.caloriesPer100g || 0) * ratio);
        acc.carbs += round1((master.carbsPer100g || 0) * ratio);
        acc.protein += round1((master.proteinPer100g || 0) * ratio);
        acc.fat += round1((master.fatPer100g || 0) * ratio);
        acc.sodium += round1((master.sodiumPer100g || 0) * ratio);
        acc.sugar += round1((master.sugarPer100g || 0) * ratio);
        acc.count += 1;
      }
      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0, sodium: 0, sugar: 0, count: 0 }
  );

  const useIngSum = ingredientTotals.count > 0;

  // 1인분 영양 수치 추출 (하단 식재료 DB 합계가 있으면 100% 동기화)
  const calories = useIngSum ? round1(ingredientTotals.calories / effectiveServings) : round1(parseNumeric(nutrition?.calories));
  const carbs = useIngSum ? round1(ingredientTotals.carbs / effectiveServings) : round1(parseNumeric(nutrition?.carbs));
  const protein = useIngSum ? round1(ingredientTotals.protein / effectiveServings) : round1(parseNumeric(nutrition?.protein));
  const fat = useIngSum ? round1(ingredientTotals.fat / effectiveServings) : round1(parseNumeric(nutrition?.fat));
  const sodium = useIngSum ? round1(ingredientTotals.sodium / effectiveServings) : round1(parseNumeric(nutrition?.sodium));
  const sugar = useIngSum ? round1(ingredientTotals.sugar / effectiveServings) : round1(parseNumeric(nutrition?.sugar));

  const hasNutrition = calories > 0 || carbs > 0 || protein > 0 || fat > 0;

  // 탄/단/지 에너지 비율 계산 (탄수화물 4kcal/g, 단백질 4kcal/g, 지방 9kcal/g)
  const carbKcal = carbs * 4;
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const macroTotalKcal = carbKcal + proteinKcal + fatKcal;

  const carbRatio = macroTotalKcal > 0 ? Math.round((carbKcal / macroTotalKcal) * 100) : 0;
  const proteinRatio = macroTotalKcal > 0 ? Math.round((proteinKcal / macroTotalKcal) * 100) : 0;
  const fatRatio = macroTotalKcal > 0 ? Math.max(0, 100 - carbRatio - proteinRatio) : 0;

  // 전체 레시피 총 칼로리 (식재료별 기여도 % 계산용)
  const totalRecipeCalories = calories * effectiveServings;

  const displayAiComment = cleanAiCommentText(aiComment);

  return (
    <section className="w-full mt-8 pt-6 border-t border-gray-100">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600">
            <LocalFireDepartmentIcon sx={{ fontSize: 20 }} />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">
              영양성분 정보
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              1인분 기준 추정치 (총 {effectiveServings}인분)
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80">
          1인분
        </span>
      </div>

      <div className="space-y-4">
        {/* ① 1인분 요약 카드 (미산출 시 안내 카드 표시) */}
        {!hasNutrition ? (
          <div className="w-full py-7 px-4 bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
            <PieChartOutlineIcon sx={{ fontSize: 28, color: "#9ca3af" }} />
            <p className="text-xs font-bold text-gray-600 mt-2">
              영양성분 정보가 아직 산출되지 않았습니다.
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              레시피 등록 및 수정 완료 시 AI가 표준 식재료 영양을 기반으로 자동 산출합니다.
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/30 border border-emerald-100/90 rounded-2xl p-5 shadow-xs">
            {/* 칼로리 대형 Callout */}
            <div className="flex items-baseline justify-between pb-4 border-b border-emerald-100/50">
              <span className="text-xs font-bold text-gray-500">열량</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600 tracking-tight">
                  {calories.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </span>
                <span className="text-xs font-bold text-gray-400">kcal</span>
              </div>
            </div>

            

            {/* 3대 영양소 (탄/단/지) 수치 박스 */}
            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="bg-white/90 border border-amber-100/80 rounded-xl p-2.5 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[11px] font-bold text-gray-500">탄수화물</span>
                </div>
                <div className="text-sm font-black text-gray-900">
                  {carbs.toFixed(1)}
                  <span className="text-[10px] font-semibold text-gray-400 ml-0.5">g</span>
                </div>
              </div>

              <div className="bg-white/90 border border-emerald-100/80 rounded-xl p-2.5 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-gray-500">단백질</span>
                </div>
                <div className="text-sm font-black text-gray-900">
                  {protein.toFixed(1)}
                  <span className="text-[10px] font-semibold text-gray-400 ml-0.5">g</span>
                </div>
              </div>

              <div className="bg-white/90 border border-rose-100/80 rounded-xl p-2.5 text-center shadow-2xs">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-[11px] font-bold text-gray-500">지방</span>
                </div>
                <div className="text-sm font-black text-gray-900">
                  {fat.toFixed(1)}
                  <span className="text-[10px] font-semibold text-gray-400 ml-0.5">g</span>
                </div>
              </div>
            </div>

            {/* 탄단지 에너지 비율 스택 프로그레스 바 */}
            {macroTotalKcal > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100">
                  <div
                    style={{ width: `${carbRatio}%` }}
                    className="bg-amber-400 transition-all duration-500"
                    title={`탄수화물 ${carbRatio}%`}
                  />
                  <div
                    style={{ width: `${proteinRatio}%` }}
                    className="bg-emerald-500 transition-all duration-500"
                    title={`단백질 ${proteinRatio}%`}
                  />
                  <div
                    style={{ width: `${fatRatio}%` }}
                    className="bg-rose-400 transition-all duration-500"
                    title={`지방 ${fatRatio}%`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-medium text-gray-400 px-0.5">
                  <span>탄수화물 {carbRatio}%</span>
                  <span>단백질 {proteinRatio}%</span>
                  <span>지방 {fatRatio}%</span>
                </div>
              </div>
            )}

            {/* 부가 영양소 (나트륨, 당류) */}
            {(sodium > 0 || sugar > 0) && (
              <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-emerald-100/40 text-[11px] font-medium text-gray-500">
                {sodium > 0 && (
                  <span>
                    나트륨 <strong className="font-bold text-gray-700">{sodium.toFixed(0)}mg</strong>
                  </span>
                )}
                {sugar > 0 && (
                  <span>
                    당류 <strong className="font-bold text-gray-700">{sugar.toFixed(1)}g</strong>
                  </span>
                )}
              </div>
            )}
            {/* AI 셰프 한줄평 말풍선 카드 */}
            {displayAiComment && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex items-start gap-3 shadow-2xs mt-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-extrabold text-emerald-800 tracking-tight block mb-0.5">
                    AI 셰프의 영양 한줄평
                  </span>
                  <p className="text-xs font-medium text-emerald-950 leading-relaxed">
                    "{displayAiComment}"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ② 서브 영역: 식재료별 영양 상세 분석 (접이식 아코디언) */}
        {ingredients.length > 0 && (
          <div className="bg-white border border-gray-200/70 rounded-2xl overflow-hidden transition-all shadow-2xs">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors cursor-pointer border-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">
                  식재료별 영양성분 상세
                </span>
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {ingredients.length}개 재료
                </span>
              </div>
              <span className="text-gray-400 flex items-center text-xs font-medium">
                {isExpanded ? (
                  <>
                    접기 <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
                  </>
                ) : (
                  <>
                    펼치기 <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
                  </>
                )}
              </span>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
                <p className="text-[11px] text-gray-400 pb-1">
                  {hasNutrition
                    ? "각 재료의 분량을 표준 100g 영양 DB 기준으로 환산한 추정 기여도입니다."
                    : "각 재료의 표준 100g 영양 DB 기준 정보입니다. (레시피 전체 영양은 저장 시 자동 산출)"}
                </p>

                  <div className="divide-y divide-gray-100">
                    {(() => {
                      // 전체 식재료 칼로리 총합 연산 (식재료별 기여도 % 합계가 정확히 100%가 되도록 처리)
                      const sumOfAllIngredientCalories = ingredients.reduce((sum, ing) => {
                        const ingName = ing.name?.trim() || "";
                        const noSpaceName = ingName.replace(/\s+/g, "");
                        const master = ingredientNutritions[ingName]
                          || ingredientNutritions[noSpaceName]
                          || Object.entries(ingredientNutritions).find(
                              ([k]) => k.replace(/\s+/g, "").toLowerCase() === noSpaceName.toLowerCase()
                            )?.[1];

                        const parsedGrams = parseGramsFromQqt(ing.qqt);
                        const isGramsKnown = parsedGrams !== null && parsedGrams > 0;
                        const ratio = isGramsKnown ? parsedGrams / 100.0 : 1.0;
                        const ingCal = master?.caloriesPer100g != null ? master.caloriesPer100g * ratio : 0;
                        return sum + ingCal;
                      }, 0);

                      return ingredients.map((ing, idx) => {
                        const ingName = ing.name?.trim() || "";
                        const noSpaceName = ingName.replace(/\s+/g, "");

                        // 1. 원문 이름, 2. 공백 제거 이름, 3. 대소문자/공백 무시 유연 매칭
                        const master = ingredientNutritions[ingName]
                          || ingredientNutritions[noSpaceName]
                          || Object.entries(ingredientNutritions).find(
                              ([k]) => k.replace(/\s+/g, "").toLowerCase() === noSpaceName.toLowerCase()
                            )?.[1];

                        const parsedGrams = parseGramsFromQqt(ing.qqt);
                        const isGramsKnown = parsedGrams !== null && parsedGrams > 0;
                        const ratio = isGramsKnown ? parsedGrams / 100.0 : 1.0;

                        const ingCal = master?.caloriesPer100g != null
                          ? round1(master.caloriesPer100g * ratio)
                          : null;
                        const ingProtein = master?.proteinPer100g != null
                          ? round1(master.proteinPer100g * ratio)
                          : null;
                        const ingCarbs = master?.carbsPer100g != null
                          ? round1(master.carbsPer100g * ratio)
                          : null;
                        const ingFat = master?.fatPer100g != null
                          ? round1(master.fatPer100g * ratio)
                          : null;
                        const ingSodium = master?.sodiumPer100g != null
                          ? round1(master.sodiumPer100g * ratio)
                          : null;
                        const ingSugar = master?.sugarPer100g != null
                          ? round1(master.sugarPer100g * ratio)
                          : null;

                        // 전체 식재료 총 칼로리 대비 비중 (합계 100% 연산)
                        const calShare = (ingCal && sumOfAllIngredientCalories > 0)
                          ? Math.min(100, Math.round((ingCal / sumOfAllIngredientCalories) * 100))
                          : null;

                        const quantityDisplay = formatQuantityWithGrams(ing.qqt, parsedGrams);

                        return (
                          <div
                            key={`${ingName}-${idx}`}
                            className="py-2.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-800 truncate">
                                  {ingName}
                                </span>
                                <span className="text-[11px] text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded-md shrink-0">
                                  {quantityDisplay}
                                </span>
                              </div>

                              {/* 탄단지 및 부가 영양소 서브 정보 */}
                              {(ingProtein !== null || ingCarbs !== null || ingFat !== null || ingSodium !== null || ingSugar !== null) && (
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                  {ingCarbs !== null && `탄 ${ingCarbs.toFixed(1)}g`}
                                  {ingProtein !== null && ` · 단 ${ingProtein.toFixed(1)}g`}
                                  {ingFat !== null && ` · 지 ${ingFat.toFixed(1)}g`}
                                  {ingSodium !== null && ingSodium > 0 && ` · 나트륨 ${ingSodium.toFixed(0)}mg`}
                                  {ingSugar !== null && ingSugar > 0 && ` · 당 ${ingSugar.toFixed(1)}g`}
                                </p>
                              )}
                            </div>

                            {/* 칼로리 및 비중 */}
                            <div className="text-right shrink-0">
                              {ingCal !== null ? (
                                <>
                                  <span className="font-extrabold text-gray-900">
                                    {Math.round(ingCal)} kcal
                                  </span>
                                  {calShare !== null && calShare > 0 && (
                                    <span className="block text-[10px] font-semibold text-emerald-600">
                                      전체의 {calShare}%
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[11px] text-gray-300">-</span>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
            </div>
        )}
      </div>
    </section>
  );
}
