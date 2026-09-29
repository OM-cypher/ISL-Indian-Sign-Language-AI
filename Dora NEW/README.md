# ✋ Dora ISL AI — Indian Sign Language Recognition & Translation Platform

A state-of-the-art, real-time **Indian Sign Language (ISL) Recognition, 2-Way Translation, and Learning Studio** powered by Python FastAPI, MediaPipe Hand tracking, OpenCV biomechanics, and a futuristic dark-glass Web UI.

---

## 🌟 Enhanced Feature Suite

### 1. ⚡ Real-Time Neural Recognition (1-Hand & 2-Hand ISL)
- Tracks up to 2 hands simultaneously at 60 FPS using 21 3D hand landmarks per hand.
- Supports both single-handed fingerspelling (A-Z, 0-9) and traditional **two-handed Indian Sign Language signs** (Namaste, Help, Thank You, Doctor, etc.) with temporal stability and jitter suppression.

### 2. 🎙️ Voice-to-Sign Dictation (Speech Recognition)
- Speak directly into your microphone in **English or Hindi**!
- Transcribes spoken sentences in real time and automatically converts them into animated ISL sign sequences and fingerspelling demonstrations.

### 3. 🌐 Bilingual Support (English & हिन्दी)
- Instant one-click toggle between English and Hindi.
- All sign titles, descriptions, tips, and speech synthesis work seamlessly in both English and Hindi (`hi-IN`).

### 4. ✨ Smart Predictive Word Autocomplete
- Displays real-time predictive word chips (e.g., typing *"H"* suggests *"HELLO"*, *"HELP"*, *"HERE"*).
- Click any suggested chip to autocomplete the word and advance your sentence.

### 5. 🧠 In-Browser AI Custom Trainer Studio
- Teach the AI your own custom signs directly from your webcam!
- **Step 1**: Enter gesture name (e.g. `TEACHER`, `FRIEND`, `HOME`).
- **Step 2**: 3-2-1 visual countdown on camera captures 30 normalized landmark frames.
- **Step 3**: Click *"Train AI Model Now"* to train a Scikit-Learn Random Forest Classifier that **hot-reloads into the active engine immediately without restarting the server**!

### 6. 🚨 Emergency SOS Beacon Mode
- Instant emergency assistance trigger for speech & hearing-impaired individuals.
- Quick one-click cards for **Ambulance (Medical)**, **Police (Security)**, **Speech Impaired Notice**, and **Fire Hazard**.
- Emits an emergency audio siren, speaks out the broadcast message, and copies the emergency text to your clipboard.

### 7. 📥 Conversation Transcript Export
- Export your complete sentence history and gesture timeline as a formatted `.txt` report with timestamps for medical, educational, or official records.

### 8. 🎨 4 Futuristic Accessibility Themes
- **🌌 Cyber Obsidian**: Sleek deep space dark mode with neon cyan and purple glow.
- **🟢 Neon Matrix**: Energetic cyber emerald green aesthetic.
- **🟣 Sunset Amethyst**: Vibrant twilight magenta and violet tones.
- **⚡ High Contrast Mode**: Specially designed for low-vision accessibility.

---

## 📂 Project Structure

```
d:\Dora NEW\
├── backend\
│   ├── app.py                   # FastAPI server with WebSocket & REST endpoints
│   ├── isl_engine.py            # Geometric normalizer, ISL rules, and ML hot-loader
│   ├── isl_dictionary_data.py   # Bilingual ISL database, reverse translator, & predictive lexicon
│   ├── collect_and_train.py     # Offline / batch model trainer
│   ├── data\                    # User-recorded custom gesture datasets
│   └── models\                  # Saved Random Forest weights (.joblib) and class lists
├── frontend\
│   ├── index.html               # Modern Cyber-Glass studio HUD, tabs, & modals
│   ├── style.css                # 4-theme CSS design system, glassmorphism, micro-animations
│   ├── app.js                   # MediaPipe tracking, voice dictation, WebSocket client, HUD logic
│   └── dictionary.js            # Bilingual ISL registry and skeletal joint parameters
├── requirements.txt             # Python dependencies
└── README.md                    # Project documentation
```

---

## 🚀 Quick Launch

### 1. Start Server
Run from the workspace directory:
```bash
python backend/app.py
```

### 2. Open Application
Navigate in your browser to:
```
http://localhost:8000
```

---

## 🖐️ Expanded ISL Gesture Vocabulary (34+ Core Signs)

| Category | Gestures Included |
| :--- | :--- |
| **Alphabets (A-Z)** | `A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `L`, `O`, `V`, `W`, `Y` |
| **Numbers (0-9)** | `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` |
| **Greetings** | `NAMASTE / HELLO` (2 hands), `HELLO / STOP` (1 hand) |
| **Emergency** | `HELP` (2 hands), `DOCTOR / HOSPITAL` (pulse check gesture) |
| **Daily Phrases** | `THANK YOU`, `WATER` (W shape to chin), `FOOD / EAT` (cone to mouth), `YES`, `NO`, `PLEASE`, `GOOD / THUMBS UP`, `I LOVE YOU`, `PEACE / VICTORY`, `OK / AGREEMENT` |
| **Custom Signs** | Dynamically unlimited! Add your own signs in the **AI Custom Trainer** tab. |
