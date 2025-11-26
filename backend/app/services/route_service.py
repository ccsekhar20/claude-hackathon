"""
Service for fetching routes from Google Maps Directions API.
"""
import os
import requests
import polyline
from typing import List, Optional
from app.models.route import Route, Waypoint, RouteSegment, Coordinate
from config import GOOGLE_MAPS_API_KEY


class RouteService:
    """Service for interacting with Google Maps Directions API."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or GOOGLE_MAPS_API_KEY
        self.base_url = "https://maps.googleapis.com/maps/api/directions/json"
    
    def get_routes(
        self,
        start: Coordinate,
        end: Coordinate,
        alternatives: bool = True
    ) -> List[Route]:
        """
        Fetch candidate routes from Google Maps Directions API.
        
        Args:
            start: Starting coordinate
            end: Ending coordinate
            alternatives: Whether to return alternative routes
        
        Returns:
            List of Route objects
        """
        params = {
            "origin": f"{start.lat},{start.lng}",
            "destination": f"{end.lat},{end.lng}",
            "mode": "walking",
            "alternatives": "true" if alternatives else "false",
            "key": self.api_key
        }
        
        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "OK":
                raise Exception(f"Google Maps API error: {data.get('status')}")
            
            routes = []
            for idx, route_data in enumerate(data.get("routes", [])):
                route = self._parse_route(route_data, f"route_{idx}")
                routes.append(route)
            
            return routes
        
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch routes from Google Maps: {str(e)}")
    
    def _parse_route(self, route_data: dict, route_id: str) -> Route:
        """Parse a route from Google Maps API response."""
        legs = route_data.get("legs", [])
        if not legs:
            raise ValueError("Route has no legs")
        
        # Aggregate distance and duration
        total_distance = sum(leg.get("distance", {}).get("value", 0) for leg in legs)
        total_duration = sum(leg.get("duration", {}).get("value", 0) for leg in legs)
        
        # Get overview polyline
        overview_polyline = route_data.get("overview_polyline", {}).get("points", "")
        
        # Extract waypoints from steps
        waypoints = []
        steps = []
        
        for leg in legs:
            leg_steps = leg.get("steps", [])
            for step_idx, step in enumerate(leg_steps):
                # Start location of step
                start_location = step.get("start_location", {})
                waypoint = Waypoint(
                    lat=start_location.get("lat", 0),
                    lng=start_location.get("lng", 0),
                    step_index=len(steps)
                )
                waypoints.append(waypoint)
                
                # Create route segment
                end_location = step.get("end_location", {})
                segment = RouteSegment(
                    start=Coordinate(
                        lat=start_location.get("lat", 0),
                        lng=start_location.get("lng", 0)
                    ),
                    end=Coordinate(
                        lat=end_location.get("lat", 0),
                        lng=end_location.get("lng", 0)
                    ),
                    distance_meters=step.get("distance", {}).get("value", 0),
                    duration_seconds=step.get("duration", {}).get("value", 0),
                    polyline=step.get("polyline", {}).get("points", "")
                )
                steps.append(segment)
        
        # Add final destination waypoint
        if legs:
            last_leg = legs[-1]
            end_location = last_leg.get("end_location", {})
            waypoints.append(Waypoint(
                lat=end_location.get("lat", 0),
                lng=end_location.get("lng", 0),
                step_index=len(steps)
            ))
        
        # Parse bounds
        bounds = route_data.get("bounds", {})
        bounds_dict = None
        if bounds:
            bounds_dict = {
                "northeast": bounds.get("northeast", {}),
                "southwest": bounds.get("southwest", {})
            }
        
        return Route(
            route_id=route_id,
            distance_meters=total_distance,
            duration_seconds=total_duration,
            polyline=overview_polyline,
            waypoints=waypoints,
            bounds=bounds_dict,
            steps=steps
        )

