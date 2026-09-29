"""
Comprehensive Indian Sign Language (ISL) Dictionary & Metadata Reference.
Includes bilingual metadata (English & Hindi), hand postures, reverse translation,
skeletal pose wireframes, and predictive vocabulary.
"""

from typing import List, Dict, Optional

ISL_SIGNS = [
    # ---------------- ALPHABETS ----------------
    {
        "id": "A",
        "name": "Alphabet A",
        "hindi_name": "अक्षर A",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 or 2 Hands",
        "symbol": "🅰️",
        "description": "Make a fist with the thumb resting vertically alongside the index finger. In 2-handed ISL, dominant index touches the thumb tip of the non-dominant open hand.",
        "hindi_desc": "मुट्ठी बंद करें और अंगूठे को तर्जनी के पास सीधा रखें। 2-हाथ वाले ISL में, तर्जनी से दूसरे हाथ के अंगूठे को छुएं।",
        "tips": "Keep knuckles relaxed and thumb snug against the curled index finger.",
        "frequency": "Very High",
        "examples": ["Apple", "Always", "Action"]
    },
    {
        "id": "B",
        "name": "Alphabet B",
        "hindi_name": "अक्षर B",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 or 2 Hands",
        "symbol": "🅱️",
        "description": "Extend four fingers straight up together, with thumb tucked across the palm. In 2-handed ISL, form two circles with both hands touching (binoculars shape).",
        "hindi_desc": "चारों उंगलियों को एक साथ सीधा रखें, अंगूठे को हथेली पर मोड़ें। 2-हाथ वाले ISL में दोनों हाथों से दो वृत्त (दूरबीन आकार) बनाएं।",
        "tips": "Keep the four fingers tightly together and palm facing outward.",
        "frequency": "High",
        "examples": ["Boy", "Book", "Bharat"]
    },
    {
        "id": "C",
        "name": "Alphabet C",
        "hindi_name": "अक्षर C",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "©️",
        "description": "Curve fingers and thumb into a clear 'C' or cup shape facing sideways.",
        "hindi_desc": "उंगलियों और अंगूठे को 'C' या कप के आकार में मोड़ें।",
        "tips": "Maintain a natural curve like you are holding a coffee mug.",
        "frequency": "High",
        "examples": ["Cat", "Cold", "Come"]
    },
    {
        "id": "D",
        "name": "Alphabet D",
        "hindi_name": "अक्षर D",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 or 2 Hands",
        "symbol": "🇩",
        "description": "Index finger points straight up, while thumb touches the tips of middle, ring, and pinky forming a circle.",
        "hindi_desc": "तर्जनी उंगली सीधी ऊपर रखें, अंगूठा अन्य उंगलियों को छूकर वृत्त बनाता है।",
        "tips": "Only index finger points up; the other 3 fingers touch the thumb.",
        "frequency": "High",
        "examples": ["Day", "Door", "Doctor"]
    },
    {
        "id": "E",
        "name": "Alphabet E",
        "hindi_name": "अक्षर E",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "🇪",
        "description": "Bend all fingers at joints, resting tips onto the thumb.",
        "hindi_desc": "सभी उंगलियों को मोड़कर उनके सिरों को अंगूठे पर टिकाएं।",
        "tips": "Fingertips curl down to touch the edge of the folded thumb.",
        "frequency": "Very High",
        "examples": ["Eat", "Eye", "Easy"]
    },
    {
        "id": "F",
        "name": "Alphabet F",
        "hindi_name": "अक्षर F",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "🇫",
        "description": "Thumb and index finger touch to form an 'O' ring, while middle, ring, and pinky stand upright spread.",
        "hindi_desc": "अंगूठा और तर्जनी मिलकर वृत्त बनाते हैं, शेष तीन उंगलियां सीधी फैली रहती हैं।",
        "tips": "Opposite of 'D' — 3 fingers extended, index and thumb touching.",
        "frequency": "Medium",
        "examples": ["Friend", "Family", "Food"]
    },
    {
        "id": "G",
        "name": "Alphabet G",
        "hindi_name": "अक्षर G",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "🇬",
        "description": "Extend index finger and thumb horizontally parallel, with other fingers curled in.",
        "hindi_desc": "तर्जनी और अंगूठे को समानांतर आगे बढ़ाएं, बाकी उंगलियां मुड़ी हुई।",
        "tips": "Looks like you are measuring a small gap between thumb and index.",
        "frequency": "Medium",
        "examples": ["Good", "Go", "Give"]
    },
    {
        "id": "H",
        "name": "Alphabet H",
        "hindi_name": "अक्षर H",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "🇭",
        "description": "Extend both index and middle fingers horizontally together, thumb folded over ring finger.",
        "hindi_desc": "तर्जनी और मध्यमा दोनों को क्षैतिज रूप से एक साथ सीधा रखें।",
        "tips": "Hold two fingers horizontally pointing forward or sideways.",
        "frequency": "Medium",
        "examples": ["Home", "Help", "Hear"]
    },
    {
        "id": "I",
        "name": "Alphabet I",
        "hindi_name": "अक्षर I",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "ℹ️",
        "description": "Extend only pinky finger straight up into the air; thumb crosses folded fingers.",
        "hindi_desc": "केवल कनिष्ठिका (छोटी उंगली) को सीधा ऊपर रखें; अंगूठा अन्य उंगलियों पर।",
        "tips": "Clean vertical pinky finger while all others stay folded into a fist.",
        "frequency": "High",
        "examples": ["India", "Ice", "Island"]
    },
    {
        "id": "L",
        "name": "Alphabet L",
        "hindi_name": "अक्षर L",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "🇱",
        "description": "Form an 'L' shape with thumb and index finger extended at a 90-degree angle.",
        "hindi_desc": "अंगूठे और तर्जनी को 90 डिग्री पर फैलाकर 'L' का आकार बनाएं।",
        "tips": "Thumb points sideways, index points directly upward.",
        "frequency": "High",
        "examples": ["Love", "Learn", "Light"]
    },
    {
        "id": "O",
        "name": "Alphabet O",
        "hindi_name": "अक्षर O",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "⭕",
        "description": "Curve all fingers and thumb together to make an open circle 'O'.",
        "hindi_desc": "सभी उंगलियों और अंगूठे को मिलाकर गोल 'O' बनाएं।",
        "tips": "Keep finger joints rounded.",
        "frequency": "High",
        "examples": ["Open", "One", "Order"]
    },
    {
        "id": "V",
        "name": "Alphabet V",
        "hindi_name": "अक्षर V",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "✌️",
        "description": "Extend index and middle fingers in a spread 'V' (peace sign), other fingers folded.",
        "hindi_desc": "तर्जनी और मध्यमा को 'V' आकार में फैलाएं (शांति/जीत का चिन्ह)।",
        "tips": "Spread fingers comfortably apart.",
        "frequency": "Medium",
        "examples": ["Victory", "Voice", "View"]
    },
    {
        "id": "W",
        "name": "Alphabet W",
        "hindi_name": "अक्षर W",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "🇼",
        "description": "Extend index, middle, and ring fingers spread upward in a 'W' shape.",
        "hindi_desc": "तर्जनी, मध्यमा और अनामिका तीनों को ऊपर 'W' आकार में फैलाएं।",
        "tips": "Thumb holds pinky down against the palm.",
        "frequency": "Medium",
        "examples": ["Water", "World", "Walk"]
    },
    {
        "id": "Y",
        "name": "Alphabet Y",
        "hindi_name": "अक्षर Y",
        "type": "alphabet",
        "category": "Letters",
        "hands": "1 Hand",
        "symbol": "🤙",
        "description": "Extend thumb and pinky finger outward; index, middle, and ring folded.",
        "hindi_desc": "अंगूठे और कनिष्ठिका को बाहर फैलाएं, बीच की तीन उंगलियां मुड़ी हुई।",
        "tips": "Classic 'hang loose' shape.",
        "frequency": "Medium",
        "examples": ["Yes", "You", "Yellow"]
    },

    # ---------------- NUMBERS ----------------
    {
        "id": "0",
        "name": "Number 0",
        "hindi_name": "संख्या 0 (शून्य)",
        "type": "number",
        "category": "Numbers",
        "hands": "1 Hand",
        "symbol": "0️⃣",
        "description": "Fingers curled with tips touching thumb forming a zero.",
        "hindi_desc": "उंगलियों को मोड़कर अंगूठे से मिलाकर शून्य बनाएं।",
        "tips": "Smooth round shape.",
        "frequency": "High",
        "examples": ["Zero"]
    },
    {
        "id": "1",
        "name": "Number 1",
        "hindi_name": "संख्या 1 (एक)",
        "type": "number",
        "category": "Numbers",
        "hands": "1 Hand",
        "symbol": "1️⃣",
        "description": "Index finger extended vertically, thumb and other fingers folded.",
        "hindi_desc": "तर्जनी उंगली को सीधा ऊपर रखें।",
        "tips": "Clear single finger pointing up.",
        "frequency": "High",
        "examples": ["One"]
    },
    {
        "id": "2",
        "name": "Number 2",
        "hindi_name": "संख्या 2 (दो)",
        "type": "number",
        "category": "Numbers",
        "hands": "1 Hand",
        "symbol": "2️⃣",
        "description": "Index and middle fingers extended up together.",
        "hindi_desc": "तर्जनी और मध्यमा दो उंगलियों को सीधा ऊपर रखें।",
        "tips": "Two fingers upright.",
        "frequency": "High",
        "examples": ["Two"]
    },
    {
        "id": "3",
        "name": "Number 3",
        "hindi_name": "संख्या 3 (तीन)",
        "type": "number",
        "category": "Numbers",
        "hands": "1 Hand",
        "symbol": "3️⃣",
        "description": "Thumb, index, and middle extended OR index, middle, ring extended.",
        "hindi_desc": "अंगूठा, तर्जनी और मध्यमा (या तीन उंगलियां) सीधी रखें।",
        "tips": "Three distinct fingers shown.",
        "frequency": "High",
        "examples": ["Three"]
    },
    {
        "id": "4",
        "name": "Number 4",
        "hindi_name": "संख्या 4 (चार)",
        "type": "number",
        "category": "Numbers",
        "hands": "1 Hand",
        "symbol": "4️⃣",
        "description": "Four fingers (index, middle, ring, pinky) extended up with thumb folded.",
        "hindi_desc": "चारों उंगलियों को सीधा फैलाएं, अंगूठा अंदर मुड़ा हुआ।",
        "tips": "Thumb tucked across palm.",
        "frequency": "High",
        "examples": ["Four"]
    },
    {
        "id": "5",
        "name": "Number 5",
        "hindi_name": "संख्या 5 (पाँच)",
        "type": "number",
        "category": "Numbers",
        "hands": "1 Hand",
        "symbol": "5️⃣",
        "description": "All five fingers fully extended and spread.",
        "hindi_desc": "पाँचों उंगलियों को पूरी तरह खोलकर फैलाएं।",
        "tips": "Wide open hand.",
        "frequency": "High",
        "examples": ["Five"]
    },

    # ---------------- PHRASES & ESSENTIAL SIGNS ----------------
    {
        "id": "NAMASTE / HELLO",
        "name": "Namaste / Hello",
        "hindi_name": "नमस्ते / नमस्कार",
        "type": "phrase",
        "category": "Greetings",
        "hands": "2 Hands",
        "symbol": "🙏",
        "description": "Traditional Indian greeting: bring both flat palms together near the chest in front of the camera.",
        "hindi_desc": "पारंपरिक भारतीय अभिवादन: दोनों हथेलियों को सीने के सामने एक साथ जोड़ें।",
        "tips": "Palms pressed lightly together with fingers pointing upward.",
        "frequency": "Essential",
        "examples": ["Namaste!", "Hello everyone", "Welcome"]
    },
    {
        "id": "HELLO / STOP",
        "name": "Hello / Stop",
        "hindi_name": "नमस्ते / रुको",
        "type": "phrase",
        "category": "Greetings",
        "hands": "1 Hand",
        "symbol": "👋",
        "description": "Raise an open hand with palm facing camera, wave gently or hold steady.",
        "hindi_desc": "खुली हथेली को कैमरे के सामने उठाएं, हिलाएं या स्थिर रखें।",
        "tips": "Keep hand visible in upper torso frame.",
        "frequency": "Essential",
        "examples": ["Hello", "Stop here", "Hi"]
    },
    {
        "id": "HELP",
        "name": "Help (Emergency)",
        "hindi_name": "मदद / सहायता (आपातकालीन)",
        "type": "phrase",
        "category": "Emergency",
        "hands": "2 Hands",
        "symbol": "🆘",
        "description": "Place a closed fist with thumb up onto an open flat horizontal palm of the opposite hand.",
        "hindi_desc": "दूसरे हाथ की सपाट हथेली पर मुट्ठी (अंगूठा ऊपर) रखें। यह अंतर्राष्ट्रीय एवं ISL सहायता संकेत है।",
        "tips": "Clear emergency sign recognized internationally and in ISL.",
        "frequency": "Essential",
        "examples": ["I need help", "Emergency assistance", "Help me"]
    },
    {
        "id": "THANK YOU",
        "name": "Thank You",
        "hindi_name": "धन्यवाद / शुक्रिया",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 or 2 Hands",
        "symbol": "🤝",
        "description": "Touch flat hand fingertips to chin or lips, then move outward toward the recipient.",
        "hindi_desc": "हाथ की उंगलियों को ठुड्डी या होंठों से छुएं, फिर सामने वाले की ओर आगे बढ़ाएं।",
        "tips": "Smooth forward gentle motion expresses sincere gratitude.",
        "frequency": "Essential",
        "examples": ["Thank you so much", "Thanks for your help"]
    },
    {
        "id": "YES",
        "name": "Yes / Affirmation",
        "hindi_name": "हाँ / स्वीकार",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "✅",
        "description": "Make a fist and nod it gently up and down like a head nodding yes.",
        "hindi_desc": "मुट्ठी बनाएं और सिर हिलाने की तरह मुट्ठी को ऊपर-नीचे हिलाएं।",
        "tips": "Gentle wrist nodding motion.",
        "frequency": "Essential",
        "examples": ["Yes", "Agreed", "Correct"]
    },
    {
        "id": "NO",
        "name": "No / Negation",
        "hindi_name": "नहीं / मना करना",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "❌",
        "description": "Snap index and middle finger closed against thumb, or wave index finger left-right.",
        "hindi_desc": "तर्जनी और मध्यमा को अंगूठे के साथ मिलाकर बंद करें या तर्जनी को दाएं-बाएं हिलाएं।",
        "tips": "Definite closing or waving motion.",
        "frequency": "Essential",
        "examples": ["No", "Not possible", "Never"]
    },
    {
        "id": "PLEASE",
        "name": "Please / Request",
        "hindi_name": "कृपया / निवेदन",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 or 2 Hands",
        "symbol": "🥺",
        "description": "Rub flat hand in a gentle circular motion over the chest/heart.",
        "hindi_desc": "सपाट हाथ को सीने/हृदय के ऊपर धीरे-धीरे गोल घुमाएं।",
        "tips": "Circular clockwise rubbing motion over chest.",
        "frequency": "High",
        "examples": ["Please help", "Please come"]
    },
    {
        "id": "WATER",
        "name": "Water / Drink",
        "hindi_name": "पानी / जल",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "💧",
        "description": "Make a 'W' hand shape with three fingers and tap index finger lightly near chin/lips.",
        "hindi_desc": "तीन उंगलियों से 'W' बनाएं और होंठों/ठुड्डी के पास दो बार छुएं।",
        "tips": "Three fingers upward, tapping lips.",
        "frequency": "Essential",
        "examples": ["I need water", "Drinking water"]
    },
    {
        "id": "FOOD / EAT",
        "name": "Food / Eat",
        "hindi_name": "खाना / भोजन",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "🍲",
        "description": "Bring all fingertips together toward thumb in a cone shape and tap lightly toward mouth.",
        "hindi_desc": "सभी उंगलियों को अंगूठे के साथ मिलाकर मुंह की ओर दो बार ले जाएं।",
        "tips": "Represents taking food to the mouth.",
        "frequency": "Essential",
        "examples": ["I am hungry", "Food is ready"]
    },
    {
        "id": "GOOD / THUMBS UP",
        "name": "Good / Yes / Superb",
        "hindi_name": "अच्छा / बहुत बढ़िया",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "👍",
        "description": "Thumb pointing straight up, fingers closed in a fist.",
        "hindi_desc": "मुट्ठी बंद करके अंगूठे को सीधा ऊपर उठाएं।",
        "tips": "Universal affirmation of approval and excellence.",
        "frequency": "High",
        "examples": ["Good job", "Yes, understood", "Superb"]
    },
    {
        "id": "I LOVE YOU",
        "name": "I Love You",
        "hindi_name": "आई लव यू / स्नेह",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "🤟",
        "description": "Extend thumb, index, and pinky finger outward together (I + L + Y combined sign).",
        "hindi_desc": "अंगूठे, तर्जनी और कनिष्ठिका को एक साथ बाहर फैलाएं।",
        "tips": "Middle and ring finger stay curled inward.",
        "frequency": "High",
        "examples": ["I love you", "Warm regards"]
    },
    {
        "id": "PEACE / V",
        "name": "Peace / Victory",
        "hindi_name": "शांति / विजय",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "✌️",
        "description": "Index and middle fingers extended apart in a 'V' shape.",
        "hindi_desc": "तर्जनी और मध्यमा को 'V' आकार में फैलाएं।",
        "tips": "Symbol of peace and accomplishment.",
        "frequency": "High",
        "examples": ["Peace", "Victory"]
    },
    {
        "id": "OK / 9",
        "name": "OK / Agreement",
        "hindi_name": "ठीक है / सहमत",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "👌",
        "description": "Thumb and index finger touching tips in a ring, other 3 fingers extended upward.",
        "hindi_desc": "अंगूठे और तर्जनी को जोड़कर छल्ला बनाएं, तीन उंगलियां ऊपर।",
        "tips": "Indicates 'All is well' or number 9.",
        "frequency": "High",
        "examples": ["It's okay", "Agreed", "Nine"]
    },
    {
        "id": "DOCTOR / HOSPITAL",
        "name": "Doctor / Hospital",
        "hindi_name": "डॉक्टर / अस्पताल",
        "type": "phrase",
        "category": "Emergency",
        "hands": "2 Hands",
        "symbol": "🏥",
        "description": "Tap two fingers (index and middle) of dominant hand onto the wrist of opposite hand (checking pulse).",
        "hindi_desc": "एक हाथ की दो उंगलियों से दूसरे हाथ की कलाई पर नाड़ी (पल्स) छूने का संकेत करें।",
        "tips": "Standard medical assistance sign.",
        "frequency": "Essential",
        "examples": ["Call doctor", "Go to hospital"]
    },
    {
        "id": "YOU",
        "name": "You / Pointing",
        "hindi_name": "आप / तुम (इशारा)",
        "type": "phrase",
        "category": "Phrases",
        "hands": "1 Hand",
        "symbol": "👉",
        "description": "Extend dominant index finger directly forward toward the person you are communicating with or toward the camera. Keep middle, ring, and pinky fingers folded in a relaxed fist with thumb resting alongside.",
        "hindi_desc": "तर्जनी उंगली को सामने वाले व्यक्ति (कैमरे) की ओर सीधा इंगित करें। बाकी उंगलियों को मुट्ठी की तरह मोड़कर रखें। यह 'आप' या 'तुम' का मानक ISL संकेत है।",
        "tips": "Point index finger directly forward toward the viewer with confident hand motion.",
        "frequency": "Essential",
        "examples": ["You", "How are you", "Thank you", "Where are you"]
    }
]

