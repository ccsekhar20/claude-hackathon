"use client";

import { motion } from "framer-motion";
import { Shield, MapPin, Users, Bell } from "lucide-react";
import { GlowButton } from "../GlowButton";

interface OnboardingScreenProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

const screens = [
  {
    icon: Shield,
    title: "Stay Safe at Night",
    description: "AI-powered safety analysis of your walking routes with real-time hazard detection.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: MapPin,
    title: "Smart Route Planning",
    description: "Compare multiple routes with detailed safety scores based on lighting, crime data, and crowd density.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Users,
    title: "Virtual Companion",
    description: "Share your live location with trusted contacts who can monitor your journey in real-time.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Get notified about potential hazards, well-lit areas, and emergency services nearby.",
    gradient: "from-orange-500/20 to-red-500/20",
  },
];

export function OnboardingScreen({ step, onNext, onSkip }: OnboardingScreenProps) {
  const screen = screens[step];
  const Icon = screen.icon;
  const isLastStep = step === screens.length - 1;

  return (
    <div className="flex flex-col items-center justify-between h-full px-8 py-16 pt-20">
      <button
        onClick={onSkip}
        className="self-end text-white/60 text-sm font-medium mb-8"
      >
        Skip
      </button>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col items-center justify-center text-center"
      >
        <motion.div
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${screen.gradient} flex items-center justify-center mb-8 glow-safe`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className="w-16 h-16 text-white" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-4">{screen.title}</h2>
        <p className="text-white/70 text-lg leading-relaxed max-w-sm">
          {screen.description}
        </p>
      </motion.div>

      <div className="w-full space-y-4">
        <div className="flex justify-center gap-2 mb-6">
          {screens.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-emerald-400" : "w-2 bg-white/30"
              }`}
              animate={{ scale: i === step ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <GlowButton onClick={onNext} variant="primary" size="lg" className="w-full">
          {isLastStep ? "Get Started" : "Continue"}
        </GlowButton>
      </div>
    </div>
  );
}
