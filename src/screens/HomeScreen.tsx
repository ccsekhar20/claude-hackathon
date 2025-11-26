import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RecentRoute {
  from: string;
  to: string;
  time: string;
  safety: number;
}

const recentRoutes: RecentRoute[] = [
  { from: 'Suzzallo Library', to: 'McMahon Hall', time: '8 min', safety: 92 },
  { from: 'Allen Library', to: 'The Ave', time: '12 min', safety: 87 },
];

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View>
          <Text style={styles.title}>SafeWalk AI</Text>
          <Text style={styles.subtitle}>Your night safety companion</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
        </TouchableOpacity>
      </Animated.View>

      <GlassCard style={styles.routeCard}>
        <View style={styles.inputContainer}>
          <View style={styles.iconCircle}>
            <View style={styles.greenDot} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Current location"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={from}
            onChangeText={setFrom}
          />
        </View>

        <View style={[styles.inputContainer, { marginTop: 16 }]}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
            <Ionicons name="location-outline" size={20} color={Colors.blueGradient[0]} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Where to?"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={to}
            onChangeText={setTo}
          />
        </View>

        <GlowButton
          onPress={() => navigation.navigate('Routes')}
          variant="primary"
          size="lg"
          style={styles.findButton}
        >
          Find Safe Routes
        </GlowButton>
      </GlassCard>

      <ScrollView style={styles.recentRoutes} showsVerticalScrollIndicator={false}>
        <View style={styles.recentHeader}>
          <Ionicons name="time-outline" size={16} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.recentTitle}>Recent Routes</Text>
        </View>

        {recentRoutes.map((route, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 100).duration(400)}
            style={styles.routeItem}
          >
            <View style={styles.routeInfo}>
              <View style={styles.routeText}>
                <Text style={styles.routeFrom}>{route.from}</Text>
                <Text style={styles.routeTo}>to {route.to}</Text>
              </View>
              <View style={styles.safetyBadge}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.safetyScore}>{route.safety}</Text>
              </View>
            </View>
            <View style={styles.routeMeta}>
              <Ionicons name="time-outline" size={12} color="rgba(255, 255, 255, 0.5)" />
              <Text style={styles.routeTime}>{route.time} walk</Text>
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeCard: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.safeGreen,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  findButton: {
    width: '100%',
    marginTop: 24,
  },
  recentRoutes: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  recentTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  routeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeText: {
    flex: 1,
  },
  routeFrom: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  routeTo: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  safetyScore: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  routeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeTime: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
  },
});