# Common vocabulary for predictive text autocomplete
COMMON_WORDS = [
    "HELLO", "HELP", "HOW", "HAVE", "HOME", "HERE",
    "NAMASTE", "NAME", "NEED", "NICE", "NO", "NOT",
    "THANK", "THANKS", "TODAY", "TOMORROW", "TIME",
    "PLEASE", "PEACE", "PRAY", "PEOPLE", "PAIN",
    "WATER", "WANT", "WHAT", "WHERE", "WHEN", "WHY",
    "FOOD", "FRIEND", "FAMILY", "FATHER", "FEEL",
    "GOOD", "GREAT", "GO", "GIVE", "GLAD",
    "YES", "YOU", "YOUR", "YESTERDAY",
    "DOCTOR", "DAY", "DEAR", "DO",
    "COME", "CALL", "CAN", "CARE",
    "AM", "ARE", "AND", "ALL", "ABOUT",
    "LOVE", "LIKE", "LOOK", "LISTEN",
    "INDIA", "ISL", "IMPORTANT"
]


def get_all_signs() -> List[Dict]:
    return ISL_SIGNS


def get_predictive_words(prefix: str, limit: int = 5) -> List[str]:
    """Returns word suggestions based on prefix."""
    prefix = prefix.upper().strip()
    if not prefix:
        return ["HELLO", "NAMASTE", "HELP", "THANK YOU", "WATER"][:limit]
    matches = [w for w in COMMON_WORDS if w.startswith(prefix)]
    return matches[:limit]


