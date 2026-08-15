"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

function PostPreviewAdminHoriItem({ postPreview }: { postPreview: Post }) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // 버튼 클릭 시 카드의 기본 이벤트 방지
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) {
      return;
    }

    Swal.fire({
      title: postPreview.title,
      text: "원하시는 작업을 선택해주세요.",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "✏️ 에디터 수정",
      denyButtonText: "🌍 발행 페이지 이동",
      cancelButtonText: "취소",
      confirmButtonColor: "#10b981", // Emerald
      denyButtonColor: "#3b82f6",    // Blue
    }).then((result) => {
      if (result.isConfirmed) {
        router.push(`/admin/post/${postPreview.postId}`);
      } else if (result.isDenied) {
        if (postPreview.draft) {
          Swal.fire({
            title: "임시 저장 게시글입니다",
            text: "현재 게시글은 임시 저장(비공개) 상태입니다. 미리보기 페이지로 이동할까요?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "이동하기",
            cancelButtonText: "취소",
            confirmButtonColor: "#10b981",
          }).then((res) => {
            if (res.isConfirmed) {
              router.push(`/post/${postPreview.slug}`);
            }
          });
        } else {
          router.push(`/post/${postPreview.slug}`);
        }
      }
    });
  };

  const plainContent = postPreview.content
    ?.replace(/!\[.*?\]\(.*?\)/g, "")
    ?.replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    ?.replace(/[#>*_\-`]/g, "")
    ?.replace(/\n+/g, " ")
    ?.trim();

  return (
    <li
      onClick={handleCardClick}
      className="w-full bg-white border border-gray-200 hover:border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
    >
      {/* 좌측 정보 영역 */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {/* 상태 태그 */}
          <span
            className={`px-2.5 py-0.5 text-[11px] font-extrabold rounded-full border ${
              postPreview.draft
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {postPreview.draft ? "⏸ 임시 저장" : "🌍 공개 게시됨"}
          </span>

          {/* slug */}
          <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
            /{postPreview.slug}
          </span>
        </div>

        {/* 게시글 제목 */}
        <h2 className="text-base font-black text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
          {postPreview.title}
        </h2>

        {/* 요약 내용 */}
        {plainContent && (
          <p className="text-xs text-gray-500 line-clamp-1 font-medium leading-relaxed">
            {plainContent}
          </p>
        )}

        {/* 조회수 */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium mt-1">
          <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
          <span>조회수 {postPreview.viewCnt ?? 0}회</span>
        </div>
      </div>

      {/* 우측 선택 버튼 영역 */}
      <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
        <Link
          href={`/admin/post/${postPreview.postId}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 rounded-xl transition-all"
        >
          <EditOutlinedIcon sx={{ fontSize: 15 }} />
          <span>수정</span>
        </Link>

        <Link
          href={`/post/${postPreview.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
        >
          <OpenInNewOutlinedIcon sx={{ fontSize: 15 }} />
          <span>포스팅 보기</span>
        </Link>
      </div>
    </li>
  );
}

export default React.memo(PostPreviewAdminHoriItem);