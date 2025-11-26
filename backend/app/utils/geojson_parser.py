"""
Utilities for parsing UW Maps GeoJSON data for emergency callboxes.
"""
import json
from typing import List
from app.models.route import Coordinate


def parse_callboxes_geojson(geojson_data: dict) -> List[Coordinate]:
    """
    Parse GeoJSON data and extract emergency callbox coordinates.
    
    Args:
        geojson_data: GeoJSON dictionary
    
    Returns:
        List of callbox coordinates
    """
    callboxes = []
    
    if geojson_data.get("type") == "FeatureCollection":
        features = geojson_data.get("features", [])
        for feature in features:
            geometry = feature.get("geometry", {})
            if geometry.get("type") == "Point":
                coordinates = geometry.get("coordinates", [])
                if len(coordinates) >= 2:
                    # GeoJSON format is [lng, lat]
                    lng, lat = coordinates[0], coordinates[1]
                    callboxes.append(Coordinate(lat=lat, lng=lng))
    
    elif geojson_data.get("type") == "Feature":
        geometry = geojson_data.get("geometry", {})
        if geometry.get("type") == "Point":
            coordinates = geometry.get("coordinates", [])
            if len(coordinates) >= 2:
                lng, lat = coordinates[0], coordinates[1]
                callboxes.append(Coordinate(lat=lat, lng=lng))
    
    return callboxes


def load_callboxes_from_file(file_path: str) -> List[Coordinate]:
    """
    Load callboxes from a local GeoJSON file.
    
    Args:
        file_path: Path to the GeoJSON file
    
    Returns:
        List of callbox coordinates
    """
    with open(file_path, 'r') as f:
        geojson_data = json.load(f)
    return parse_callboxes_geojson(geojson_data)

