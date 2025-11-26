"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Footprints, Lightbulb, Users, Shield } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { SafetyIndicator } from "../SafetyIndicator";
import { GlowButton } from "../GlowButton";

interface RouteComparisonScreenProps {
  onBack: () => void;
  onSelectRoute: () => void;
}

interface Route {
  id: number;
  name: string;
  safety: number;
  safetyLevel: "safe" | "caution" | "danger";
  duration: string;
  distance: string;
  lighting: number;
  crowdDensity: number;
  highlights: string[];
}

const routes: Route[] = [
  {
    id: 1,
    name: "Campus Loop Route",
    safety: 92,
    safetyLevel: "safe",
    duration: "8 min",
    distance: "0.6 mi",
    lighting: 95,
    crowdDensity: 78,
    highlights: ["Well-lit pathways", "Emergency stations nearby", "High foot traffic"],
  },
  {
    id: 2,
    name: "University Way",
    safety: 78,
    safetyLevel: "caution",
    duration: "6 min",
    distance: "0.5 mi",
    lighting: 72,
    crowdDensity: 65,
    highlights: ["Direct route", "Some dimly lit areas", "Active businesses"],
  },
  {
    id: 3,
    name: "Burke-Gilman Trail",
    safety: 65,
    safetyLevel: "danger",
    duration: "10 min",
    distance: "0.7 mi",
    lighting: 45,
    crowdDensity: 30,
    highlights: ["Isolated sections", "Poor lighting", "Scenic but avoid at night"],
  },
];

export function RouteComparisonScreen({ onBack, onSelectRoute }: RouteComparisonScreenProps) {
  return (
    <div className="flex flex-col h-full px-6 py-16 pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 rounded-full glass-surface flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </motion.button>
        <div>
          <h2 className="text-xl font-bold text-white">Route Options</h2>
          <p className="text-white/60 text-sm">Choose your safest path</p>
        </div>
      </motion.div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-6">
        {routes.map((route, i) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard
              glow={i === 0 ? "safe" : "none"}
              animate={false}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              {i === 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold uppercase">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-white font-semibold text-lg mb-2">{route.name}</h3>
                <div className="flex items-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Footprints className="w-4 h-4" />
                    <span>{route.distance}</span>
                  </div>
                </div>
              </div>

              <SafetyIndicator
                level={route.safetyLevel}
                score={route.safety}
                animated={false}
              />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="glass-surface rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/60 text-xs">Lighting</span>
                  </div>
                  <div className="text-white font-semibold">{route.lighting}%</div>
                </div>
                <div className="glass-surface rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-xs">Crowd</span>
                  </div>
                  <div className="text-white font-semibold">{route.crowdDensity}%</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-4 space-y-2">
                {route.highlights.map((highlight, j) => (
                  <div key={j} className="flex items-start gap-2 text-white/70 text-xs">
                    <div className="w-1 h-1 rounded-full bg-white/50 mt-1.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {i === 0 && (
                <GlowButton
                  onClick={onSelectRoute}
                  variant="primary"
                  size="md"
                  className="w-full mt-4"
                >
                  Start Walking
                </GlowButton>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
