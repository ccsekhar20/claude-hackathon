"""
Distance calculation utilities using Haversine formula.
"""
from math import radians, sin, cos, sqrt, atan2
from app.models.route import Coordinate


def haversine_distance(coord1: Coordinate, coord2: Coordinate) -> float:
    """
    Calculate the great circle distance between two points on Earth.
    
    Args:
        coord1: First coordinate
        coord2: Second coordinate
    
    Returns:
        Distance in meters
    """
    # Earth's radius in meters
    R = 6371000
    
    lat1_rad = radians(coord1.lat)
    lat2_rad = radians(coord2.lat)
    delta_lat = radians(coord2.lat - coord1.lat)
    delta_lng = radians(coord2.lng - coord1.lng)
    
    a = sin(delta_lat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(delta_lng / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    
    return R * c


def point_to_line_distance(
    point: Coordinate,
    line_start: Coordinate,
    line_end: Coordinate
) -> float:
    """
    Calculate the shortest distance from a point to a line segment.
    
    Args:
        point: The point
        line_start: Start of the line segment
        line_end: End of the line segment
    
    Returns:
        Distance in meters
    """
    # Convert to radians
    lat1, lng1 = radians(line_start.lat), radians(line_start.lng)
    lat2, lng2 = radians(line_end.lat), radians(line_end.lng)
    lat_p, lng_p = radians(point.lat), radians(point.lng)
    
    # Earth's radius
    R = 6371000
    
    # Vector from line_start to line_end
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    
    # Vector from line_start to point
    dlat_p = lat_p - lat1
    dlng_p = lng_p - lng1
    
    # Dot product to find projection
    dot = dlat * dlat_p + dlng * dlng_p
    len_sq = dlat * dlat + dlng * dlng
    
    if len_sq == 0:
        # Line segment is a point
        return haversine_distance(point, line_start)
    
    # Parameter for closest point on line segment
    t = max(0, min(1, dot / len_sq))
    
    # Closest point on line segment
    closest_lat = lat1 + t * dlat
    closest_lng = lng1 + t * dlng
    
    # Distance from point to closest point
    closest_coord = Coordinate(
        lat=closest_lat * 180 / 3.14159265359,
        lng=closest_lng * 180 / 3.14159265359
    )
    
    return haversine_distance(point, closest_coord)


def find_nearest_callbox(
    route_waypoints: list,
    callbox: Coordinate
) -> float:
    """
    Find the minimum distance from a callbox to any point on the route.
    
    Args:
        route_waypoints: List of waypoints along the route
        callbox: Callbox location
    
    Returns:
        Minimum distance in meters
    """
    if not route_waypoints:
        return float('inf')
    
    min_distance = float('inf')
    
    # Check distance to each waypoint
    for waypoint in route_waypoints:
        distance = haversine_distance(
            Coordinate(lat=waypoint.lat, lng=waypoint.lng),
            callbox
        )
        min_distance = min(min_distance, distance)
    
    # Check distance to line segments between waypoints
    for i in range(len(route_waypoints) - 1):
        segment_start = Coordinate(
            lat=route_waypoints[i].lat,
            lng=route_waypoints[i].lng
        )
        segment_end = Coordinate(
            lat=route_waypoints[i + 1].lat,
            lng=route_waypoints[i + 1].lng
        )
        distance = point_to_line_distance(callbox, segment_start, segment_end)
        min_distance = min(min_distance, distance)
    
    return min_distance

