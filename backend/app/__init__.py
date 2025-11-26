"""
SafeWalk AI Backend - Flask Application Factory
"""
from flask import Flask
from flask_cors import CORS
from app.routes import safe_route, test_routes


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Enable CORS for React Native app
    CORS(app, resources={
        r"/*": {
            "origins": ["*"],  # In production, restrict to specific origins
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    app.register_blueprint(safe_route.bp)
    app.register_blueprint(test_routes.bp)
    
    # Root endpoint
    @app.route("/")
    def root():
        return {
            "service": "SafeWalk AI Backend",
            "version": "1.0.0",
            "endpoints": {
                "health": "/health",
                "safe_route": "/safe-route (POST)",
                "test_routes": "/test-routes (GET)"
            },
            "status": "running"
        }
    
    # Health check endpoint
    @app.route("/health")
    def health():
        return {"status": "ok"}
    
    return app

