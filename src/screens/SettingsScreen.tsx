import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const settingSections: SettingSection[] = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline', label: 'Profile', value: 'Emily Chen' },
      { icon: 'notifications-outline', label: 'Notifications', value: 'Enabled' },
      { icon: 'moon-outline', label: 'Dark Mode', value: 'Always On' },
    ],
  },
  {
    title: 'Safety & Privacy',
    items: [
      { icon: 'shield-outline', label: 'Emergency Contacts', value: '2 contacts' },
      { icon: 'people-outline', label: 'Trusted Companions', value: '5 people' },
      { icon: 'location-outline', label: 'Location Sharing', value: 'When Walking' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Help & FAQ', value: '' },
      { icon: 'shield-outline', label: 'Safety Guidelines', value: '' },
    ],
  },
];

export function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your preferences</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.profileCard}>
        <GlassCard>
          <View style={styles.profileContent}>
            <LinearGradient
              colors={Colors.emeraldGradient}
              style={styles.avatar}
            >
              <Text style={styles.avatarEmoji}>👩‍🎓</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Emily Chen</Text>
              <Text style={styles.profileSubtext}>University of Washington</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>47 Safe Walks</Text>
              </View>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.sections}>
        {settingSections.map((section, sectionIndex) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay(200 + sectionIndex * 100).duration(400)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <GlassCard>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                >
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon} size={16} color="rgba(255, 255, 255, 0.7)" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    {item.value && (
                      <Text style={styles.settingValue}>{item.value}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.4)" />
                </TouchableOpacity>
              ))}
            </GlassCard>
          </Animated.View>
        ))}
      </ScrollView>

      <Animated.View entering={FadeInDown.delay(500).duration(400)}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={Colors.dangerRed} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>
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
  profileCard: {
    marginBottom: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.safeGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  sections: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  settingValue: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  logoutText: {
    color: Colors.dangerRed,
    fontSize: 16,
    fontWeight: '500',
  },
});

