"use client";

import { useState } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { RouteComparisonScreen } from "./screens/RouteComparisonScreen";
import { ActiveWalkScreen } from "./screens/ActiveWalkScreen";
import { ArrivalScreen } from "./screens/ArrivalScreen";
import { ReportScreen } from "./screens/ReportScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { motion, AnimatePresence } from "framer-motion";

type Screen =
  | "onboarding"
  | "home"
  | "routes"
  | "walk"
  | "arrival"
  | "report"
  | "settings";

export function SafeWalkDemo() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleOnboardingNext = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setCurrentScreen("home");
    }
  };

  const handleOnboardingSkip = () => {
    setCurrentScreen("home");
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(1);

  const navigateTo = (screen: Screen, dir = 1) => {
    setDirection(dir);
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-white space-y-6 max-w-xl"
        >
          <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-semibold mb-4">
            🛡️ SafeWalk AI
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Walk Safer
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              At Night
            </span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed">
            AI-powered safety companion for University of Washington students. Real-time route
            analysis, hazard detection, and live companion tracking.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="glass-surface rounded-2xl p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-1">92%</div>
              <div className="text-white/60 text-sm">Avg Safety Score</div>
            </div>
            <div className="glass-surface rounded-2xl p-4">
              <div className="text-3xl font-bold text-blue-400 mb-1">15K+</div>
              <div className="text-white/60 text-sm">Safe Walks</div>
            </div>
            <div className="glass-surface rounded-2xl p-4">
              <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
              <div className="text-white/60 text-sm">Protection</div>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Real-time hazard detection & alerts</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AI-powered route safety scoring</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live location sharing with trusted contacts</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Emergency quick-access features</span>
            </div>
          </div>
        </motion.div>

        {/* Phone Demo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PhoneFrame>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentScreen}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {currentScreen === "onboarding" && (
                  <OnboardingScreen
                    step={onboardingStep}
                    onNext={handleOnboardingNext}
                    onSkip={handleOnboardingSkip}
                  />
                )}
                {currentScreen === "home" && (
                  <HomeScreen
                    onStartRoute={() => navigateTo("routes", 1)}
                    onOpenSettings={() => navigateTo("settings", 1)}
                  />
                )}
                {currentScreen === "routes" && (
                  <RouteComparisonScreen
                    onBack={() => navigateTo("home", -1)}
                    onSelectRoute={() => navigateTo("walk", 1)}
                  />
                )}
                {currentScreen === "walk" && (
                  <ActiveWalkScreen
                    onComplete={() => navigateTo("arrival", 1)}
                    onCancel={() => navigateTo("home", -1)}
                  />
                )}
                {currentScreen === "arrival" && (
                  <ArrivalScreen
                    onHome={() => navigateTo("home", -1)}
                    onReportIssue={() => navigateTo("report", 1)}
                  />
                )}
                {currentScreen === "report" && (
                  <ReportScreen
                    onBack={() => navigateTo("arrival", -1)}
                    onSubmit={() => navigateTo("home", -1)}
                  />
                )}
                {currentScreen === "settings" && (
                  <SettingsScreen onBack={() => navigateTo("home", -1)} />
                )}
              </motion.div>
            </AnimatePresence>
          </PhoneFrame>

          {/* Screen Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { id: "onboarding", label: "Welcome" },
              { id: "home", label: "Home" },
              { id: "routes", label: "Routes" },
              { id: "walk", label: "Live Walk" },
              { id: "arrival", label: "Arrival" },
              { id: "settings", label: "Settings" },
            ].map((screen) => (
              <motion.button
                key={screen.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (screen.id === "onboarding") setOnboardingStep(0);
                  navigateTo(screen.id as Screen, 1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  currentScreen === screen.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {screen.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
