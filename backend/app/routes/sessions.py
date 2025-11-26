"""
Session management routes for walk sessions.
Handles session creation, location updates, panic, and arrival.
"""
import uuid
from datetime import datetime, timedelta, timezone
import threading
from flask import Blueprint, request, jsonify
from flask_socketio import join_room

bp = Blueprint('sessions', __name__)

# In-memory session storage (shared across requests)
sessions = {}  # session_id -> session dict
inactivity_timers = {}  # session_id -> Timer
INACTIVITY_MINUTES = 3

# SocketIO instance (will be set by app factory)
socketio = None


def set_socketio(instance):
    """Set the SocketIO instance for this module."""
    global socketio
    socketio = instance


def create_session(data):
    """
    Create a new walk session.
    
    Args:
        data: Dictionary containing session data (userName, startLocation, endLocation, etc.)
    
    Returns:
        Dictionary representing the created session
    """
    session_id = str(uuid.uuid4())
    share_token = uuid.uuid4().hex[:10]
    
    session = {
        "id": session_id,
        "shareToken": share_token,
        "userName": data.get("userName", ""),
        "startLocation": data.get("startLocation", {}),
        "endLocation": data.get("endLocation", {}),
        "status": "active",
        "createdAt": datetime.now(timezone.utc),
        "lastUpdateAt": None,
        "lastLocation": None,
        "eta": None,
        "autoNotify": data.get("autoNotify", {}),
        "companion": {
            "enabled": data.get("liveCompanionEnabled", False),
            "joinedAt": None,
        },
    }
    
    sessions[session_id] = session
    return session


def get_session_by_id(session_id):
    """
    Get a session by its ID.
    
    Args:
        session_id: The session ID to look up
    
    Returns:
        Session dictionary if found, None otherwise
    """
    return sessions.get(session_id)


def get_session_by_share_token(token):
    """
    Get a session by its share token.
    
    Args:
        token: The share token to look up
    
    Returns:
        Session dictionary if found, None otherwise
    """
    for session in sessions.values():
        if session.get("shareToken") == token:
            return session
    return None


def check_inactivity(session_id):
    """
    Check if a session has been inactive and emit an alert if so.
    
    Args:
        session_id: The session ID to check
    """
    if not socketio:
        return
        
    session = sessions.get(session_id)
    if not session:
        return
    
    if session["status"] == "active" and session["lastUpdateAt"]:
        time_since_update = datetime.now(timezone.utc) - session["lastUpdateAt"]
        if time_since_update > timedelta(minutes=INACTIVITY_MINUTES):
            socketio.emit("inactivity_alert", {
                "message": "User has been inactive for a while.",
                "lastLocation": session["lastLocation"],
            }, room=session_id)


def schedule_inactivity_check(session_id):
    """
    Schedule an inactivity check for a session.
    Cancels any existing timer for the session first.
    
    Args:
        session_id: The session ID to schedule a check for
    """
    # Cancel existing timer if any
    if session_id in inactivity_timers:
        inactivity_timers[session_id].cancel()
    
    # Schedule new timer
    timer = threading.Timer(
        INACTIVITY_MINUTES * 60,
        check_inactivity,
        args=(session_id,)
    )
    timer.start()
    inactivity_timers[session_id] = timer


def send_arrival_notification(session):
    """
    Send arrival notification via Auto-Notify (currently logs to console).
    Auto-Notify Arrival: Sends a notification when user arrives at destination.
    
    TODO: Replace console logging with actual Twilio SMS or email integration.
    For Twilio: Use twilio.rest.Client to send SMS
    For email: Use smtplib or a service like SendGrid
    
    Args:
        session: The session dictionary containing autoNotify configuration
    """
    auto = session.get("autoNotify") or {}
    if not auto.get("enabled"):
        return
    
    text = f'{session["userName"]} has arrived safely at their destination via SafeWalk AI.'
    contact = auto.get("contactValue")
    channel = auto.get("contactChannel", "sms")
    
    # For now, just print the notification to the console for demo:
    print(f"[AUTO-NOTIFY:{channel}] To {contact}: {text}")


