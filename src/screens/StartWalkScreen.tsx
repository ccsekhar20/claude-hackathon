import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios'; // Not needed for demo mode
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// import { BACKEND_URL } from '../config/constants'; // Not needed for demo mode

export function StartWalkScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  // Form state - DEMO: Hardcoded route from Bagley Hall to The Standard at Seattle
  const [userName, setUserName] = useState('Demo User');
  const [startLocation, setStartLocation] = useState('Bagley Hall, University of Washington');
  const [endLocation, setEndLocation] = useState('The Standard at Seattle');
  // Demo coordinates: Bagley Hall (47.6553, -122.3035) to The Standard (47.6600, -122.3100)
  const START_COORDS = { lat: 47.6553, lng: -122.3035 };
  const END_COORDS = { lat: 47.6600, lng: -122.3100 };
  const [liveCompanionEnabled, setLiveCompanionEnabled] = useState(true);
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState(false);
  const [contactPhone, setContactPhone] = useState('+12065551234');
  

  /**
   * Start a new walk session
   * DEMO MODE: Hardcoded to work without backend
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

    // DEMO: Hardcoded session data - no backend required
    const demoSessionId = `demo-${Date.now()}`;
    const demoShareToken = Math.random().toString(36).substring(2, 12);
    const demoShareUrl = `https://safewalk.app/companion/${demoShareToken}`;
    
    // Navigate directly to ActiveWalkScreen with hardcoded session data
    navigation.navigate('ActiveWalk', {
      sessionId: demoSessionId,
      shareUrl: demoShareUrl,
    });
  };


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

          <Text style={[styles.label, { marginTop: 16 }]}>Start Location</Text>
          <View style={styles.locationDisplay}>
            <Ionicons name="location" size={20} color={Colors.safeGreen} />
            <Text style={styles.locationText}>{startLocation}</Text>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>End Location</Text>
          <View style={styles.locationDisplay}>
            <Ionicons name="flag" size={20} color={Colors.blueGradient[0]} />
            <Text style={styles.locationText}>{endLocation}</Text>
          </View>

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
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationText: {
    flex: 1,
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
});

