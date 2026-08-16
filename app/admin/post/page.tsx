"use client";

import { useEffect, useState, useRef } from "react";
import { fetchPostList, generatePostByAI, createDirectPost } from "@/app/(api)/post";
import CircularProgress from "@mui/material/CircularProgress";
import PostPreviewAdminHoriItem from "./PostPreviewAdminHoriItem";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PrimaryButton, SecondaryButton } from "@/app/(commom)/Component/Buttons";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

export default function DraftPost() {
  const router = useRouter();
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ingredient, setIngredient] = useState<string>("");
  const [refetch, setRefetch] = useState<number>(0);
  const [isCreatingDirect, setIsCreatingDirect] = useState(false);

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

  /** 직접 글쓰기 (새 초안 생성 후 에디터 이동) */
  const handleDirectCreate = async () => {
    const { value: title } = await Swal.fire({
      title: "직접 글쓰기",
      text: "생성할 새 식재료 아티클의 제목을 입력하세요.",
      input: "text",
      inputPlaceholder: "예: 머그인 추천 신선 식재료 보관법",
      showCancelButton: true,
      confirmButtonText: "글쓰기 시작",
      cancelButtonText: "취소",
      confirmButtonColor: "#10B981",
    });

    if (title === undefined) return; // 취소 클릭

    try {
      setIsCreatingDirect(true);
      const newPost = await createDirectPost({
        title: title?.trim() || "새 식재료 아티클",
      });

      if (newPost && newPost.postId) {
        Swal.fire({
          title: "새 글 생성 완료!",
          text: "에디터 페이지로 이동합니다.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        }).then(() => {
          router.push(`/admin/post/${newPost.postId}`);
        });
      }
    } catch (e) {
      console.error("direct create error", e);
      Swal.fire("오류", "게시글 생성에 실패했습니다.", "error");
    } finally {
      setIsCreatingDirect(false);
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
            AI 미니 에이전트로 식재료 아티클을 자동 생성하거나, 직접 글쓰기로 새 아티클을 작성할 수 있습니다.
          </p>
        </div>

        {/* 1. AI 게시글 자동 생성 카드 */}
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
              className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-gray-50 focus:bg-white font-medium"
            />
            <PrimaryButton
              onClick={generatePost}
              size="md"
              className="whitespace-nowrap sm:w-auto flex items-center justify-center gap-1.5 font-bold"
            >
              🪄 게시글 자동 생성
            </PrimaryButton>
          </div>
        </section>

        {/* 2. AI 자동 생성 버튼 아래: 직접 글쓰기 카드 */}
        <section className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm sm:text-base">
              <EditNoteOutlinedIcon sx={{ fontSize: 22, color: "#10B981" }} />
              <span>직접 글쓰기 (수동 작성)</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              원하는 제목과 내용, 태그를 커스텀하여 새 식재료 백과 아티클을 직접 작성합니다.
            </p>
          </div>

          <SecondaryButton
            onClick={handleDirectCreate}
            disabled={isCreatingDirect}
            size="md"
            className="w-full sm:w-auto whitespace-nowrap flex items-center justify-center gap-1.5 font-bold border-emerald-300 text-emerald-700 hover:bg-emerald-50 shrink-0"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            <span>{isCreatingDirect ? "생성 중..." : "✏️ 직접 글쓰기"}</span>
          </SecondaryButton>
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
                작성된 게시글이 없습니다. 위에서 새 아티클을 생성하거나 직접 글쓰기를 시작해보세요.
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
