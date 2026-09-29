/**
 * Indian Sign Language (ISL) Frontend Dictionary & Knowledge Registry
 * Multilingual Pan-India Support: English, Hindi, Tamil, Telugu, Bengali, Marathi.
 * Includes complete 3D hand skeletal joint rotations, descriptions, and category metadata.
 */

const ISL_LOCAL_DICTIONARY = [
  // ---------------- ALPHABETS ----------------
  {
    id: "A",
    name: "Alphabet A",
    hindi_name: "अक्षर A",
    type: "alphabet",
    category: "Letters",
    hands: "1 or 2 Hands",
    symbol: "🅰️",
    description: "Make a closed fist with thumb resting alongside the index finger. In 2-handed ISL, dominant index touches the thumb tip of opposite open hand.",
    hindi_desc: "मुट्ठी बंद करें और अंगूठे को तर्जनी के पास सीधा रखें। 2-हाथ वाले ISL में, तर्जनी से दूसरे हाथ के अंगूठे को छुएं।",
    tips: "Keep thumb vertical next to curled index finger.",
    translations: {
      en: { name: "Alphabet A", desc: "Make a closed fist with thumb resting alongside the index finger." },
      hi: { name: "अक्षर A", desc: "मुट्ठी बंद करें और अंगूठे को तर्जनी के पास सीधा रखें।" },
      ta: { name: "எழுத்து A", desc: "கையை மூடி பெருவிரலை ஆட்காட்டி விரலுக்கு அருகில் வைக்கவும்." },
      te: { name: "అక్షరం A", desc: "పిడికిలి బిగించి బొటనవేలిని చూపుడు వేలు పక్కన ఉంచండి." },
      bn: { name: "বর্ণ A", desc: "মুষ্টি তৈরি করুন এবং বৃদ্ধাঙ্গুলি তর্জনীর পাশে রাখুন।" },
      mr: { name: "अक्षर A", desc: "मूठ बंद करा आणि अंगठा तर्जनीजवळ सरळ ठेवा." }
    },
    skeleton: { thumb: 1.0, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2, angle: 0 }
  },
  {
    id: "B",
    name: "Alphabet B",
    hindi_name: "अक्षर B",
    type: "alphabet",
    category: "Letters",
    hands: "1 or 2 Hands",
    symbol: "🅱️",
    description: "Extend four fingers straight together, thumb folded across the palm. In 2-handed ISL, form two circles with both hands touching (binoculars shape).",
    hindi_desc: "चारों उंगलियों को एक साथ सीधा रखें, अंगूठे को हथेली पर मोड़ें। 2-हाथ वाले ISL में दोनों हाथों से दो वृत्त (दूरबीन आकार) बनाएं।",
    tips: "Keep four fingers tight together and palm facing camera.",
    translations: {
      en: { name: "Alphabet B", desc: "Extend four fingers straight together, thumb folded across palm." },
      hi: { name: "अक्षर B", desc: "चारों उंगलियों को एक साथ सीधा रखें, अंगूठे को हथेली पर मोड़ें।" },
      ta: { name: "எழுத்து B", desc: "நான்கு விரல்களையும் ஒன்றாக நேராக நீட்டி, பெருவிரலை மடிக்கவும்." },
      te: { name: "అక్షరం B", desc: "నాలుగు వేళ్లను కలిపి పైకి చాచండి, బొటనవేలిని మడవండి." },
      bn: { name: "বর্ণ B", desc: "চারটি আঙুল সোজা রাখুন এবং বৃদ্ধাঙ্গুলি তালুতে মুড়ে রাখুন।" },
      mr: { name: "अक्षर B", desc: "चार बोटे सरळ एकत्र ठेवा आणि अंगठा तळहातावर दुमडा." }
    },
    skeleton: { thumb: 0.2, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0, angle: 0 }
  },
  {
    id: "C",
    name: "Alphabet C",
    hindi_name: "अक्षर C",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "©️",
    description: "Curved hand forming a clear 'C' or cup shape facing sideways.",
    hindi_desc: "उंगलियों और अंगूठे को 'C' या कप के आकार में मोड़ें।",
    tips: "Curve fingers and thumb like holding an orange.",
    translations: {
      en: { name: "Alphabet C", desc: "Curved hand forming a clear 'C' or cup shape facing sideways." },
      hi: { name: "अक्षर C", desc: "उंगलियों और अंगूठे को 'C' या कप के आकार में मोड़ें।" },
      ta: { name: "எழுத்து C", desc: "விரல்களை வளைத்து 'C' அல்லது கப் வடிவம் உருவாக்கவும்." },
      te: { name: "అక్షరం C", desc: "చేతిని వంచి 'C' లేదా కప్పు ఆకారంలో పెట్టండి." },
      bn: { name: "বর্ণ C", desc: "আঙুল বাঁকিয়ে 'C' বা কাপের মতো ভঙ্গি করুন।" },
      mr: { name: "अक्षर C", desc: "बोटे वाकवून 'C' किंवा कपाचा आकार बनवा." }
    },
    skeleton: { thumb: 0.6, index: 0.6, middle: 0.6, ring: 0.6, pinky: 0.6, angle: 45 }
  },
  {
    id: "D",
    name: "Alphabet D",
    hindi_name: "अक्षर D",
    type: "alphabet",
    category: "Letters",
    hands: "1 or 2 Hands",
    symbol: "🇩",
    description: "Index finger points straight up, while thumb touches middle, ring, and pinky tips in a loop.",
    hindi_desc: "तर्जनी उंगली सीधी ऊपर रखें, अंगूठा अन्य उंगलियों को छूकर वृत्त बनाता है।",
    tips: "Only index points up; all other fingers touch thumb.",
    translations: {
      en: { name: "Alphabet D", desc: "Index finger points straight up, thumb touches other 3 fingers." },
      hi: { name: "अक्षर D", desc: "तर्जनी उंगली सीधी ऊपर रखें, अंगूठा अन्य उंगलियों को छूकर वृत्त बनाता है।" },
      ta: { name: "எழுத்து D", desc: "ஆட்காட்டி விரல் நேராக மேலே, மற்ற விரல்கள் பெருவிரலைத் தொடவும்." },
      te: { name: "అక్షరం D", desc: "చూపుడు వేలు నిటారుగా పైకి, ఇతర వేళ్లు బొటనవేలిని తాకాలి." },
      bn: { name: "বর্ণ D", desc: "তর্জনী সোজা উপরে রাখুন, অন্য আঙুলগুলো বৃদ্ধাঙ্গুলি স্পর্শ করবে।" },
      mr: { name: "अक्षर D", desc: "तर्जनी सरळ वर ठेवा आणि बाकी बोटे अंगठ्याला स्पर्श करा." }
    },
    skeleton: { thumb: 0.4, index: 1.0, middle: 0.3, ring: 0.3, pinky: 0.3, angle: 0 }
  },
  {
    id: "E",
    name: "Alphabet E",
    hindi_name: "अक्षर E",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🇪",
    description: "Bend all four fingers at the joints, resting tips onto the top edge of the thumb.",
    hindi_desc: "सभी उंगलियों को मोड़कर उनके सिरों को अंगूठे पर टिकाएं।",
    tips: "Curled claw-like finger tips touching thumb.",
    translations: {
      en: { name: "Alphabet E", desc: "Bend all four fingers resting tips onto thumb edge." },
      hi: { name: "अक्षर E", desc: "सभी उंगलियों को मोड़कर उनके सिरों को अंगूठे पर टिकाएं।" },
      ta: { name: "எழுத்து E", desc: "நான்கு விரல்களையும் மடக்கி நுனிகளை பெருவிரல் மேல் வைக்கவும்." },
      te: { name: "అక్షరం E", desc: "నాలుగు వేళ్లను వంచి వాటి కొనలను బొటనవేలిపై ఉంచండి." },
      bn: { name: "বর্ণ E", desc: "সব আঙুল বাঁকিয়ে ডগাগুলো বৃদ্ধাঙ্গুলির ওপর রাখুন।" },
      mr: { name: "अक्षर E", desc: "सर्व बोटे दुमडून टोके अंगठ्यावर ठेवा." }
    },
    skeleton: { thumb: 0.3, index: 0.4, middle: 0.4, ring: 0.4, pinky: 0.4, angle: 0 }
  },
  {
    id: "F",
    name: "Alphabet F",
    hindi_name: "अक्षर F",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🇫",
    description: "Thumb and index finger touch forming a circle, other three fingers extended straight.",
    hindi_desc: "अंगूठा और तर्जनी मिलकर वृत्त बनाते हैं, शेष तीन उंगलियां सीधी फैली रहती हैं।",
    tips: "Classic 'OK' hand shape with 3 fingers standing up.",
    translations: {
      en: { name: "Alphabet F", desc: "Thumb and index form a circle, other 3 fingers upright." },
      hi: { name: "अक्षर F", desc: "अंगूठा और तर्जनी मिलकर वृत्त बनाते हैं, शेष तीन उंगलियां सीधी।" },
      ta: { name: "எழுத்து F", desc: "பெருவிரலும் ஆட்காட்டியும் வட்டம் அமைக்கும், மூன்று விரல்கள் நேராக." },
      te: { name: "అక్షరం F", desc: "బొటనవేలు, చూపుడు వేలు వృత్తం చేయగా, మిగిలిన 3 వేళ్లు పైకి ఉంటాయి." },
      bn: { name: "বর্ণ F", desc: "বৃদ্ধাঙ্গুলি ও তর্জনী বৃত্ত বানায়, বাকি তিনটি আঙুল সোজা।" },
      mr: { name: "अक्षर F", desc: "अंगठा आणि तर्जनी वर्तुळ करतात, बाकी तीन बोटे सरळ." }
    },
    skeleton: { thumb: 0.5, index: 0.4, middle: 1.0, ring: 1.0, pinky: 1.0, angle: 0 }
  },
  {
    id: "G",
    name: "Alphabet G",
    hindi_name: "अक्षर G",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🇬",
    description: "Extend index finger and thumb horizontally parallel, other fingers curled.",
    hindi_desc: "तर्जनी और अंगूठे को समानांतर आगे बढ़ाएं, बाकी उंगलियां मुड़ी हुई।",
    tips: "Horizontal pinch shape.",
    translations: {
      en: { name: "Alphabet G", desc: "Extend index and thumb horizontally parallel." },
      hi: { name: "अक्षर G", desc: "तर्जनी और अंगूठे को समानांतर आगे बढ़ाएं।" },
      ta: { name: "எழுத்து G", desc: "ஆட்காட்டி விரலும் பெருவிரலும் கிடைமட்டமாக இணையாக நீட்டவும்." },
      te: { name: "అక్షరం G", desc: "చూపుడు వేలు, బొటనవేలిని సమాంతరంగా ముందుకు చాచండి." },
      bn: { name: "বর্ণ G", desc: "তর্জনী ও বৃদ্ধাঙ্গুলি অনুভূমিকভাবে সমান্তরাল রাখুন।" },
      mr: { name: "अक्षर G", desc: "तर्जनी आणि अंगठा समांतर पुढे करा." }
    },
    skeleton: { thumb: 0.8, index: 0.9, middle: 0.2, ring: 0.2, pinky: 0.2, angle: 90 }
  },
  {
    id: "H",
    name: "Alphabet H",
    hindi_name: "अक्षर H",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🇭",
    description: "Extend index and middle fingers together horizontally sideways, other fingers tucked.",
    hindi_desc: "तर्जनी और मध्यमा को एक साथ क्षैतिज रूप से आगे बढ़ाएं।",
    tips: "Two horizontal parallel fingers pointing to the side.",
    translations: {
      en: { name: "Alphabet H", desc: "Extend index and middle fingers together horizontally." },
      hi: { name: "अक्षर H", desc: "तर्जनी और मध्यमा को एक साथ क्षैतिज रूप से आगे बढ़ाएं।" },
      ta: { name: "எழுத்து H", desc: "ஆட்காட்டி மற்றும் நடுவிரலை ஒன்றாக கிடைமட்டமாக நீட்டவும்." },
      te: { name: "అక్షరం H", desc: "చూపుడు, మధ్య వేళ్లను కలిపి అడ్డంగా చాచండి." },
      bn: { name: "বর্ণ H", desc: "তর্জনী ও মধ্যমা একসাথে অনুভূমিকভাবে প্রসারিত করুন।" },
      mr: { name: "अक्षर H", desc: "तर्जनी आणि मधले बोट एकत्र आडवे पुढे करा." }
    },
    skeleton: { thumb: 0.4, index: 1.0, middle: 1.0, ring: 0.2, pinky: 0.2, angle: 90 }
  },
  {
    id: "I",
    name: "Alphabet I",
    hindi_name: "अक्षर I",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🇮",
    description: "Extend pinky finger straight up, all other fingers closed into a fist with thumb across.",
    hindi_desc: "कनिष्ठिका (छोटी उंगली) सीधी ऊपर उठाएं, बाकी उंगलियां बंद।",
    tips: "Only little pinky finger extended.",
    translations: {
      en: { name: "Alphabet I", desc: "Extend pinky finger straight up, others folded in fist." },
      hi: { name: "अक्षर I", desc: "कनिष्ठिका (छोटी उंगली) सीधी ऊपर उठाएं, बाकी उंगलियां बंद।" },
      ta: { name: "எழுத்து I", desc: "சுண்டு விரலை மட்டும் நேராக மேலே உயர்த்தவும்." },
      te: { name: "అక్షరం I", desc: "చిటికెన వేలును మాత్రమే పైకి నిటారుగా ఉంచండి." },
      bn: { name: "বর্ণ I", desc: "শুধু কনিষ্ঠা আঙুলটি সোজা উপরে তুলুন।" },
      mr: { name: "अक्षर I", desc: "फक्त करंगळी सरळ वर करा, बाकी बोटे बंद ठेवा." }
    },
    skeleton: { thumb: 0.3, index: 0.2, middle: 0.2, ring: 0.2, pinky: 1.0, angle: 0 }
  },
  {
    id: "L",
    name: "Alphabet L",
    hindi_name: "अक्षर L",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🇱",
    description: "Form an 'L' shape with thumb and index finger extended at a 90-degree angle.",
    hindi_desc: "अंगूठे और तर्जनी को 90 डिग्री पर फैलाकर 'L' का आकार बनाएं।",
    tips: "Thumb points sideways, index points straight up.",
    translations: {
      en: { name: "Alphabet L", desc: "Thumb and index extended at a 90-degree angle." },
      hi: { name: "अक्षर L", desc: "अंगूठे और तर्जनी को 90 डिग्री पर फैलाकर 'L' का आकार बनाएं।" },
      ta: { name: "எழுத்து L", desc: "பெருவிரல் மற்றும் ஆட்காட்டி 90 டிகிரியில் 'L' வடிவம்." },
      te: { name: "అక్షరం L", desc: "బొటనవేలు, చూపుడు వేలు 90 డిగ్రీల కోణంలో 'L' ఆకారం." },
      bn: { name: "বর্ণ L", desc: "বৃদ্ধাঙ্গুলি ও তর্জনী ৯০ ডিগ্রিতে 'L' আকার তৈরি করে।" },
      mr: { name: "अक्षर L", desc: "अंगठा आणि तर्जनी ९० अंशात 'L' आकार बनवतात." }
    },
    skeleton: { thumb: 1.0, index: 1.0, middle: 0.2, ring: 0.2, pinky: 0.2, angle: 0 }
  },
  {
    id: "O",
    name: "Alphabet O",
    hindi_name: "अक्षर O",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "⭕",
    description: "Curve all fingers and thumb together to make an open circle 'O'.",
    hindi_desc: "सभी उंगलियों और अंगूठे को मिलाकर गोल 'O' बनाएं।",
    tips: "Form an egg-shaped circle with fingers and thumb.",
    translations: {
      en: { name: "Alphabet O", desc: "Curve all fingers and thumb to form circle 'O'." },
      hi: { name: "अक्षर O", desc: "सभी उंगलियों और अंगूठे को मिलाकर गोल 'O' बनाएं।" },
      ta: { name: "எழுத்து O", desc: "அனைத்து விரல்களையும் குவித்து 'O' வட்டம் செய்யவும்." },
      te: { name: "అక్షరం O", desc: "అన్ని వేళ్లను కలిపి గుండ్రని 'O' ఆకారం చేయండి." },
      bn: { name: "বর্ণ O", desc: "সব আঙুল বাঁকিয়ে গোল 'O' আকৃতি তৈরি করুন।" },
      mr: { name: "अक्षर O", desc: "सर्व बोटे एकत्र करून गोल 'O' बनवा." }
    },
    skeleton: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5, angle: 20 }
  },
  {
    id: "V",
    name: "Alphabet V / Peace",
    hindi_name: "अक्षर V / शांति",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "✌️",
    description: "Extend index and middle fingers in a spread 'V' (peace sign), other fingers folded.",
    hindi_desc: "तर्जनी और मध्यमा को 'V' आकार में फैलाएं (शांति/जीत का चिन्ह)।",
    tips: "Spread fingers comfortably apart in a victory sign.",
    translations: {
      en: { name: "Alphabet V / Peace", desc: "Extend index and middle fingers in a spread 'V'." },
      hi: { name: "अक्षर V / शांति", desc: "तर्जनी और मध्यमा को 'V' आकार में फैलाएं।" },
      ta: { name: "எழுத்து V / அமைதி", desc: "ஆட்காட்டி மற்றும் நடுவிரலை 'V' வடிவில் விரிக்கவும்." },
      te: { name: "అక్షరం V / శాంతి", desc: "చూపుడు, మధ్య వేళ్లను 'V' ఆకారంలో చాచండి." },
      bn: { name: "বর্ণ V / শান্তি", desc: "তর্জনী ও মধ্যমা 'V' আকারে প্রসারিত করুন।" },
      mr: { name: "अक्षर V / शांतता", desc: "तर्जनी आणि मधले बोट 'V' आकारात पसरा." }
    },
    skeleton: { thumb: 0.3, index: 1.0, middle: 1.0, ring: 0.2, pinky: 0.2, angle: 0 }
  },
  {
    id: "W",
    name: "Alphabet W",
    hindi_name: "अक्षर W",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🇼",
    description: "Extend index, middle, and ring fingers spread upward in a 'W' shape.",
    hindi_desc: "तर्जनी, मध्यमा और अनामिका तीनों को ऊपर 'W' आकार में फैलाएं।",
    tips: "Thumb holds down the pinky.",
    translations: {
      en: { name: "Alphabet W", desc: "Extend index, middle, ring fingers in 'W' shape." },
      hi: { name: "अक्षर W", desc: "तर्जनी, मध्यमा और अनामिका को 'W' आकार में फैलाएं।" },
      ta: { name: "எழுத்து W", desc: "மூன்று விரல்களை 'W' வடிவில் மேல்நோக்கி விரிக்கவும்." },
      te: { name: "అక్షరం W", desc: "మూడు వేళ్లను 'W' ఆకారంలో పైకి చాచండి." },
      bn: { name: "বর্ণ W", desc: "তিনটি আঙুল 'W' আকারে উপরে প্রসারিত করুন।" },
      mr: { name: "अक्षर W", desc: "तीन बोटे 'W' आकारात वर पसरा." }
    },
    skeleton: { thumb: 0.3, index: 1.0, middle: 1.0, ring: 1.0, pinky: 0.2, angle: 0 }
  },
  {
    id: "Y",
    name: "Alphabet Y",
    hindi_name: "अक्षर Y",
    type: "alphabet",
    category: "Letters",
    hands: "1 Hand",
    symbol: "🤙",
    description: "Extend thumb and pinky finger outward; index, middle, and ring folded.",
    hindi_desc: "अंगूठे और कनिष्ठिका को बाहर फैलाएं, बीच की तीन उंगलियां मुड़ी हुई।",
    tips: "Classic 'hang loose' phone sign.",
    translations: {
      en: { name: "Alphabet Y", desc: "Extend thumb and pinky outward; 3 middle fingers folded." },
      hi: { name: "अक्षर Y", desc: "अंगूठे और कनिष्ठिका को बाहर फैलाएं, तीन उंगलियां मुड़ी हुई।" },
      ta: { name: "எழுத்து Y", desc: "பெருவிரல் மற்றும் சுண்டு விரலை வெளியே நீட்டவும்." },
      te: { name: "అక్షరం Y", desc: "బొటనవేలు, చిటికెన వేలును బయటకు చాచండి." },
      bn: { name: "বর্ণ Y", desc: "বৃদ্ধাঙ্গুলি ও কনিষ্ঠা বাইরে প্রসারিত করুন।" },
      mr: { name: "अक्षर Y", desc: "अंगठा आणि करंगळी बाहेर पसरा, मधली बोटे बंद ठेवा." }
    },
    skeleton: { thumb: 1.0, index: 0.2, middle: 0.2, ring: 0.2, pinky: 1.0, angle: 0 }
  },

  // ---------------- NUMBERS ----------------
  {
    id: "0",
    name: "Number 0",
    hindi_name: "संख्या 0 (शून्य)",
    type: "number",
    category: "Numbers",
    hands: "1 Hand",
    symbol: "0️⃣",
    description: "Fingers curled with tips touching thumb forming a zero.",
    hindi_desc: "उंगलियों को मोड़कर अंगूठे से मिलाकर शून्य बनाएं।",
    tips: "Smooth closed circle.",
    translations: {
      en: { name: "Number 0", desc: "Fingers curled touching thumb forming zero." },
      hi: { name: "संख्या 0 (शून्य)", desc: "उंगलियों को मोड़कर अंगूठे से मिलाकर शून्य बनाएं।" },
      ta: { name: "எண் 0 (பூஜ்ஜியம்)", desc: "விரல்களை பெருவிரலுடன் இணைத்து சுழியம் செய்யவும்." },
      te: { name: "సంఖ్య 0 (సున్నా)", desc: "వేళ్లను బొటనవేలితో కలిపి సున్నా ఆకారం చేయండి." },
      bn: { name: "সংখ্যা ০ (শূন্য)", desc: "আঙুল দিয়ে গোল শূন্য তৈরি করুন।" },
      mr: { name: "अंक ० (शून्य)", desc: "बोटे अंगठ्याशी जोडून शून्य बनवा." }
    }
  },
  {
    id: "1",
    name: "Number 1",
    hindi_name: "संख्या 1 (एक)",
    type: "number",
    category: "Numbers",
    hands: "1 Hand",
    symbol: "1️⃣",
    description: "Index finger extended vertically, thumb and other fingers folded.",
    hindi_desc: "तर्जनी उंगली को सीधा ऊपर रखें।",
    tips: "Single upright index finger.",
    translations: {
      en: { name: "Number 1", desc: "Index finger extended straight up." },
      hi: { name: "संख्या 1 (एक)", desc: "तर्जनी उंगली को सीधा ऊपर रखें।" },
      ta: { name: "எண் 1 (ஒன்று)", desc: "ஆட்காட்டி விரலை மட்டும் மேலே காட்டவும்." },
      te: { name: "సంఖ్య 1 (ఒకటి)", desc: "చూపుడు వేలును మాత్రమే నిటారుగా పైకి చూపండి." },
      bn: { name: "সংখ্যা ১ (এক)", desc: "তর্জনী সোজা উপরে তুলে এক দেখান।" },
      mr: { name: "अंक १ (एक)", desc: "तर्जनी सरळ वर ठेवून एक दर्शवा." }
    }
  },
  {
    id: "2",
    name: "Number 2",
    hindi_name: "संख्या 2 (दो)",
    type: "number",
    category: "Numbers",
    hands: "1 Hand",
    symbol: "2️⃣",
    description: "Index and middle fingers extended together or spread upward.",
    hindi_desc: "तर्जनी और मध्यमा दोनों को सीधा ऊपर रखें।",
    tips: "Two upright fingers.",
    translations: {
      en: { name: "Number 2", desc: "Index and middle fingers extended upward." },
      hi: { name: "संख्या 2 (दो)", desc: "तर्जनी और मध्यमा दोनों को सीधा ऊपर रखें।" },
      ta: { name: "எண் 2 (இரண்டு)", desc: "ஆட்காட்டி மற்றும் நடுவிரலை மேலே காட்டவும்." },
      te: { name: "సంఖ్య 2 (రెండు)", desc: "చూపుడు మరియు మధ్య వేళ్లను పైకి చూపండి." },
      bn: { name: "সংখ্যা ২ (দুই)", desc: "তর্জনী ও মধ্যমা সোজা উপরে রাখুন।" },
      mr: { name: "अंक २ (दोन)", desc: "तर्जनी आणि मधले बोट वर ठेवून दोन दर्शवा." }
    }
  },
  {
    id: "3",
    name: "Number 3",
    hindi_name: "संख्या 3 (तीन)",
    type: "number",
    category: "Numbers",
    hands: "1 Hand",
    symbol: "3️⃣",
    description: "Thumb, index, and middle fingers extended upward, ring and pinky curled.",
    hindi_desc: "अंगूठा, तर्जनी और मध्यमा को सीधा रखें।",
    tips: "Three fingers pointing up.",
    translations: {
      en: { name: "Number 3", desc: "Thumb, index, and middle fingers extended." },
      hi: { name: "संख्या 3 (तीन)", desc: "अंगूठा, तर्जनी और मध्यमा को सीधा रखें।" },
      ta: { name: "எண் 3 (மூன்று)", desc: "பெருவிரல், ஆட்காட்டி மற்றும் நடுவிரலை விரிக்கவும்." },
      te: { name: "సంఖ్య 3 (మూడు)", desc: "బొటనవేలు, చూపుడు మరియు మధ్య వేళ్లను పైకి చాచండి." },
      bn: { name: "সংখ্যা ৩ (তিন)", desc: "বৃদ্ধাঙ্গুলি, তর্জনী ও মধ্যমা উপরে তুলুন।" },
      mr: { name: "अंक ३ (तीन)", desc: "अंगठा, तर्जनी आणि मधले बोट सरळ ठेवा." }
    }
  },
  {
    id: "4",
    name: "Number 4",
    hindi_name: "संख्या 4 (चार)",
    type: "number",
    category: "Numbers",
    hands: "1 Hand",
    symbol: "4️⃣",
    description: "Four fingers extended upright together, thumb tucked across the palm.",
    hindi_desc: "चारों उंगलियों को सीधा ऊपर रखें, अंगूठा हथेली पर मुड़ा हुआ।",
    tips: "Four vertical fingers without thumb.",
    translations: {
      en: { name: "Number 4", desc: "Four fingers upright with thumb tucked." },
      hi: { name: "संख्या 4 (चार)", desc: "चारों उंगलियों को सीधा ऊपर रखें, अंगूठा मुड़ा हुआ।" },
      ta: { name: "எண் 4 (நான்கு)", desc: "நான்கு விரல்களை மேலே காட்டி பெருவிரலை மடிக்கவும்." },
      te: { name: "సంఖ్య 4 (నాలుగు)", desc: "నాలుగు వేళ్లను పైకి ఉంచి బొటనవేలిని మడవండి." },
      bn: { name: "সংখ্যা ৪ (চার)", desc: "চারটি আঙুল সোজা রাখুন এবং বৃদ্ধাঙ্গুলি মুড়ে রাখুন।" },
      mr: { name: "अंक ४ (चार)", desc: "चार बोटे सरळ वर ठेवा, अंगठा तळहातावर दुमडा." }
    }
  },
  {
    id: "5",
    name: "Number 5",
    hindi_name: "संख्या 5 (पाँच)",
    type: "number",
    category: "Numbers",
    hands: "1 Hand",
    symbol: "5️⃣",
    description: "Open flat hand facing outward with all five fingers spread wide.",
    hindi_desc: "खुली हथेली आगे की ओर, पाँचों उंगलियां फैली हुईं।",
    tips: "Full open high-five hand posture.",
    translations: {
      en: { name: "Number 5", desc: "Open hand with all five fingers spread." },
      hi: { name: "संख्या 5 (पाँच)", desc: "खुली हथेली आगे की ओर, पाँचों उंगलियां फैली हुईं।" },
      ta: { name: "எண் 5 (ஐந்து)", desc: "ஐந்து விரல்களையும் விரித்து உள்ளங்கையைக் காட்டவும்." },
      te: { name: "సంఖ్య 5 (ఐదు)", desc: "ఐదు వేళ్లను వెడల్పుగా చాచి అరచేతిని చూపించండి." },
      bn: { name: "সংখ্যা ৫ (পাঁচ)", desc: "পাঁচটি আঙুল ছড়িয়ে খোলা তালু দেখান।" },
      mr: { name: "अंक ५ (पाच)", desc: "पाचही बोटे पसरून उघडा हात दाखवा." }
    }
  },

  // ---------------- CORE PHRASES ----------------
  {
    id: "NAMASTE",
    name: "Namaste / Greetings",
    hindi_name: "नमस्ते / अभिवादन",
    type: "phrase",
    category: "Greetings",
    hands: "2 Hands",
    symbol: "🙏",
    description: "Press both palms together vertically in front of chest in traditional Indian greeting.",
    hindi_desc: "दोनों हथेलियों को जोड़कर सीने के सामने नमस्कार की मुद्रा बनाएं।",
    tips: "Keep fingers straight pointing upward near heart center.",
    translations: {
      en: { name: "Namaste / Greetings", desc: "Press both palms together in traditional Indian greeting." },
      hi: { name: "नमस्ते / अभिवादन", desc: "दोनों हथेलियों को जोड़कर सीने के सामने नमस्कार की मुद्रा बनाएं।" },
      ta: { name: "வணக்கம் / வாழ்த்துக்கள்", desc: "இரு கைகளையும் மார்பின் முன் குவித்து வணங்கவும்." },
      te: { name: "నమస్కారం / శుభాకాంక్షలు", desc: "రెండు చేతుల అరచేతులను ఛాతీ ముందు జోడించి నమస్కరించండి." },
      bn: { name: "নমস্কার / শুভেচ্ছা", desc: "বুকের সামনে দুই হাতের তালু একসাথে জোড় করে নমস্কার করুন।" },
      mr: { name: "नमस्ते / अभिवादन", desc: "दोन्ही हातांचे तळवे जोडून छातीसमोर नमस्कार करा." }
    },
    skeleton: { thumb: 0.9, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0, angle: 0 }
  },
  {
    id: "HELP",
    name: "Help / Assistance",
    hindi_name: "मदद / सहायता",
    type: "phrase",
    category: "Emergency",
    hands: "2 Hands",
    symbol: "🆘",
    description: "Place closed fist with thumb up onto flat palm of non-dominant hand and lift upward.",
    hindi_desc: "खुली हथेली पर मुट्ठी रखकर दोनों हाथों को थोड़ा ऊपर उठाएं।",
    tips: "Support gesture signaling need for assistance.",
    translations: {
      en: { name: "Help / Assistance", desc: "Place closed fist on open palm and lift upward." },
      hi: { name: "मदद / सहायता", desc: "खुली हथेली पर मुट्ठी रखकर ऊपर उठाएं।" },
      ta: { name: "உதவி / ஆதரவு", desc: "ஒரு உள்ளங்கையில் மற்றொரு கையை வைத்து மேலே தூக்கவும்." },
      te: { name: "సహాయం", desc: "ఒక అరచేతిపై మరో పిడికిలిని ఉంచి పైకి ఎత్తండి." },
      bn: { name: "সাহায্য / সহায়তা", desc: "খোলা তালুর ওপর মুষ্টি রেখে হালকা উপরে তুলুন।" },
      mr: { name: "मदत / सहाय्य", desc: "उघड्या तळहातावर मूठ ठेवून वर उचला." }
    },
    skeleton: { thumb: 1.0, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2, angle: 0 }
  },
  {
    id: "THANK YOU",
    name: "Thank You / Gratitude",
    hindi_name: "धन्यवाद / शुक्रिया",
    type: "phrase",
    category: "Greetings",
    hands: "1 Hand",
    symbol: "🤝",
    description: "Touch fingertips to chin or lips, then move hand gracefully outward toward person.",
    hindi_desc: "उंगलियों को होंठों से छूकर आगे की ओर हथेली खोलें।",
    tips: "Start at chin and extend hand forward with gratitude.",
    translations: {
      en: { name: "Thank You / Gratitude", desc: "Touch fingertips to chin, then move hand outward." },
      hi: { name: "धन्यवाद / शुक्रिया", desc: "उंगलियों को होंठों से छूकर आगे की ओर हथेली खोलें।" },
      ta: { name: "நன்றி / வணக்கம்", desc: "விரல்களை உதட்டில் தொட்டு முன்நோக்கி கையை விரிக்கவும்." },
      te: { name: "ధన్యవాదాలు", desc: "వేళ్లను పెదవులపై తాకించి ముందుకు చాచండి." },
      bn: { name: "ধন্যবাদ / কৃতজ্ঞতা", desc: "আঙুল দিয়ে ঠোঁট স্পর্শ করে সামনে প্রসারিত করুন।" },
      mr: { name: "धन्यवाद / आभार", desc: "बोटे ओठांना स्पर्श करून पुढे हात उघडा." }
    },
    skeleton: { thumb: 0.8, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0, angle: 25 }
  },
  {
    id: "WATER",
    name: "Water / Drink",
    hindi_name: "पानी / जल",
    type: "phrase",
    category: "Emergency",
    hands: "1 Hand",
    symbol: "💧",
    description: "Form a 'W' with three middle fingers upright and tap chin twice.",
    hindi_desc: "'W' आकार बनाकर ठोड़ी को दो बार छुएं।",
    tips: "Tap the chin lightly with index finger side.",
    translations: {
      en: { name: "Water / Drink", desc: "Form 'W' shape and tap chin twice." },
      hi: { name: "पानी / जल", desc: "'W' आकार बनाकर ठोड़ी को दो बार छुएं।" },
      ta: { name: "தண்ணீர் / நீர்", desc: "மூன்று விரல்களால் 'W' வடிவம் செய்து தாடையைத் தொடவும்." },
      te: { name: "నీరు / మంచినీళ్లు", desc: "మూడు వేళ్లతో 'W' ముద్రతో గడ్డాన్ని తాకండి." },
      bn: { name: "জল / পানি", desc: "'W' ভঙ্গি দিয়ে চিবুক দুবার স্পর্শ করুন।" },
      mr: { name: "पाणी", desc: "'W' मुद्रा करून हनुवटीला दोनदा स्पर्श करा." }
    },
    skeleton: { thumb: 0.3, index: 1.0, middle: 1.0, ring: 1.0, pinky: 0.2, angle: 0 }
  },
  {
    id: "FOOD",
    name: "Food / Eat",
    hindi_name: "खाना / भोजन",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "🍲",
    description: "Bring grouped fingertips of dominant hand to lips repeatedly.",
    hindi_desc: "उंगलियों के सिरों को मिलाकर होंठों के पास ले जाएं।",
    tips: "Natural eating gesture bringing fingers to mouth.",
    translations: {
      en: { name: "Food / Eat", desc: "Bring grouped fingertips to lips repeatedly." },
      hi: { name: "खाना / भोजन", desc: "उंगलियों के सिरों को मिलाकर होंठों के पास ले जाएं।" },
      ta: { name: "உணவு / சாப்பாடு", desc: "விரல்களை குவித்து வாய்க்கு அருகில் கொண்டு செல்லவும்." },
      te: { name: "ఆహారం / భోజనం", desc: "వేళ్లను కలిపి పెదవుల వద్దకు తీసుకెళ్లండి." },
      bn: { name: "খাবার / ভোজন", desc: "আঙুলের ডগা একত্রিত করে মুখে দেওয়ার ভঙ্গি করুন।" },
      mr: { name: "अन्न / जेवण", desc: "बोटांचे टोक एकत्र करून तोंडाजवळ आणा." }
    },
    skeleton: { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5, angle: 10 }
  },
  {
    id: "DOCTOR / HOSPITAL",
    name: "Doctor / Hospital",
    hindi_name: "डॉक्टर / अस्पताल",
    type: "phrase",
    category: "Emergency",
    hands: "2 Hands",
    symbol: "🏥",
    description: "Tap two fingers of dominant hand onto opposite wrist (feeling pulse).",
    hindi_desc: "दूसरे हाथ की कलाई पर नाड़ी (पल्स) छूने का संकेत करें।",
    tips: "Standard medical assistance sign.",
    translations: {
      en: { name: "Doctor / Hospital", desc: "Tap two fingers onto opposite wrist feeling pulse." },
      hi: { name: "डॉक्टर / अस्पताल", desc: "दूसरे हाथ की कलाई पर नाड़ी (पल्स) छूने का संकेत करें।" },
      ta: { name: "மருத்துவர் / மருத்துவமனை", desc: "எதிர் மணிக்கட்டில் நாடி பிடிப்பது போல் விரலால் தொடவும்." },
      te: { name: "వైద్యుడు / ఆసుపత్రి", desc: "మణికట్టుపై నాడి చూస్తున్నట్లుగా వేళ్లతో తాకండి." },
      bn: { name: "ডাক্তার / হাসপাতাল", desc: "অন্য হাতের কব্জিতে নাড়ি পরীক্ষা করার ভঙ্গি করুন।" },
      mr: { name: "डॉक्टर / रुग्णालय", desc: "दुसऱ्या हाताच्या मनगटावर नाडी तपासण्याचा संकेत करा." }
    },
    skeleton: { thumb: 0.4, index: 1.0, middle: 1.0, ring: 0.2, pinky: 0.2, angle: 45 }
  },
  {
    id: "GOOD / THUMBS UP",
    name: "Good / Thumbs Up",
    hindi_name: "अच्छा / बहुत बढ़िया",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "👍",
    description: "Thumb pointing straight up, fingers closed in a fist.",
    hindi_desc: "मुट्ठी बंद करके अंगूठे को सीधा ऊपर उठाएं।",
    tips: "Clear thumbs-up gesture.",
    translations: {
      en: { name: "Good / Thumbs Up", desc: "Thumb pointing straight up, fingers in fist." },
      hi: { name: "अच्छा / बहुत बढ़िया", desc: "मुट्ठी बंद करके अंगूठे को सीधा ऊपर उठाएं।" },
      ta: { name: "நன்று / சிறந்தது", desc: "பெருவிரலை நேராக உயர்த்தி மற்ற விரல்களை மூடவும்." },
      te: { name: "మంచిది / బాగుంది", desc: "పిడికిలి బిగించి బొటనవేలిని పైకి చూపండి." },
      bn: { name: "ভালো / চমৎকার", desc: "মুষ্টি বন্ধ করে বৃদ্ধাঙ্গুলি উপরে তুলুন।" },
      mr: { name: "छान / उत्तम", desc: "मूठ बंद करून अंगठा सरळ वर करा." }
    },
    skeleton: { thumb: 1.0, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2, angle: 0 }
  },
  {
    id: "I LOVE YOU",
    name: "I Love You",
    hindi_name: "आई लव यू / स्नेह",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "🤟",
    description: "Extend thumb, index, and pinky finger outward together (I + L + Y combined sign).",
    hindi_desc: "अंगूठे, तर्जनी और कनिष्ठिका को एक साथ बाहर फैलाएं।",
    tips: "Middle and ring finger stay curled inward.",
    translations: {
      en: { name: "I Love You", desc: "Extend thumb, index, and pinky finger outward together." },
      hi: { name: "आई लव यू / स्नेह", desc: "अंगूठे, तर्जनी और कनिष्ठिका को एक साथ बाहर फैलाएं।" },
      ta: { name: "நான் உன்னை நேசிக்கிறேன்", desc: "பெருவிரல், ஆட்காட்டி மற்றும் சுண்டு விரலை விரிக்கவும்." },
      te: { name: "నేను నిన్ను ప్రేమిస్తున్నాను", desc: "బొటనవేలు, చూపుడు వేలు, చిటికెన వేలును చాచండి." },
      bn: { name: "আমি তোমাকে ভালোবাসি", desc: "বৃদ্ধাঙ্গুলি, তর্জনী এবং কনিষ্ঠা একসাথে প্রসারিত করুন।" },
      mr: { name: "माझे तुझ्यावर प्रेम आहे", desc: "अंगठा, तर्जनी आणि करंगळी एकत्र बाहेर पसरा." }
    },
    skeleton: { thumb: 1.0, index: 1.0, middle: 0.2, ring: 0.2, pinky: 1.0, angle: 0 }
  },
  {
    id: "PEACE / V",
    name: "Peace / Victory",
    hindi_name: "शांति / विजय",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "✌️",
    description: "Index and middle fingers extended apart in a 'V' shape.",
    hindi_desc: "तर्जनी और मध्यमा को 'V' आकार में फैलाएं।",
    tips: "Symbol of peace and accomplishment.",
    translations: {
      en: { name: "Peace / Victory", desc: "Index and middle fingers extended in a 'V' shape." },
      hi: { name: "शांति / विजय", desc: "तर्जनी और मध्यमा को 'V' आकार में फैलाएं।" },
      ta: { name: "அமைதி / வெற்றி", desc: "ஆட்காட்டி மற்றும் நடுவிரலை 'V' வடிவில் விரிக்கவும்." },
      te: { name: "శాంతి / విజయం", desc: "చూపుడు మరియు మధ్య వేళ్లను 'V' ఆకారంలో చాచండి." },
      bn: { name: "শান্তি / জয়", desc: "তর্জনী এবং মধ্যমাকে 'V' আকারে প্রসারিত করুন।" },
      mr: { name: "शांतता / विजय", desc: "तर्जनी आणि मधले बोट 'V' आकारात पसरा." }
    },
    skeleton: { thumb: 0.3, index: 1.0, middle: 1.0, ring: 0.2, pinky: 0.2, angle: 0 }
  },
  {
    id: "OK / 9",
    name: "OK / Agreement",
    hindi_name: "ठीक है / सहमत",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "👌",
    description: "Thumb and index finger touching tips in a ring, other 3 fingers extended upward.",
    hindi_desc: "अंगूठे और तर्जनी को जोड़कर छल्ला बनाएं, तीन उंगलियां ऊपर।",
    tips: "Circle formed with thumb and index.",
    translations: {
      en: { name: "OK / Agreement", desc: "Thumb and index form a ring, other 3 fingers upright." },
      hi: { name: "ठीक है / सहमत", desc: "अंगूठे और तर्जनी को जोड़कर छल्ला बनाएं, तीन उंगलियां ऊपर।" },
      ta: { name: "சரி / ஒப்புதல்", desc: "பெருவிரல் மற்றும் ஆட்காட்டி விரலை வட்டமாக இணைக்கவும்." },
      te: { name: "సరే / అంగీకారం", desc: "బొటనవేలు మరియు చూపుడు వేలు కలిపి వృత్తం చేయండి." },
      bn: { name: "ঠিক আছে / সম্মত", desc: "বৃদ্ধাঙ্গুলি ও তর্জনী বৃত্তাকার করে বাকি আঙুল সোজা রাখুন।" },
      mr: { name: "ठीक आहे / संमती", desc: "अंगठा आणि तर्जनी जोडून वर्तुळ करा, इतर बोटे वर ठेवा." }
    },
    skeleton: { thumb: 0.5, index: 0.4, middle: 1.0, ring: 1.0, pinky: 1.0, angle: 0 }
  },
  {
    id: "YES",
    name: "Yes / Affirmation",
    hindi_name: "हाँ / सहमति",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "✅",
    description: "Fist nods up and down imitating head nodding.",
    hindi_desc: "मुट्ठी को सिर हिलाने की तरह ऊपर-नीचे हिलाएं।",
    tips: "Gentle nod of the closed fist.",
    translations: {
      en: { name: "Yes / Affirmation", desc: "Fist nods up and down imitating head nod." },
      hi: { name: "हाँ / सहमति", desc: "मुट्ठी को सिर हिलाने की तरह ऊपर-नीचे हिलाएं।" },
      ta: { name: "ஆம் / சரி", desc: "மூடிய கையை மேலும் கீழும் அசைக்கவும்." },
      te: { name: "అవును", desc: "మూసిన పిడికిలిని పైకి క్రిందికి ఊపండి." },
      bn: { name: "হ্যাঁ / সম্মতি", desc: "মুষ্টি উপরে নিচে দোলান।" },
      mr: { name: "होय / हो", desc: "मूठ वर-खाली हलवा." }
    }
  },
  {
    id: "NO",
    name: "No / Negation",
    hindi_name: "नहीं / मना करना",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "❌",
    description: "Snap index and middle finger closed against thumb, or wave index finger left-right.",
    hindi_desc: "तर्जनी और मध्यमा को अंगूठे के साथ मिलाकर बंद करें या तर्जनी को दाएं-बाएं हिलाएं।",
    tips: "Definite closing or waving motion.",
    translations: {
      en: { name: "No / Negation", desc: "Wave index finger or snap fingers closed against thumb." },
      hi: { name: "नहीं / मना करना", desc: "तर्जनी को दाएं-बाएं हिलाएं या अंगूठे से मिलाकर बंद करें।" },
      ta: { name: "இல்லை", desc: "ஆட்காட்டி விரலை இடது-வலது அசைக்கவும்." },
      te: { name: "కాదు / వద్దు", desc: "చూపుడు వేలును ఎడమ-కుడి ఊపండి." },
      bn: { name: "না / অসম্মতি", desc: "তর্জনী ডানে-বামে নাড়ান।" },
      mr: { name: "नाही / नकार", desc: "तर्जनी डावीकडे-उजवीकडे हलवा." }
    }
  },
  {
    id: "PLEASE",
    name: "Please / Request",
    hindi_name: "कृपया / निवेदन",
    type: "phrase",
    category: "Phrases",
    hands: "1 or 2 Hands",
    symbol: "🥺",
    description: "Rub flat hand in a gentle circular motion over the chest/heart.",
    hindi_desc: "सपाट हाथ को सीने/हृदय के ऊपर धीरे-धीरे गोल घुमाएं।",
    tips: "Circular clockwise rubbing motion over chest.",
    translations: {
      en: { name: "Please / Request", desc: "Rub flat hand gently over chest/heart." },
      hi: { name: "कृपया / निवेदन", desc: "सपाट हाथ को सीने/हृदय के ऊपर धीरे-धीरे गोल घुमाएं।" },
      ta: { name: "தயவுசெய்து", desc: "மார்பின் மீது கையை வட்டமாக சுழற்றவும்." },
      te: { name: "దయచేసి", desc: "ఛాతీపై అరచేతితో వృత్తాకారంగా రుద్దండి." },
      bn: { name: "দয়া করে", desc: "বুকের ওপর হাত মৃদুভাবে বৃত্তাকারে ঘষুন।" },
      mr: { name: "कृपया / विनंती", desc: "छातीवर हात हळूवार गोलाकार फिरवा." }
    }
  },
  {
    id: "YOU",
    name: "You / Pointing",
    hindi_name: "आप / तुम (इशारा)",
    type: "phrase",
    category: "Phrases",
    hands: "1 Hand",
    symbol: "👉",
    description: "Extend index finger straight forward toward the recipient or camera. Other fingers are curled in a relaxed fist with thumb resting alongside.",
    hindi_desc: "तर्जनी उंगली को सामने वाले व्यक्ति (कैमरे) की ओर सीधा इंगित करें। बाकी उंगलियों को मुट्ठी की तरह मोड़कर रखें। यह 'आप' या 'तुम' का मानक ISL संकेत है।",
    tips: "Clear forward pointing hand motion with index finger.",
    translations: {
      en: { name: "You / Pointing", desc: "Extend index finger straight forward toward recipient/camera." },
      hi: { name: "आप / तुम (इशारा)", desc: "तर्जनी उंगली को सामने वाले व्यक्ति (कैमरे) की ओर सीधा इंगित करें।" },
      ta: { name: "நீங்கள் / சுட்டிக்காட்டுதல்", desc: "ஆட்காட்டி விரலை நேராக முன்நோக்கி நீட்டி சுட்டிக்காட்டவும்." },
      te: { name: "మీరు / చూపడం", desc: "చూపుడు వేలును నేరుగా ముందుకు చాచి చూపించండి." },
      bn: { name: "আপনি / তুমি (ইঙ্গিত)", desc: "তর্জনী সোজা সামনের দিকে প্রসারিত করে ইঙ্গিত করুন।" },
      mr: { name: "तुम्ही / आपण (इशारा)", desc: "तर्जनी सरळ पुढे करून समोरच्या व्यक्तीकडे निर्देश करा." }
    },
    skeleton: { thumb: 0.35, index: 1.0, middle: 0.15, ring: 0.15, pinky: 0.15, angle: 0, pointing: true }
  }
];

