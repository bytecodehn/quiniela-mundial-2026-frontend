"use client";

import { type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold border-none transition-all duration-150 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green text-white hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_0_20px_oklch(60%_0.18_145/0.2)]",
  secondary: "bg-transparent text-fg border border-border hover:bg-bg-surface hover:border-fg-secondary",
  ghost: "bg-transparent text-fg-secondary hover:bg-bg-surface hover:text-fg",
  danger: "bg-red text-white hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-radius-sm",
  md: "px-5 py-2.5 text-[0.95rem] rounded-radius-md",
  lg: "px-8 py-3 text-[1.1rem] rounded-radius-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
