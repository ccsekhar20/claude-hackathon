"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function GlowButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
}: GlowButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white glow-safe",
    secondary: "glass-surface text-white",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white glow-danger",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
