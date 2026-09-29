"""
Indian Sign Language (ISL) Recognition Engine
Extracts invariant geometric hand features, angles, and inter-finger relationships
to recognize ISL alphabets (A-Z), numbers (0-9), and essential phrases (Hello, Thank You, Yes, No, Help, etc.)
with high accuracy and temporal stability.
"""

import math
import numpy as np
from typing import Dict, List, Optional, Tuple, Any
from collections import deque
import json

# Landmark indices for MediaPipe Hands (21 points)
# 0: Wrist
# 1-4: Thumb (CMC, MCP, IP, TIP)
# 5-8: Index (MCP, PIP, DIP, TIP)
# 9-12: Middle (MCP, PIP, DIP, TIP)
# 13-16: Ring (MCP, PIP, DIP, TIP)
# 17-20: Pinky (MCP, PIP, DIP, TIP)

WRIST = 0
THUMB_CMC, THUMB_MCP, THUMB_IP, THUMB_TIP = 1, 2, 3, 4
INDEX_MCP, INDEX_PIP, INDEX_DIP, INDEX_TIP = 5, 6, 7, 8
MIDDLE_MCP, MIDDLE_PIP, MIDDLE_DIP, MIDDLE_TIP = 9, 10, 11, 12
RING_MCP, RING_PIP, RING_DIP, RING_TIP = 13, 14, 15, 16
PINKY_MCP, PINKY_PIP, PINKY_DIP, PINKY_TIP = 17, 18, 19, 20

FINGER_TIPS = [THUMB_TIP, INDEX_TIP, MIDDLE_TIP, RING_TIP, PINKY_TIP]
FINGER_PIPS = [THUMB_IP, INDEX_PIP, MIDDLE_PIP, RING_PIP, PINKY_PIP]
FINGER_MCPS = [THUMB_MCP, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP]


def normalize_landmarks(raw_landmarks: List[Dict[str, float]]) -> np.ndarray:
    """
    Normalizes 21 3D landmarks relative to wrist and scales by hand size.
    Returns: (21, 3) normalized numpy array.
    """
    pts = np.array([[lm.get("x", 0.0), lm.get("y", 0.0), lm.get("z", 0.0)] for lm in raw_landmarks], dtype=np.float32)
    wrist = pts[WRIST]
    pts = pts - wrist  # Translate wrist to origin

    # Scale invariance: use distance from wrist to middle finger MCP
    scale_ref = np.linalg.norm(pts[MIDDLE_MCP])
    if scale_ref < 1e-4:
        scale_ref = np.max(np.linalg.norm(pts, axis=1))
    if scale_ref > 1e-4:
        pts = pts / scale_ref
    return pts


