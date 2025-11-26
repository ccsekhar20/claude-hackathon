import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

interface GlowButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function GlowButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  disabled = false,
}: GlowButtonProps) {
  const [pressed, setPressed] = React.useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressed ? 0.98 : 1 }],
    };
  });

  const sizeStyles = {
    sm: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
    md: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 16 },
    lg: { paddingHorizontal: 32, paddingVertical: 16, fontSize: 18 },
  }[size];

  const buttonContent = (
    <Text style={[styles.text, { fontSize: sizeStyles.fontSize }]}>
      {children}
    </Text>
  );

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        style={[animatedStyle, style]}
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={Colors.emeraldGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            sizeStyles,
            disabled && styles.disabled,
            styles.glowSafe,
          ]}
        >
          {buttonContent}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  if (variant === 'danger') {
    return (
      <AnimatedTouchable
        style={[animatedStyle, style]}
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={Colors.redGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            sizeStyles,
            disabled && styles.disabled,
            styles.glowDanger,
          ]}
        >
          {buttonContent}
        </LinearGradient>
      </AnimatedTouchable>
    );
  }

  // Secondary variant
  return (
    <AnimatedTouchable
      style={[animatedStyle, style]}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.8}
    >
      <View style={[styles.button, styles.secondary, sizeStyles, disabled && styles.disabled]}>
        {buttonContent}
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  glowSafe: {
    shadowColor: '#34d399',
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

