# SafeWalk AI Backend

A minimal Flask backend with real-time support using Flask-SocketIO.

## Setup

### 1. Create a Virtual Environment

```bash
python3 -m venv venv
```

### 2. Activate the Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

### 3. Install Requirements

```bash
pip install -r requirements.txt
```

### 4. Run the Server

```bash
python app.py
```

The server will start on `http://0.0.0.0:5000` with debug mode enabled.

## Endpoints

### Health Check

- `GET /health` - Health check endpoint that returns `{"status": "ok"}`

**Example:**
```bash
curl http://localhost:5000/health
```

### Walk Sessions

#### Create a Walk Session

- `POST /api/sessions` - Create a new walk session with Live Companion Mode and Auto-Notify Arrival support

**Example:**
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Agastya",
    "startLocation": {"lat": 47.655, "lng": -122.308},
    "endLocation": {"lat": 47.658, "lng": -122.313},
    "autoNotify": {
      "enabled": true,
      "contactName": "Mom",
      "contactChannel": "sms",
      "contactValue": "+12065551234"
    },
    "liveCompanionEnabled": true
  }'
```

**Response:**
```json
{
  "sessionId": "<uuid>",
  "shareUrl": "https://placeholder-frontend-url/companion/<shareToken>"
}
```

#### Get Session by Share Token (Companion View)

- `GET /api/sessions/share/<share_token>` - Get session information for Live Companion Mode view

**Example:**
```bash
curl http://localhost:5000/api/sessions/share/abc123def4
```

**Response:**
```json
{
  "userName": "Agastya",
  "status": "active",
  "startLocation": {"lat": 47.655, "lng": -122.308},
  "endLocation": {"lat": 47.658, "lng": -122.313},
  "lastLocation": {"lat": 47.656, "lng": -122.310},
  "eta": "11:42 PM"
}
```

#### Update Location

- `POST /api/sessions/<session_id>/location` - Update the current location for a walk session

**Example:**
```bash
curl -X POST http://localhost:5000/api/sessions/<session_id>/location \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 47.656,
    "lng": -122.310
  }'
```

**Response:**
```json
{
  "ok": true
}
```

#### Trigger Panic/SOS

- `POST /api/sessions/<session_id>/panic` - Trigger a panic/SOS event for a walk session

**Example:**
```bash
curl -X POST http://localhost:5000/api/sessions/<session_id>/panic \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "ok": true
}
```

#### Mark Arrival

- `POST /api/sessions/<session_id>/arrive` - Mark a walk session as arrived and trigger Auto-Notify Arrival

**Example:**
```bash
curl -X POST http://localhost:5000/api/sessions/<session_id>/arrive \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "ok": true
}
```

**Note:** When arrival is marked, if Auto-Notify is enabled, a notification will be logged to the console (and can be configured to send via Twilio SMS or email).

## Real-time Support

The backend uses Flask-SocketIO for real-time communication. Socket.IO events include:

- `join_session` - Join a session room by session ID
- `join_session_by_token` - Join a session room by share token
- `location_update` - Emitted when location is updated
- `inactivity_alert` - Emitted when user is inactive for 3+ minutes
- `panic` - Emitted when panic/SOS is triggered
- `arrived` - Emitted when user arrives at destination

## Environment Variables

Currently using a hardcoded `SECRET_KEY` for development. In production, use environment variables with `python-dotenv`:

1. Create a `.env` file in the backend directory
2. Add `SECRET_KEY=your-secret-key-here`
3. Update `app.py` to load from environment variables

