"""
Route handler for /safe-route endpoint.
"""
from flask import Blueprint, request, jsonify
from app.services.google_routes import get_candidate_routes
from app.services.weather import get_weather_visibility
# Import from backend/services/ (relative to backend root)
import sys
from pathlib import Path
backend_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_root))
from services.safety_score import score_route

bp = Blueprint('safe_route', __name__)


@bp.route('/safe-route', methods=['POST'])
def get_safe_route():
    """
    Calculate the safest route between two coordinates.
    
    Request body:
    {
        "start": {"lat": number, "lng": number},
        "end": {"lat": number, "lng": number}
    }
    
    Returns:
        JSON with best route, all routes, and context
    """
    try:
        data = request.get_json()
        
        # Validate request
        if not data:
            return jsonify({"error": "Invalid request", "message": "Request body is required"}), 400
        
        start = data.get("start")
        end = data.get("end")
        
        if not start or not end:
            return jsonify({
                "error": "Invalid coordinates",
                "message": "Start and end coordinates are required"
            }), 400
        
        if "lat" not in start or "lng" not in start:
            return jsonify({
                "error": "Invalid start coordinates",
                "message": "Start must have 'lat' and 'lng' keys"
            }), 400
        
        if "lat" not in end or "lng" not in end:
            return jsonify({
                "error": "Invalid end coordinates",
                "message": "End must have 'lat' and 'lng' keys"
            }), 400
        
        # Validate coordinate values
        try:
            start_lat = float(start["lat"])
            start_lng = float(start["lng"])
            end_lat = float(end["lat"])
            end_lng = float(end["lng"])
        except (ValueError, TypeError) as e:
            return jsonify({
                "error": "Invalid coordinate values",
                "message": f"Coordinates must be valid numbers: {str(e)}"
            }), 400
        
        # Get candidate routes from Google Maps
        try:
            routes = get_candidate_routes(start, end)
        except Exception as e:
            return jsonify({
                "error": "Route calculation failed",
                "message": str(e)
            }), 500
        
        if not routes:
            return jsonify({
                "error": "No routes found",
                "message": "Unable to find routes between the specified locations"
            }), 404
        
        # Get weather visibility (use midpoint of route)
        midpoint_lat = (start_lat + end_lat) / 2
        midpoint_lng = (start_lng + end_lng) / 2
        
        try:
            weather = get_weather_visibility(midpoint_lat, midpoint_lng)
        except Exception as e:
            # Fallback to default weather if API fails
            weather = {"visibility": 10000, "condition": "Clear"}
        
        # Score each route
        scored_routes = []
        for route in routes:
            try:
                route_score = score_route(route, weather)
                scored_routes.append({
                    "route": route,
                    "score": route_score
                })
            except Exception as e:
                # Skip routes that fail to score
                continue
        
        if not scored_routes:
            return jsonify({
                "error": "Route scoring failed",
                "message": "Unable to score any routes"
            }), 500
        
        # Find route with highest safetyScore
        best_route_data = max(scored_routes, key=lambda x: x["score"]["safetyScore"])
        best_route = best_route_data["route"]
        best_score = best_route_data["score"]
        
        # Format all routes for response
        all_routes = []
        for route_data in scored_routes:
            route = route_data["route"]
            score = route_data["score"]
            all_routes.append({
                "safetyScore": score["safetyScore"],
                "distanceMeters": score["distanceMeters"],
                "etaMinutes": score["etaMinutes"],
                "polyline": score["polyline"],
                "explanation": score["explanation"],
                "tags": score["tags"]
            })
        
        # Format response
        response = {
            "bestRoute": {
                "safetyScore": best_score["safetyScore"],
                "distanceMeters": best_score["distanceMeters"],
                "etaMinutes": best_score["etaMinutes"],
                "polyline": best_score["polyline"],
                "explanation": best_score["explanation"],
                "tags": best_score["tags"]
            },
            "allRoutes": all_routes,
            "context": {
                "weather": {
                    "visibility": weather["visibility"],
                    "condition": weather["condition"]
                }
            }
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500

