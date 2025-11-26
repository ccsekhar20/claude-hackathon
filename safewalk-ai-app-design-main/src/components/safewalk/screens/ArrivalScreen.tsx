"use client";

import { motion } from "framer-motion";
import { CheckCircle, Share2, Flag, Home } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { GlowButton } from "../GlowButton";

interface ArrivalScreenProps {
  onHome: () => void;
  onReportIssue: () => void;
}

export function ArrivalScreen({ onHome, onReportIssue }: ArrivalScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-16">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
        className="relative mb-8"
      >
        <motion.div
          className="absolute inset-0 bg-emerald-400/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center glow-safe">
          <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-3">You Arrived Safely!</h2>
        <p className="text-white/70 text-lg">
          Your companions have been notified of your safe arrival.
        </p>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full mb-6"
      >
        <GlassCard>
          <h3 className="text-white font-semibold mb-4 text-center">Walk Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">8:24</div>
              <div className="text-white/60 text-xs">Duration</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-2xl font-bold text-blue-400 mb-1">0.6</div>
              <div className="text-white/60 text-xs">Miles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">92</div>
              <div className="text-white/60 text-xs">Safety</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full space-y-3"
      >
        <GlowButton onClick={onHome} variant="primary" size="lg" className="w-full">
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </GlowButton>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-surface rounded-2xl px-4 py-3 flex items-center justify-center gap-2 text-white/80 text-sm font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReportIssue}
            className="glass-surface rounded-2xl px-4 py-3 flex items-center justify-center gap-2 text-white/80 text-sm font-medium"
          >
            <Flag className="w-4 h-4" />
            Report Issue
          </motion.button>
        </div>
      </motion.div>

      {/* Fun Stat */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 text-center"
      >
        <p className="text-white/50 text-sm">
          🎉 You've completed <span className="text-emerald-400 font-semibold">47 safe walks</span> with SafeWalk AI
        </p>
      </motion.div>
    </div>
  );
}
