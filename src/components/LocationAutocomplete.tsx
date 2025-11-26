import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GOOGLE_PLACES_API_KEY } from '../config/constants';
import { Colors } from '../constants/Colors';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: { name: string; placeId: string }) => void;
  icon?: React.ReactNode;
  style?: any;
  showValidation?: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
}

export function LocationAutocomplete({
  placeholder,
  value,
  onChangeText,
  onSelectLocation,
  icon,
  style,
  showValidation = true,
  userLocation,
}: LocationAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isValidLocation, setIsValidLocation] = useState<boolean | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<View>(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Don't search if input is empty
    if (value.length === 0) {
      setPredictions([]);
      setShowDropdown(false);
      setIsValidLocation(null);
      return;
    }

    // Debounce API calls - faster response for better UX
    debounceTimer.current = setTimeout(() => {
      searchPlaces(value);
    }, 150);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, userLocation]);

  const searchPlaces = async (input: string) => {
    // Use mock data if no API key is configured
    if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY.trim() === '') {
      const mockResults = getMockPredictions(input);
      setPredictions(mockResults);
      setShowDropdown(mockResults.length > 0);
      // Check if input matches any mock location
      const exactMatch = mockResults.some(
        (p) => p.structured_formatting.main_text.toLowerCase() === input.toLowerCase()
      );
      setIsValidLocation(exactMatch || input.length === 0 ? null : false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Build API URL with location bias if available
      let apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${GOOGLE_PLACES_API_KEY}&types=establishment|geocode`;
      
      // Add location bias to prioritize results near user's location
      if (userLocation) {
        apiUrl += `&location=${userLocation.latitude},${userLocation.longitude}&radius=5000`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.predictions) {
        setPredictions(data.predictions);
        setShowDropdown(true);
        // Check if input exactly matches any prediction
        const exactMatch = data.predictions.some(
          (p: PlacePrediction) =>
            p.structured_formatting.main_text.toLowerCase() === input.toLowerCase() ||
            p.description.toLowerCase() === input.toLowerCase()
        );
        setIsValidLocation(exactMatch);
      } else {
        setIsValidLocation(false);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      // Fallback to mock data on error
      const mockResults = getMockPredictions(input);
      setPredictions(mockResults);
      setShowDropdown(true);
      const exactMatch = mockResults.some(
        (p) => p.structured_formatting.main_text.toLowerCase() === input.toLowerCase()
      );
      setIsValidLocation(exactMatch || input.length === 0 ? null : false);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockPredictions = (input: string): PlacePrediction[] => {
    // Mock data for development/testing
    const mockPlaces = [
      {
        place_id: '1',
        description: 'Suzzallo Library, University of Washington',
        structured_formatting: {
          main_text: 'Suzzallo Library',
          secondary_text: 'University of Washington',
        },
      },
      {
        place_id: '2',
        description: 'McMahon Hall, University of Washington',
        structured_formatting: {
          main_text: 'McMahon Hall',
          secondary_text: 'University of Washington',
        },
      },
      {
        place_id: '3',
        description: 'Allen Library, University of Washington',
        structured_formatting: {
          main_text: 'Allen Library',
          secondary_text: 'University of Washington',
        },
      },
      {
        place_id: '4',
        description: 'The Ave, University District, Seattle',
        structured_formatting: {
          main_text: 'The Ave',
          secondary_text: 'University District, Seattle',
        },
      },
      {
        place_id: '5',
        description: 'Red Square, University of Washington',
        structured_formatting: {
          main_text: 'Red Square',
          secondary_text: 'University of Washington',
        },
      },
      {
        place_id: '6',
        description: 'Drumheller Fountain, University of Washington',
        structured_formatting: {
          main_text: 'Drumheller Fountain',
          secondary_text: 'University of Washington',
        },
      },
      {
        place_id: '7',
        description: 'Husky Stadium, University of Washington',
        structured_formatting: {
          main_text: 'Husky Stadium',
          secondary_text: 'University of Washington',
        },
      },
    ];

    const lowerInput = input.toLowerCase();
    return mockPlaces.filter((place) =>
      place.description.toLowerCase().includes(lowerInput) ||
      place.structured_formatting.main_text.toLowerCase().includes(lowerInput)
    );
  };

  const handleSelect = (prediction: PlacePrediction) => {
    const locationName = prediction.structured_formatting.main_text;
    onChangeText(locationName);
    onSelectLocation({
      name: locationName,
      placeId: prediction.place_id,
    });
    setShowDropdown(false);
    setPredictions([]);
    setIsValidLocation(true);
  };

  // Check validation when value changes but no search is happening
  useEffect(() => {
    if (value.length >= 2 && !isLoading && predictions.length === 0) {
      const mockPlaces = getMockPredictions('');
      const exactMatch = mockPlaces.some(
        (p) => p.structured_formatting.main_text.toLowerCase() === value.toLowerCase()
      );
      setIsValidLocation(exactMatch ? true : null);
    } else if (value.length === 0) {
      setIsValidLocation(null);
    }
  }, [value, predictions.length, isLoading]);

  return (
    <View style={[styles.container, style]} ref={inputRef}>
      <View style={styles.inputWrapper}>
        {icon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowDropdown(true);
            }
          }}
          onBlur={() => {
            // Delay to allow selection
            setTimeout(() => setShowDropdown(false), 300);
          }}
        />
        {isLoading ? (
          <View style={styles.rightIcon}>
            <ActivityIndicator size="small" color={Colors.safeGreen} />
          </View>
        ) : (
          showValidation && value.length > 0 && isValidLocation !== null && (
            <View style={styles.rightIcon}>
              <Ionicons
                name={isValidLocation ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={isValidLocation ? Colors.safeGreen : Colors.dangerRed}
              />
            </View>
          )
        )}
      </View>

      {showDropdown && predictions.length > 0 && (
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdown}>
            <View style={styles.dropdownCard}>
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.predictionItem}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.predictionIconContainer}>
                      <Ionicons
                        name="location"
                        size={18}
                        color={Colors.safeGreen}
                      />
                    </View>
                    <View style={styles.predictionText}>
                      <Text style={styles.predictionMain}>
                        {item.structured_formatting.main_text}
                      </Text>
                      <Text style={styles.predictionSecondary}>
                        {item.structured_formatting.secondary_text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                scrollEnabled={predictions.length > 4}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 16,
    minHeight: 48,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 8,
    zIndex: 99999,
    elevation: 25,
    backgroundColor: 'transparent',
  },
  dropdown: {
    width: '100%',
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  dropdownCard: {
    backgroundColor: 'rgba(15, 15, 35, 0.98)',
    borderRadius: 16,
    padding: 6,
    maxHeight: 280,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  predictionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  predictionText: {
    flex: 1,
  },
  predictionMain: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  predictionSecondary: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});

