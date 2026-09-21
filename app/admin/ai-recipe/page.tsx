"use client";

import { useState } from "react";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import Swal from "sweetalert2";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";

interface GenerationResult {
  url: string;
  success: boolean;
  error?: string;
}

export default function AiRecipeAdminPage() {
  const [videoUrls, setVideoUrls] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentProgress, setCurrentProgress] = useState<{
    current: number;
    total: number;
    currentUrl: string;
  } | null>(null);
  const [generationResults, setGenerationResults] = useState<GenerationResult[]>([]);

  // URL 입력 필드 추가 (+)
  const handleAddUrl = () => {
    setVideoUrls((prev) => [...prev, ""]);
  };

  // URL 입력 필드 제거
  const handleRemoveUrl = (index: number) => {
    setVideoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // URL 값 변경 및 다중 줄 붙여넣기 자동 분할 처리
  const handleChangeUrl = (index: number, val: string) => {
    if (val.includes("\n")) {
      const lines = val
        .split(/[\r\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (lines.length > 1) {
        setVideoUrls((prev) => {
          const next = [...prev];
          next.splice(index, 1, ...lines);
          return next;
        });
        return;
      }
    }

    setVideoUrls((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

const startGeneration = async () => {
    // 1. 실행 확인 팝업
    const confirmResult = await Swal.fire({
      title: "AI 레시피 일괄 생성",
      text: "PENDING 상태인 유튜브 소스들을 바탕으로 AI 레시피 생성을 시작하시겠습니까?\n(작업은 백그라운드에서 비동기로 진행됩니다.)",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "시작하기",
      cancelButtonText: "취소",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      allowEnterKey: false,
    });

    if (!confirmResult.isConfirmed) {
      return; // 취소 버튼을 눌렀을 경우 중단
    }

    // 2. 로딩 팝업 표시 (API 응답 대기 중)
    Swal.fire({
      title: "요청 전송 중...",
      text: "서버에 일괄 생성 작업을 요청하고 있습니다.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading(); // SweetAlert2 공식 로딩 애니메이션 실행
      },
    });

    try {
      // 3. API 요청 전송 (비동기 백그라운드 작업 시작)
      const response = await axiosAuthInstacne.post(
        "admin/recipe/ai/batch/from-youtube"
      );

      // 4. 성공 팝업
      await Swal.fire({
        title: "작업 요청 성공!",
        text: "레시피 AI 일괄 생성 작업이 백그라운드에서 시작되었습니다. 완료되면 이메일로 결과가 발송됩니다.",
        icon: "success",
        confirmButtonText: "확인",
        confirmButtonColor: "#3085d6",
        allowEnterKey: false,
      });

    } catch (error:any) {
      console.error("Failed to trigger recipe batch generation:", error);

      // 5. 에러 발생 팝업
      const errorMsg = error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.";
      await Swal.fire({
        title: "요청 실패",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#d33",
        allowEnterKey: false,
      });
    }
  };


  // 다중 AI 레시피 생성 실행
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효한 URL 필터링
    const trimmedUrls = videoUrls.map((u) => u.trim()).filter(Boolean);

    if (trimmedUrls.length === 0) {
      Swal.fire({
        title: "URL을 입력해주세요",
        text: "가져올 유튜브 요리 영상의 링크를 최소 1개 이상 입력해주세요.",
        icon: "warning",
      });
      return;
    }

    // 유튜브 URL 유효성 검사
    const invalidUrls = trimmedUrls.filter(
      (u) => !u.includes("youtube.com") && !u.includes("youtu.be")
    );

    if (invalidUrls.length > 0) {
      Swal.fire({
        title: "올바르지 않은 URL이 포함되어 있습니다",
        text: `YouTube 링크(youtube.com 또는 youtu.be)만 가능합니다:\n${invalidUrls.slice(0, 2).join(", ")}${invalidUrls.length > 2 ? ` 외 ${invalidUrls.length - 2}건` : ""}`,
        icon: "error",
      });
      return;
    }

    setIsLoading(true);
    const results: GenerationResult[] = [];

    for (let i = 0; i < trimmedUrls.length; i++) {
      const targetUrl = trimmedUrls[i];
      setCurrentProgress({
        current: i + 1,
        total: trimmedUrls.length,
        currentUrl: targetUrl,
      });

      try {
        const response = await axiosAuthInstacne.post(
          "admin/recipe/ai/script/from-youtube",
          {
            videoUrl: targetUrl,
          },
          {
            timeout: 180000, // 개별 요청당 3분 타임아웃
          }
        );

        if (response.data) {
          const item: GenerationResult = {
            url: targetUrl,
            success: true,
          };
          results.push(item);
          setGenerationResults((prev) => [item, ...prev]);
        } else {
          const errMsg =
            response.data?.message || "레시피 생성 중 오류가 발생했습니다.";
          const item: GenerationResult = {
            url: targetUrl,
            success: false,
            error: errMsg,
          };
          results.push(item);
          setGenerationResults((prev) => [item, ...prev]);
        }
      } catch (error: any) {
        console.error(`[AiRecipeAdminPage] Error for ${targetUrl}:`, error);
        const errorMsg =
          error.response?.data?.message ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : null) ||
          error.message ||
          "AI 레시피 생성에 실패했습니다.";

        const item: GenerationResult = {
          url: targetUrl,
          success: false,
          error: String(errorMsg),
        };
        results.push(item);
        setGenerationResults((prev) => [item, ...prev]);
      }
    }

    setCurrentProgress(null);
    setIsLoading(false);

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.length - successCount;

    if (failCount === 0) {
      Swal.fire({
        title: "AI 레시피 생성 완료!",
        text: `총 ${successCount}건의 AI 레시피가 성공적으로 등록되었습니다. 검수 후 발행해주세요!`,
        icon: "success",
        confirmButtonColor: "#059669",
      });
      setVideoUrls([""]); // 전체 성공 시 입력란 초기화
    } else {
      Swal.fire({
        title: `처리 완료 (성공 ${successCount}건 / 실패 ${failCount}건)`,
        text: `일부 영상 생성에 실패했습니다. 아래 결과 내역을 확인해주세요.`,
        icon: successCount > 0 ? "warning" : "error",
        confirmButtonColor: successCount > 0 ? "#f59e0b" : "#dc2626",
      });
    }
  };

  const validUrlCount = videoUrls.map((u) => u.trim()).filter(Boolean).length;

  return (
    <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5 bg-gray-50/50">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mt-4">
        {/* 헤더 타이틀 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-violet-200">
            <AutoAwesomeIcon sx={{ fontSize: 24 }} />
          </span>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              유튜브 AI 레시피 자동 수집기
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                Admin
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              유튜브 요리 영상 대본을 AI가 분석하여 레시피, 대표 이미지, 영양성분을 자동 생성합니다.
            </p>
          </div>
        </div>

        {/* 안내 카드 */}
        <div className="bg-violet-50/60 border border-violet-100/90 rounded-2xl p-4 mb-6 text-xs text-violet-950 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-violet-900">
            📌 생성 프로세스 안내
          </p>
          <ul className="list-disc list-inside space-y-1 text-violet-800/90 pl-1 leading-relaxed">
            <li>
              <strong>+ 버튼</strong>을 눌러 여러 개의 유튜브 URL을 한 번에 입력하고 일괄 데이터를 DB에 삽입합니다.
            </li>
            <li>
              그리고 recipe_ai_source의 데이터를 수기로 모두 라이브에 동기화합니다. (INSERT)
            </li>
            <li>
              다음으로 "소스로 레시피 생성"을 실행하는 경우 해당 recipe_ai_source의 스크립트를 기준으로 레시피 데이터가 세팅됩니다.
            </li>
            <li>
              이는 유튜브가 AWS 서버(데이터 센터)의 IP를 차단하기 때문으로 데이터 센터가 아닌 로컬(홈 PC)에서 전처리를 하기 위함입니다.
            </li>
            <li>
              표준 100g 식재료 DB와 연동되어 <strong>1인분 칼로리/영양성분</strong>이 자동 산출됩니다.
            </li>
            <li>
              안전한 품질 관리를 위해 <strong>임시저장(isDraft=true)</strong> 상태로 등록되므로, 검수 후 정식 발행하실 수 있습니다.
            </li>
          </ul>
        </div>

        {/* URL 입력 폼 */}
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-extrabold text-gray-700 flex items-center gap-1">
                <SmartDisplayIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                유튜브 영상 URL 목록 ({videoUrls.length}개)
              </label>
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={isLoading}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <AddIcon sx={{ fontSize: 15 }} />
                URL 추가
              </button>
            </div>

            {videoUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="shrink-0 w-6 text-xs font-bold text-gray-400 text-center">
                  #{index + 1}
                </span>
                <input
                  type="text"
                  placeholder="예: https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
                  value={url}
                  onChange={(e) => handleChangeUrl(index, e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all disabled:opacity-60"
                />
                {videoUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUrl(index)}
                    disabled={isLoading}
                    title="URL 삭제"
                    className="border-none shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 추가 편의 버튼 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={isLoading}
              className="border-none text-xs text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <AddIcon sx={{ fontSize: 14 }} />
              입력란 추가하기
            </button>
          </div>

          {/* 진행 상태 프로그레스 바 (로딩 중) */}
          {isLoading && currentProgress && (
            <div className="p-4 rounded-2xl bg-violet-50/80 border border-violet-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-violet-900">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                  생성 진행 중 ({currentProgress.current} / {currentProgress.total})
                </span>
                <span>
                  {Math.round((currentProgress.current / currentProgress.total) * 100)}%
                </span>
              </div>

              {/* 프로그레스 바 */}
              <div className="w-full bg-violet-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentProgress.current / currentProgress.total) * 100}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-violet-700 font-medium truncate">
                현재 작업: {currentProgress.currentUrl}
              </p>
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading || validUrlCount === 0}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI 분석 및 순차 생성 중 ({currentProgress ? `${currentProgress.current}/${currentProgress.total}` : "준비 중"})...
              </>
            ) : (
              <>
                <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                스크립트 DB Insert 생성 시작하기 (총 {validUrlCount}개)
              </>
            )}
          </button>
        </form>

        {/* 생성 결과 리스트 카드 */}
        {generationResults.length > 0 && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
                <span>📋 최근 생성 결과 내역 ({generationResults.length}건)</span>
              </h2>
              {!isLoading && (
                <button
                  type="button"
                  onClick={() => setGenerationResults([])}
                  className="text-xs text-gray-400 hover:text-gray-600 font-medium cursor-pointer"
                >
                  결과 목록 지우기
                </button>
              )}
            </div>

            <div className="space-y-3">
              {generationResults.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all animate-fadeIn ${
                    item.success
                      ? "bg-emerald-50/70 border-emerald-200/80"
                      : "bg-red-50/70 border-red-200/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {item.success ? (
                        <CheckCircleOutlineIcon
                          sx={{ fontSize: 18, color: "#059669" }}
                        />
                      ) : (
                        <ErrorOutlineIcon
                          sx={{ fontSize: 18, color: "#dc2626" }}
                        />
                      )}
                      <span
                        className={`text-xs font-bold ${
                          item.success ? "text-emerald-800" : "text-red-800"
                        }`}
                      >
                        {item.success
                          ? `레시피 생성 성공`
                          : "레시피 생성 실패"}
                      </span>
                    </div>

                    <span className="text-[11px] text-gray-400 font-mono truncate max-w-[200px] sm:max-w-xs">
                      {item.url}
                    </span>
                  </div>
{/* 
                  {item.success && item.recipeId ? (
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <Link
                        href={`/edit-recipe/${item.recipeId}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1 shadow-xs no-underline"
                      >
                        검수 및 수정하기 (임시저장 편집)
                        <ArrowForwardIcon sx={{ fontSize: 13 }} />
                      </Link>
                      <Link
                        href={`/recipe-detail/${item.recipeId}`}
                        target="_blank"
                        className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-100/50 text-emerald-800 border border-emerald-300 font-bold text-xs text-center transition-colors no-underline"
                      >
                        상세 페이지 미리보기 ↗
                      </Link>
                    </div>
                  ) : (
                    <p className="text-xs text-red-700 mt-1 pl-6">
                      {item.error || "영상 자막을 불러올 수 없거나 처리 중 오류가 발생했습니다."}
                    </p>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        )}
          {/* 제출 버튼 */}
          <button
            onClick={()=>startGeneration()}
            type="submit"
            className="mt-3 w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-green hover:from-green-700 hover:to-green-700 transition-all shadow-md shadow-violet-200 flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            AI 레시피 생성 시작하기
          </button>
      </div>
    </div>
  );
}
