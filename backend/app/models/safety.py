"""
Safety scoring models and enums.
"""
from dataclasses import dataclass
from typing import List, Optional
from enum import Enum


class SafetyTag(str, Enum):
    """Tags that describe safety characteristics of a route."""
    WELL_LIT = "well_lit"
    POORLY_LIT = "poorly_lit"
    CALLBOX_NEARBY = "callbox_nearby"
    NO_CALLBOXES = "no_callboxes"
    DAYLIGHT = "daylight"
    NIGHTTIME = "nighttime"
    GOOD_VISIBILITY = "good_visibility"
    POOR_VISIBILITY = "poor_visibility"
    ACTIVE_ALERTS = "active_alerts"
    NO_ALERTS = "no_alerts"
    SHORT_ROUTE = "short_route"
    LONGER_ROUTE = "longer_route"
    MULTIPLE_CALLBOXES = "multiple_callboxes"


@dataclass
class SafetyFactors:
    """Breakdown of safety scoring factors."""
    callbox_proximity_score: float  # 0-100
    weather_visibility_score: float  # 0-100
    alerts_penalty: float  # 0-100 (higher = more penalty, so subtract from score)
    time_of_day_score: float  # 0-100
    route_length_score: float  # 0-100 (shorter routes slightly preferred)


@dataclass
class SafetyScore:
    """Complete safety score and explanation for a route."""
    score: float  # 0-100
    explanation: str
    tags: List[SafetyTag]
    factors: SafetyFactors


@dataclass
class CallboxLocation:
    """Location of an emergency callbox."""
    lat: float
    lng: float
    distance_meters: float  # Distance from the route
    callbox_id: Optional[str] = None


@dataclass
class UWAlert:
    """Represents a UW Alert that may affect route safety."""
    alert_id: str
    title: str
    description: str
    location: Optional[dict] = None  # {"lat": float, "lng": float, "radius_meters": float}
    severity: str = "medium"  # "low", "medium", "high", "critical"
    active: bool = True

