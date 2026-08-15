"use client";

import React from "react";

export type BadgeVariant = "emerald" | "gray" | "amber" | "blue" | "rose" | "dark";
export type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
  gray: "bg-gray-100 text-gray-700 border-gray-200/80",
  amber: "bg-amber-50 text-amber-700 border-amber-200/70",
  blue: "bg-blue-50 text-blue-700 border-blue-200/70",
  rose: "bg-rose-50 text-rose-700 border-rose-200/70",
  dark: "bg-gray-900 text-white border-gray-800",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2 py-0.5 rounded-md gap-1",
  md: "text-xs px-2.5 py-1 rounded-lg gap-1.5",
};

export default function Badge({
  children,
  variant = "emerald",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center font-bold border transition-all select-none whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
