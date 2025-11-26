# SafeWalk AI - Mobile App

A React Native mobile app converted from the Next.js web application. SafeWalk AI helps University of Washington students walk safely at night with AI-powered route analysis, real-time hazard detection, and live companion tracking.

## Features

- 🛡️ **AI-Powered Safety Analysis** - Real-time route safety scoring
- 🗺️ **Smart Route Planning** - Compare multiple routes with detailed safety metrics
- 👥 **Live Companion Tracking** - Share your location with trusted contacts
- ⚠️ **Hazard Alerts** - Get notified about potential dangers
- 📱 **Native Mobile Experience** - Built with React Native and Expo

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Screen navigation
- **React Native Reanimated** - Smooth animations
- **Expo Blur** - Glassmorphism effects
- **Expo Linear Gradient** - Gradient backgrounds

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

### Building for Production

#### iOS
```bash
expo build:ios
```

#### Android
```bash
expo build:android
```

## Project Structure

```
├── App.tsx                 # Main app entry point
├── src/
│   ├── components/         # Reusable components
│   │   ├── GlassCard.tsx
│   │   ├── GlowButton.tsx
│   │   └── SafetyIndicator.tsx
│   ├── screens/            # Screen components
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── RouteComparisonScreen.tsx
│   │   ├── ActiveWalkScreen.tsx
│   │   ├── ArrivalScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── constants/          # Constants and config
│   │   └── Colors.ts
│   └── lib/                # Utilities
│       └── utils.ts
├── app.json                # Expo configuration
└── package.json
```

## Screens

1. **Onboarding** - Welcome screens introducing app features
2. **Home** - Main screen with route input and recent routes
3. **Routes** - Compare multiple route options with safety scores
4. **Active Walk** - Live tracking screen with progress and alerts
5. **Arrival** - Success screen with walk summary
6. **Report** - Report safety issues in the community
7. **Settings** - User preferences and account management

## Native Features

- **Location Services** - GPS tracking for routes
- **Notifications** - Push notifications for alerts
- **Camera** - Photo upload for issue reporting
- **Background Location** - Track walks in background

## Development

### Adding New Screens

1. Create screen component in `src/screens/`
2. Add route to `src/navigation/AppNavigator.tsx`
3. Update `RootStackParamList` type

### Styling

The app uses StyleSheet for styling with a consistent color palette defined in `src/constants/Colors.ts`. Glassmorphism effects are achieved using Expo Blur.

## Converting from Web

This app was converted from a Next.js web application. Key changes:

- React components → React Native components
- Tailwind CSS → StyleSheet
- Framer Motion → React Native Reanimated
- HTML elements → React Native components (View, Text, etc.)
- CSS classes → StyleSheet objects
- Web icons (lucide-react) → Expo Vector Icons

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

