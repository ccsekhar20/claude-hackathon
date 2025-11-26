"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "safe" | "caution" | "danger" | "none";
  animate?: boolean;
}

export function GlassCard({ children, className, glow = "none", animate = true }: GlassCardProps) {
  const glowClass = {
    safe: "glow-safe",
    caution: "glow-caution",
    danger: "glow-danger",
    none: "",
  }[glow];

  const content = (
    <div
      className={cn(
        "glass-surface rounded-3xl p-6 transition-all duration-300",
        glowClass,
        className
      )}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
