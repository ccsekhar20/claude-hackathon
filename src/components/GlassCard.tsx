import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: 'safe' | 'caution' | 'danger' | 'none';
  animate?: boolean;
}

export function GlassCard({ children, style, glow = 'none', animate = true }: GlassCardProps) {
  const glowStyles = {
    safe: styles.glowSafe,
    caution: styles.glowCaution,
    danger: styles.glowDanger,
    none: {},
  }[glow];

  const content = (
    <BlurView intensity={20} tint="dark" style={[styles.card, glowStyles, style]}>
      {children}
    </BlurView>
  );

  if (animate) {
    return (
      <Animated.View entering={FadeInDown.duration(400)}>
        {content}
      </Animated.View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
  },
  glowSafe: {
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glowCaution: {
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  glowDanger: {
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});

