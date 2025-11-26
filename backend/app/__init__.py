"""
SafeWalk AI Backend - Flask Application Factory
"""
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from app.routes import safe_route, test_routes, sessions


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "dev-secret"  # TODO: Use env var in production
    
    # Enable CORS for React Native app
    CORS(app, resources={
        r"/*": {
            "origins": ["*"],  # In production, restrict to specific origins
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize Socket.IO with CORS enabled for all origins
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")
    
    # Set Socket.IO instance for sessions module
    sessions.set_socketio(socketio)
    
    # Register Socket.IO handlers for sessions
    sessions.register_socketio_handlers(socketio)
    
    # Register blueprints
    app.register_blueprint(safe_route.bp)
    app.register_blueprint(test_routes.bp)
    app.register_blueprint(sessions.bp)
    
    # Root endpoint
    @app.route("/")
    def root():
        return {
            "service": "SafeWalk AI Backend",
            "version": "1.0.0",
            "endpoints": {
                "health": "/health",
                "safe_route": "/safe-route (POST)",
                "test_routes": "/test-routes (GET)",
                "sessions": "/api/sessions (POST)",
                "session_by_share": "/api/sessions/share/<token> (GET)",
                "update_location": "/api/sessions/<id>/location (POST)",
                "panic": "/api/sessions/<id>/panic (POST)",
                "arrive": "/api/sessions/<id>/arrive (POST)"
            },
            "status": "running"
        }
    
    # Health check endpoint
    @app.route("/health")
    def health():
        return {"status": "ok"}
    
    # Store socketio in app for access in run.py
    app.socketio = socketio
    
    return app

