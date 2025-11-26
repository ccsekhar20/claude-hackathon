"""
Route data models for representing Google Maps routes and waypoints.
"""
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Coordinate:
    """Represents a geographic coordinate."""
    lat: float
    lng: float
    
    def __post_init__(self):
        """Validate coordinate values."""
        if not (-90 <= self.lat <= 90):
            raise ValueError(f"Latitude must be between -90 and 90, got {self.lat}")
        if not (-180 <= self.lng <= 180):
            raise ValueError(f"Longitude must be between -180 and 180, got {self.lng}")


@dataclass
class Waypoint:
    """Represents a waypoint along a route."""
    lat: float
    lng: float
    step_index: Optional[int] = None  # Index in the route steps


@dataclass
class RouteSegment:
    """Represents a segment of a route."""
    start: Coordinate
    end: Coordinate
    distance_meters: float
    duration_seconds: float
    polyline: str  # Encoded polyline string


@dataclass
class Route:
    """Represents a complete route from start to end."""
    route_id: str
    distance_meters: float
    duration_seconds: float
    polyline: str  # Encoded polyline for the entire route
    waypoints: List[Waypoint]
    bounds: Optional[dict] = None  # {"northeast": {lat, lng}, "southwest": {lat, lng}}
    steps: Optional[List[RouteSegment]] = None  # Detailed step-by-step breakdown

