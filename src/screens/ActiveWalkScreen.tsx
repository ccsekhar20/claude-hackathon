import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// import * as Location from 'expo-location'; // Not needed for demo mode
// import axios from 'axios'; // Not needed for demo mode
// import { io, Socket } from 'socket.io-client'; // Not needed for demo mode
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
// import { BACKEND_URL } from '../config/constants'; // Not needed for demo mode
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type ActiveWalkScreenRouteProp = RouteProp<RootStackParamList, 'ActiveWalk'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ActiveWalkScreen() {
  const route = useRoute<ActiveWalkScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const sessionId = route.params?.sessionId;
  const shareUrl = route.params?.shareUrl;

  // Location and session state
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [inactivityAlert, setInactivityAlert] = useState(false);
  const [isLocationTracking, setIsLocationTracking] = useState(false);

  // Refs for cleanup
  const locationWatchRef = useRef<any>(null); // DEMO: Simplified type
  const locationUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  /**
   * Initialize location tracking - DEMO MODE: Hardcoded, no backend required
   */
  useEffect(() => {
    if (!sessionId) {
      Alert.alert('Error', 'No session ID provided');
      navigation.goBack();
      return;
    }

    // DEMO: Start simulated location tracking (no backend needed)
    startLocationTracking();

    // Cleanup on unmount
    return () => {
      if (locationWatchRef.current) {
        locationWatchRef.current.remove();
      }
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
    };
  }, [sessionId]);

  /**
   * Start tracking user location - DEMO MODE: Simulated location updates
   */
  const startLocationTracking = async () => {
    // DEMO: Use hardcoded start location (Bagley Hall)
    const demoStartLocation = {
      lat: 47.6553,
      lng: -122.3035,
    };

    setCurrentLocation(demoStartLocation);
    setIsLocationTracking(true);
    
    // DEMO: Simulate ETA calculation
    const now = new Date();
    const etaTime = new Date(now.getTime() + 6 * 60000); // 6 minutes from now
    setEta(etaTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));

    // DEMO: Simulate location movement (gradually move towards destination)
    let currentLat = demoStartLocation.lat;
    let currentLng = demoStartLocation.lng;
    const endLat = 47.6600;
    const endLng = -122.3100;
    
    locationUpdateIntervalRef.current = setInterval(() => {
      // Simulate movement towards destination
      const latDiff = endLat - currentLat;
      const lngDiff = endLng - currentLng;
      
      // Move 1% closer each update
      currentLat += latDiff * 0.01;
      currentLng += lngDiff * 0.01;
      
      setCurrentLocation({ lat: currentLat, lng: currentLng });
      
      // Update progress
      const distanceTraveled = Math.sqrt(
        Math.pow(currentLat - demoStartLocation.lat, 2) + 
        Math.pow(currentLng - demoStartLocation.lng, 2)
      );
      const totalDistance = Math.sqrt(
        Math.pow(endLat - demoStartLocation.lat, 2) + 
        Math.pow(endLng - demoStartLocation.lng, 2)
      );
      const progressPercent = Math.min(100, (distanceTraveled / totalDistance) * 100);
      setProgress(progressPercent);
    }, 2000); // Update every 2 seconds for demo
  };

  // DEMO: Location updates are simulated, no backend call needed

  /**
   * Trigger panic/SOS - DEMO MODE: No backend call needed
   */
  const handlePanic = async () => {
    if (!sessionId) return;

    Alert.alert(
      'Trigger SOS?',
      'This will alert your companion and emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, SOS',
          style: 'destructive',
          onPress: () => {
            // DEMO: Just show alert, no backend call
            Alert.alert('SOS Triggered', 'Your emergency contacts have been notified.');
          },
        },
      ]
    );
  };

  /**
   * Mark arrival - DEMO MODE: No backend call needed
   */
  const handleArrive = async () => {
    if (!sessionId) return;

    // Stop location tracking
    if (locationWatchRef.current) {
      locationWatchRef.current.remove();
      locationWatchRef.current = null;
    }
    if (locationUpdateIntervalRef.current) {
      clearInterval(locationUpdateIntervalRef.current);
      locationUpdateIntervalRef.current = null;
    }

    // DEMO: Navigate directly to arrival screen, no backend call
    navigation.navigate('Arrival', { sessionId });
  };

  // Show loading state while initializing
  if (!sessionId) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.safeGreen} />
          <Text style={styles.loadingText}>Initializing walk...</Text>
        </View>
      </View>
    );
  }

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

        {/* Inactivity Alert Banner */}
        {inactivityAlert && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.inactivityBanner}>
            <GlassCard glow="caution">
              <View style={styles.alertContent}>
                <View style={styles.alertIcon}>
                  <Ionicons name="time-outline" size={20} color={Colors.cautionYellow} />
                </View>
                <View style={styles.alertText}>
                  <Text style={styles.alertTitle}>Inactivity Detected</Text>
                  <Text style={styles.alertDescription}>
                    You haven't updated your location recently. Your companions have been notified.
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setInactivityAlert(false)}>
                  <Ionicons name="close" size={16} color="rgba(255, 255, 255, 0.4)" />
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        )}

        <GlassCard glow="safe" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Animated.View style={[styles.navIcon, animatedStyle]}>
              <Ionicons name="navigate-outline" size={24} color={Colors.safeGreen} />
            </Animated.View>
            <View style={styles.progressInfo}>
              <Text style={styles.routeName}>Bagley Hall → The Standard</Text>
              {eta ? (
                <Text style={styles.timeRemaining}>ETA: {eta}</Text>
              ) : (
                <Text style={styles.timeRemaining}>Tracking location...</Text>
              )}
            </View>
          </View>

          {currentLocation && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Current Location</Text>
              <Text style={styles.locationText}>
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </Text>
            </View>
          )}

          {!isLocationTracking && (
            <View style={styles.trackingStatus}>
              <ActivityIndicator size="small" color={Colors.cautionYellow} />
              <Text style={styles.trackingText}>Starting location tracking...</Text>
            </View>
          )}
        </GlassCard>

        {showAlert && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.alertCard}>
            <GlassCard glow="caution">
              <View style={styles.alertContent}>
                <View style={styles.alertIcon}>
                  <Ionicons name="warning-outline" size={20} color={Colors.cautionYellow} />
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

        {shareUrl && (
          <GlassCard style={styles.shareCard}>
            <View style={styles.shareHeader}>
              <Ionicons name="people-outline" size={16} color={Colors.purpleGradient[0]} />
              <Text style={styles.shareTitle}>Share with Companion</Text>
            </View>
            <Text style={styles.shareUrl} numberOfLines={1}>
              {shareUrl}
            </Text>
            <Text style={styles.shareHint}>Share this link for real-time tracking</Text>
          </GlassCard>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePanic}>
            <Ionicons name="warning" size={24} color={Colors.dangerRed} />
            <Text style={styles.actionLabel}>SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color={Colors.blueGradient[0]} />
            <Text style={styles.actionLabel}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="flashlight-outline" size={24} color={Colors.cautionYellow} />
            <Text style={styles.actionLabel}>Flashlight</Text>
          </TouchableOpacity>
        </View>

        <GlowButton
          onPress={handleArrive}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
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
  locationInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: Colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  trackingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  trackingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  inactivityBanner: {
    marginBottom: 16,
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
  shareCard: {
    marginBottom: 16,
  },
  shareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  shareTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  shareUrl: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  shareHint: {
    fontSize: 12,
    color: Colors.textTertiary,
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
