"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "neutral" | "outline-primary" | "outline-secondary" | "outline-neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 border cursor-pointer focus:outline-none";

  const variants = {
    primary: "bg-mugin-primary text-white border-transparent hover:bg-[#e0562b]",
    secondary: "bg-darkGreen text-white border-transparent hover:bg-[#487373]",
    neutral: "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200",
    "outline-primary": "bg-white text-mugin-primary border-mugin-primary hover:bg-orange-50",
    "outline-secondary": "bg-white text-darkGreen border-darkGreen hover:bg-teal-50",
    "outline-neutral": "bg-white text-gray-500 border-gray-200 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
