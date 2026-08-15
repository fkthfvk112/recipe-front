"use client";

import FallbackPage from "@/app/(commom)/Component/FallbackPage";

export default function NotFound() {
  return (
    <FallbackPage
      icon="🔍"
      title="페이지를 찾을 수 없습니다 (404)"
      description="요청하신 페이지가 존재하지 않거나, 이동 또는 삭제되었습니다."
      primaryAction={{ label: "홈으로 돌아가기", href: "/" }}
    />
  );
}
