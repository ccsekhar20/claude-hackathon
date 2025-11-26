# SafeWalk AI Backend

Backend service for SafeWalk AI - a safety-first navigation assistant for University of Washington students.

## Features

- **Route Calculation**: Fetches candidate walking routes from Google Maps Directions API
- **Safety Scoring**: Calculates safety scores (0-100) based on multiple factors:
  - Proximity to UW emergency callboxes
  - Weather visibility
  - Active UW Alerts
  - Time of day (daylight vs nighttime)
  - Route length
- **Route Enrichment**: Enriches routes with safety metadata and explanations
- **Real-time Support**: Flask-SocketIO for live companion mode and walk sessions

## Setup

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Add your API keys to `.env`:
   - `GOOGLE_MAPS_API_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - `WEATHER_API_KEY`: Get from [WeatherAPI.com](https://www.weatherapi.com/)

### Running the Server

```bash
python run.py
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### POST `/safe-route`

Calculate the safest route between two coordinates.

**Request:**
```json
{
  "start": {
    "lat": 47.6553,
    "lng": -122.3035
  },
  "end": {
    "lat": 47.6530,
    "lng": -122.3045
  }
}
```

**Response:**
```json
{
  "bestRoute": {
    "safetyScore": 85,
    "distanceMeters": 1250,
    "etaMinutes": 15,
    "polyline": "encoded_polyline_string",
    "explanation": ["..."],
    "tags": ["Good visibility", "Short route"]
  },
  "allRoutes": [...],
  "context": {
    "weather": {
      "visibility": 4800,
      "condition": "Fog"
    }
  }
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### Walk Sessions (Real-time)

#### Create a Walk Session

- `POST /api/sessions` - Create a new walk session with Live Companion Mode and Auto-Notify Arrival support

**Example:**
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Agastya",
    "startLocation": {"lat": 47.655, "lng": -122.308},
    "endLocation": {"lat": 47.658, "lng": -122.313},
    "autoNotify": {
      "enabled": true,
      "contactName": "Mom",
      "contactChannel": "sms",
      "contactValue": "+12065551234"
    },
    "liveCompanionEnabled": true
  }'
```

**Response:**
```json
{
  "sessionId": "<uuid>",
  "shareUrl": "https://placeholder-frontend-url/companion/<shareToken>"
}
```

#### Get Session by Share Token (Companion View)

- `GET /api/sessions/share/<share_token>` - Get session information for Live Companion Mode view

**Example:**
```bash
curl http://localhost:5000/api/sessions/share/abc123def4
```

**Response:**
```json
{
  "userName": "Agastya",
  "status": "active",
  "startLocation": {"lat": 47.655, "lng": -122.308},
  "endLocation": {"lat": 47.658, "lng": -122.313},
  "lastLocation": {"lat": 47.656, "lng": -122.310},
  "eta": "11:42 PM"
}
```

#### Update Location

- `POST /api/sessions/<session_id>/location` - Update the current location for a walk session

#### Trigger Panic/SOS

- `POST /api/sessions/<session_id>/panic` - Trigger a panic/SOS event for a walk session

#### Mark Arrival

- `POST /api/sessions/<session_id>/arrive` - Mark a walk session as arrived and trigger Auto-Notify Arrival

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── routes/
│   │   └── safe_route.py    # /safe-route endpoint
│   ├── services/
│   │   ├── route_service.py      # Google Maps integration
│   │   ├── weather_service.py    # WeatherAPI.com integration
│   │   ├── uw_alerts_service.py  # UW Alerts scraping
│   │   ├── callbox_service.py    # Emergency callbox data
│   │   └── safety_scorer.py      # Safety scoring algorithm
│   ├── models/
│   │   ├── route.py         # Route data models
│   │   └── safety.py        # Safety score models
│   └── utils/
│       ├── distance.py       # Distance calculations
│       └── geojson_parser.py # GeoJSON parsing
├── config.py                # Configuration
├── run.py                   # Entry point
├── requirements.txt         # Python dependencies
└── .env.example            # Environment variables template
```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `GOOGLE_MAPS_API_KEY`: Required for route calculation
- `WEATHER_API_KEY`: Optional (falls back to stub data)
- `UW_ALERTS_ENABLED`: Set to `false` to use stub data
- `UW_CALLBOXES_GEOJSON_URL` or `UW_CALLBOXES_GEOJSON_PATH`: For emergency callbox data

## Real-time Support

The backend uses Flask-SocketIO for real-time communication. Socket.IO events include:

- `join_session` - Join a session room by session ID
- `join_session_by_token` - Join a session room by share token
- `location_update` - Emitted when location is updated
- `inactivity_alert` - Emitted when user is inactive for 3+ minutes
- `panic` - Emitted when panic/SOS is triggered
- `arrived` - Emitted when user arrives at destination

## Development

The backend uses Flask with a modular service architecture. Each service is responsible for a specific data source or calculation:

- **RouteService**: Fetches routes from Google Maps
- **WeatherService**: Gets weather data from WeatherAPI.com
- **UWAlertsService**: Scrapes or stubs UW Alerts
- **CallboxService**: Loads and queries emergency callbox locations
- **SafetyScorer**: Calculates comprehensive safety scores

## Notes

- The UW Alerts service includes basic HTML scraping. Adjust the `_parse_alerts_html` method based on the actual structure of emergency.uw.edu
- Emergency callbox data can be loaded from a URL or local GeoJSON file
- Weather service falls back to stub data if the API key is not configured
- All services include error handling and fallbacks for development
