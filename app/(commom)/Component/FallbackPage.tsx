"use client";

import React from "react";
import Link from "next/link";
import { PrimaryButton, CancelButton } from "./Buttons";

export interface ActionConfig {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface FallbackPageProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  className?: string;
}

/**
 * 앱 전체 단 하나의 공통 실패 / 에러 / NoContent 페이지 컴포넌트
 */
export default function FallbackPage({
  icon = "⚠️",
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: FallbackPageProps) {
  return (
    <div className={`min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 w-full ${className}`}>
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-10 text-center border border-gray-100/90 shadow-[0_12px_40px_rgb(0,0,0,0.06)] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl mb-4 border border-gray-100 shrink-0">
          {icon}
        </div>

        <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-2 tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-sm leading-relaxed mb-6">
            {description}
          </p>
        )}

        {/* Action Buttons - 수직/수평 반응형 배치로 긴 글자도 절대 안 잘림 */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-2">
          {primaryAction && (
            <div className="w-full sm:w-auto shrink-0">
              {primaryAction.href ? (
                <Link href={primaryAction.href} className="w-full sm:w-auto inline-block">
                  <PrimaryButton size="md" className="whitespace-nowrap px-6 py-3 w-full sm:w-auto text-xs sm:text-sm">
                    {primaryAction.label}
                  </PrimaryButton>
                </Link>
              ) : (
                <PrimaryButton size="md" onClick={primaryAction.onClick} className="whitespace-nowrap px-6 py-3 w-full sm:w-auto text-xs sm:text-sm">
                  {primaryAction.label}
                </PrimaryButton>
              )}
            </div>
          )}

          {secondaryAction && (
            <div className="w-full sm:w-auto shrink-0">
              {secondaryAction.href ? (
                <Link href={secondaryAction.href} className="w-full sm:w-auto inline-block">
                  <CancelButton size="md" className="whitespace-nowrap px-6 py-3 w-full sm:w-auto text-xs sm:text-sm">
                    {secondaryAction.label}
                  </CancelButton>
                </Link>
              ) : (
                <CancelButton size="md" onClick={secondaryAction.onClick} className="whitespace-nowrap px-6 py-3 w-full sm:w-auto text-xs sm:text-sm">
                  {secondaryAction.label}
                </CancelButton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
