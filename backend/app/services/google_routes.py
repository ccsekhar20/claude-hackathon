"""
Service for fetching candidate routes from Google Maps Directions API.
"""
import requests
from config import GOOGLE_MAPS_API_KEY


def get_candidate_routes(start: dict, end: dict) -> list:
    """
    Fetch candidate routes from Google Maps Directions API.
    
    Args:
        start: Dictionary with "lat" and "lng" keys (e.g., {"lat": 47.6553, "lng": -122.3035})
        end: Dictionary with "lat" and "lng" keys (e.g., {"lat": 47.6530, "lng": -122.3045})
    
    Returns:
        List of raw Google route objects (data["routes"])
    
    Raises:
        ValueError: If start or end dicts are missing required keys
        Exception: If API response status is not "OK" or if request fails
    """
    # Validate input
    if not isinstance(start, dict) or "lat" not in start or "lng" not in start:
        raise ValueError("start must be a dict with 'lat' and 'lng' keys")
    if not isinstance(end, dict) or "lat" not in end or "lng" not in end:
        raise ValueError("end must be a dict with 'lat' and 'lng' keys")
    
    if not GOOGLE_MAPS_API_KEY:
        raise ValueError("GOOGLE_MAPS_API_KEY is not configured")
    
    # Prepare API request
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {
        "origin": f"{start['lat']},{start['lng']}",
        "destination": f"{end['lat']},{end['lng']}",
        "mode": "walking",
        "alternatives": "true",
        "key": GOOGLE_MAPS_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Check API response status
        status = data.get("status")
        if status != "OK":
            error_message = data.get("error_message", "Unknown error")
            raise Exception(f"Google Maps API error: {status}. {error_message}")
        
        # Return raw route objects
        return data.get("routes", [])
    
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch routes from Google Maps: {str(e)}")

