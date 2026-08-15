"use client";

import EmptyState from "@/app/(commom)/Component/EmptyState";

export default function NoContent_Recipe() {
  return (
    <div className="w-full max-w-xl mx-auto my-6">
      <EmptyState
        icon="🍳"
        title="일치하는 레시피 검색 결과가 없습니다."
        description="검색어나 식재료 필터 조건을 변경해 보시거나, 전체 인기 레시피를 확인해 보세요."
        actionText="인기 레시피 전체보기"
        actionHref="/recipes/1/sortingCondition=POPULARITY"
      />
    </div>
  );
}