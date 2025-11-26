"""
Entry point for SafeWalk AI backend server.
"""
from app import create_app

app = create_app()
socketio = app.socketio

if __name__ == "__main__":
    from config import FLASK_PORT, FLASK_DEBUG
    # Use socketio.run instead of app.run to enable Socket.IO support
    socketio.run(app, debug=FLASK_DEBUG, port=FLASK_PORT, host="0.0.0.0")

