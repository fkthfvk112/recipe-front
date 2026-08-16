"use client";

import React from "react";
import { CircularProgress } from "@mui/material";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "px-3 py-2 text-xs rounded-xl",
  md: "px-5 py-3 text-xs sm:text-sm rounded-2xl",
  lg: "px-6 py-3.5 text-sm sm:text-base rounded-2xl",
};

/**
 * Emerald Primary Button - 주요 저장 / 게시 / 소비하기 / 완료 액션 (Solid Emerald)
 */
export function PrimaryButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-black text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] shadow-md border-none transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
        fullWidth ? "w-full" : "w-auto"
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "white" }} /> : children}
    </button>
  );
}

/**
 * Neutral Cancel / Secondary Button - 취소 / 닫기 / 보조 액션 (Gray Border)
 */
export function CancelButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-bold text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 shadow-xs transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "#6b7280" }} /> : children}
    </button>
  );
}

/**
 * Danger / Destructive Button - 삭제 / 파괴적 액션 (Light Red / Solid Red)
 */
export function DangerButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-black text-white bg-rose-500 hover:bg-rose-600 active:scale-[0.99] shadow-md border-none transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-1.5 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "white" }} /> : children}
    </button>
  );
}

/**
 * Soft Rose / Discard Button - 폐기하기 / 보조 경고 액션 (Pastel Rose)
 */
export function RoseButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-black text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "#ef4444" }} /> : children}
    </button>
  );
}

/**
 * Dark Button - 차분한 중립 블랙 액션 (식재료 보충하기 등)
 */
export function DarkButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-extrabold text-white bg-neutral-800 hover:bg-neutral-900 shadow-md border-none transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "white" }} /> : children}
    </button>
  );
}

/**
 * Outline Emerald Button - 에메랄드 테두리 버튼 (White Bg + Emerald Border)
 */
export function OutlineButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-bold text-emerald-600 bg-white hover:bg-emerald-50 border border-emerald-500 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "#10b981" }} /> : children}
    </button>
  );
}

export const SecondaryButton = OutlineButton;

/**
 * Subtle / Badge Icon Button - 상단 헤더 / 카드 우측 뱃지형 수정·설정 소형 버튼 (Subtle Gray/Emerald Hover)
 */
export function SubtleButton({
  children,
  loading = false,
  fullWidth = false,
  size = "sm",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`font-bold text-gray-700 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200/60 border border-gray-200/80 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1 shrink-0 ${
        fullWidth ? "w-full" : "w-auto"
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={14} sx={{ color: "#10b981" }} /> : children}
    </button>
  );
}

/**
 * Orange Accent Button - '무엇을 먹을까?', 레시피 추천 / 이벤트 등 포인트 강조 버튼 (Solid Orange)
 */
export function OrangeButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`font-black text-white bg-[#FF7043] hover:bg-[#F4511E] active:scale-[0.99] shadow-md border-none transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
        fullWidth ? "w-full" : "w-auto"
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "white" }} /> : children}
    </button>
  );
}

export const AccentButton = OrangeButton;
