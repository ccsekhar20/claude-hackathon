# SafeWalk AI - Demo Setup

## Quick Start Demo

This demo is pre-configured with a route from **Bagley Hall** to **The Standard at Seattle**.

### Demo Route
- **Start**: Bagley Hall, University of Washington (47.6553, -122.3035)
- **End**: The Standard at Seattle (47.6600, -122.3100)
- **Distance**: ~0.4 miles
- **Estimated Time**: 6 minutes

### Starting the Demo

1. **Start the Backend** (Terminal 1):
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
The backend will start on `http://localhost:5000`

2. **Start the Frontend** (Terminal 2):
```bash
npx expo start
```

3. **Demo Flow**:
   - Open the app
   - Navigate to "Start Walk" screen
   - Name is pre-filled as "Demo User"
   - Route is hardcoded: Bagley Hall → The Standard
   - Click "Start SafeWalk"
   - You'll be taken to ActiveWalkScreen with live tracking
   - Share the URL with a companion for real-time tracking
   - Click "I Feel Safe - End Walk" when done
   - Arrival screen will show completion

### Features Available in Demo

✅ **Session Management**: Create and track walk sessions
✅ **Live Location Tracking**: Real-time location updates via Socket.IO
✅ **Companion Mode**: Share link for real-time tracking
✅ **Panic/SOS**: Emergency alert system
✅ **Auto-Notify**: Arrival notifications (configured in StartWalkScreen)
✅ **Inactivity Alerts**: Automatic alerts after 3 minutes of inactivity

### Demo Data

- **User Name**: Pre-filled as "Demo User" (editable)
- **Start Location**: Bagley Hall, University of Washington
- **End Location**: The Standard at Seattle
- **Live Companion**: Enabled by default
- **Auto-Notify**: Disabled by default (can be enabled)

### Troubleshooting

**Backend not running?**
- Make sure you're in the `backend` directory
- Check that port 5000 is available
- Verify dependencies are installed: `pip install -r requirements.txt`

**Frontend can't connect?**
- Ensure backend is running on `http://localhost:5000`
- Check `src/config/constants.ts` has `BACKEND_URL = 'http://localhost:5000'`

**Socket.IO connection issues?**
- Backend must be running with Socket.IO support
- Use `python run.py` (not `python app.py`)
- Check browser console for connection errors

### Notes

- All location data is hardcoded for the demo
- No API keys required for basic session management
- Google Maps API key needed only for route calculation (optional for demo)
- Weather API key optional (falls back to stub data)

