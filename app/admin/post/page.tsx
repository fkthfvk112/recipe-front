"use client";

import { useEffect, useState, useRef } from "react";
import { fetchPostList, generatePostByAI } from "@/app/(api)/post";
import CircularProgress from "@mui/material/CircularProgress";
import PostPreviewAdminHoriItem from "./PostPreviewAdminHoriItem";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PrimaryButton } from "@/app/(commom)/Component/Buttons";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

export default function DraftPost() {
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredient, setIngredient] = useState<string>("");
  const [refetch, setRefetch] = useState<number>(0);

  const viewRef = useRef<HTMLDivElement | null>(null);

  const fetchDraftPosts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchPostList(); // Post[]
      if (Array.isArray(data)) {
        setPostList(data);
      }
    } catch (e) {
      console.error("draft post fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftPosts();
  }, [refetch]);

  const generatePost = async () => {
    if (!ingredient.trim()) {
      Swal.fire({
        title: "식재료명을 입력해주세요.",
        icon: "warning",
      });
      return;
    }

    // 로딩 모달
    withReactContent(Swal).fire({
      title: "AI 게시글을 생성하는 중...",
      text: "식재료 백과 아티클 초안과 마크다운을 자동 구성합니다.",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      html: (
        <div className="overflow-y-hidden flex justify-center py-4">
          <CircularProgress color="success" />
        </div>
      ),
    });

    try {
      await generatePostByAI(ingredient);
      setRefetch((prev) => prev + 1);
      setIngredient("");

      Swal.fire({
        title: "게시글 생성 완료!",
        text: "목록에 새 식재료 백과 초안이 추가되었습니다.",
        icon: "success",
      });
    } catch (e) {
      console.error("AI post generate error", e);
      Swal.fire({
        title: "게시글 생성에 실패했습니다.",
        text: "잠시 후 다시 시도해주세요.",
        icon: "error",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200/60 w-fit">
            📝 게시글 관리자
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            식재료 백과 게시글 목록
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            AI 미니 에이전트로 식재료 아티클을 자동 생성하거나, 게시글 수정/발행 페이지로 이동할 수 있습니다.
          </p>
        </div>

        {/* AI 게시글 자동 생성 카드 */}
        <section className="bg-white border border-emerald-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm sm:text-base">
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 20 }} />
            <span>AI 식재료 게시글 자동 생성</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              onChange={(evt) => setIngredient(evt.target.value)}
              value={ingredient}
              onKeyDown={(e) => {
                if (e.key === "Enter") generatePost();
              }}
              type="text"
              placeholder="생성할 식재료명 입력 (예: 양파, 대파, 바나나)"
              className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50 focus:bg-white"
            />
            <PrimaryButton
              onClick={generatePost}
              size="md"
              className="whitespace-nowrap sm:w-auto"
            >
              🪄 게시글 자동 생성
            </PrimaryButton>
          </div>
        </section>

        {/* 게시글 목록 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-gray-700">
              전체 게시글 ({postList.length})
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              항목 클릭 시 수정/발행페이지 선택 가능
            </span>
          </div>

          <ul className="w-full">
            {!isLoading && postList.length === 0 ? (
              <li className="bg-white rounded-2xl border border-gray-200 text-center text-gray-400 py-16 text-sm font-medium">
                작성된 게시글이 없습니다. 위에서 새 아티클을 생성해보세요.
              </li>
            ) : (
              postList.map((post, idx) => (
                <PostPreviewAdminHoriItem
                  key={`post-${post.postId ?? idx}`}
                  postPreview={post}
                />
              ))
            )}
          </ul>
        </section>

        <div className="h-10 flex justify-center items-center" ref={viewRef}>
          {isLoading && <CircularProgress color="success" size={28} />}
        </div>
      </div>
    </main>
  );
}
