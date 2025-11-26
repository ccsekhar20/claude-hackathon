"""
Configuration for SafeWalk AI backend.
Loads environment variables and provides configuration constants.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Google Maps API
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

# WeatherAPI.com
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")
WEATHER_API_BASE_URL = os.getenv(
    "WEATHER_API_BASE_URL",
    "https://api.weatherapi.com/v1"
)

# UW Alerts
UW_ALERTS_URL = os.getenv("UW_ALERTS_URL", "https://emergency.uw.edu/")
UW_ALERTS_ENABLED = os.getenv("UW_ALERTS_ENABLED", "true").lower() == "true"

# UW Emergency Callboxes
UW_CALLBOXES_GEOJSON_URL = os.getenv("UW_CALLBOXES_GEOJSON_URL", "")
UW_CALLBOXES_GEOJSON_PATH = os.getenv("UW_CALLBOXES_GEOJSON_PATH", "")

# Flask Configuration
FLASK_ENV = os.getenv("FLASK_ENV", "development")
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() == "true"
FLASK_PORT = int(os.getenv("FLASK_PORT", "5001"))

# CORS Configuration
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:8081,exp://localhost:8081"
).split(",")

