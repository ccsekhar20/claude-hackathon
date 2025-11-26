import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ActiveWalkScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigation.navigate('Arrival'), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    const alertTimer = setTimeout(() => {
      setShowAlert(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(alertTimer);
    };
  }, []);

  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const companions = [
    { name: 'Mom', status: 'watching', avatar: '👩' },
    { name: 'Sarah', status: 'watching', avatar: '👱‍♀️' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(30, 58, 138, 0.2)', 'rgba(88, 28, 135, 0.2)', 'rgba(190, 24, 93, 0.2)']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.activeBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.activeText}>Active Walk</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <GlassCard glow="safe" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Animated.View style={[styles.navIcon, animatedStyle]}>
              <Ionicons name="navigate" size={24} color={Colors.safeGreen} />
            </Animated.View>
            <View style={styles.progressInfo}>
              <Text style={styles.routeName}>Campus Loop Route</Text>
              <Text style={styles.timeRemaining}>4 min remaining</Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0.4 mi walked</Text>
              <Text style={styles.progressLabel}>0.2 mi left</Text>
            </View>
          </View>
        </GlassCard>

        {showAlert && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.alertCard}>
            <GlassCard glow="caution">
              <View style={styles.alertContent}>
                <View style={styles.alertIcon}>
                  <Ionicons name="warning" size={20} color={Colors.cautionYellow} />
                </View>
                <View style={styles.alertText}>
                  <Text style={styles.alertTitle}>Low Light Area Ahead</Text>
                  <Text style={styles.alertDescription}>
                    Construction zone with reduced lighting. Stay alert and consider using phone flashlight.
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowAlert(false)}>
                  <Ionicons name="close" size={16} color="rgba(255, 255, 255, 0.4)" />
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        )}

        <GlassCard style={styles.companionsCard}>
          <View style={styles.companionsHeader}>
            <Ionicons name="people" size={16} color={Colors.purpleGradient[0]} />
            <Text style={styles.companionsTitle}>Live Companions</Text>
          </View>
          <View style={styles.companionsList}>
            {companions.map((companion, i) => (
              <View key={i} style={styles.companionItem}>
                <Text style={styles.companionAvatar}>{companion.avatar}</Text>
                <View style={styles.companionInfo}>
                  <Text style={styles.companionName}>{companion.name}</Text>
                  <View style={styles.watchingDot} />
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={24} color={Colors.dangerRed} />
            <Text style={styles.actionLabel}>Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color={Colors.blueGradient[0]} />
            <Text style={styles.actionLabel}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="flashlight" size={24} color={Colors.cautionYellow} />
            <Text style={styles.actionLabel}>Flashlight</Text>
          </TouchableOpacity>
        </View>

        <GlowButton
          onPress={() => navigation.navigate('Arrival')}
          variant="primary"
          size="lg"
          style={styles.endButton}
        >
          I Feel Safe - End Walk
        </GlowButton>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nightBg,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.safeGreen,
  },
  activeText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  navIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeRemaining: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.safeGreen,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  alertCard: {
    marginBottom: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.cautionYellow,
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  companionsCard: {
    marginBottom: 16,
  },
  companionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  companionsTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  companionsList: {
    flexDirection: 'row',
    gap: 12,
  },
  companionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  companionAvatar: {
    fontSize: 20,
  },
  companionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companionName: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  watchingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.safeGreen,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  endButton: {
    width: '100%',
    marginBottom: 32,
  },
});

