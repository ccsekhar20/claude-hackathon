"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation,
  AlertTriangle,
  Lightbulb,
  Phone,
  X,
  MessageSquare,
  Users,
  Shield,
} from "lucide-react";
import { GlassCard } from "../GlassCard";
import { GlowButton } from "../GlowButton";
import { useState, useEffect } from "react";

interface ActiveWalkScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function ActiveWalkScreen({ onComplete, onCancel }: ActiveWalkScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [companions, setCompanions] = useState([
    { name: "Mom", status: "watching", avatar: "👩" },
    { name: "Sarah", status: "watching", avatar: "👱‍♀️" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    // Show alert at 30% progress
    const alertTimer = setTimeout(() => {
      setShowAlert(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(alertTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative flex flex-col h-full">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-pink-900/20" />

      <div className="relative z-10 flex flex-col h-full px-6 py-16 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="glass-surface rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-sm font-semibold">Active Walk</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="w-10 h-10 rounded-full glass-surface flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
        </motion.div>

        {/* Progress Card */}
        <GlassCard className="mb-4" glow="safe">
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center"
            >
              <Navigation className="w-6 h-6 text-emerald-400" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">Campus Loop Route</h3>
              <p className="text-white/60 text-sm">4 min remaining</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-400"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>0.4 mi walked</span>
            <span>0.2 mi left</span>
          </div>
        </GlassCard>

        {/* Hazard Alerts */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="mb-4"
            >
              <GlassCard glow="caution" className="border-yellow-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-yellow-400 font-semibold text-sm mb-1">
                      Low Light Area Ahead
                    </h4>
                    <p className="text-white/70 text-xs">
                      Construction zone with reduced lighting. Stay alert and consider using
                      phone flashlight.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAlert(false)}
                    className="text-white/40 hover:text-white/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Companions Watching */}
        <GlassCard className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-purple-400" />
            <h4 className="text-white/80 font-semibold text-sm">Live Companions</h4>
          </div>
          <div className="flex items-center gap-3">
            {companions.map((companion, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 glass-surface rounded-full px-3 py-1.5"
              >
                <span className="text-xl">{companion.avatar}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-medium">{companion.name}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-surface rounded-2xl p-4 flex flex-col items-center gap-2"
          >
            <Phone className="w-6 h-6 text-red-400" />
            <span className="text-white/80 text-xs font-medium">Emergency</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-surface rounded-2xl p-4 flex flex-col items-center gap-2"
          >
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <span className="text-white/80 text-xs font-medium">Message</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-surface rounded-2xl p-4 flex flex-col items-center gap-2"
          >
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <span className="text-white/80 text-xs font-medium">Flashlight</span>
          </motion.button>
        </div>

        <GlowButton onClick={onComplete} variant="primary" size="lg" className="w-full">
          I Feel Safe - End Walk
        </GlowButton>
      </div>
    </div>
  );
}
