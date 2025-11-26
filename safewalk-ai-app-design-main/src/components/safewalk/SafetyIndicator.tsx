"use client";

import { motion } from "framer-motion";
import { Shield, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafetyIndicatorProps {
  level: "safe" | "caution" | "danger";
  score: number;
  animated?: boolean;
}

export function SafetyIndicator({ level, score, animated = true }: SafetyIndicatorProps) {
  const config = {
    safe: {
      icon: Shield,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      glowClass: "glow-safe",
      label: "Safe Route",
    },
    caution: {
      icon: AlertTriangle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      glowClass: "glow-caution",
      label: "Exercise Caution",
    },
    danger: {
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      glowClass: "glow-danger",
      label: "High Risk",
    },
  }[level];

  const Icon = config.icon;

  return (
    <motion.div
      initial={animated ? { scale: 0 } : undefined}
      animate={animated ? { scale: 1 } : undefined}
      transition={{ duration: 0.5, type: "spring" }}
      className={cn("flex items-center gap-3 p-4 rounded-2xl", config.bgColor, config.glowClass)}
    >
      <div className={cn("p-3 rounded-full", config.bgColor)}>
        <Icon className={cn("w-6 h-6", config.color)} />
      </div>
      <div className="flex-1">
        <div className={cn("text-sm font-semibold", config.color)}>{config.label}</div>
        <div className="text-white/80 text-xs mt-0.5">Safety Score: {score}/100</div>
      </div>
    </motion.div>
  );
}