def translate_text_to_sign_sequence(text: str) -> List[Dict]:
    """
    Translates input words or phrases into a sequence of ISL dictionary items or fingerspelling letters.
    """
    words = text.upper().strip().split()
    sequence = []
    
    phrase_lookup = {s["name"].upper(): s for s in ISL_SIGNS}
    for s in ISL_SIGNS:
        phrase_lookup[s["id"].upper()] = s
        if "hindi_name" in s:
            phrase_lookup[s["hindi_name"].upper()] = s

    for w in words:
        # Check exact match first
        matched = False
        for key, sign_obj in phrase_lookup.items():
            if w == key:
                sequence.append({
                    "token": w,
                    "matched_sign": sign_obj,
                    "mode": "phrase"
                })
                matched = True
                break

        # Fallback to substring match
        if not matched:
            for key, sign_obj in phrase_lookup.items():
                if w in key or key in w:
                    sequence.append({
                        "token": w,
                        "matched_sign": sign_obj,
                        "mode": "phrase"
                    })
                    matched = True
                    break
        
        if not matched:
            # Fingerspell character by character
            chars = []
            for ch in w:
                if ch.isalnum():
                    ch_sign = phrase_lookup.get(ch, {
                        "id": ch,
                        "name": f"Letter {ch}",
                        "hindi_name": f"अक्षर {ch}",
                        "symbol": ch,
                        "description": f"Fingerspell letter '{ch}' in ISL.",
                        "hindi_desc": f"ISL में अक्षर '{ch}' का संकेत करें।",
                        "tips": "Perform standard ISL hand posture."
                    })
                    chars.append({
                        "char": ch,
                        "sign": ch_sign
                    })
            sequence.append({
                "token": w,
                "fingerspell": chars,
                "mode": "spelling"
            })

    return sequence
