import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

interface SafetyIndicatorProps {
  level: 'safe' | 'caution' | 'danger';
  score: number;
  animated?: boolean;
}

export function SafetyIndicator({ level, score, animated = true }: SafetyIndicatorProps) {
  const config = {
    safe: {
      icon: 'shield-outline' as const,
      color: Colors.safeGreen,
      bgColor: 'rgba(52, 211, 153, 0.2)',
      label: 'Safe Route',
    },
    caution: {
      icon: 'warning-outline' as const,
      color: Colors.cautionYellow,
      bgColor: 'rgba(251, 191, 36, 0.2)',
      label: 'Exercise Caution',
    },
    danger: {
      icon: 'alert-circle-outline' as const,
      color: Colors.dangerRed,
      bgColor: 'rgba(239, 68, 68, 0.2)',
      label: 'High Risk',
    },
  }[level];

  const content = (
    <View style={[styles.container, { backgroundColor: config.bgColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
        <Ionicons name={config.icon} size={24} color={config.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
        <Text style={styles.score}>Safety Score: {score}/100</Text>
      </View>
    </View>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.duration(500)}>
        {content}
      </Animated.View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  score: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
});

