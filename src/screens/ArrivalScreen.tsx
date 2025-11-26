import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ArrivalScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.successContainer}
      >
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.successIcon}
        >
          <LinearGradient
            colors={Colors.emeraldGradient}
            style={styles.iconGradient}
          >
            <Ionicons name="checkmark-circle" size={64} color="#ffffff" />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.textContainer}>
          <Text style={styles.title}>You Arrived Safely!</Text>
          <Text style={styles.subtitle}>
            Your companions have been notified of your safe arrival.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(400)} style={styles.statsCard}>
          <GlassCard>
            <Text style={styles.statsTitle}>Walk Summary</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Colors.safeGreen }]}>8:24</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
              <View style={[styles.statItem, styles.statDivider]}>
                <Text style={[styles.statValue, { color: Colors.blueGradient[0] }]}>0.6</Text>
                <Text style={styles.statLabel}>Miles</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: Colors.cautionYellow }]}>92</Text>
                <Text style={styles.statLabel}>Safety</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(900).duration(400)} style={styles.actions}>
          <GlowButton
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            size="lg"
            style={styles.homeButton}
          >
            <Ionicons name="home" size={20} color="#ffffff" style={{ marginRight: 8 }} />
            Back to Home
          </GlowButton>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Report')}
              style={styles.actionButton}
            >
              <Ionicons name="flag-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.actionText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1100).duration(400)} style={styles.funStat}>
          <Text style={styles.funStatText}>
            🎉 You've completed{' '}
            <Text style={styles.funStatHighlight}>47 safe walks</Text> with SafeWalk AI
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nightBg,
    paddingTop: 60,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsCard: {
    width: '100%',
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actions: {
    width: '100%',
    marginBottom: 32,
  },
  homeButton: {
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  funStat: {
    marginTop: 16,
  },
  funStatText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  funStatHighlight: {
    color: Colors.safeGreen,
    fontWeight: '600',
  },
});

