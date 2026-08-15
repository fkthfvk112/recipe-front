"use client";

import React from "react";
import { CircularProgress } from "@mui/material";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "px-3.5 py-2 text-xs rounded-xl",
  md: "px-4 py-3 text-xs rounded-2xl",
  lg: "px-6 py-3.5 text-sm rounded-2xl",
};

/**
 * Emerald Primary Button - 주요 저장 / 게시 / 완료 액션 (Solid Emerald)
 */
export function PrimaryButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] shadow-md border-none transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-1.5 ${
        fullWidth ? "w-full" : ""
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
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
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
 * Danger / Destructive Button - 삭제 / 파괴적 액션 (Light Red)
 */
export function DangerButton({
  children,
  loading = false,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading ? <CircularProgress size={16} sx={{ color: "#ef4444" }} /> : children}
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
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
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
