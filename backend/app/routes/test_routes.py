"""
Test route for verifying Google Maps API integration.
"""
from flask import Blueprint, jsonify
from app.services.google_routes import get_candidate_routes

bp = Blueprint('test_routes', __name__)


@bp.route('/test-routes', methods=['GET'])
def test_routes():
    """
    Test endpoint to verify Google Maps API key works.
    Uses two UW campus coordinates.
    """
    # UW campus coordinates
    start = {"lat": 47.6553, "lng": -122.3035}  # Near Red Square
    end = {"lat": 47.6530, "lng": -122.3045}    # Near Suzzallo Library
    
    try:
        routes = get_candidate_routes(start, end)
        return jsonify({
            "status": "success",
            "number_of_routes": len(routes),
            "message": f"Successfully fetched {len(routes)} route(s) from Google Maps API"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "message": "Failed to fetch routes from Google Maps API"
        }), 500