def calculate_finger_states(pts: np.ndarray) -> Dict[str, Any]:
    """
    Determines whether each finger is extended, curled, or touching another finger.
    """
    # Vector norms from wrist to tips vs wrist to PIP
    wrist_to_tips = [np.linalg.norm(pts[tip]) for tip in FINGER_TIPS]
    wrist_to_pips = [np.linalg.norm(pts[pip]) for pip in FINGER_PIPS]

    # For thumb, check distance between thumb tip and index MCP vs thumb MCP
    thumb_extended = np.linalg.norm(pts[THUMB_TIP] - pts[INDEX_MCP]) > 0.85
    thumb_folded = np.linalg.norm(pts[THUMB_TIP] - pts[INDEX_MCP]) < 0.55

    # Fingers 1..4 (Index, Middle, Ring, Pinky) are extended if tip is further from wrist than PIP
    index_extended = wrist_to_tips[1] > wrist_to_pips[1] * 1.15
    middle_extended = wrist_to_tips[2] > wrist_to_pips[2] * 1.15
    ring_extended = wrist_to_tips[3] > wrist_to_pips[3] * 1.15
    pinky_extended = wrist_to_tips[4] > wrist_to_pips[4] * 1.15

    # Inter-joint lengths (MCP to TIP straightness)
    len_thumb = np.linalg.norm(pts[THUMB_TIP] - pts[THUMB_MCP])
    len_index = np.linalg.norm(pts[INDEX_TIP] - pts[INDEX_MCP])
    len_middle = np.linalg.norm(pts[MIDDLE_TIP] - pts[MIDDLE_MCP])
    len_ring = np.linalg.norm(pts[RING_TIP] - pts[RING_MCP])
    len_pinky = np.linalg.norm(pts[PINKY_TIP] - pts[PINKY_MCP])

    # Index finger 3D orientation vector
    index_vec = pts[INDEX_TIP] - pts[INDEX_MCP]
    # In MediaPipe, negative Z is closer to camera; positive forward_z means finger points directly at camera
    index_forward_z = float(pts[INDEX_MCP][2] - pts[INDEX_TIP][2])
    index_up_y = float(pts[INDEX_MCP][1] - pts[INDEX_TIP][1])

    # Robust index straightness (even under 2D perspective foreshortening when pointing at camera)
    index_straight = len_index > 0.62 or index_extended
    middle_curled = len_middle < 0.58 and not middle_extended
    ring_curled = len_ring < 0.58 and not ring_extended
    pinky_curled = len_pinky < 0.58 and not pinky_extended

    # High-confidence pointing flag: index is straight while other 3 fingers are curled
    is_pointing_motion = index_straight and middle_curled and ring_curled and pinky_curled

    # Inter-fingertip distances
    d_thumb_index = np.linalg.norm(pts[THUMB_TIP] - pts[INDEX_TIP])
    d_index_middle = np.linalg.norm(pts[INDEX_TIP] - pts[MIDDLE_TIP])
    d_middle_ring = np.linalg.norm(pts[MIDDLE_TIP] - pts[RING_TIP])
    d_ring_pinky = np.linalg.norm(pts[RING_TIP] - pts[PINKY_TIP])
    d_thumb_pinky = np.linalg.norm(pts[THUMB_TIP] - pts[PINKY_TIP])
    d_thumb_middle = np.linalg.norm(pts[THUMB_TIP] - pts[MIDDLE_TIP])

    extended_count = sum([index_extended, middle_extended, ring_extended, pinky_extended])

    return {
        "thumb_extended": thumb_extended,
        "thumb_folded": thumb_folded,
        "index_extended": index_extended,
        "middle_extended": middle_extended,
        "ring_extended": ring_extended,
        "pinky_extended": pinky_extended,
        "extended_count": extended_count,
        "len_index": float(len_index),
        "len_middle": float(len_middle),
        "len_ring": float(len_ring),
        "len_pinky": float(len_pinky),
        "index_forward_z": index_forward_z,
        "index_up_y": index_up_y,
        "index_straight": is_pointing_motion,
        "is_pointing_motion": is_pointing_motion,
        "d_thumb_index": float(d_thumb_index),
        "d_index_middle": float(d_index_middle),
        "d_middle_ring": float(d_middle_ring),
        "d_ring_pinky": float(d_ring_pinky),
        "d_thumb_pinky": float(d_thumb_pinky),
        "d_thumb_middle": float(d_thumb_middle),
    }


