"""
Service for calculating safety scores for routes.
"""
from typing import List, Optional
from datetime import datetime
from app.models.route import Route, Waypoint
from app.models.safety import (
    SafetyScore,
    SafetyFactors,
    SafetyTag,
    CallboxLocation,
    UWAlert
)


class SafetyScorer:
    """Service for calculating safety scores based on multiple factors."""
    
    # Scoring weights (sum should be ~1.0)
    WEIGHT_CALLBOX = 0.35
    WEIGHT_VISIBILITY = 0.25
    WEIGHT_ALERTS = 0.25
    WEIGHT_TIME_OF_DAY = 0.10
    WEIGHT_ROUTE_LENGTH = 0.05
    
    # Thresholds
    CALLBOX_OPTIMAL_DISTANCE = 50.0  # meters - ideal distance
    CALLBOX_MAX_DISTANCE = 200.0  # meters - beyond this, no benefit
    VISIBILITY_GOOD = 10000  # meters
    VISIBILITY_POOR = 1000  # meters
    ROUTE_LENGTH_PREFERRED = 500.0  # meters - shorter is slightly better
    
    def calculate_safety_score(
        self,
        route: Route,
        callboxes: List[CallboxLocation],
        weather_data: dict,
        alerts: List[UWAlert],
        time_of_day: Optional[datetime] = None
    ) -> SafetyScore:
        """
        Calculate a comprehensive safety score for a route.
        
        Args:
            route: The route to score
            callboxes: Callboxes along/near the route
            weather_data: Weather data from WeatherService
            alerts: Active UW alerts
            time_of_day: Current time (defaults to now)
        
        Returns:
            SafetyScore object with score, explanation, tags, and factors
        """
        if time_of_day is None:
            time_of_day = datetime.now()
        
        # Calculate individual factor scores
        callbox_score = self._score_callbox_proximity(callboxes)
        visibility_score = self._score_weather_visibility(weather_data)
        alerts_penalty = self._score_alerts(alerts)
        time_score = self._score_time_of_day(time_of_day)
        length_score = self._score_route_length(route.distance_meters)
        
        factors = SafetyFactors(
            callbox_proximity_score=callbox_score,
            weather_visibility_score=visibility_score,
            alerts_penalty=alerts_penalty,
            time_of_day_score=time_score,
            route_length_score=length_score
        )
        
        # Calculate weighted overall score
        base_score = (
            callbox_score * self.WEIGHT_CALLBOX +
            visibility_score * self.WEIGHT_VISIBILITY +
            time_score * self.WEIGHT_TIME_OF_DAY +
            length_score * self.WEIGHT_ROUTE_LENGTH
        )
        
        # Apply alerts penalty (subtract from score)
        final_score = max(0, min(100, base_score - alerts_penalty))
        
        # Generate tags
        tags = self._generate_tags(
            callboxes, weather_data, alerts, time_of_day, route.distance_meters
        )
        
        # Generate explanation
        explanation = self._generate_explanation(
            callboxes, weather_data, alerts, time_of_day, factors
        )
        
        return SafetyScore(
            score=round(final_score, 1),
            explanation=explanation,
            tags=tags,
            factors=factors
        )
    
    def _score_callbox_proximity(self, callboxes: List[CallboxLocation]) -> float:
        """Score based on proximity to emergency callboxes."""
        if not callboxes:
            return 30.0  # Low score if no callboxes nearby
        
        # Use the closest callbox
        closest = min(callboxes, key=lambda x: x.distance_meters)
        distance = closest.distance_meters
        
        if distance <= self.CALLBOX_OPTIMAL_DISTANCE:
            return 100.0
        elif distance <= self.CALLBOX_MAX_DISTANCE:
            # Linear interpolation between optimal and max
            ratio = (self.CALLBOX_MAX_DISTANCE - distance) / (
                self.CALLBOX_MAX_DISTANCE - self.CALLBOX_OPTIMAL_DISTANCE
            )
            return 50.0 + (ratio * 50.0)
        else:
            return 30.0
    
    def _score_weather_visibility(self, weather_data: dict) -> float:
        """Score based on weather visibility."""
        visibility = weather_data.get("visibility_meters", 10000)
        weather_condition = weather_data.get("weather_condition", "Clear").lower()
        
        # Check for poor weather conditions
        poor_conditions = ["fog", "mist", "haze", "rain", "snow", "storm"]
        is_poor_weather = any(cond in weather_condition for cond in poor_conditions)
        
        if visibility >= self.VISIBILITY_GOOD and not is_poor_weather:
            return 100.0
        elif visibility >= self.VISIBILITY_POOR:
            # Linear interpolation
            ratio = (visibility - self.VISIBILITY_POOR) / (
                self.VISIBILITY_GOOD - self.VISIBILITY_POOR
            )
            base_score = 50.0 + (ratio * 50.0)
            # Reduce if poor weather condition
            return base_score * (0.7 if is_poor_weather else 1.0)
        else:
            return 30.0
    
    def _score_alerts(self, alerts: List[UWAlert]) -> float:
        """Calculate penalty based on active alerts."""
        if not alerts:
            return 0.0
        
        # Sum up penalties based on alert severity
        total_penalty = 0.0
        for alert in alerts:
            if not alert.active:
                continue
            
            severity_penalties = {
                "low": 5.0,
                "medium": 15.0,
                "high": 30.0,
                "critical": 50.0
            }
            total_penalty += severity_penalties.get(alert.severity, 15.0)
        
        # Cap penalty at 50 points
        return min(50.0, total_penalty)
    
    def _score_time_of_day(self, time_of_day: datetime) -> float:
        """Score based on time of day (daylight vs nighttime)."""
        hour = time_of_day.hour
        
        # Daylight hours (roughly 6 AM to 8 PM)
        if 6 <= hour < 20:
            return 100.0
        # Dusk/dawn (5-6 AM, 8-9 PM)
        elif (5 <= hour < 6) or (20 <= hour < 21):
            return 70.0
        # Nighttime
        else:
            return 40.0
    
    def _score_route_length(self, distance_meters: float) -> float:
        """Score based on route length (shorter is slightly better)."""
        if distance_meters <= self.ROUTE_LENGTH_PREFERRED:
            return 100.0
        else:
            # Slight penalty for longer routes
            ratio = min(1.0, self.ROUTE_LENGTH_PREFERRED / distance_meters)
            return 70.0 + (ratio * 30.0)
    
    def _generate_tags(
        self,
        callboxes: List[CallboxLocation],
        weather_data: dict,
        alerts: List[UWAlert],
        time_of_day: datetime,
        route_length: float
    ) -> List[SafetyTag]:
        """Generate safety tags based on route characteristics."""
        tags = []
        
        # Callbox tags
        if len(callboxes) >= 2:
            tags.append(SafetyTag.MULTIPLE_CALLBOXES)
        elif len(callboxes) == 1:
            tags.append(SafetyTag.CALLBOX_NEARBY)
        else:
            tags.append(SafetyTag.NO_CALLBOXES)
        
        # Time of day tags
        hour = time_of_day.hour
        if 6 <= hour < 20:
            tags.append(SafetyTag.DAYLIGHT)
        else:
            tags.append(SafetyTag.NIGHTTIME)
        
        # Visibility tags
        visibility = weather_data.get("visibility_meters", 10000)
        if visibility >= self.VISIBILITY_GOOD:
            tags.append(SafetyTag.GOOD_VISIBILITY)
        else:
            tags.append(SafetyTag.POOR_VISIBILITY)
        
        # Alert tags
        if alerts:
            tags.append(SafetyTag.ACTIVE_ALERTS)
        else:
            tags.append(SafetyTag.NO_ALERTS)
        
        # Route length tags
        if route_length <= self.ROUTE_LENGTH_PREFERRED:
            tags.append(SafetyTag.SHORT_ROUTE)
        else:
            tags.append(SafetyTag.LONGER_ROUTE)
        
        return tags
    
    def _generate_explanation(
        self,
        callboxes: List[CallboxLocation],
        weather_data: dict,
        alerts: List[UWAlert],
        time_of_day: datetime,
        factors: SafetyFactors
    ) -> str:
        """Generate a human-readable explanation of the safety score."""
        parts = []
        
        # Callbox explanation
        if callboxes:
            count = len(callboxes)
            closest = min(callboxes, key=lambda x: x.distance_meters)
            parts.append(f"Route passes near {count} emergency callbox{'es' if count > 1 else ''} (closest: {int(closest.distance_meters)}m away)")
        else:
            parts.append("No emergency callboxes nearby")
        
        # Weather explanation
        visibility = weather_data.get("visibility_meters", 10000)
        condition = weather_data.get("weather_description", "clear")
        if visibility >= self.VISIBILITY_GOOD:
            parts.append(f"good visibility ({condition})")
        else:
            parts.append(f"reduced visibility ({condition}, {int(visibility/1000)}km)")
        
        # Alerts explanation
        if alerts:
            parts.append(f"{len(alerts)} active alert{'s' if len(alerts) > 1 else ''} in area")
        else:
            parts.append("no active alerts")
        
        # Time explanation
        hour = time_of_day.hour
        if 6 <= hour < 20:
            parts.append("daylight hours")
        else:
            parts.append("nighttime")
        
        return ", ".join(parts).capitalize() + "."

