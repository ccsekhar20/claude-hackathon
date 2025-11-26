"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Users,
  Moon,
  ChevronRight,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { GlassCard } from "../GlassCard";

interface SettingsScreenProps {
  onBack: () => void;
}

const settingSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", value: "Emily Chen" },
      { icon: Bell, label: "Notifications", value: "Enabled" },
      { icon: Moon, label: "Dark Mode", value: "Always On" },
    ],
  },
  {
    title: "Safety & Privacy",
    items: [
      { icon: Shield, label: "Emergency Contacts", value: "2 contacts" },
      { icon: Users, label: "Trusted Companions", value: "5 people" },
      { icon: Shield, label: "Location Sharing", value: "When Walking" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQ", value: "" },
      { icon: Shield, label: "Safety Guidelines", value: "" },
    ],
  },
];

export function SettingsScreen({ onBack }: SettingsScreenProps) {
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
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-white/60 text-sm">Manage your preferences</p>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl">
              👩‍🎓
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">Emily Chen</h3>
              <p className="text-white/60 text-sm">University of Washington</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  47 Safe Walks
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Settings Sections */}
      <div className="flex-1 overflow-y-auto pb-6 space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
          >
            <h4 className="text-white/60 text-xs font-semibold uppercase mb-3 px-2">
              {section.title}
            </h4>
            <GlassCard className="divide-y divide-white/10">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white font-medium text-sm">{item.label}</div>
                      {item.value && (
                        <div className="text-white/50 text-xs mt-0.5">{item.value}</div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </motion.button>
                );
              })}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full glass-surface rounded-2xl py-4 flex items-center justify-center gap-2 text-red-400 font-medium"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </motion.button>
    </div>
  );
}
