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

  // 1인분 영양 수치 추출 (백엔드에서 전달받은 nutrition 객체값 그대로 표기)
  const calories = round1(parseNumeric(nutrition?.calories));
  const carbs = round1(parseNumeric(nutrition?.carbs));
  const protein = round1(parseNumeric(nutrition?.protein));
  const fat = round1(parseNumeric(nutrition?.fat));
  const sodium = round1(parseNumeric(nutrition?.sodium));
  const sugar = round1(parseNumeric(nutrition?.sugar));

  const hasNutrition = calories > 0 || carbs > 0 || protein > 0 || fat > 0;

  // 탄/단/지 에너지 비율 계산 (탄수화물 4kcal/g, 단백질 4kcal/g, 지방 9kcal/g)
  const carbKcal = carbs * 4;
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const macroTotalKcal = carbKcal + proteinKcal + fatKcal;

  const carbRatio = macroTotalKcal > 0 ? Math.round((carbKcal / macroTotalKcal) * 100) : 0;
  const proteinRatio = macroTotalKcal > 0 ? Math.round((proteinKcal / macroTotalKcal) * 100) : 0;
  const fatRatio = macroTotalKcal > 0 ? Math.max(0, 100 - carbRatio - proteinRatio) : 0;

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
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex items-start gap-3 shadow-2xs mt-3">
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
                  식재료 100g당 표준 영양성분 정보입니다.
                </p>

                <div className="divide-y divide-gray-100">
                  {ingredients.map((ing, idx) => {
                    const ingName = ing.name?.trim() || "";
                    const noSpaceName = ingName.replace(/\s+/g, "");

                    // 1. 원문 이름, 2. 공백 제거 이름, 3. 대소문자/공백 무시 유연 매칭
                    const master = ingredientNutritions[ingName]
                      || ingredientNutritions[noSpaceName]
                      || Object.entries(ingredientNutritions).find(
                          ([k]) => k.replace(/\s+/g, "").toLowerCase() === noSpaceName.toLowerCase()
                        )?.[1];

                    const ingCal = master?.caloriesPer100g != null ? round1(master.caloriesPer100g) : null;
                    const ingProtein = master?.proteinPer100g != null ? round1(master.proteinPer100g) : null;
                    const ingCarbs = master?.carbsPer100g != null ? round1(master.carbsPer100g) : null;
                    const ingFat = master?.fatPer100g != null ? round1(master.fatPer100g) : null;
                    const ingSodium = master?.sodiumPer100g != null ? round1(master.sodiumPer100g) : null;
                    const ingSugar = master?.sugarPer100g != null ? round1(master.sugarPer100g) : null;

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
                            {ing.qqt && ing.qqt.trim() && (
                              <span className="text-[11px] text-gray-500 font-medium px-1.5 py-0.5 bg-gray-100 rounded-md shrink-0">
                                {ing.qqt}
                              </span>
                            )}
                          </div>

                          {/* 100g당 탄단지 및 부가 영양소 서브 정보 */}
                          {(ingProtein !== null || ingCarbs !== null || ingFat !== null || ingSodium !== null || ingSugar !== null) && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {ingCarbs !== null && `탄 ${ingCarbs.toFixed(1)}g`}
                              {ingProtein !== null && ` · 단 ${ingProtein.toFixed(1)}g`}
                              {ingFat !== null && ` · 지 ${ingFat.toFixed(1)}g`}
                              {ingSodium !== null && ingSodium > 0 && ` · 나트륨 ${ingSodium.toFixed(0)}mg`}
                              {ingSugar !== null && ingSugar > 0 && ` · 당 ${ingSugar.toFixed(1)}g`}
                              <span className="ml-1 text-emerald-600 font-medium">(100g당)</span>
                            </p>
                          )}
                        </div>

                        {/* 100g당 칼로리 */}
                        <div className="text-right shrink-0">
                          {ingCal !== null ? (
                            <>
                              <span className="font-extrabold text-gray-900">
                                {Math.round(ingCal)} kcal
                              </span>
                              <span className="block text-[10px] font-semibold text-gray-400">
                                100g당
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] text-gray-300">-</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
