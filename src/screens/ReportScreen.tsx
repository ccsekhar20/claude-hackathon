import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { Colors } from '../constants/Colors';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface IssueType {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const issueTypes: IssueType[] = [
  { id: 'lighting', label: 'Poor Lighting', icon: 'bulb-outline', color: Colors.cautionYellow },
  { id: 'crowd', label: 'Suspicious Activity', icon: 'people-outline', color: Colors.dangerRed },
  { id: 'hazard', label: 'Physical Hazard', icon: 'warning-outline', color: '#fb923c' },
  { id: 'other', label: 'Other', icon: 'location-outline', color: Colors.blueGradient[0] },
];

export function ReportScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [anonymous, setAnonymous] = useState(true);

  const handleSubmit = () => {
    if (selectedType && description) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Report Safety Issue</Text>
          <Text style={styles.headerSubtitle}>Help keep our community safe</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What happened?</Text>
          <View style={styles.issueGrid}>
            {issueTypes.map((type, i) => {
              const isSelected = selectedType === type.id;
              return (
                <Animated.View
                  key={type.id}
                  entering={FadeInRight.delay(i * 100).duration(400)}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedType(type.id)}
                    style={[
                      styles.issueButton,
                      isSelected && { borderColor: Colors.safeGreen, borderWidth: 2, backgroundColor: 'rgba(52, 211, 153, 0.1)' },
                    ]}
                  >
                    <Ionicons name={type.icon} size={24} color={type.color} />
                    <Text style={styles.issueLabel}>{type.label}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        <GlassCard style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Ionicons name="location-outline" size={20} color={Colors.blueGradient[0]} />
            <Text style={styles.locationTitle}>Location</Text>
          </View>
          <Text style={styles.locationText}>Near Campus Loop & Stevens Way</Text>
          <TouchableOpacity>
            <Text style={styles.locationChange}>Change location</Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide more details about the issue..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity style={styles.photoButton}>
          <Ionicons name="camera-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.photoText}>Add Photo (Optional)</Text>
        </TouchableOpacity>

        <GlassCard style={styles.anonymousCard}>
          <View style={styles.anonymousContent}>
            <View>
              <Text style={styles.anonymousTitle}>Submit Anonymously</Text>
              <Text style={styles.anonymousSubtitle}>Your identity will not be shared</Text>
            </View>
            <Switch
              value={anonymous}
              onValueChange={setAnonymous}
              trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: Colors.safeGreen }}
              thumbColor="#ffffff"
            />
          </View>
        </GlassCard>
      </ScrollView>

      <GlowButton
        onPress={handleSubmit}
        variant="primary"
        size="lg"
        style={styles.submitButton}
        disabled={!selectedType}
      >
        Submit Report
      </GlowButton>
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  issueButton: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  issueLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  locationCard: {
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  locationTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  locationChange: {
    color: Colors.safeGreen,
    fontSize: 12,
    fontWeight: '500',
  },
  textArea: {
    width: '100%',
    minHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: Colors.textPrimary,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  photoButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  photoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  anonymousCard: {
    marginBottom: 24,
  },
  anonymousContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anonymousTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  anonymousSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  submitButton: {
    width: '100%',
    marginBottom: 32,
  },
});

