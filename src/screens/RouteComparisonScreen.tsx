import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { SafetyIndicator } from '../components/SafetyIndicator';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Route {
  id: number;
  name: string;
  safety: number;
  safetyLevel: 'safe' | 'caution' | 'danger';
  duration: string;
  distance: string;
  lighting: number;
  crowdDensity: number;
  highlights: string[];
}

const routes: Route[] = [
  {
    id: 1,
    name: 'Bagley Hall → The Standard',
    safety: 94,
    safetyLevel: 'safe',
    duration: '6 min',
    distance: '0.4 mi',
    lighting: 98,
    crowdDensity: 85,
    highlights: ['Well-lit pathways', 'Emergency stations nearby', 'High foot traffic', 'Shortest route'],
  },
  {
    id: 2,
    name: 'University Way',
    safety: 78,
    safetyLevel: 'caution',
    duration: '6 min',
    distance: '0.5 mi',
    lighting: 72,
    crowdDensity: 65,
    highlights: ['Direct route', 'Some dimly lit areas', 'Active businesses'],
  },
  {
    id: 3,
    name: 'Burke-Gilman Trail',
    safety: 65,
    safetyLevel: 'danger',
    duration: '10 min',
    distance: '0.7 mi',
    lighting: 45,
    crowdDensity: 30,
    highlights: ['Isolated sections', 'Poor lighting', 'Scenic but avoid at night'],
  },
];

export function RouteComparisonScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Route Options</Text>
          <Text style={styles.headerSubtitle}>Choose your safest path</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.routesList}>
        {routes.map((route, i) => (
          <Animated.View
            key={route.id}
            entering={FadeInRight.delay(i * 100).duration(400)}
            style={styles.routeCard}
          >
            <GlassCard glow={i === 0 ? 'safe' : 'none'} animate={false}>
              {i === 0 && (
                <View style={styles.recommendedBadge}>
                  <Ionicons name="shield-outline" size={16} color={Colors.safeGreen} />
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              )}

              <View style={styles.routeHeader}>
                <Text style={styles.routeName}>{route.name}</Text>
                <View style={styles.routeMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{route.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="walk-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{route.distance}</Text>
                  </View>
                </View>
              </View>

              <SafetyIndicator level={route.safetyLevel} score={route.safety} animated={false} />

              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Ionicons name="bulb-outline" size={16} color={Colors.cautionYellow} />
                    <Text style={styles.statLabel}>Lighting</Text>
                  </View>
                  <Text style={styles.statValue}>{route.lighting}%</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Ionicons name="people-outline" size={16} color={Colors.blueGradient[0]} />
                    <Text style={styles.statLabel}>Crowd</Text>
                  </View>
                  <Text style={styles.statValue}>{route.crowdDensity}%</Text>
                </View>
              </View>

              <View style={styles.highlights}>
                {route.highlights.map((highlight, j) => (
                  <View key={j} style={styles.highlightItem}>
                    <View style={styles.highlightDot} />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>

              {i === 0 && (
                <GlowButton
                  onPress={() => navigation.navigate('StartWalk')}
                  variant="primary"
                  size="md"
                  style={styles.startButton}
                >
                  Start Walking
                </GlowButton>
              )}
            </GlassCard>
          </Animated.View>
        ))}
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  routesList: {
    flex: 1,
  },
  routeCard: {
    marginBottom: 16,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recommendedText: {
    color: Colors.safeGreen,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  routeHeader: {
    marginBottom: 16,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  routeMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  highlights: {
    marginTop: 16,
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  highlightDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 6,
  },
  highlightText: {
    color: Colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  startButton: {
    width: '100%',
    marginTop: 16,
  },
});

