import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type CompanionScreenRouteProp = RouteProp<RootStackParamList, 'Companion'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BACKEND_URL = 'http://localhost:5000';

interface SessionData {
  userName: string;
  status: string;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  lastLocation: { lat: number; lng: number } | null;
  eta: string | null;
}

export function CompanionScreen() {
  const route = useRoute<CompanionScreenRouteProp>();
  const shareToken = route.params?.shareToken || '';

  // Session state
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time state
  const [lastLocation, setLastLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [inactivityAlert, setInactivityAlert] = useState(false);
  const [panicTriggered, setPanicTriggered] = useState(false);
  const [arrived, setArrived] = useState(false);

  // Socket ref for cleanup
  const socketRef = useRef<Socket | null>(null);

  /**
   * Fetch initial session data from GET /api/sessions/share/<shareToken>
   */
  useEffect(() => {
    if (!shareToken) {
      setError('No share token provided');
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/sessions/share/${shareToken}`);
        const data: SessionData = response.data;
        setSessionData(data);
        setLastLocation(data.lastLocation);
        setEta(data.eta);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching session:', error);
        setError(error.response?.data?.error || 'Failed to load session');
        setLoading(false);
      }
    };

    fetchSession();
  }, [shareToken]);

  /**
   * Connect to Socket.IO and listen for real-time events
   */
  useEffect(() => {
    if (!shareToken || loading) return;

    // Connect to Socket.IO server
    const socket = io(BACKEND_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected (companion)');
      // Join the session room using share token
      socket.emit('join_session_by_token', { shareToken });
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected (companion)');
    });

    /**
     * Listen for location_update events
     * Updates the lastLocation and ETA when user moves
     */
    socket.on('location_update', (data: { lat: number; lng: number; timestamp: string; eta: string }) => {
      console.log('Location update received:', data);
      setLastLocation({ lat: data.lat, lng: data.lng });
      setEta(data.eta);
      setInactivityAlert(false); // Clear inactivity alert on new location
    });

    /**
     * Listen for inactivity_alert events
     * Shows alert when user hasn't updated location for 3+ minutes
     */
    socket.on('inactivity_alert', (data: { message: string; lastLocation: { lat: number; lng: number } | null }) => {
      console.log('Inactivity alert received:', data);
      setInactivityAlert(true);
      Alert.alert('Inactivity Alert', data.message);
    });

    /**
     * Listen for panic events
     * Shows SOS alert when user triggers panic button
     */
    socket.on('panic', (data: { message: string; lastLocation: { lat: number; lng: number } | null }) => {
      console.log('Panic event received:', data);
      setPanicTriggered(true);
      Alert.alert(
        '🚨 SOS TRIGGERED',
        `${data.message}\n\nLast known location: ${data.lastLocation ? `${data.lastLocation.lat.toFixed(6)}, ${data.lastLocation.lng.toFixed(6)}` : 'Unknown'}`,
        [{ text: 'OK' }]
      );
    });

    /**
     * Listen for arrived events
     * Shows success message when user arrives safely
     */
    socket.on('arrived', (data: { arrivedAt: string }) => {
      console.log('Arrived event received:', data);
      setArrived(true);
      Alert.alert('✅ Arrived Safely', `${sessionData?.userName || 'User'} has arrived safely at their destination.`);
    });

    socketRef.current = socket;

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [shareToken, loading, sessionData?.userName]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.safeGreen} />
          <Text style={styles.loadingText}>Loading session...</Text>
        </View>
      </View>
    );
  }

  if (error || !sessionData) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle" size={48} color={Colors.dangerRed} />
          <Text style={styles.errorText}>{error || 'Session not found'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Companion View</Text>
          <Text style={styles.subtitle}>Tracking {sessionData.userName}'s walk</Text>
        </View>

        {/* Panic Banner */}
        {panicTriggered && (
          <View style={styles.panicBanner}>
            <Ionicons name="warning" size={24} color="#fff" />
            <Text style={styles.panicText}>SOS TRIGGERED</Text>
            <Text style={styles.panicSubtext}>User needs immediate assistance</Text>
          </View>
        )}

        {/* Arrived Banner */}
        {arrived && (
          <View style={styles.arrivedBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.arrivedText}>Arrived Safely</Text>
            <Text style={styles.arrivedSubtext}>User has reached their destination</Text>
          </View>
        )}

        {/* Inactivity Alert Banner */}
        {inactivityAlert && !panicTriggered && !arrived && (
          <View style={styles.inactivityBanner}>
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.inactivityText}>User has been inactive for a while</Text>
          </View>
        )}

        <GlassCard style={styles.card} glow={panicTriggered ? 'danger' : arrived ? 'safe' : 'none'}>
          <View style={styles.statusRow}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sessionData.status) }]}>
              <Text style={styles.statusText}>{sessionData.status.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>User</Text>
            <Text style={styles.value}>{sessionData.userName}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Start Location</Text>
            <Text style={styles.locationText}>
              {sessionData.startLocation.lat.toFixed(6)}, {sessionData.startLocation.lng.toFixed(6)}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>End Location</Text>
            <Text style={styles.locationText}>
              {sessionData.endLocation.lat.toFixed(6)}, {sessionData.endLocation.lng.toFixed(6)}
            </Text>
          </View>

          {lastLocation && (
            <View style={styles.section}>
              <Text style={styles.label}>Last Known Location</Text>
              <Text style={styles.locationText}>
                {lastLocation.lat.toFixed(6)}, {lastLocation.lng.toFixed(6)}
              </Text>
            </View>
          )}

          {eta && (
            <View style={styles.section}>
              <Text style={styles.label}>Estimated Arrival</Text>
              <Text style={styles.value}>{eta}</Text>
            </View>
          )}
        </GlassCard>
      </ScrollView>
    </View>
  );
}

/**
 * Get color for status badge
 */
function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return Colors.safeGreen;
    case 'arrived':
      return Colors.safeGreen;
    case 'panic':
      return Colors.dangerRed;
    case 'cancelled':
      return Colors.textTertiary;
    default:
      return Colors.textTertiary;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nightBg,
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  errorText: {
    color: Colors.dangerRed,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  panicBanner: {
    backgroundColor: Colors.dangerRed,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  panicText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  panicSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  arrivedBanner: {
    backgroundColor: Colors.safeGreen,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  arrivedText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  arrivedSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  inactivityBanner: {
    backgroundColor: Colors.cautionYellow,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inactivityText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  card: {
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: Colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
});

