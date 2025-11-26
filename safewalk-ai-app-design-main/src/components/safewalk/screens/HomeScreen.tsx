"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Star, Settings, User } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { GlowButton } from "../GlowButton";
import { useState } from "react";

interface HomeScreenProps {
  onStartRoute: () => void;
  onOpenSettings: () => void;
}

export function HomeScreen({ onStartRoute, onOpenSettings }: HomeScreenProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const recentRoutes = [
    { from: "Suzzallo Library", to: "McMahon Hall", time: "8 min", safety: 92 },
    { from: "Allen Library", to: "The Ave", time: "12 min", safety: 87 },
  ];

  return (
    <div className="flex flex-col h-full px-6 py-16 pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">SafeWalk AI</h1>
          <p className="text-white/60 text-sm">Your night safety companion</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full glass-surface flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-white/80" />
        </motion.button>
      </motion.div>

      {/* Route Input Card */}
      <GlassCard className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <input
              type="text"
              placeholder="Current location"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Where to?"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400/50 transition-colors"
            />
          </div>
        </div>

        <GlowButton
          onClick={onStartRoute}
          variant="primary"
          size="lg"
          className="w-full mt-6"
        >
          Find Safe Routes
        </GlowButton>
      </GlassCard>

      {/* Recent Routes */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-white/60" />
          <h3 className="text-white/80 text-sm font-semibold">Recent Routes</h3>
        </div>

        <div className="space-y-3">
          {recentRoutes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-surface rounded-2xl p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{route.from}</div>
                  <div className="text-white/60 text-xs mt-1">to {route.to}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-semibold">{route.safety}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <Clock className="w-3 h-3" />
                <span>{route.time} walk</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
