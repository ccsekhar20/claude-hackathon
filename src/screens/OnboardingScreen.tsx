import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const screens = [
  {
    icon: 'shield-outline' as const,
    title: 'Stay Safe at Night',
    description: 'AI-powered safety analysis of your walking routes with real-time hazard detection.',
    gradient: [Colors.safeGreen, '#14b8a6'],
  },
  {
    icon: 'location-outline' as const,
    title: 'Smart Route Planning',
    description: 'Compare multiple routes with detailed safety scores based on lighting, crime data, and crowd density.',
    gradient: [Colors.blueGradient[0], Colors.blueGradient[1]],
  },
  {
    icon: 'people-outline' as const,
    title: 'Virtual Companion',
    description: 'Share your live location with trusted contacts who can monitor your journey in real-time.',
    gradient: [Colors.purpleGradient[0], Colors.purpleGradient[1]],
  },
  {
    icon: 'notifications-outline' as const,
    title: 'Instant Alerts',
    description: 'Get notified about potential hazards, well-lit areas, and emergency services nearby.',
    gradient: [Colors.cautionYellow, Colors.dangerRed],
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [step, setStep] = useState(0);
  const screen = screens[step];
  const isLastStep = step === screens.length - 1;

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      navigation.replace('Home');
    }
  };

  const handleSkip = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          key={step}
          entering={FadeInRight.duration(400)}
          exiting={FadeOutLeft.duration(400)}
          style={styles.screenContent}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${screen.gradient[0]}20` }]}>
            <Ionicons name={screen.icon} size={64} color="#ffffff" />
          </View>

          <Text style={styles.title}>{screen.title}</Text>
          <Text style={styles.description}>{screen.description}</Text>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {screens.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive]}
            />
          ))}
        </View>

        <GlowButton onPress={handleNext} variant="primary" size="lg" style={styles.button}>
          {isLastStep ? 'Get Started' : 'Continue'}
        </GlowButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nightBg,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  footer: {
    paddingBottom: 40,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    width: 32,
    backgroundColor: Colors.safeGreen,
  },
  button: {
    width: '100%',
  },
});