@bp.route("/api/sessions", methods=["POST"])
def create_walk_session():
    """
    Create a new walk session.
    Supports Live Companion Mode and Auto-Notify Arrival configuration.
    
    Expected JSON:
    {
        "userName": "Agastya",
        "startLocation": { "lat": 47.655, "lng": -122.308 },
        "endLocation": { "lat": 47.658, "lng": -122.313 },
        "autoNotify": {
            "enabled": true,
            "contactName": "Mom",
            "contactChannel": "sms",
            "contactValue": "+12065551234"
        },
        "liveCompanionEnabled": true
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid request body"}), 400
    
    session = create_session(data)
    
    return jsonify({
        "sessionId": session["id"],
        "shareUrl": f"https://placeholder-frontend-url/companion/{session['shareToken']}"
    }), 201


@bp.route("/api/sessions/share/<share_token>", methods=["GET"])
def get_session_by_share(share_token):
    """
    Get session information by share token (for companion view).
    Live Companion Mode: Allows companions to view walk status via share token.
    
    Args:
        share_token: The share token to look up
    """
    session = get_session_by_share_token(share_token)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    # Format response to match what frontend expects
    # Convert location objects to strings for display
    start_loc = session["startLocation"]
    end_loc = session["endLocation"]
    
    start_location_str = "Bagley Hall, University of Washington" if isinstance(start_loc, dict) else str(start_loc)
    end_location_str = "The Standard at Seattle" if isinstance(end_loc, dict) else str(end_loc)
    
    return jsonify({
        "userName": session["userName"],
        "startLocation": start_location_str,
        "endLocation": end_location_str,
        "startedAt": session["createdAt"].isoformat(),
        "status": session["status"],
        "lastLocation": session["lastLocation"],
        "eta": session["eta"]
    })


@bp.route("/api/sessions/<session_id>/location", methods=["POST"])
def update_location(session_id):
    """
    Update the location for a walk session.
    
    Args:
        session_id: The session ID to update
    
    Expected JSON:
    {
        "lat": 47.656,
        "lng": -122.310
    }
    """
    session = get_session_by_id(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    data = request.get_json()
    if not data or "lat" not in data or "lng" not in data:
        return jsonify({"error": "Invalid request body. Expected lat and lng"}), 400
    
    # Update session location
    session["lastLocation"] = {
        "lat": data["lat"],
        "lng": data["lng"]
    }
    session["lastUpdateAt"] = datetime.now(timezone.utc)
    
    # Compute dummy ETA (e.g., "11:42 PM")
    now = datetime.now(timezone.utc)
    session["eta"] = now.strftime("%I:%M %p")
    
    # Emit location update to all clients in the session room
    if socketio:
        socketio.emit("location_update", {
            "lat": session["lastLocation"]["lat"],
            "lng": session["lastLocation"]["lng"],
            "timestamp": session["lastUpdateAt"].isoformat(),
            "eta": session["eta"],
        }, room=session_id)
    
    # Schedule inactivity check
    schedule_inactivity_check(session_id)
    
    return jsonify({"ok": True})


@bp.route("/api/sessions/<session_id>/panic", methods=["POST"])
def trigger_panic(session_id):
    """
    Trigger a panic/SOS event for a walk session.
    
    Args:
        session_id: The session ID to trigger panic for
    """
    session = get_session_by_id(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    # Update session status
    session["status"] = "panic"
    
    # Emit panic event to all clients in the session room
    if socketio:
        socketio.emit("panic", {
            "message": "User triggered SOS.",
            "lastLocation": session["lastLocation"],
        }, room=session_id)
    
    return jsonify({"ok": True})


@bp.route("/api/sessions/<session_id>/arrive", methods=["POST"])
def arrive(session_id):
    """
    Mark a walk session as arrived and trigger Auto-Notify Arrival.
    Auto-Notify Arrival: Sends notification to configured contact when user arrives.
    
    Args:
        session_id: The session ID to mark as arrived
    """
    session = get_session_by_id(session_id)
    
    if not session:
        return jsonify({"error": "Session not found"}), 404
    
    # Update session status and arrival time
    session["status"] = "arrived"
    session["arrivedAt"] = datetime.now(timezone.utc)
    
    # Cancel any inactivity timer for this session
    if session_id in inactivity_timers:
        inactivity_timers[session_id].cancel()
        del inactivity_timers[session_id]
    
    # Emit arrived event to all clients in the session room
    if socketio:
        socketio.emit("arrived", {
            "arrivedAt": session["arrivedAt"].isoformat()
        }, room=session_id)
        
        # Also emit arrival_notification for companion screen
        socketio.emit("arrival_notification", {
            "message": f"{session['userName']} has arrived safely at their destination.",
            "arrivedAt": session["arrivedAt"].isoformat()
        }, room=session_id)
    
    # Send arrival notification via Auto-Notify
    send_arrival_notification(session)
    
    return jsonify({"ok": True})


def register_socketio_handlers(socketio_instance):
    """
    Register Socket.IO event handlers for session management.
    
    Args:
        socketio_instance: The SocketIO instance to register handlers on
    """
    @socketio_instance.on("join_session")
    def handle_join_session(data):
        """
        Handle Socket.IO event to join a session by session ID.
        
        Expected data:
        {
            "sessionId": "<uuid>"
        }
        """
        session_id = data.get("sessionId")
        if not session_id:
            return
        
        session = get_session_by_id(session_id)
        if session:
            join_room(session_id)

    @socketio_instance.on("join_session_by_token")
    def handle_join_session_by_token(data):
        """
        Handle Socket.IO event to join a session by share token.
        
        Expected data:
        {
            "shareToken": "<token>"
        }
        """
        share_token = data.get("shareToken")
        if not share_token:
            return
        
        session = get_session_by_share_token(share_token)
        if session:
            join_room(session["id"])
            # Update companion joined timestamp if not already set
            if not session["companion"]["joinedAt"]:
                session["companion"]["joinedAt"] = datetime.now(timezone.utc)

