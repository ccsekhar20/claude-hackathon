# SafeWalk AI - End-to-End User Workflow

## Overview
SafeWalk AI is a mobile safety application designed for University of Washington students to walk safely at night. The app provides AI-powered route analysis, real-time location tracking, and live companion features.

---

## Complete User Journey

### 1. **First Launch - Onboarding** 📱
**Screen:** `OnboardingScreen`

- User opens the app for the first time
- Views 4 onboarding screens explaining key features:
  1. **Stay Safe at Night** - AI-powered safety analysis
  2. **Smart Route Planning** - Compare routes with safety scores
  3. **Virtual Companion** - Share live location with trusted contacts
  4. **Instant Alerts** - Get notified about hazards and well-lit areas
- User can either:
  - Tap "Continue" to go through all screens
  - Tap "Skip" to go directly to Home
- After last screen, taps "Get Started" → navigates to Home

---

### 2. **Home Screen - Planning a Walk** 🏠
**Screen:** `HomeScreen`

**User Actions:**
- Views app header with "SafeWalk AI" title and settings icon
- Sees route planning card with two location inputs:
  - **"Current location"** field (green dot icon)
    - Can use location button (📍) to auto-fill current GPS location
    - Or manually type/search using Google Places autocomplete
  - **"Where to?"** field (blue location icon)
    - Types destination or searches using autocomplete dropdown
- Views "Recent Routes" section showing past walks with safety scores
- Taps **"Find Safe Routes"** button → navigates to Route Comparison

**Technical Details:**
- Location autocomplete uses Google Places API
- Current location uses Expo Location services
- Recent routes are displayed from local storage/mock data

---

### 3. **Route Comparison - Choosing the Safest Path** 🗺️
**Screen:** `RouteComparisonScreen`

**User Actions:**
- Views multiple route options (typically 3 routes)
- Each route card shows:
  - Route name (e.g., "Campus Loop Route")
  - Safety score (0-100) with color-coded indicator
  - Duration and distance
  - Lighting percentage
  - Crowd density percentage
  - Route highlights (well-lit areas, emergency stations, etc.)
- Top route is marked as "Recommended" with green glow
- Compares routes based on:
  - Safety score (primary factor)
  - Lighting conditions
  - Foot traffic/crowd density
  - Route highlights
- Taps **"Start Walking"** on preferred route → navigates to Start Walk screen

**Route Examples:**
- **Route 1 (Recommended):** 92 safety, 8 min, well-lit, high traffic
- **Route 2:** 78 safety, 6 min, some dim areas
- **Route 3:** 65 safety, 10 min, isolated, poor lighting

---

### 4. **Start Walk - Session Setup** 🚶
**Screen:** `StartWalkScreen`

**User Actions:**
- Enters their name
- Views pre-filled start and end locations (from previous screens)
- Configures walk settings:
  - **Enable Live Companion Mode** (toggle ON/OFF)
    - If enabled: generates shareable link for real-time tracking
  - **Enable Auto-Notify** (toggle ON/OFF)
    - If enabled: requires contact phone number
    - Automatically notifies contact when user arrives safely
- Taps **"Start SafeWalk"** button
  - Creates session via backend API (`POST /api/sessions`)
  - Receives `sessionId` and `shareUrl` (if companion enabled)
  - Navigates to Active Walk screen

**Backend Integration:**
- Creates walk session with user details
- Sets up Socket.IO connection for real-time updates
- Generates share token for companion tracking

---

### 5. **Active Walk - Real-Time Tracking** 🎯
**Screen:** `ActiveWalkScreen`

**User Actions:**
- Sees "Active Walk" badge with pulsing green dot
- Views real-time information:
  - Current location coordinates (updates every 5 seconds or 10 meters)
  - ETA to destination
  - Navigation icon with rotating animation
- If Live Companion enabled:
  - Sees shareable link card
  - Can copy/share link with trusted contacts
- Receives real-time alerts:
  - **Inactivity Alert** (if location not updated for a while)
  - **Hazard Alerts** (low light areas, construction zones, etc.)
- Quick action buttons:
  - **SOS Button** 🚨 - Triggers emergency alert to companions
  - **Message** - Send message to companion (future feature)
  - **Flashlight** - Toggle phone flashlight (future feature)
- Taps **"I Feel Safe - End Walk"** when arriving → navigates to Arrival screen

**Technical Details:**
- Location tracking via Expo Location (`watchPositionAsync`)
- Socket.IO connection for real-time updates
- Location updates sent to backend every 5 seconds
- Backend calculates ETA and monitors inactivity

**Companion Experience (Separate Screen):**
- Companion opens share link → `CompanionScreen`
- Views walker's live location updates
- Receives real-time notifications:
  - Location updates with ETA
  - Inactivity alerts
  - Panic/SOS alerts
  - Arrival notifications
- Can see walker's route, start/end locations, and session status

---

### 6. **Arrival - Walk Completion** ✅
**Screen:** `ArrivalScreen`

