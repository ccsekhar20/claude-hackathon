import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RecentRoute {
  from: string;
  to: string;
  time: string;
  safety: number;
}

const recentRoutes: RecentRoute[] = [
  { from: 'Bagley Hall', to: 'The Standard at Seattle', time: '6 min', safety: 94 },
  { from: 'Suzzallo Library', to: 'McMahon Hall', time: '8 min', safety: 92 },
  { from: 'Allen Library', to: 'The Ave', time: '12 min', safety: 87 },
];

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromPlaceId, setFromPlaceId] = useState<string | null>(null);
  const [toPlaceId, setToPlaceId] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature.'
        );
        setIsGettingLocation(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const address = geocode[0];
        // Format address
        const addressParts = [
          address.streetNumber,
          address.street,
          address.district || address.subAdministrativeArea,
        ].filter(Boolean);
        
        const locationName = addressParts.length > 0
          ? addressParts.join(' ')
          : address.name || address.formattedAddress || 'Current Location';
        
        setFrom(locationName);
        setFromPlaceId(`current_${location.coords.latitude}_${location.coords.longitude}`);
        // Store location for autocomplete bias
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        setFrom('Current Location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your current location. Please try again.');
    } finally {
      setIsGettingLocation(false);
    }
  };

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

      <View style={styles.routeCardWrapper}>
        <GlassCard style={styles.routeCard}>
          <View style={styles.inputSection}>
            <View style={styles.autocompleteRow}>
              <View style={styles.autocompleteWrapper}>
                <LocationAutocomplete
                  placeholder="Current location"
                  value={from}
                  onChangeText={setFrom}
                  onSelectLocation={(location) => {
                    setFrom(location.name);
                    setFromPlaceId(location.placeId);
                  }}
                  showValidation={true}
                  userLocation={userLocation}
                  icon={
                    <View style={styles.iconCircle}>
                      <View style={styles.greenDot} />
                    </View>
                  }
                />
              </View>
              <TouchableOpacity
                onPress={getCurrentLocation}
                disabled={isGettingLocation}
                style={styles.locationButton}
              >
                {isGettingLocation ? (
                  <ActivityIndicator size="small" color={Colors.safeGreen} />
                ) : (
                  <Ionicons name="locate" size={20} color={Colors.safeGreen} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.autocompleteRow}>
              <View style={styles.autocompleteWrapper}>
                <LocationAutocomplete
                  placeholder="Where to?"
                  value={to}
                  onChangeText={setTo}
                  onSelectLocation={(location) => {
                    setTo(location.name);
                    setToPlaceId(location.placeId);
                  }}
                  showValidation={true}
                  userLocation={userLocation}
                  icon={
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                      <Ionicons name="location-outline" size={20} color={Colors.blueGradient[0]} />
                    </View>
                  }
                />
              </View>
            </View>
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
      </View>

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
  routeCardWrapper: {
    marginBottom: 24,
    zIndex: 1,
    position: 'relative' as any,
  },
  routeCard: {
    overflow: 'visible' as any,
    padding: 20,
    position: 'relative' as any,
  },
  inputSection: {
    gap: 16,
  },
  autocompleteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
  },
  autocompleteWrapper: {
    flex: 1,
    zIndex: 10,
    position: 'relative' as any,
    overflow: 'visible' as any,
    minWidth: 0,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    marginTop: 0,
    shadowColor: Colors.safeGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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