// Complete Multilingual UI Lexicon
const UI_I18N = {
  en: {
    langName: "English",
    flag: "🇬🇧",
    voice: "en-IN",
    nav: {
      studio: "Recognition Studio",
      translator: "2-Way Translator",
      call: "Accessible Call",
      dictionary: "ISL Dictionary",
      quiz: "Sign Challenge",
      trainer: "AI Custom Trainer",
      memory: "Memory Match"
    },
    status: {
      online: "Backend: Python AI (Online)",
      client: "Client Engine (Active)"
    }
  },
  hi: {
    langName: "हिन्दी",
    flag: "🇮🇳",
    voice: "hi-IN",
    nav: {
      studio: "पहचान स्टूडियो",
      translator: "द्वि-मार्गी अनुवादक",
      call: "लाइव कॉल",
      dictionary: "ISL शब्दकोश",
      quiz: "संकेत चुनौती",
      trainer: "कस्टम AI ट्रेनर",
      memory: "मेमोरी गेम"
    },
    status: {
      online: "बैकएंड: पायथन AI (सक्रिय)",
      client: "क्लाइंट इंजन (सक्रिय)"
    }
  },
  ta: {
    langName: "தமிழ்",
    flag: "🇮🇳",
    voice: "ta-IN",
    nav: {
      studio: "அடையாள அரங்கம்",
      translator: "இருவழி மொழிபெயர்ப்பாளர்",
      call: "அணுகக்கூடிய அழைப்பு",
      dictionary: "ISL அகராதி",
      quiz: "சைகை சவால்",
      trainer: "தனிப்பயன் AI பயிற்சி",
      memory: "நினைவக விளையாட்டு"
    },
    status: {
      online: "பின்தளம்: பைதான் AI (இணைக்கப்பட்டது)",
      client: "உலாவி இயந்திரம் (செயலில்)"
    }
  },
  te: {
    langName: "తెలుగు",
    flag: "🇮🇳",
    voice: "te-IN",
    nav: {
      studio: "గుర్తింపు స్టూడియో",
      translator: "ద్విమార్గ అనువాదకం",
      call: "లైవ్ కాల్",
      dictionary: "ISL నిఘంటువు",
      quiz: "సైగ సవాలు",
      trainer: "కస్టమ్ AI ట్రైనర్",
      memory: "మెమరీ గేమ్"
    },
    status: {
      online: "బ్యాకెండ్: పైథాన్ AI (ఆన్‌లైన్)",
      client: "క్లయింట్ ఇంజిన్ (యాక్టివ్)"
    }
  },
  bn: {
    langName: "বাংলা",
    flag: "🇮🇳",
    voice: "bn-IN",
    nav: {
      studio: "শনাক্তকরণ স্টুডিও",
      translator: "দ্বিমুখী অনুবাদক",
      call: "অ্যাক্সেসিবল কল",
      dictionary: "ISL অভিধান",
      quiz: "ইশারা চ্যালেঞ্জ",
      trainer: "কাস্টম AI ট্রেইনার",
      memory: "মেমোরি গেম"
    },
    status: {
      online: "ব্যাকএন্ড: পাইথন এআই (অনলাইন)",
      client: "ক্লায়েন্ট ইঞ্জিন (সক্রিয়)"
    }
  },
  mr: {
    langName: "मराठी",
    flag: "🇮🇳",
    voice: "mr-IN",
    nav: {
      studio: "ओळख स्टुडिओ",
      translator: "द्विमार्गी अनुवादक",
      call: "लाईव्ह कॉल",
      dictionary: "ISL शब्दकोश",
      quiz: "संकेत आव्हान",
      trainer: "कस्टम AI ट्रेनर",
      memory: "मेमरी गेम"
    },
    status: {
      online: "बॅकएंड: पायथन AI (सक्रिय)",
      client: "क्लायंट इंजिन (सक्रिय)"
    }
  }
};

// Helper localization getters
function getSignNameLocalized(sign, lang = "en") {
  if (!sign) return "";
  if (sign.translations && sign.translations[lang] && sign.translations[lang].name) {
    return sign.translations[lang].name;
  }
  if (lang === "hi" && sign.hindi_name) return sign.hindi_name;
  return sign.name || sign.id;
}

function getSignDescLocalized(sign, lang = "en") {
  if (!sign) return "";
  if (sign.translations && sign.translations[lang] && sign.translations[lang].desc) {
    return sign.translations[lang].desc;
  }
  if (lang === "hi" && sign.hindi_desc) return sign.hindi_desc;
  return sign.description || "";
}

window.ISL_DICTIONARY = ISL_LOCAL_DICTIONARY;
window.UI_I18N = UI_I18N;
window.getSignNameLocalized = getSignNameLocalized;
window.getSignDescLocalized = getSignDescLocalized;