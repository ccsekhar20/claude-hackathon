"""
Weather service module that integrates with WeatherAPI.com.
"""
import requests
from config import WEATHER_API_KEY


def get_weather_visibility(lat: float, lng: float) -> dict:
    """
    Get weather visibility and condition from WeatherAPI.com.
    
    Args:
        lat: Latitude
        lng: Longitude
    
    Returns:
        Dictionary with:
        - "visibility": visibility in meters (defaults to 10000 if missing)
        - "condition": main weather condition string (e.g., "Clear", "Rain")
    
    Raises:
        Exception: If API request fails
    """
    if not WEATHER_API_KEY:
        # Return default values if API key not configured
        return {
            "visibility": 10000,
            "condition": "Clear"
        }
    
    url = "https://api.weatherapi.com/v1/current.json"
    params = {
        "key": WEATHER_API_KEY,
        "q": f"{lat},{lng}",
        "aqi": "no"
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        current = data.get("current", {})
        condition_data = current.get("condition", {})
        
        # Extract visibility (WeatherAPI.com returns in km, convert to meters)
        # Default to 10000 meters (10 km) if missing
        visibility_km = current.get("vis_km", 10.0)
        visibility = int(visibility_km * 1000)  # Convert km to meters
        
        # Extract main weather condition
        condition = condition_data.get("text", "Clear")
        # WeatherAPI.com uses descriptive text, extract main condition
        # Common conditions: "Clear", "Sunny", "Partly cloudy", "Cloudy", "Rain", etc.
        condition_text = condition.lower()
        if "clear" in condition_text or "sunny" in condition_text:
            condition = "Clear"
        elif "rain" in condition_text or "drizzle" in condition_text:
            condition = "Rain"
        elif "snow" in condition_text:
            condition = "Snow"
        elif "cloud" in condition_text:
            condition = "Cloudy"
        elif "fog" in condition_text or "mist" in condition_text:
            condition = "Fog"
        else:
            condition = "Clear"  # Default
        
        return {
            "visibility": visibility,
            "condition": condition
        }
    
    except requests.RequestException as e:
        # Return default values on error
        return {
            "visibility": 10000,
            "condition": "Clear"
        }


def test_weather():
    """
    Test function that prints visibility and condition for a UW campus coordinate.
    """
    # UW campus coordinate (near Red Square)
    uw_lat = 47.6553
    uw_lng = -122.3035
    
    print(f"Testing weather for UW campus ({uw_lat}, {uw_lng})...")
    
    try:
        weather_data = get_weather_visibility(uw_lat, uw_lng)
        print(f"Visibility: {weather_data['visibility']} meters")
        print(f"Condition: {weather_data['condition']}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    test_weather()

