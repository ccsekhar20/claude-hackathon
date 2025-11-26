"""
Entry point for SafeWalk AI backend server.
"""
from app import create_app

app = create_app()

if __name__ == "__main__":
    from config import FLASK_PORT, FLASK_DEBUG
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host="0.0.0.0")

