import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { BACKEND_URL } from '../config/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CompanionRouteProp = RouteProp<RootStackParamList, 'Companion'>;

interface SessionData {
  userName: string;
  startLocation: string | { lat: number; lng: number };
  endLocation: string | { lat: number; lng: number };
  startedAt: string;
  status: string;
}

interface LocationUpdate {
  lat: number;
  lng: number;
  timestamp: string;
  eta: string;
}

interface InactivityAlert {
  message: string;
  lastLocation: {
    lat: number;
    lng: number;
  };
}

interface PanicAlert {
  message: string;
  lastLocation: {
    lat: number;
    lng: number;
  };
}

interface ArrivalInfo {
  message: string;
  arrivedAt: string;
}

export function CompanionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CompanionRouteProp>();
  const shareToken = route.params?.shareToken;

  // Session state
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live tracking state
  const [lastLocation, setLastLocation] = useState<LocationUpdate | null>(null);
  const [inactivityAlert, setInactivityAlert] = useState<InactivityAlert | null>(null);
  const [panicAlert, setPanicAlert] = useState<PanicAlert | null>(null);
  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Socket reference
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!shareToken) {
      setError('No share token provided');
      setLoading(false);
      return;
    }

    // Fetch initial session data
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/sessions/share/${shareToken}`);
        setSessionData(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching session data:', err);
        setError(err.response?.data?.message || 'Failed to load session');
        setLoading(false);
      }
    };

    fetchSessionData();

    // Initialize Socket.IO connection
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      
      // Join the session room
      newSocket.emit('join_session_by_token', { shareToken });
      console.log('Joined session with token:', shareToken);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Location updates
    newSocket.on('location_update', (data: LocationUpdate) => {
      console.log('Location update received:', data);
      setLastLocation(data);
    });

    // Inactivity alerts
    newSocket.on('inactivity_alert', (data: InactivityAlert) => {
      console.log('Inactivity alert received:', data);
      setInactivityAlert(data);
      Alert.alert(
        '⚠️ Inactivity Alert',
        data.message,
        [{ text: 'OK', onPress: () => setInactivityAlert(null) }]
      );
    });

    // Panic alerts
    newSocket.on('panic', (data: PanicAlert) => {
      console.log('Panic alert received:', data);
      setPanicAlert(data);
      Alert.alert(
        '🚨 PANIC ALERT',
        data.message,
        [
          { text: 'Call Emergency', style: 'destructive' },
          { text: 'OK', onPress: () => setPanicAlert(null) }
        ]
      );
    });

    // Arrival notifications
    newSocket.on('arrival_notification', (data: ArrivalInfo) => {
      console.log('Arrival notification received:', data);
      setArrivalInfo(data);
      Alert.alert(
        '✅ SafeWalk AI',
        data.message,
        [{ text: 'Great!', onPress: () => {} }]
      );
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      console.log('Cleaning up socket connection');
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.off('location_update');
      newSocket.off('inactivity_alert');
      newSocket.off('panic');
      newSocket.off('arrival_notification');
      newSocket.disconnect();
    };
  }, [shareToken]);

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(30, 58, 138, 0.2)', 'rgba(88, 28, 135, 0.2)', 'rgba(190, 24, 93, 0.2)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centerContent}>
          <Animated.View entering={FadeIn.duration(500)}>
            <Text style={styles.loadingText}>Loading session...</Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  if (error || !sessionData) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(30, 58, 138, 0.2)', 'rgba(88, 28, 135, 0.2)', 'rgba(190, 24, 93, 0.2)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.dangerRed} />
          <Text style={styles.errorText}>{error || 'Session not found'}</Text>
          <GlowButton
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="md"
            style={styles.errorButton}
          >
            Go Back
          </GlowButton>
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
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Live Companion</Text>
            <View style={styles.connectionStatus}>
              <View style={[styles.statusDot, isConnected && styles.statusConnected]} />
              <Text style={styles.statusText}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Walker Info */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <GlassCard glow={arrivalInfo ? 'safe' : 'none'}>
            <View style={styles.walkerHeader}>
              <LinearGradient
                colors={Colors.purpleGradient}
                style={styles.walkerAvatar}
              >
                <Ionicons name="person" size={32} color="#ffffff" />
              </LinearGradient>
              <View style={styles.walkerInfo}>
                <Text style={styles.walkerLabel}>Walking with:</Text>
                <Text style={styles.walkerName}>{sessionData.userName}</Text>
              </View>
            </View>
            <View style={styles.routeInfo}>
              <View style={styles.routeItem}>
                <Ionicons name="location-outline" size={16} color={Colors.safeGreen} />
                <Text style={styles.routeText} numberOfLines={1}>
                  From: {typeof sessionData.startLocation === 'string' 
                    ? sessionData.startLocation 
                    : 'Bagley Hall, University of Washington'}
                </Text>
              </View>
              <View style={styles.routeItem}>
                <Ionicons name="flag-outline" size={16} color={Colors.blueGradient[0]} />
                <Text style={styles.routeText} numberOfLines={1}>
                  To: {typeof sessionData.endLocation === 'string' 
                    ? sessionData.endLocation 
                    : 'The Standard at Seattle'}
                </Text>
              </View>
              <View style={styles.routeItem}>
                <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.routeText}>
                  Started: {new Date(sessionData.startedAt).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Arrival Banner */}
        {arrivalInfo && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.arrivalBanner}>
            <GlassCard glow="safe">
              <View style={styles.alertContent}>
                <View style={styles.arrivalIcon}>
                  <Ionicons name="checkmark-circle" size={32} color={Colors.safeGreen} />
                </View>
                <View style={styles.alertTextContainer}>
                  <Text style={[styles.alertTitle, { color: Colors.safeGreen }]}>
                    Arrived Safely!
                  </Text>
                  <Text style={styles.alertMessage}>{arrivalInfo.message}</Text>
                  <Text style={styles.alertTimestamp}>
                    Arrived at: {new Date(arrivalInfo.arrivedAt).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Panic Alert Banner */}
        {panicAlert && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.alertBanner}>
            <GlassCard glow="danger">
              <View style={styles.alertContent}>
                <View style={styles.panicIcon}>
                  <Ionicons name="warning" size={32} color={Colors.dangerRed} />
                </View>
                <View style={styles.alertTextContainer}>
                  <Text style={[styles.alertTitle, { color: Colors.dangerRed }]}>
                    🚨 PANIC ALERT
                  </Text>
                  <Text style={styles.alertMessage}>{panicAlert.message}</Text>
                  <Text style={styles.alertLocation}>
                    Location: {panicAlert.lastLocation.lat.toFixed(6)}, {panicAlert.lastLocation.lng.toFixed(6)}
                  </Text>
                </View>
              </View>
              <GlowButton
                onPress={() => {/* Call emergency services */}}
                variant="danger"
                size="md"
                style={styles.emergencyButton}
              >
                <Ionicons name="call" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                Call Emergency
              </GlowButton>
            </GlassCard>
          </Animated.View>
        )}

        {/* Inactivity Alert Banner */}
        {inactivityAlert && !panicAlert && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.alertBanner}>
            <GlassCard glow="caution">
              <View style={styles.alertContent}>
                <View style={styles.cautionIcon}>
                  <Ionicons name="alert-circle" size={32} color={Colors.cautionYellow} />
                </View>
                <View style={styles.alertTextContainer}>
                  <Text style={[styles.alertTitle, { color: Colors.cautionYellow }]}>
                    ⚠️ Inactivity Alert
                  </Text>
                  <Text style={styles.alertMessage}>{inactivityAlert.message}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setInactivityAlert(null)}
                  style={styles.dismissButton}
                >
                  <Ionicons name="close" size={20} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Live Location */}
        {lastLocation && !arrivalInfo && (
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <GlassCard>
              <View style={styles.sectionHeader}>
                <Ionicons name="navigate-circle-outline" size={20} color={Colors.blueGradient[0]} />
                <Text style={styles.sectionTitle}>Live Location</Text>
              </View>
              <View style={styles.locationGrid}>
                <View style={styles.locationItem}>
                  <Text style={styles.locationLabel}>Latitude</Text>
                  <Text style={styles.locationValue}>{lastLocation.lat.toFixed(6)}</Text>
                </View>
                <View style={styles.locationItem}>
                  <Text style={styles.locationLabel}>Longitude</Text>
                  <Text style={styles.locationValue}>{lastLocation.lng.toFixed(6)}</Text>
                </View>
              </View>
              <View style={styles.etaContainer}>
                <Ionicons name="time-outline" size={18} color={Colors.safeGreen} />
                <Text style={styles.etaText}>ETA: {lastLocation.eta}</Text>
              </View>
              <Text style={styles.lastUpdate}>
                Last updated: {new Date(lastLocation.timestamp).toLocaleTimeString()}
              </Text>
            </GlassCard>
          </Animated.View>
        )}

        {/* Quick Actions */}
        {!arrivalInfo && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call-outline" size={24} color={Colors.safeGreen} />
              <Text style={styles.actionLabel}>Call Walker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color={Colors.blueGradient[0]} />
              <Text style={styles.actionLabel}>Send Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="alert-circle-outline" size={24} color={Colors.dangerRed} />
              <Text style={styles.actionLabel}>Emergency</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Session Info */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <GlassCard>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.purpleGradient[0]} />
              <Text style={styles.sectionTitle}>Session Info</Text>
            </View>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Status</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusIndicator} />
                  <Text style={styles.infoValue}>{sessionData.status}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Share Token</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{shareToken}</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Back to Home Button */}
        {arrivalInfo && (
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <GlowButton
              onPress={() => navigation.navigate('Home')}
              variant="primary"
              size="lg"
              style={styles.homeButton}
            >
              <Ionicons name="home-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              Back to Home
            </GlowButton>
          </Animated.View>
        )}
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusConnected: {
    backgroundColor: Colors.safeGreen,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 150,
  },
  walkerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  walkerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walkerInfo: {
    flex: 1,
  },
  walkerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  walkerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  routeInfo: {
    gap: 12,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  arrivalBanner: {
    marginTop: 16,
    marginBottom: 16,
  },
  alertBanner: {
    marginTop: 16,
    marginBottom: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  arrivalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cautionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  alertTimestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  alertLocation: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontFamily: 'monospace',
  },
  dismissButton: {
    padding: 4,
  },
  emergencyButton: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  locationGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  locationItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.safeGreen,
  },
  lastUpdate: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
    textAlign: 'center',
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.safeGreen,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  homeButton: {
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
