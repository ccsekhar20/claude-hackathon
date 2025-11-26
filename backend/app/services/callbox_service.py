"""
Service for loading and querying UW emergency callbox locations.
"""
import os
import requests
import json
from typing import List, Optional
from app.models.route import Coordinate, Waypoint
from app.models.safety import CallboxLocation
from app.utils.geojson_parser import parse_callboxes_geojson, load_callboxes_from_file
from app.utils.distance import find_nearest_callbox
from config import UW_CALLBOXES_GEOJSON_URL, UW_CALLBOXES_GEOJSON_PATH


class CallboxService:
    """Service for managing UW emergency callbox data."""
    
    def __init__(
        self,
        geojson_url: Optional[str] = None,
        geojson_path: Optional[str] = None
    ):
        self.geojson_url = geojson_url or UW_CALLBOXES_GEOJSON_URL
        self.geojson_path = geojson_path or UW_CALLBOXES_GEOJSON_PATH
        self._callboxes_cache: Optional[List[Coordinate]] = None
    
    def get_callboxes(self) -> List[Coordinate]:
        """
        Load callbox coordinates from GeoJSON source.
        Uses caching to avoid repeated API calls.
        
        Returns:
            List of callbox coordinates
        """
        if self._callboxes_cache is not None:
            return self._callboxes_cache
        
        callboxes = []
        
        # Try local file first
        if self.geojson_path and os.path.exists(self.geojson_path):
            try:
                callboxes = load_callboxes_from_file(self.geojson_path)
            except Exception as e:
                print(f"Error loading callboxes from file: {e}")
        
        # Fallback to URL
        if not callboxes and self.geojson_url:
            try:
                response = requests.get(self.geojson_url, timeout=10)
                response.raise_for_status()
                geojson_data = response.json()
                callboxes = parse_callboxes_geojson(geojson_data)
            except Exception as e:
                print(f"Error loading callboxes from URL: {e}")
        
        # Cache the result
        self._callboxes_cache = callboxes
        return callboxes
    
    def find_callboxes_along_route(
        self,
        route_waypoints: List[Waypoint],
        max_distance_meters: float = 100.0
    ) -> List[CallboxLocation]:
        """
        Find all callboxes within a certain distance of the route.
        
        Args:
            route_waypoints: Waypoints along the route
            max_distance_meters: Maximum distance to consider a callbox "along" the route
        
        Returns:
            List of CallboxLocation objects with distances
        """
        callboxes = self.get_callboxes()
        route_callboxes = []
        
        for idx, callbox in enumerate(callboxes):
            distance = find_nearest_callbox(route_waypoints, callbox)
            
            if distance <= max_distance_meters:
                route_callboxes.append(CallboxLocation(
                    lat=callbox.lat,
                    lng=callbox.lng,
                    distance_meters=distance,
                    callbox_id=f"callbox_{idx}"
                ))
        
        # Sort by distance (closest first)
        route_callboxes.sort(key=lambda x: x.distance_meters)
        
        return route_callboxes
    
    def clear_cache(self):
        """Clear the callboxes cache (useful for testing or updates)."""
        self._callboxes_cache = None

