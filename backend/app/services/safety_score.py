"""
Safety scoring module for Google Maps walking routes.
Computes a safety score (0-100) based on distance and weather visibility.
"""
import polyline
from typing import List, Dict


def normalize(value: float, min_val: float, max_val: float) -> float:
    """
    Normalize a value to the range [0, 1] using min-max normalization.
    
    Args:
        value: Value to normalize
        min_val: Minimum value (maps to 0)
        max_val: Maximum value (maps to 1)
    
    Returns:
        Normalized value between 0 and 1
    """
    if max_val == min_val:
        return 1.0
    
    normalized = (value - min_val) / (max_val - min_val)
    return max(0.0, min(1.0, normalized))  # Clamp between 0 and 1


def compute_safety_score(
    route: Dict,
    visibility_meters: float
) -> Dict:
    """
    Compute a safety score (0-100) for a Google Maps walking route.
    
    Args:
        route: Google Maps route object (from get_candidate_routes)
            Must contain:
            - "overview_polyline" with "points" key
            - "legs" array with distance and duration
        visibility_meters: Current weather visibility in meters
    
    Returns:
        Dictionary with:
        - safetyScore: int (0-100)
        - explanation: List[str] (2-4 human-readable sentences)
        - tags: List[str]
        - polyline: str (original encoded polyline)
        - etaMinutes: int
        - distanceMeters: int
    """
    # Extract route data
    overview_polyline = route.get("overview_polyline", {})
    encoded_polyline = overview_polyline.get("points", "")
    
    # Decode polyline to get coordinates
    try:
        coordinates = polyline.decode(encoded_polyline)
        # Sample up to ~50 points along the route using slicing
        if len(coordinates) > 50:
            step = len(coordinates) // 50
            sampled_coordinates = coordinates[::step][:50]
        else:
            sampled_coordinates = coordinates
    except Exception:
        # If polyline decoding fails, use empty list
        sampled_coordinates = []
    
    # Extract distance and duration from route legs
    legs = route.get("legs", [])
    distance_meters = 0
    duration_seconds = 0
    
    for leg in legs:
        distance_meters += leg.get("distance", {}).get("value", 0)
        duration_seconds += leg.get("duration", {}).get("value", 0)
    
    eta_minutes = int(duration_seconds / 60)
    
    # Compute visibility score (normalize visibility between 2000 and 10000 meters)
    # visibility < 2000 → very low (score ~0)
    # visibility >= 10000 → max score = 1
    visibility_score = normalize(visibility_meters, min_val=2000, max_val=10000)
    
    # Compute length score
    # Shorter routes are safer
    # Use maxDistance = 2000 meters (2km). Any route longer than that gets lengthScore = 0
    max_distance = 2000  # meters
    if distance_meters > max_distance:
        length_score = 0.0
    else:
        # Normalize: maxDistance - distanceMeters, where distanceMeters=0 gives max score
        length_score = normalize(max_distance - distance_meters, min_val=0, max_val=max_distance)
    
    # Combine with weights
    w_vis = 0.6
    w_len = 0.4
    
    risk = (
        w_vis * (1 - visibility_score) +
        w_len * (1 - length_score)
    )
    
    safety_score = max(0, int(100 - risk * 100))
    
    # Produce tags
    tags = []
    if visibility_score > 0.7:
        tags.append("Good visibility")
    elif visibility_score < 0.3:
        tags.append("Poor visibility")
    
    if length_score > 0.7:
        tags.append("Short route")
    
    # Add nighttime penalty tag if visibility < 4000m
    if visibility_meters < 4000:
        tags.append("Low visibility conditions")
    
    # Produce explanation list with 2-4 human-readable sentences
    explanation = []
    
    # Distance explanation
    if distance_meters <= 1000:
        explanation.append(f"This is a short route of {distance_meters}m, taking approximately {eta_minutes} minutes.")
    elif distance_meters <= 2000:
        explanation.append(f"This route is {distance_meters}m long and takes approximately {eta_minutes} minutes.")
    else:
        explanation.append(f"This is a longer route of {distance_meters}m, taking approximately {eta_minutes} minutes.")
    
    # Visibility explanation
    if visibility_score > 0.7:
        explanation.append(f"Excellent visibility conditions ({int(visibility_meters)}m) make this route safer.")
    elif visibility_score > 0.3:
        explanation.append(f"Moderate visibility ({int(visibility_meters)}m) is acceptable for walking.")
    else:
        explanation.append(f"Poor visibility ({int(visibility_meters)}m) reduces safety, especially at night.")
    
    # Length impact
    if length_score > 0.7:
        explanation.append("The short distance minimizes exposure time.")
    elif length_score < 0.3:
        explanation.append("The longer distance increases overall risk.")
    
    # Safety score summary
    if safety_score >= 80:
        explanation.append("Overall, this route has a high safety score.")
    elif safety_score >= 60:
        explanation.append("This route has a moderate safety score.")
    else:
        explanation.append("This route has a lower safety score due to visibility and distance factors.")
    
    # Ensure explanation has 2-4 sentences
    if len(explanation) > 4:
        explanation = explanation[:4]
    elif len(explanation) < 2:
        explanation.append("Consider your comfort level with the route conditions.")
    
    return {
        "safetyScore": safety_score,
        "explanation": explanation,
        "tags": tags,
        "polyline": encoded_polyline,
        "etaMinutes": eta_minutes,
        "distanceMeters": distance_meters
    }

