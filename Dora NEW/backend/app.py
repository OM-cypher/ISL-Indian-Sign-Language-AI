"""
FastAPI Backend Server for Indian Sign Language (ISL) Recognition Web Platform.
Provides real-time high-throughput WebSocket hand recognition,
REST APIs for ISL dictionary, 2-way sign translation, and learning challenges.
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

import sys
from pathlib import Path

# Add backend directory to sys.path so modules resolve cleanly
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from isl_engine import ISLRecognizer
from isl_dictionary_data import get_all_signs, translate_text_to_sign_sequence, get_predictive_words

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ISL_Server")

app = FastAPI(
    title="Indian Sign Language (ISL) AI Recognition Platform",
    description="Real-time multi-hand ISL recognition and bidirectional translation engine",
    version="1.0.0"
)

# Enable CORS for local dev / cross-origin web browsers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate engine
isl_recognizer = ISLRecognizer(history_size=8, min_confidence=0.60)

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"


class TranslateRequest(BaseModel):
    text: str


class QuizCheckRequest(BaseModel):
    target_sign: str
    detected_sign: str
    confidence: float


@app.get("/api/status")
async def get_status():
    """Health & capability check."""
    return {
        "status": "online",
        "system": "Indian Sign Language Recognition Engine",
        "engine_version": "1.0.0",
        "supported_signs_count": len(get_all_signs()),
        "tracking_support": "1-Hand and 2-Hand ISL Tracking",
        "features": [
            "Real-time WebSocket landmark classification",
            "ISL Alphabets (A-Z) & Numbers (0-9)",
            "Essential phrases (Namaste, Help, Thank You, etc.)",
            "Auto Sentence Builder with hold-to-type",
            "Text-to-Sign Reverse Translation",
            "Interactive Sign Practice Challenges"
        ]
    }


@app.get("/api/signs")
async def list_signs():
    """Returns the full ISL gesture dictionary with illustrations and descriptions."""
    return {"signs": get_all_signs()}


@app.post("/api/translate")
async def translate_text(req: TranslateRequest):
    """Converts input text into a sequence of ISL signs and fingerspellings."""
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    sequence = translate_text_to_sign_sequence(req.text)
    return {
        "original_text": req.text,
        "sequence": sequence,
        "token_count": len(sequence)
    }


@app.get("/api/quiz/random")
async def get_random_challenge():
    """Fetches a random sign for the user to practice."""
    import random
    signs = get_all_signs()
    selected = random.choice(signs)
    return {
        "target_id": selected["id"],
        "target_name": selected["name"],
        "hindi_name": selected.get("hindi_name", ""),
        "category": selected["category"],
        "symbol": selected["symbol"],
        "description": selected["description"],
        "hindi_desc": selected.get("hindi_desc", ""),
        "tips": selected["tips"]
    }


@app.get("/api/predictive")
async def get_predictive_suggestions(prefix: str = ""):
    """Returns predictive word completions for live typing."""
    return {"suggestions": get_predictive_words(prefix)}


class CustomSignRecord(BaseModel):
    name: str
    samples: List[List[float]]


@app.post("/api/custom-sign/record")
async def record_custom_sign(req: CustomSignRecord):
    """Saves user-recorded hand landmark frames for a custom sign."""
    name = req.name.strip().upper()
    if not name or len(req.samples) == 0:
        raise HTTPException(status_code=400, detail="Sign name and samples are required")

    data_dir = BACKEND_DIR / "data"
    data_dir.mkdir(exist_ok=True)
    dataset_file = data_dir / "custom_signs.json"

    dataset = {}
    if dataset_file.exists():
        try:
            with open(dataset_file, "r", encoding="utf-8") as f:
                dataset = json.load(f)
        except Exception:
            dataset = {}

    if name not in dataset:
        dataset[name] = []
    dataset[name].extend(req.samples)

    with open(dataset_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f)

    return {
        "status": "success",
        "sign_name": name,
        "recorded_samples_count": len(req.samples),
        "total_samples": len(dataset[name])
    }


@app.post("/api/custom-sign/train")
async def train_custom_signs():
    """Trains a Random Forest classifier on recorded custom signs and reloads model live."""
    from sklearn.ensemble import RandomForestClassifier
    import joblib
    import numpy as np

    data_dir = BACKEND_DIR / "data"
    dataset_file = data_dir / "custom_signs.json"
    if not dataset_file.exists():
        raise HTTPException(status_code=400, detail="No custom gesture recordings found to train.")

    with open(dataset_file, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    if len(dataset) == 0:
        raise HTTPException(status_code=400, detail="Custom dataset is empty.")

    X = []
    y = []
    for sign_name, samples in dataset.items():
        for s in samples:
            if len(s) == 63:
                X.append(s)
                y.append(sign_name)

    if len(set(y)) < 2:
        rng = np.random.default_rng(42)
        base = np.zeros(63)
        for _ in range(50):
            X.append(list(base + rng.normal(0, 0.05, 63)))
            y.append("NEUTRAL / IDLE")

    X = np.array(X, dtype=np.float32)
    y = np.array(y)

    clf = RandomForestClassifier(n_estimators=100, max_depth=16, random_state=42)
    clf.fit(X, y)

    models_dir = BACKEND_DIR / "models"
    models_dir.mkdir(exist_ok=True)
    joblib.dump(clf, models_dir / "isl_custom_model.joblib")

    classes = list(clf.classes_)
    with open(models_dir / "isl_custom_classes.json", "w", encoding="utf-8") as f:
        json.dump(classes, f, indent=2)

    # Hot reload into active engine
    isl_recognizer.load_custom_model()

    return {
        "status": "success",
        "trained_classes": classes,
        "sample_count": len(X)
    }


@app.get("/api/custom-signs")
async def get_custom_signs():
    """Lists all user-created gestures."""
    data_dir = BACKEND_DIR / "data"
    dataset_file = data_dir / "custom_signs.json"
    if not dataset_file.exists():
        return {"custom_signs": []}
    with open(dataset_file, "r", encoding="utf-8") as f:
        dataset = json.load(f)
    return {
        "custom_signs": [{"name": k, "sample_count": len(v)} for k, v in dataset.items()]
    }


@app.get("/api/custom-signs/export")
async def export_custom_dataset():
    """Exports full recorded custom gestures dataset."""
    data_dir = BACKEND_DIR / "data"
    dataset_file = data_dir / "custom_signs.json"
    if not dataset_file.exists():
        return {}
    with open(dataset_file, "r", encoding="utf-8") as f:
        return json.load(f)


@app.post("/api/custom-signs/import")
async def import_custom_dataset(data: Dict[str, Any]):
    """Imports an external custom gesture dataset JSON."""
    data_dir = BACKEND_DIR / "data"
    data_dir.mkdir(exist_ok=True)
    dataset_file = data_dir / "custom_signs.json"
    with open(dataset_file, "w", encoding="utf-8") as f:
        json.dump(data, f)
    return {"status": "success", "imported_signs": list(data.keys())}


@app.delete("/api/custom-signs/{name}")
async def delete_custom_sign(name: str):
    """Deletes a custom gesture from the dataset."""
    data_dir = BACKEND_DIR / "data"
    dataset_file = data_dir / "custom_signs.json"
    if dataset_file.exists():
        with open(dataset_file, "r", encoding="utf-8") as f:
            dataset = json.load(f)
        target = name.upper().strip()
        if target in dataset:
            del dataset[target]
            with open(dataset_file, "w", encoding="utf-8") as f:
                json.dump(dataset, f)
            return {"status": "success", "deleted": target}
    raise HTTPException(status_code=404, detail="Gesture not found")


@app.websocket("/ws/recognize")
async def websocket_recognize(websocket: WebSocket):
    """
    High-speed WebSocket endpoint for real-time sign recognition.
    Receives landmark arrays from client-side hand tracking, evaluates
    via ISLRecognizer, and streams back detection results, confidence, and sentence hold triggers.
    """
    await websocket.accept()
    logger.info("Client connected to ISL WebSocket Recognition Stream")
    try:
        while True:
            raw_data = await websocket.receive_text()
            payload = json.loads(raw_data)
            
            # Payload contains: {"hands": [{"landmarks": [...], "handedness": "Right"}]}
            hands_data = payload.get("hands", [])
            result = isl_recognizer.process(hands_data)
            
            await websocket.send_text(json.dumps(result))
    except WebSocketDisconnect:
        logger.info("Client disconnected from ISL WebSocket Stream")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_text(json.dumps({"error": str(e), "detected": False}))
        except Exception:
            pass


# WebRTC Signaling Room Connection Manager for Real Multi-Device Video Calls
class CallRoomManager:
    def __init__(self):
        # room_id -> list of active WebSockets
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)
        logger.info(f"Client joined WebRTC room '{room_id}' (Total peers in room: {len(self.rooms[room_id])})")
        # Notify other peer that someone joined
        for peer in self.rooms[room_id]:
            if peer != websocket:
                try:
                    await peer.send_text(json.dumps({
                        "type": "peer_joined",
                        "room_id": room_id,
                        "peer_count": len(self.rooms[room_id])
                    }))
                except Exception:
                    pass
        # Tell the newly joined peer their room status
        await websocket.send_text(json.dumps({
            "type": "room_joined",
            "room_id": room_id,
            "peer_count": len(self.rooms[room_id])
        }))

    async def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms:
            if websocket in self.rooms[room_id]:
                self.rooms[room_id].remove(websocket)
            logger.info(f"Client left WebRTC room '{room_id}' (Remaining: {len(self.rooms[room_id])})")
            for peer in self.rooms[room_id]:
                try:
                    await peer.send_text(json.dumps({"type": "peer_left", "room_id": room_id}))
                except Exception:
                    pass
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast(self, room_id: str, sender: WebSocket, message: str):
        if room_id in self.rooms:
            for peer in self.rooms[room_id]:
                if peer != sender:
                    try:
                        await peer.send_text(message)
                    except Exception:
                        pass

call_room_mgr = CallRoomManager()


@app.websocket("/ws/call/{room_id}")
async def websocket_call(websocket: WebSocket, room_id: str):
    """
    Real-time WebRTC Signaling WebSocket for Accessible Video Calls.
    Exchanges SDP offers, answers, ICE candidates, and real-time live sign subtitles.
    """
    clean_room = room_id.strip().upper()
    await call_room_mgr.connect(clean_room, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await call_room_mgr.broadcast(clean_room, websocket, data)
    except WebSocketDisconnect:
        await call_room_mgr.disconnect(clean_room, websocket)
    except Exception as e:
        logger.error(f"WebRTC signaling error in room '{clean_room}': {e}")
        await call_room_mgr.disconnect(clean_room, websocket)


@app.get("/api/languages")
async def get_supported_languages():
    """Returns list of supported Indian languages with BCP-47 voice codes."""
    return {
        "languages": [
            {"code": "en", "name": "English", "native": "English", "voice": "en-IN", "flag": "🇬🇧"},
            {"code": "hi", "name": "Hindi", "native": "हिन्दी", "voice": "hi-IN", "flag": "🇮🇳"},
            {"code": "ta", "name": "Tamil", "native": "தமிழ்", "voice": "ta-IN", "flag": "🇮🇳"},
            {"code": "te", "name": "Telugu", "native": "తెలుగు", "voice": "te-IN", "flag": "🇮🇳"},
            {"code": "bn", "name": "Bengali", "native": "বাংলা", "voice": "bn-IN", "flag": "🇮🇳"},
            {"code": "mr", "name": "Marathi", "native": "मराठी", "voice": "mr-IN", "flag": "🇮🇳"},
        ]
    }


# Serve frontend static assets if available
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")



if __name__ == "__main__":
    import uvicorn
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    print("\n" + "="*60)
    print(">> Starting Indian Sign Language (ISL) Recognition Server")
    print(">> URL: http://localhost:8000")
    print(">> WebSocket: ws://localhost:8000/ws/recognize")
    print("="*60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
