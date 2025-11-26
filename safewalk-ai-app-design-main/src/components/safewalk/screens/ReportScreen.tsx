"use client";

import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Lightbulb, Users, MapPin, Camera } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { GlowButton } from "../GlowButton";
import { useState } from "react";

interface ReportScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

const issueTypes = [
  { id: "lighting", label: "Poor Lighting", icon: Lightbulb, color: "yellow" },
  { id: "crowd", label: "Suspicious Activity", icon: Users, color: "red" },
  { id: "hazard", label: "Physical Hazard", icon: AlertCircle, color: "orange" },
  { id: "other", label: "Other", icon: MapPin, color: "blue" },
];

export function ReportScreen({ onBack, onSubmit }: ReportScreenProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (selectedType && description) {
      onSubmit();
    }
  };

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
          <h2 className="text-xl font-bold text-white">Report Safety Issue</h2>
          <p className="text-white/60 text-sm">Help keep our community safe</p>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Issue Type Selection */}
        <div className="mb-6">
          <label className="text-white/80 text-sm font-semibold mb-3 block">
            What happened?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {issueTypes.map((type, i) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.id)}
                  className={`glass-surface rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
                    isSelected ? "ring-2 ring-emerald-400 bg-emerald-500/10" : ""
                  }`}
                >
                  <Icon className={`w-6 h-6 text-${type.color}-400`} />
                  <span className="text-white/80 text-xs font-medium text-center">
                    {type.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <GlassCard className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold text-sm">Location</h3>
          </div>
          <p className="text-white/70 text-sm">Near Campus Loop & Stevens Way</p>
          <button className="text-emerald-400 text-xs font-medium mt-2">
            Change location
          </button>
        </GlassCard>

        {/* Description */}
        <div className="mb-6">
          <label className="text-white/80 text-sm font-semibold mb-3 block">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide more details about the issue..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400/50 transition-colors resize-none"
          />
        </div>

        {/* Photo Upload */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full glass-surface rounded-2xl p-4 flex items-center justify-center gap-3 text-white/80 mb-6"
        >
          <Camera className="w-5 h-5" />
          <span className="font-medium">Add Photo (Optional)</span>
        </motion.button>

        {/* Anonymous Toggle */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium text-sm mb-1">Submit Anonymously</h4>
              <p className="text-white/60 text-xs">
                Your identity will not be shared
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked
              />
              <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-emerald-500 transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Submit Button */}
      <GlowButton
        onClick={handleSubmit}
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!selectedType}
      >
        Submit Report
      </GlowButton>
    </div>
  );
}
