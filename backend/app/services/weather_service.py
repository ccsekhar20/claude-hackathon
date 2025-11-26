"""
Service for fetching weather data from WeatherAPI.com.
"""
import os
import requests
from typing import Optional, Dict
from datetime import datetime
from config import WEATHER_API_KEY, WEATHER_API_BASE_URL


class WeatherService:
    """Service for interacting with WeatherAPI.com."""
    
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or WEATHER_API_KEY
        self.base_url = base_url or WEATHER_API_BASE_URL or "https://api.weatherapi.com/v1"
    
    def get_weather(self, lat: float, lng: float) -> Dict:
        """
        Fetch current weather conditions for a location.
        
        Args:
            lat: Latitude
            lng: Longitude
        
        Returns:
            Dictionary with weather data including visibility, conditions, etc.
        """
        if not self.api_key:
            # Return stub data if API key not configured
            return self._get_stub_weather()
        
        params = {
            "key": self.api_key,
            "q": f"{lat},{lng}",
            "aqi": "no"
        }
        
        try:
            response = requests.get(
                f"{self.base_url}/current.json",
                params=params,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            condition = current.get("condition", {})
            
            # WeatherAPI.com returns visibility in km, convert to meters
            visibility_km = current.get("vis_km", 10.0)
            visibility_meters = visibility_km * 1000
            
            return {
                "visibility_meters": visibility_meters,
                "weather_condition": condition.get("text", "Clear"),
                "weather_description": condition.get("text", "clear sky"),
                "clouds_percent": current.get("cloud", 0),
                "wind_speed": current.get("wind_kph", 0) / 3.6,  # Convert km/h to m/s
                "temperature": current.get("temp_c", 20),
                "timestamp": datetime.now().isoformat()
            }
        
        except requests.RequestException as e:
            # Fallback to stub data on error
            return self._get_stub_weather()
    
    def _get_stub_weather(self) -> Dict:
        """Return stub weather data for development/testing."""
        return {
            "visibility_meters": 10000,
            "weather_condition": "Clear",
            "weather_description": "clear sky",
            "clouds_percent": 0,
            "wind_speed": 0,
            "temperature": 20,
            "timestamp": datetime.now().isoformat()
        }

