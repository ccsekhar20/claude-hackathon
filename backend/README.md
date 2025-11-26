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

The server will start on `http://localhost:5001` (or the port specified in `.env`).

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
  },
  "preferences": {
    "avoid_highways": false,
    "walking_speed": "normal"
  }
}
```

**Response:**
```json
{
  "safest_route": {
    "route_id": "route_0",
    "safety_score": 85,
    "distance_meters": 1250,
    "duration_seconds": 900,
    "polyline": "encoded_polyline_string",
    "waypoints": [...],
    "safety_explanation": "...",
    "safety_tags": ["well_lit", "callbox_nearby"],
    "safety_factors": {...},
    "callboxes_along_route": [...],
    "active_alerts": []
  },
  "alternative_routes": [...]
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "safewalk-ai-backend"
}
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── routes/
│   │   └── safe_route.py    # /safe-route endpoint
│   ├── services/
│   │   ├── route_service.py      # Google Maps integration
│   │   ├── weather_service.py    # OpenWeatherMap integration
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

