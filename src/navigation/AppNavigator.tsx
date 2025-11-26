import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RouteComparisonScreen } from '../screens/RouteComparisonScreen';
import { ActiveWalkScreen } from '../screens/ActiveWalkScreen';
import { ArrivalScreen } from '../screens/ArrivalScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StartWalkScreen } from '../screens/StartWalkScreen';
import { CompanionScreen } from '../screens/CompanionScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Routes: undefined;
  ActiveWalk: { sessionId: string; shareUrl?: string };
  Arrival: { sessionId: string };
  Report: undefined;
  Settings: undefined;
  StartWalk: undefined;
  Companion: { shareToken: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Routes" component={RouteComparisonScreen} />
        <Stack.Screen name="ActiveWalk" component={ActiveWalkScreen} />
        <Stack.Screen name="Arrival" component={ArrivalScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="StartWalk" component={StartWalkScreen} />
        <Stack.Screen name="Companion" component={CompanionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

