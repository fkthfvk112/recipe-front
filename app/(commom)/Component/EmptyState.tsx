"use client";

import React from "react";
import FallbackPage from "./FallbackPage";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

/**
 * EmptyState -> FallbackPage 래퍼 (앱 전체 단 하나의 공통 폴백 페이지 컴포넌트)
 */
export default function EmptyState({
  icon = "🔍",
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <FallbackPage
      icon={icon}
      title={title}
      description={description}
      primaryAction={
        actionText
          ? {
              label: actionText,
              href: actionHref,
              onClick: onAction,
            }
          : undefined
      }
    />
  );
}