**User Actions:**
- Sees success animation with checkmark icon
- Views "You Arrived Safely!" message
- Sees walk summary statistics:
  - Duration (e.g., "8:24")
  - Distance (e.g., "0.6 Miles")
  - Safety score (e.g., "92")
- If Auto-Notify enabled: sees confirmation that contacts were notified
- Action options:
  - **"Back to Home"** - Returns to main screen
  - **"Share"** - Share walk completion (future feature)
  - **"Report Issue"** - Report safety concerns → navigates to Report screen
- Views achievement stat (e.g., "47 safe walks completed")

**Backend Integration:**
- Marks session as completed (`POST /api/sessions/:id/arrive`)
- Sends auto-notify messages if enabled
- Updates walk statistics

---

### 7. **Report Issue - Community Safety** 🚩
**Screen:** `ReportScreen`

**User Actions:**
- Selects issue type:
  - Poor Lighting 💡
  - Suspicious Activity 👥
  - Physical Hazard ⚠️
  - Other 📍
- Views auto-detected location (can change if needed)
- Optionally adds:
  - Description text
  - Photo attachment
- Chooses to submit anonymously (toggle)
- Taps **"Submit Report"** → returns to Home

**Purpose:**
- Helps improve safety data for future route recommendations
- Builds community safety database
- Contributes to AI safety scoring

---

### 8. **Settings - Account Management** ⚙️
**Screen:** `SettingsScreen`

**User Actions:**
- Views profile card with:
  - User name and university
  - Achievement badge (total safe walks)
- Manages settings in sections:
  - **Account:**
    - Profile information
    - Notification preferences
    - Dark mode settings
  - **Safety & Privacy:**
    - Emergency contacts (manage trusted contacts)
    - Trusted companions (people who can track walks)
    - Location sharing preferences
  - **Support:**
    - Help & FAQ
    - Safety guidelines
- Can sign out from app

---

## Alternative Flows

### **Companion Tracking Flow** 👥
1. User starts walk with Live Companion enabled
2. Receives shareable link (e.g., `https://safewalk.app/companion/abc123`)
3. Shares link via text/email with trusted contact
4. Companion opens link → `CompanionScreen`
5. Companion views:
   - Walker's name and route
   - Live location updates
   - Real-time ETA
   - Connection status
6. Companion receives alerts:
   - Inactivity alerts (if walker stops moving)
   - Panic alerts (if SOS triggered)
   - Arrival notifications
7. Companion can:
   - Call walker
   - Send message
   - Trigger emergency services

### **Emergency Flow** 🚨
1. During active walk, user feels unsafe
2. Taps **SOS button** on Active Walk screen
3. Confirms SOS trigger
4. Backend sends:
   - Panic alert to all companions
   - Emergency notification to auto-notify contacts
   - Last known location to emergency services
5. Companions receive immediate alert with location
6. User can continue walk or contact emergency services

### **Inactivity Detection** ⏱️
1. User's location stops updating (e.g., phone dies, app crashes)
2. Backend detects inactivity after threshold (e.g., 2 minutes)
3. Backend sends inactivity alert:
   - To user's Active Walk screen
   - To all companions via Socket.IO
4. Companions see alert with last known location
5. User can dismiss alert when location tracking resumes

---

## Key Features Summary

### **Safety Features**
- ✅ AI-powered route safety scoring
- ✅ Real-time location tracking
- ✅ Inactivity monitoring
- ✅ SOS/panic button
- ✅ Auto-notify on arrival
- ✅ Hazard alerts during walk

### **Social Features**
- ✅ Live companion tracking
- ✅ Shareable tracking links
- ✅ Real-time location sharing
- ✅ Emergency contact notifications

### **Community Features**
- ✅ Safety issue reporting
- ✅ Anonymous reporting option
- ✅ Photo attachments for reports
- ✅ Community safety database

### **User Experience**
- ✅ Smooth onboarding flow
- ✅ Google Places autocomplete
- ✅ Recent routes history
- ✅ Achievement tracking
- ✅ Dark mode UI
- ✅ Glassmorphism design

---

## Technical Stack

**Frontend:**
- React Native with Expo
- TypeScript
- React Navigation
- Socket.IO Client
- Expo Location
- Google Places API

**Backend Integration:**
- REST API for session management
- Socket.IO for real-time updates
- Location tracking endpoints
- Safety scoring service
- Auto-notify service

---

## User Flow Diagram

```
Onboarding → Home → Route Comparison → Start Walk → Active Walk → Arrival
                                                              ↓
                                                         Report Issue
                                                              ↓
                                                            Home
                                                              ↓
                                                          Settings
```

---

## Success Metrics

- **User completes walk safely** ✅
- **Companion receives real-time updates** ✅
- **Auto-notify sent on arrival** ✅
- **Safety issue reported** (optional) ✅
- **Route safety data improved** (community benefit) ✅

---

## Future Enhancements

- [ ] Map visualization of routes
- [ ] Turn-by-turn navigation
- [ ] Weather integration
- [ ] Crime data overlays
- [ ] Group walking features
- [ ] Integration with campus security
- [ ] Machine learning for personalized safety scores

