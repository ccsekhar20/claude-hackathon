import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BACKEND_URL = 'http://localhost:5000';

export function StartWalkScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  // Form state
  const [userName, setUserName] = useState('');
  const [startLocation, setStartLocation] = useState('47.655, -122.308');
  const [endLocation, setEndLocation] = useState('47.658, -122.313');
  const [liveCompanionEnabled, setLiveCompanionEnabled] = useState(true);
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  
  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  
  // Location tracking state
  const [currentLat, setCurrentLat] = useState(47.655);
  const [currentLng, setCurrentLng] = useState(-122.308);
  
  // Refs for cleanup
  const socketRef = useRef<Socket | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  /**
   * Start a new walk session
   * Sends POST /api/sessions to create a session and connects via Socket.IO
   */
  const handleStartWalk = async () => {
    if (!userName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (autoNotifyEnabled && !contactPhone.trim()) {
      Alert.alert('Error', 'Please enter a contact phone number for Auto-Notify');
      return;
    }

    try {
      // Parse hardcoded coordinates (for now)
      const [startLat, startLng] = startLocation.split(',').map(s => parseFloat(s.trim()));
      const [endLat, endLng] = endLocation.split(',').map(s => parseFloat(s.trim()));

      // Create session via POST /api/sessions
      const response = await axios.post(`${BACKEND_URL}/api/sessions`, {
        userName: userName.trim(),
        startLocation: { lat: startLat, lng: startLng },
        endLocation: { lat: endLat, lng: endLng },
        autoNotify: {
          enabled: autoNotifyEnabled,
          contactName: 'Friend',
          contactChannel: 'sms',
          contactValue: contactPhone.trim(),
        },
        liveCompanionEnabled,
      });

      const { sessionId: newSessionId, shareUrl: newShareUrl } = response.data;
      setSessionId(newSessionId);
      setShareUrl(newShareUrl);
      setIsWalking(true);
      setCurrentLat(startLat);
      setCurrentLng(startLng);

      // Connect to Socket.IO server
      const socket = io(BACKEND_URL, {
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log('Socket.IO connected');
        // Join the session room
        socket.emit('join_session', { sessionId: newSessionId });
      });

      socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
      });

      socketRef.current = socket;

      // Start fake location updater - simulate user moving every 5 seconds
      let lat = startLat;
      let lng = startLng;
      
      locationIntervalRef.current = setInterval(() => {
        // Simulate movement by slightly adjusting coordinates
        lat = lat + (Math.random() - 0.5) * 0.001;
        lng = lng + (Math.random() - 0.5) * 0.001;
        
        // Update state for display
        setCurrentLat(lat);
        setCurrentLng(lng);
        
        // Send location update to backend with latest values
        updateLocation(newSessionId, lat, lng);
      }, 5000);

      // Send initial location
      updateLocation(newSessionId, startLat, startLng);
    } catch (error: any) {
      console.error('Error starting walk:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to start walk session');
    }
  };

  /**
   * Update location by sending POST /api/sessions/:id/location
   */
  const updateLocation = async (id: string, lat: number, lng: number) => {
    try {
      await axios.post(`${BACKEND_URL}/api/sessions/${id}/location`, {
        lat,
        lng,
      });
    } catch (error: any) {
      console.error('Error updating location:', error);
    }
  };

  /**
   * Trigger panic/SOS by sending POST /api/sessions/:id/panic
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
          onPress: async () => {
            try {
              await axios.post(`${BACKEND_URL}/api/sessions/${sessionId}/panic`);
              Alert.alert('SOS Triggered', 'Your emergency contacts have been notified.');
            } catch (error: any) {
              console.error('Error triggering panic:', error);
              Alert.alert('Error', 'Failed to trigger SOS');
            }
          },
        },
      ]
    );
  };

  /**
   * Mark arrival by sending POST /api/sessions/:id/arrive
   */
  const handleArrive = async () => {
    if (!sessionId) return;

    try {
      await axios.post(`${BACKEND_URL}/api/sessions/${sessionId}/arrive`);
      
      // Cleanup
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      Alert.alert('Arrived Safely!', 'Your arrival has been logged and notifications sent.');
      setIsWalking(false);
    } catch (error: any) {
      console.error('Error marking arrival:', error);
      Alert.alert('Error', 'Failed to mark arrival');
    }
  };

  /**
   * Copy share URL to clipboard
   */
  const handleCopyShareUrl = async () => {
    if (shareUrl) {
      await Clipboard.setStringAsync(shareUrl);
      Alert.alert('Copied!', 'Share URL copied to clipboard');
    }
  };

  // If walk is active, show active walk UI
  if (isWalking && sessionId) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>SafeWalk Active</Text>
            <Text style={styles.subtitle}>Your walk is being tracked</Text>
          </View>

          <GlassCard style={styles.card}>
            <Text style={styles.label}>Session ID</Text>
            <Text style={styles.sessionId}>{sessionId}</Text>

            <Text style={[styles.label, { marginTop: 24 }]}>Share URL</Text>
            <TouchableOpacity onPress={handleCopyShareUrl} style={styles.shareUrlContainer}>
              <Text style={styles.shareUrl} numberOfLines={1}>
                {shareUrl}
              </Text>
              <Ionicons name="copy-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.hint}>Tap to copy and share with your companion</Text>

            <View style={styles.locationInfo}>
              <Text style={styles.label}>Current Location</Text>
              <Text style={styles.locationText}>
                {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
              </Text>
            </View>
          </GlassCard>

          <View style={styles.buttonContainer}>
            <GlowButton
              variant="danger"
              size="lg"
              onPress={handlePanic}
              style={styles.panicButton}
            >
              <Ionicons name="warning" size={20} color="#fff" style={{ marginRight: 8 }} />
              Panic / SOS
            </GlowButton>

            <GlowButton
              variant="primary"
              size="lg"
              onPress={handleArrive}
              style={styles.arriveButton}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              I Arrived Safely
            </GlowButton>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Show form to start a walk
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Start SafeWalk</Text>
          <Text style={styles.subtitle}>Set up your walk session</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={Colors.textTertiary}
            value={userName}
            onChangeText={setUserName}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Start Location (lat, lng)</Text>
          <TextInput
            style={styles.input}
            placeholder="47.655, -122.308"
            placeholderTextColor={Colors.textTertiary}
            value={startLocation}
            onChangeText={setStartLocation}
            editable={false}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>End Location (lat, lng)</Text>
          <TextInput
            style={styles.input}
            placeholder="47.658, -122.313"
            placeholderTextColor={Colors.textTertiary}
            value={endLocation}
            onChangeText={setEndLocation}
            editable={false}
          />

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchLabel}>Enable Live Companion Mode</Text>
              <Text style={styles.switchHint}>Share a link for real-time tracking</Text>
            </View>
            <Switch
              value={liveCompanionEnabled}
              onValueChange={setLiveCompanionEnabled}
              trackColor={{ false: Colors.nightSurface, true: Colors.safeGreen }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchLabel}>Enable Auto-Notify</Text>
              <Text style={styles.switchHint}>Notify contact when you arrive</Text>
            </View>
            <Switch
              value={autoNotifyEnabled}
              onValueChange={setAutoNotifyEnabled}
              trackColor={{ false: Colors.nightSurface, true: Colors.safeGreen }}
              thumbColor="#fff"
            />
          </View>

          {autoNotifyEnabled && (
            <>
              <Text style={[styles.label, { marginTop: 16 }]}>Contact Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+12065551234"
                placeholderTextColor={Colors.textTertiary}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
            </>
          )}

          <GlowButton
            variant="primary"
            size="lg"
            onPress={handleStartWalk}
            style={styles.startButton}
          >
            Start SafeWalk
          </GlowButton>
        </GlassCard>
      </ScrollView>
    </View>
  );
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
  header: {
    marginBottom: 32,
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
  card: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  switchHint: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  startButton: {
    width: '100%',
    marginTop: 32,
  },
  sessionId: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  shareUrlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  shareUrl: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.textPrimary,
  },
  hint: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 8,
  },
  locationInfo: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: Colors.textPrimary,
  },
  buttonContainer: {
    gap: 16,
  },
  panicButton: {
    width: '100%',
  },
  arriveButton: {
    width: '100%',
  },
});