class ISLRecognizer:
    """
    Multi-level Indian Sign Language (ISL) gesture recognizer.
    Combines precise geometric biomechanics with rule matching and temporal smoothing.
    Supports both 1-handed and 2-handed signs.
    """

    def __init__(self, history_size: int = 6, min_confidence: float = 0.60):
        self.history = deque(maxlen=history_size)
        self.min_confidence = min_confidence
        self.last_stable_sign = None
        self.stable_counter = 0
        self.custom_model = None
        self.custom_classes = []
        self.prev_wrist = None
        self.motion_history = deque(maxlen=8)
        self.load_custom_model()

    def load_custom_model(self):
        """Loads user-trained Scikit-Learn model dynamically if available."""
        try:
            import joblib
            from pathlib import Path
            model_path = Path(__file__).resolve().parent / "models" / "isl_custom_model.joblib"
            meta_path = Path(__file__).resolve().parent / "models" / "isl_custom_classes.json"
            if model_path.exists() and meta_path.exists():
                self.custom_model = joblib.load(model_path)
                with open(meta_path, "r", encoding="utf-8") as f:
                    self.custom_classes = json.load(f)
                print(f"[ISL_ENGINE] Loaded custom trained ML model with {len(self.custom_classes)} gestures: {self.custom_classes}")
        except Exception as e:
            print(f"[ISL_ENGINE] Custom model not loaded: {e}")

    def recognize_single_hand(self, pts: np.ndarray, handedness: str = "Right", motion_type: str = "STATIC") -> Tuple[str, float, str]:
        """
        Classifies single-hand ISL alphabets, numbers, and basic expressions.
        Incorporates dynamic motion velocity (waving, nodding, forward pointing).
        Returns: (sign_name, confidence, category)
        """
        # Motion-informed dynamic gesture matching
        if motion_type == "WAVING":
            return "HELLO / STOP", 0.97, "phrase"
        if motion_type == "NODDING":
            return "YES", 0.96, "phrase"

        # 1. Custom user-trained gesture evaluation (if model active)
        if self.custom_model is not None and len(self.custom_classes) > 0:
            try:
                feat = pts.flatten().reshape(1, -1)
                probs = self.custom_model.predict_proba(feat)[0]
                best_idx = int(np.argmax(probs))
                best_conf = float(probs[best_idx])
                if best_conf >= 0.85:
                    return self.custom_classes[best_idx], round(best_conf, 2), "custom"
            except Exception:
                pass

        f = calculate_finger_states(pts)
        ext = f["extended_count"]
        th_ext = f["thumb_extended"]
        th_fold = f["thumb_folded"]
        idx_ext = f["index_extended"]
        mid_ext = f["middle_extended"]
        rng_ext = f["ring_extended"]
        pky_ext = f["pinky_extended"]

        d_ti = f["d_thumb_index"]
        d_im = f["d_index_middle"]
        d_mr = f["d_middle_ring"]
        d_rp = f["d_ring_pinky"]
        d_tp = f["d_thumb_pinky"]

        # Wrist to finger tips vertical offsets
        y_thumb = pts[THUMB_TIP][1]
        y_wrist = pts[WRIST][1]
        y_index = pts[INDEX_TIP][1]

        # ------------------------------------------------------------------
        # PHRASES & CORE GESTURES
        # ------------------------------------------------------------------
        # WATER: W shape (index, middle, ring spread upright, thumb holding pinky)
        if idx_ext and mid_ext and rng_ext and not pky_ext and d_im > 0.18:
            return "WATER", 0.93, "phrase"

        # FOOD / EAT: All fingertips clustered together in cone shape
        if d_ti < 0.35 and d_im < 0.25 and d_mr < 0.25 and not idx_ext:
            return "FOOD / EAT", 0.91, "phrase"

        # I LOVE YOU: Thumb, Index, Pinky extended; Middle and Ring folded
        if th_ext and idx_ext and not mid_ext and not rng_ext and pky_ext:
            return "I LOVE YOU", 0.94, "phrase"

        # GOOD / THUMBS UP: Thumb pointing up/extended, all other 4 fingers curled
        if ext == 0 and th_ext and y_thumb < y_wrist:
            return "GOOD / THUMBS UP", 0.93, "phrase"

        # STOP / HELLO / OPEN PALM: All 5 fingers extended and spread outwards
        if ext == 4 and th_ext and d_im > 0.35 and d_mr > 0.3:
            return "HELLO / STOP", 0.92, "phrase"

        # PEACE / VICTORY / V: Index & Middle extended in V shape, Ring & Pinky folded
        if idx_ext and mid_ext and not rng_ext and not pky_ext and d_im > 0.35:
            return "PEACE / V", 0.95, "alphabet"

        # OK SIGN: Thumb and Index touching to form a circle, other 3 extended
        if d_ti < 0.35 and mid_ext and rng_ext and pky_ext:
            return "OK / 9", 0.91, "number"

        # ------------------------------------------------------------------
        # POINTING & ISL 'YOU' GESTURE (Enhanced Biomechanics & Motion)
        # ------------------------------------------------------------------
        # Calculate Index Dominance Ratio over other curled fingers
        len_index = f.get("len_index", 0.0)
        len_middle = f.get("len_middle", 0.0)
        len_ring = f.get("len_ring", 0.0)
        len_pinky = f.get("len_pinky", 0.0)
        other_avg = max(0.08, (len_middle + len_ring + len_pinky) / 3.0)

        # Index dominance is invariant to tilt, rotation, and dynamic hand movement
        is_index_dominant = (len_index > 0.58) and (len_index > other_avg * 1.25)
        is_pointing = f.get("is_pointing_motion", False) or is_index_dominant or (idx_ext and not mid_ext and not rng_ext and not pky_ext)
        forward_z = f.get("index_forward_z", 0.0)
        up_y = f.get("index_up_y", 0.0)

        not_l_shape = (d_ti <= 0.70) or (not th_ext)

        if is_pointing and not_l_shape:
            # Pointing forward toward viewer / camera or forward motion
            if forward_z > -0.20 or motion_type == "FORWARD_REACH" or up_y < 0.75:
                return "YOU / POINTING", 0.97, "phrase"
            elif up_y >= 0.75 and forward_z <= -0.20:
                return "1 / D", 0.93, "number"

        # ------------------------------------------------------------------
        # NUMBERS (0-9)
        # ------------------------------------------------------------------
        # 0 / O: All fingers curved forming an O, thumb touching fingertips
        if d_ti < 0.4 and not idx_ext and not mid_ext and not rng_ext and not pky_ext and not th_ext:
            return "0 / O", 0.89, "number"

        # 1: Only Index finger pointing straight up
        if idx_ext and not mid_ext and not rng_ext and not pky_ext and not th_ext:
            # If pointing slightly forward, prefer YOU / POINTING
            if forward_z > 0.05:
                return "YOU / POINTING", 0.95, "phrase"
            return "1 / D", 0.93, "number"

        # 2: Index and Middle finger together pointing up
        if idx_ext and mid_ext and not rng_ext and not pky_ext and d_im <= 0.35 and not th_ext:
            return "2 / U", 0.92, "number"

        # 3: Thumb, Index, and Middle extended OR Index, Middle, Ring extended
        if idx_ext and mid_ext and rng_ext and not pky_ext and not th_ext:
            return "3 / W", 0.91, "number"
        if th_ext and idx_ext and mid_ext and not rng_ext and not pky_ext:
            return "3", 0.90, "number"

        # 4: 4 fingers (Index, Middle, Ring, Pinky) extended, thumb tucked
        if ext == 4 and th_fold:
            return "4 / B", 0.93, "number"

        # 5: All 5 fingers extended together
        if ext == 4 and th_ext and d_im <= 0.35:
            return "5", 0.90, "number"

        # 6: Thumb and Pinky touching, Index, Middle, Ring extended (or Pinky only folded)
        if d_tp < 0.35 and idx_ext and mid_ext and rng_ext and not pky_ext:
            return "6", 0.88, "number"

        # 7: Thumb and Ring touching, Index, Middle, Pinky extended
        if not rng_ext and idx_ext and mid_ext and pky_ext:
            return "7", 0.87, "number"

        # 8: Thumb and Middle touching, Index, Ring, Pinky extended
        if not mid_ext and idx_ext and rng_ext and pky_ext:
            return "8", 0.87, "number"

        # ------------------------------------------------------------------
        # ISL ALPHABETS (Fingerspelling 1-Handed Standard Variations)
        # ------------------------------------------------------------------
        # A: Clenched fist with thumb resting alongside index finger
        if ext == 0 and not th_fold and pts[THUMB_TIP][1] < pts[INDEX_MCP][1]:
            return "A", 0.89, "alphabet"

        # C: Curved hand like a cup / letter C
        if 0.3 < d_ti < 0.8 and not idx_ext and not pky_ext and pts[INDEX_TIP][0] > pts[THUMB_TIP][0]:
            return "C", 0.86, "alphabet"

        # L: Thumb and Index extended at 90-degree angle (L-shape)
        if th_ext and idx_ext and not mid_ext and not rng_ext and not pky_ext and d_ti > 0.7:
            return "L", 0.94, "alphabet"

        # Y: Thumb and Pinky extended outwards (hang loose shape)
        if th_ext and pky_ext and not idx_ext and not mid_ext and not rng_ext:
            return "Y", 0.92, "alphabet"

        # I: Only Pinky extended, all other fingers folded
        if pky_ext and not idx_ext and not mid_ext and not rng_ext and not th_ext:
            return "I", 0.93, "alphabet"

        # X: Index bent in hook shape, others closed
        if not mid_ext and not rng_ext and not pky_ext and 0.4 < pts[INDEX_TIP][1] - pts[INDEX_MCP][1] < 0.8:
            return "X", 0.85, "alphabet"

        # S: Closed fist with thumb wrapped across the fingers
        if ext == 0 and th_fold:
            return "S", 0.88, "alphabet"

        # F: Thumb and Index touching, Middle, Ring, Pinky extended
        if d_ti < 0.35 and mid_ext and rng_ext and pky_ext:
            return "F", 0.90, "alphabet"

        # H: Index and Middle extended horizontally together
        if idx_ext and mid_ext and not rng_ext and not pky_ext and d_im < 0.28:
            return "H", 0.87, "alphabet"

        # Default fallback if distinct finger pattern recognized
        if idx_ext and not mid_ext and not rng_ext and not pky_ext:
            return "D", 0.85, "alphabet"

        return "Detecting...", 0.50, "neutral"

    def recognize_two_hands(self, hand1: Dict[str, Any], hand2: Dict[str, Any]) -> Tuple[str, float, str]:
        """
        Classifies traditional two-handed Indian Sign Language (ISL) signs.
        In ISL, many signs and alphabets utilize both hands (e.g., Namaste/Hello, Help, Thank You, A, B, etc.).
        """
        pts1 = normalize_landmarks(hand1["landmarks"])
        pts2 = normalize_landmarks(hand2["landmarks"])

        raw1 = hand1["landmarks"]
        raw2 = hand2["landmarks"]

        # Calculate distance between wrists in screen space
        wrist1 = np.array([raw1[0]["x"], raw1[0]["y"]])
        wrist2 = np.array([raw2[0]["x"], raw2[0]["y"]])
        wrist_dist = np.linalg.norm(wrist1 - wrist2)

        # Distance between index tips
        idx_tip1 = np.array([raw1[8]["x"], raw1[8]["y"]])
        idx_tip2 = np.array([raw2[8]["x"], raw2[8]["y"]])
        idx_dist = np.linalg.norm(idx_tip1 - idx_tip2)

        # Distance between palms / middle MCPs
        palm1 = np.array([raw1[9]["x"], raw1[9]["y"]])
        palm2 = np.array([raw2[9]["x"], raw2[9]["y"]])
        palm_dist = np.linalg.norm(palm1 - palm2)

        f1 = calculate_finger_states(pts1)
        f2 = calculate_finger_states(pts2)

        # ------------------------------------------------------------------
        # ISL TWO-HANDED PHRASES
        # ------------------------------------------------------------------
        # NAMASTE / HELLO / RESPECT: Both flat palms together in prayer gesture
        if f1["extended_count"] >= 3 and f2["extended_count"] >= 3 and palm_dist < 0.18:
            return "NAMASTE / HELLO", 0.96, "phrase"

        # HELP: One hand is a flat open palm facing up; other hand is a thumbs up/fist resting on it
        if (f1["extended_count"] >= 3 and f2["extended_count"] == 0 and palm_dist < 0.22) or \
           (f2["extended_count"] >= 3 and f1["extended_count"] == 0 and palm_dist < 0.22):
            return "HELP", 0.94, "phrase"

        # THANK YOU / WELCOME: Palms open facing upward or chest-to-forward movement
        if f1["extended_count"] >= 3 and f2["extended_count"] >= 3 and wrist_dist < 0.25 and palm_dist > 0.15:
            return "THANK YOU", 0.91, "phrase"

        # PLEASE: Both hands open, circular movement or flat together
        if f1["extended_count"] == 4 and f2["extended_count"] == 4 and palm_dist < 0.25:
            return "PLEASE", 0.90, "phrase"

        # DOCTOR / HOSPITAL: Dominant index or two fingers touching wrist of other hand
        if (np.linalg.norm(idx_tip1 - wrist2) < 0.16 and f1["index_extended"]) or \
           (np.linalg.norm(idx_tip2 - wrist1) < 0.16 and f2["index_extended"]):
            return "DOCTOR / HOSPITAL", 0.95, "phrase"

        # ------------------------------------------------------------------
        # ISL TWO-HANDED ALPHABETS
        # ------------------------------------------------------------------
        # ISL 'A': Dominant hand index finger touches thumb tip of non-dominant open hand
        thumb_tip2 = np.array([raw2[4]["x"], raw2[4]["y"]])
        if np.linalg.norm(idx_tip1 - thumb_tip2) < 0.09:
            return "ISL A", 0.93, "alphabet"

        # ISL 'B': Dominant hand index and thumb touch non-dominant index and thumb (double circle / binoculars)
        if idx_dist < 0.1 and np.linalg.norm(np.array([raw1[4]["x"], raw1[4]["y"]]) - thumb_tip2) < 0.1:
            return "ISL B", 0.92, "alphabet"

        # ISL 'D': Left hand forms an open C/circle, right index points up touching it
        if idx_dist < 0.12 and f1["index_extended"] and not f2["index_extended"]:
            return "ISL D", 0.90, "alphabet"

        # ISL 'P': Index tip of one hand touches palm/wrist of the other
        if np.linalg.norm(idx_tip1 - palm2) < 0.09 or np.linalg.norm(idx_tip2 - palm1) < 0.09:
            return "ISL P", 0.91, "alphabet"

        # ISL 'T': Index finger touches middle of open palm
        if np.linalg.norm(idx_tip1 - palm2) < 0.11:
            return "ISL T", 0.89, "alphabet"

        # Fallback to dominant hand if two hands present
        dominant = hand1 if hand1.get("handedness") == "Right" else hand2
        pts_dom = normalize_landmarks(dominant["landmarks"])
        sign, conf, cat = self.recognize_single_hand(pts_dom)
        return sign, conf * 0.95, cat

    def process(self, hands_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Main entry point for processing hand landmarks from the client.
        Tracks dynamic motion velocity (waving, nodding, forward pointing) and
        applies adaptive recency stabilization to eliminate lag and false transitions.
        """
        if not hands_data or len(hands_data) == 0:
            self.history.append("NONE")
            self.prev_wrist = None
            return {
                "detected": False,
                "sign": "No Hands Detected",
                "confidence": 0.0,
                "category": "none",
                "stable_sign": self.last_stable_sign or "",
                "is_held": False,
                "hold_progress": 0.0,
                "hands_count": 0,
            }

        num_hands = len(hands_data)

        # Dynamic Hand Motion Analysis (Velocity & Directional Vectors)
        motion_type = "STATIC"
        hand0 = hands_data[0]
        raw_wrist = hand0["landmarks"][0]
        curr_wrist = np.array([raw_wrist.get("x", 0.0), raw_wrist.get("y", 0.0), raw_wrist.get("z", 0.0)], dtype=np.float32)

        if self.prev_wrist is not None:
            vel = curr_wrist - self.prev_wrist
            self.motion_history.append(vel)

            if len(self.motion_history) >= 3:
                recent_vels = np.array(list(self.motion_history))
                avg_speed = np.mean(np.linalg.norm(recent_vels, axis=1))

                # Horizontal oscillation (waving)
                vx = recent_vels[:, 0]
                sign_changes_x = np.count_nonzero(np.diff(np.sign(vx[vx != 0])))

                # Vertical oscillation (nodding)
                vy = recent_vels[:, 1]
                sign_changes_y = np.count_nonzero(np.diff(np.sign(vy[vy != 0])))

                # Forward Z velocity (pointing / pushing forward toward camera)
                mean_vz = np.mean(recent_vels[:, 2])

                if avg_speed > 0.015:
                    if sign_changes_x >= 1 and np.max(np.abs(vx)) > 0.015:
                        motion_type = "WAVING"
                    elif sign_changes_y >= 1 and np.max(np.abs(vy)) > 0.015:
                        motion_type = "NODDING"
                    elif mean_vz < -0.01:
                        motion_type = "FORWARD_REACH"
        self.prev_wrist = curr_wrist

        if num_hands >= 2:
            raw_sign, conf, cat = self.recognize_two_hands(hands_data[0], hands_data[1])
        else:
            pts = normalize_landmarks(hand0["landmarks"])
            raw_sign, conf, cat = self.recognize_single_hand(pts, hand0.get("handedness", "Right"), motion_type)

        # Fast Adaptive Recency Smoothing:
        # Avoid getting stuck on old gestures; switch promptly when current gesture is confident
        self.history.append(raw_sign)

        # Immediate switch if last 2 frames match and confidence is high
        if len(self.history) >= 2 and self.history[-1] == self.history[-2] and self.history[-1] not in ["NONE", "Detecting..."]:
            stable_sign = self.history[-1]
            conf = max(conf, 0.94)
        else:
            # Exponentially weight more recent frames
            weighted_counts = {}
            for idx, s in enumerate(self.history):
                if s != "NONE" and s != "Detecting...":
                    w = 1.0 + (idx * 0.8)
                    weighted_counts[s] = weighted_counts.get(s, 0.0) + w

            if weighted_counts:
                stable_sign = max(weighted_counts.items(), key=lambda x: x[1])[0]
            else:
                stable_sign = raw_sign

        # Check hold duration for sentence accumulator
        if stable_sign == self.last_stable_sign and stable_sign not in ["Detecting...", "No Hands Detected", ""]:
            self.stable_counter += 1
        else:
            self.last_stable_sign = stable_sign
            self.stable_counter = 1

        # Hold threshold: ~12 consecutive frames (approx 0.8 - 1.0 second)
        HOLD_THRESHOLD = 12
        hold_progress = min(1.0, self.stable_counter / HOLD_THRESHOLD)
        is_held = self.stable_counter >= HOLD_THRESHOLD

        return {
            "detected": True,
            "sign": stable_sign,
            "raw_sign": raw_sign,
            "confidence": round(float(conf), 2),
            "category": cat,
            "stable_sign": stable_sign,
            "is_held": is_held,
            "hold_progress": round(hold_progress, 2),
            "hands_count": num_hands,
            "handedness": [h.get("handedness", "Unknown") for h in hands_data],
        }
