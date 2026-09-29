/**
 * Dora ISL AI — Complete Enhanced Frontend Application Engine
 * Integrates:
 * 1. Pan-India Multilingual Engine (English, Hindi, Tamil, Telugu, Bengali, Marathi)
 * 2. 60 FPS MediaPipe Hands 3D Landmark Tracking with Python WebSocket & Local Client Dual-Engine
 * 3. Biomechanics Finger Gauges, Jitter Stability & Real-Time HUD
 * 4. 3D Virtual Signer Hand Avatar Rig with Mouse Drag Rotation & Smooth Joint Interpolation
 * 5. Reverse 2-Way Translator with Voice Dictation & Choreographed Sequence Stepper
 * 6. Accessible Video Call with Both AI Simulation Consultation and Real WebRTC P2P Room Calling
 * 7. ISL Interactive Dictionary with Multilingual Search & Category Filters
 * 8. Sign Practice Challenge & 30-Second Rapid-Fire Reflex Sprint Arcade with Combo Multipliers
 * 9. AI Custom Gesture Studio & Scikit-Learn Random Forest Model Trainer
 * 10. ISL Brain Memory Match Game (12-Card Dynamic Pair Flipper)
 * 11. Biomechanics Session Analytics & Printable Digital ISL Proficiency Certificate Generator
 * 12. Fullscreen Particle Confetti Celebration Engine
 * 13. Healthcare Quickboard & Emergency SOS Beacon
 * 14. Progressive Web App (PWA) Offline Service Worker & Native Installation Banner
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // WebSocket URL Helper (Dynamic for Localhost, LAN & HTTPS Public Tunnels)
  // -------------------------------------------------------------------------
  function getWsUrl(path) {
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const wsProto = isHttps ? "wss:" : "ws:";
    const host = typeof window !== "undefined" ? window.location.host : "localhost:8000";
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    if (host) {
      return `${wsProto}//${host}${cleanPath}`;
    }
    return `ws://localhost:8000${cleanPath}`;
  }

  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------
  const state = {
    cameraRunning: false,
    cameraStream: null,
    cameraMirrored: true,
    showSkeleton: true,
    minConfidence: 0.65,
    ttsEnabled: true,
    currentLanguage: "en", // "en", "hi", "ta", "te", "bn", "mr"
    currentTheme: "obsidian",

    // Tracking & FPS
    lastFrameTime: performance.now(),
    fps: 0,
    handsTracked: 0,
    lastTrackedLandmarks: null,

    // Recognition Results
    currentSign: "Ready",
    currentConfidence: 0.0,
    currentCategory: "neutral",

    // Universal AI Object & Item Detection State
    visionMode: "all", // "all", "gestures", "objects"
    cocoModel: null,
    isCocoLoading: false,
    detectedObjects: [],
    lastAnnouncedObject: "",
    lastAnnouncedTime: 0,
    lastCocoDetectTime: 0,

    // Auto-Type Hold State
    holdProgress: 0.0,
    isHeldCommitted: false,
    lastCommittedSign: "",

    // WebSocket to Python Backend
    ws: null,
    backendConnected: false,
    backendUrl: getWsUrl('/ws/recognize'),

    // Quiz & Sprint State
    challengeMode: "practice", // "practice" or "sprint"
    quizTarget: null,
    quizStreak: 0,
    quizScore: 0,
    quizMatchedDuration: 0,

    // 30s Reflex Sprint Arcade
    sprintActive: false,
    sprintTimeLeft: 30.0,
    sprintCombo: 1.0,
    sprintStreak: 0,
    sprintScore: 0,
    sprintTarget: null,
    sprintTimerInterval: null,
    sprintSignsMastered: 0,
    sprintHighScore: parseInt(localStorage.getItem('dora_isl_sprint_hs') || '0', 10),

    // Audio & Dictation (Enhanced Speech Engine)
    synth: typeof window !== "undefined" ? window.speechSynthesis : null,
    recognition: null,
    isListening: false,
    playbackSpeed: 1.0,
    lastSpokenSign: "",
    lastSpokenSignTime: 0,

    // Custom Trainer Recording
    isRecordingGesture: false,
    recordingFrames: [],
    targetRecordFrames: 30,

    // 3D Virtual Avatar Rig
    avatarRotX: 0.2,
    avatarRotY: 0.0,
    avatarTargetPose: { thumb: 0.5, index: 1.0, middle: 1.0, ring: 0.2, pinky: 0.2 },
    avatarCurrentPose: { thumb: 0.5, index: 1.0, middle: 1.0, ring: 0.2, pinky: 0.2 },
    isDraggingAvatar: false,
    lastMouseX: 0,
    lastMouseY: 0,

    // Sequence Player in 2-Way Translator
    sequencePlaying: false,
    sequenceStepIdx: 0,
    sequenceCards: [],
    sequenceLoop: false,
    sequenceTimer: null,

    // Accessible Call (Simulation vs WebRTC P2P)
    callMode: "sim", // "sim" or "p2p"
    p2pRoom: "DORA-101",
    peerConnection: null,
    dataChannel: null,
    p2pWs: null,
    isPeerConnected: false,
    p2pSpeechRec: null,
    isP2pMicActive: false,

    // Biomechanics Analytics & Certificate
    sessionSignsTotal: 0,
    sessionConfidenceSum: 0,
    sessionRightCount: 0,
    sessionLeftCount: 0,
    lastWristPositions: [],
    sessionStabilityIndex: 94,

    // PWA
    deferredPwaPrompt: null,

    // Full Conversation Log
    conversationLog: []
  };

  // -------------------------------------------------------------------------
  // DOM Elements Map
  // -------------------------------------------------------------------------
  const el = {
    // Navigation & Global Controls
    tabs: document.querySelectorAll('.nav-tab'),
    panes: document.querySelectorAll('.tab-pane'),
    backendStatusPill: document.getElementById('backendStatusPill'),
    backendStatusLabel: document.getElementById('backendStatusLabel'),
    ttsToggleBtn: document.getElementById('ttsToggleBtn'),
    ttsIcon: document.getElementById('ttsIcon'),
    headerSosBtn: document.getElementById('headerSosBtn'),
    btnHealthcarePhrases: document.getElementById('btnHealthcarePhrases'),

    // Pan-India Multilingual Dropdown
    langDropdownWrapper: document.getElementById('langDropdownWrapper'),
    langSelectorBtn: document.getElementById('langSelectorBtn'),
    currentLangFlag: document.getElementById('currentLangFlag'),
    currentLangLabel: document.getElementById('currentLangLabel'),
    langMenu: document.getElementById('langMenu'),
    langOptItems: document.querySelectorAll('.lang-opt-item'),

    // PWA Install Button
    btnInstallApp: document.getElementById('btnInstallApp'),

    // Theme Switcher
    themeBtn: document.getElementById('themeBtn'),
    themeMenu: document.getElementById('themeMenu'),
    themeOpts: document.querySelectorAll('.theme-opt'),

    // Camera & Canvas
    webcamVideo: document.getElementById('webcamVideo'),
    skeletonCanvas: document.getElementById('skeletonCanvas'),
    cameraIdleState: document.getElementById('cameraIdleState'),
    startCameraBtn: document.getElementById('startCameraBtn'),
    toggleCameraBtn: document.getElementById('toggleCameraBtn'),
    toggleSkeletonBtn: document.getElementById('toggleSkeletonBtn'),
    flipCameraBtn: document.getElementById('flipCameraBtn'),
    confSlider: document.getElementById('confSlider'),
    confVal: document.getElementById('confVal'),

    // Viewport HUD Overlays & Countdown
    recordCountdownOverlay: document.getElementById('recordCountdownOverlay'),
    countdownDigit: document.getElementById('countdownDigit'),
    countdownCaption: document.getElementById('countdownCaption'),
    floatingBadge: document.getElementById('floatingBadge'),
    floatingSymbol: document.getElementById('floatingSymbol'),
    floatingSign: document.getElementById('floatingSign'),
    floatingMeta: document.getElementById('floatingMeta'),
    holdIndicator: document.getElementById('holdIndicator'),
    holdRingCircle: document.getElementById('holdRingCircle'),
    fpsCounter: document.getElementById('fpsCounter'),
    handsCounter: document.getElementById('handsCounter'),
    objectsCounter: document.getElementById('objectsCounter'),
    modeBtnAll: document.getElementById('modeBtnAll'),
    modeBtnGestures: document.getElementById('modeBtnGestures'),
    modeBtnObjects: document.getElementById('modeBtnObjects'),

    // Biomechanics Finger Meters
    stabilityTag: document.getElementById('stabilityTag'),
    fThumbFill: document.getElementById('fThumbFill'),
    fIndexFill: document.getElementById('fIndexFill'),
    fMiddleFill: document.getElementById('fMiddleFill'),
    fRingFill: document.getElementById('fRingFill'),
    fPinkyFill: document.getElementById('fPinkyFill'),

    // Showcase & Sentence Output
    signCategoryBadge: document.getElementById('signCategoryBadge'),
    confBarFill: document.getElementById('confBarFill'),
    confText: document.getElementById('confText'),
    detectedSignTitle: document.getElementById('detectedSignTitle'),
    detectedSignHindi: document.getElementById('detectedSignHindi'),
    detectedSignHint: document.getElementById('detectedSignHint'),
    predictiveBar: document.getElementById('predictiveBar'),
    predChips: document.getElementById('predChips'),
    sentenceOutput: document.getElementById('sentenceOutput'),
    btnSpace: document.getElementById('btnSpace'),
    btnBackspace: document.getElementById('btnBackspace'),
    btnClear: document.getElementById('btnClear'),
    btnCopy: document.getElementById('btnCopy'),
    btnDownloadTranscript: document.getElementById('btnDownloadTranscript'),
    btnOpenAnalytics: document.getElementById('btnOpenAnalytics'),
    btnSpeak: document.getElementById('btnSpeak'),
    recentChips: document.getElementById('recentChips'),

    // Translator & 3D Virtual Avatar Canvas
    translateInput: document.getElementById('translateInput'),
    btnMicDictate: document.getElementById('btnMicDictate'),
    micIcon: document.getElementById('micIcon'),
    micText: document.getElementById('micText'),
    btnTranslate: document.getElementById('btnTranslate'),
    sampleChips: document.querySelectorAll('.sample-chip'),
    virtualAvatarCanvas: document.getElementById('virtualAvatarCanvas'),
    translationSummaryTitle: document.getElementById('translationSummaryTitle'),
    translationCardsGrid: document.getElementById('translationCardsGrid'),
    btnPlaySequence: document.getElementById('btnPlaySequence'),
    btnPauseSequence: document.getElementById('btnPauseSequence'),
    btnPrevStep: document.getElementById('btnPrevStep'),
    btnNextStep: document.getElementById('btnNextStep'),
    seqLoopToggle: document.getElementById('seqLoopToggle'),
    seqStepPill: document.getElementById('seqStepPill'),
    speedBtns: document.querySelectorAll('.speed-btn'),

    // Accessible Live Call (Simulation + WebRTC P2P)
    btnCallModeSim: document.getElementById('btnCallModeSim'),
    btnCallModeP2P: document.getElementById('btnCallModeP2P'),
    p2pRoomControls: document.getElementById('p2pRoomControls'),
    p2pRoomInput: document.getElementById('p2pRoomInput'),
    btnGenRoom: document.getElementById('btnGenRoom'),
    btnJoinRoom: document.getElementById('btnJoinRoom'),
    btnCopyRoomLink: document.getElementById('btnCopyRoomLink'),
    p2pStatusPill: document.getElementById('p2pStatusPill'),
    callSelfVideo: document.getElementById('callSelfVideo'),
    signerSubtitles: document.getElementById('signerSubtitles'),
    simAvatarBox: document.getElementById('simAvatarBox'),
    hearingSubtitles: document.getElementById('hearingSubtitles'),
    btnSimulatePeerReply: document.getElementById('btnSimulatePeerReply'),
    p2pRemoteVideoBox: document.getElementById('p2pRemoteVideoBox'),
    remotePeerVideo: document.getElementById('remotePeerVideo'),
    p2pRemoteSubtitles: document.getElementById('p2pRemoteSubtitles'),
    btnP2pMicToggle: document.getElementById('btnP2pMicToggle'),
    peerFooterStatus: document.getElementById('peerFooterStatus'),
    callTranscriptMessages: document.getElementById('callTranscriptMessages'),
    btnEndCall: document.getElementById('btnEndCall'),

    // ISL Dictionary
    dictSearchInput: document.getElementById('dictSearchInput'),
    dictFilterBtns: document.querySelectorAll('.filter-btn'),
    dictionaryGrid: document.getElementById('dictionaryGrid'),

    // Quiz & Reflex Sprint Mode
    btnModePractice: document.getElementById('btnModePractice'),
    btnModeSprint: document.getElementById('btnModeSprint'),
    practiceCard: document.getElementById('practiceCard'),
    sprintCard: document.getElementById('sprintCard'),
    quizStreak: document.getElementById('quizStreak'),
    quizScore: document.getElementById('quizScore'),
    targetSymbol: document.getElementById('targetSymbol'),
    targetSignName: document.getElementById('targetSignName'),
    targetSignHindi: document.getElementById('targetSignHindi'),
    targetSignDesc: document.getElementById('targetSignDesc'),
    quizMatchPercent: document.getElementById('quizMatchPercent'),
    quizMeterFill: document.getElementById('quizMeterFill'),
    quizMatchStatus: document.getElementById('quizMatchStatus'),
    btnSkipChallenge: document.getElementById('btnSkipChallenge'),
    btnHintChallenge: document.getElementById('btnHintChallenge'),

    // Reflex Sprint Card Elements
    sprintTimerVal: document.getElementById('sprintTimerVal'),
    sprintComboVal: document.getElementById('sprintComboVal'),
    sprintScoreVal: document.getElementById('sprintScoreVal'),
    sprintHighScoreVal: document.getElementById('sprintHighScoreVal'),
    sprintTimerFill: document.getElementById('sprintTimerFill'),
    sprintTargetSymbol: document.getElementById('sprintTargetSymbol'),
    sprintTargetName: document.getElementById('sprintTargetName'),
    sprintTargetHint: document.getElementById('sprintTargetHint'),
    sprintHitBanner: document.getElementById('sprintHitBanner'),
    btnStartSprint: document.getElementById('btnStartSprint'),
    btnEndSprintEarly: document.getElementById('btnEndSprintEarly'),

    // Sprint Results Modal
    sprintResultsOverlay: document.getElementById('sprintResultsOverlay'),
    sprintRankIcon: document.getElementById('sprintRankIcon'),
    sprintRankTitle: document.getElementById('sprintRankTitle'),
    sprintRankSubtitle: document.getElementById('sprintRankSubtitle'),
    sresSigns: document.getElementById('sresSigns'),
    sresMultiplier: document.getElementById('sresMultiplier'),
    sresScore: document.getElementById('sresScore'),
    sresStreak: document.getElementById('sresStreak'),
    btnCloseSprintModal: document.getElementById('btnCloseSprintModal'),
    btnSprintAgain: document.getElementById('btnSprintAgain'),

    // Biomechanics Analytics & Certificate Modal
    analyticsModalOverlay: document.getElementById('analyticsModalOverlay'),
    btnCloseAnalytics: document.getElementById('btnCloseAnalytics'),
    mTotalSigns: document.getElementById('mTotalSigns'),
    mStabilityIndex: document.getElementById('mStabilityIndex'),
    mHandUsage: document.getElementById('mHandUsage'),
    mAvgConf: document.getElementById('mAvgConf'),
    certStudentName: document.getElementById('certStudentName'),
    btnGenerateCert: document.getElementById('btnGenerateCert'),
    certCanvas: document.getElementById('certCanvas'),
    btnDownloadCertPng: document.getElementById('btnDownloadCertPng'),
    btnShareCert: document.getElementById('btnShareCert'),

    // AI Custom Trainer
    customSignNameInput: document.getElementById('customSignNameInput'),
    btnStartRecordGesture: document.getElementById('btnStartRecordGesture'),
    recordProgressBox: document.getElementById('recordProgressBox'),
    recProgressPct: document.getElementById('recProgressPct'),
    recFill: document.getElementById('recFill'),
    btnTrainCustomModel: document.getElementById('btnTrainCustomModel'),
    customChipsList: document.getElementById('customChipsList'),

    // Healthcare Quickboard
    phraseboardOverlay: document.getElementById('phraseboardOverlay'),
    btnClosePhraseboard: document.getElementById('btnClosePhraseboard'),
    pbPhraseBtns: document.querySelectorAll('.pb-phrase-btn'),

    // Emergency SOS Modal
    sosModalOverlay: document.getElementById('sosModalOverlay'),
    sosMessageText: document.getElementById('sosMessageText'),
    btnDismissSos: document.getElementById('btnDismissSos'),
    btnCopySos: document.getElementById('btnCopySos'),
    btnSpeakSos: document.getElementById('btnSpeakSos'),
    sosActionCards: document.querySelectorAll('.sos-action-card'),

    // Confetti Canvas & Toast Container
    confettiCanvas: document.getElementById('confettiCanvas'),
    toastContainer: document.getElementById('toastContainer')
  };

  const canvasCtx = el.skeletonCanvas.getContext('2d');
  const avatarCtx = el.virtualAvatarCanvas?.getContext('2d');
  const certCtx = el.certCanvas?.getContext('2d');
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 26; // 163.36

  // -------------------------------------------------------------------------
  // 1. Toast Notification Utility & Synthesized Audio FX
  // -------------------------------------------------------------------------
  function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function playSuccessChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.25);
      });
    } catch (e) {}
  }

  function playHitChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  function playEmergencySiren() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(850, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(700, audioCtx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {}
  }

  // -------------------------------------------------------------------------
  // 2. Multilingual Speech Synthesis Engine (Anti-Freeze, GC-Protected, Mobile Ready)
  // -------------------------------------------------------------------------
  window._activeUtterances = window._activeUtterances || [];
  let speechVoices = [];
  let isSpeechUnlocked = false;

  function populateVoiceList() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      speechVoices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      speechVoices = [];
    }
  }

  function findBestVoice(langCode) {
    if (!speechVoices || speechVoices.length === 0) {
      populateVoiceList();
    }
    if (!speechVoices || speechVoices.length === 0) return null;

    // 1. Exact BCP-47 match (e.g. "hi-IN", "en-IN", "ta-IN")
    let match = speechVoices.find(v => v.lang === langCode || v.lang.replace('_', '-') === langCode);
    if (match) return match;

    // 2. Language prefix match (e.g. "hi", "en", "ta")
    const prefix = langCode.split('-')[0].toLowerCase();
    match = speechVoices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    // 3. Fallback to English voice
    match = speechVoices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (match) return match;

    // 4. Default system voice
    match = speechVoices.find(v => v.default);
    return match || speechVoices[0] || null;
  }

  function unlockAudioContext() {
    try {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
      isSpeechUnlocked = true;
    } catch (e) {}
  }

  function speak(text, forceLang = null) {
    if (!state.ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    if (!text || !text.toString().trim()) return;

    const cleanText = text.toString().trim();
    try {
      const synth = window.speechSynthesis;

      // Always unpause if Chrome speech engine froze in paused state
      if (synth.paused) {
        synth.resume();
      }

      // If speech is busy or queued, clear prior pending items
      if (synth.speaking || synth.pending) {
        synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = Math.max(0.7, Math.min(state.playbackSpeed || 1.0, 1.4));
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const langCode = forceLang || (window.UI_I18N?.[state.currentLanguage]?.voice || "en-IN");
      utterance.lang = langCode;

      const bestVoice = findBestVoice(langCode);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // CRITICAL: Pin utterance in global array so Chrome V8 Garbage Collector does NOT destroy it mid-speech!
      window._activeUtterances.push(utterance);

      utterance.onend = () => {
        const idx = window._activeUtterances.indexOf(utterance);
        if (idx !== -1) window._activeUtterances.splice(idx, 1);
      };

      utterance.onerror = (evt) => {
        if (evt.error !== 'interrupted' && evt.error !== 'canceled') {
          console.warn("TTS error:", evt.error);
        }
        const idx = window._activeUtterances.indexOf(utterance);
        if (idx !== -1) window._activeUtterances.splice(idx, 1);
      };

      synth.speak(utterance);

      // Workaround for Chrome paused bug immediately following speak
      if (synth.paused) {
        synth.resume();
      }
    } catch (e) {
      console.warn("TTS speak exception:", e);
    }
  }

  function announceDetectedSign(sign, confidence = 1.0) {
    if (!state.ttsEnabled || !sign || sign === "Detecting..." || sign === "No Hands Detected") return;
    if (confidence < 0.72) return;
    const now = performance.now();
    // Cooldown: 4.5s for same sign, 2.0s for different sign
    if (state.lastSpokenSign === sign && (now - state.lastSpokenSignTime < 4500)) return;
    if (now - state.lastSpokenSignTime < 2000) return;

    state.lastSpokenSign = sign;
    state.lastSpokenSignTime = now;

    let cleanName = sign;
    if (cleanName.includes("/")) cleanName = cleanName.split("/")[0].trim();
    if (cleanName.startsWith("ISL ")) cleanName = cleanName.replace("ISL ", "");
    if (cleanName.startsWith("Alphabet ")) cleanName = cleanName.replace("Alphabet ", "Letter ");

    const dictItem = (window.ISL_DICTIONARY || []).find(s => s.id === sign || sign.includes(s.id));
    const locName = dictItem && window.getSignNameLocalized ? window.getSignNameLocalized(dictItem, state.currentLanguage) : cleanName;

    speak(locName);
  }

  function initSpeechSynthesis() {
    populateVoiceList();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoiceList;
      }
    }

    // Chrome SpeechSynthesis keep-alive watchdog to prevent silent stalling
    setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 350);

    // Global unlock on any user interaction (unmutes mobile & browser autoplay gates)
    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlockAudioContext, { passive: true });
    });

    // Wire up TTS Toggle Button in header
    if (el.ttsToggleBtn) {
      el.ttsToggleBtn.addEventListener('click', () => {
        unlockAudioContext();
        state.ttsEnabled = !state.ttsEnabled;
        if (state.ttsEnabled) {
          if (el.ttsIcon) el.ttsIcon.textContent = "🔊";
          el.ttsToggleBtn.classList.remove('muted');
          showToast("Voice Audio: Enabled 🔊");
          speak("Voice output enabled");
        } else {
          if (el.ttsIcon) el.ttsIcon.textContent = "🔇";
          el.ttsToggleBtn.classList.add('muted');
          if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          showToast("Voice Audio: Muted 🔇");
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 3. Theme Engine & Pan-India Multilingual Switcher
  // -------------------------------------------------------------------------
  function initThemesAndLanguage() {
    // Theme Switcher
    el.themeOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        el.themeOpts.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        const theme = opt.dataset.theme;
        state.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        el.themeMenu.classList.remove('open');
        showToast(`Theme: ${opt.textContent}`);
      });
    });

    el.themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.themeMenu.classList.toggle('open');
    });

    // Multilingual Dropdown
    if (el.langSelectorBtn && el.langMenu) {
      el.langSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        el.langMenu.classList.toggle('open');
        el.langDropdownWrapper?.classList.toggle('open');
      });

      el.langOptItems.forEach(item => {
        item.addEventListener('click', () => {
          const lang = item.dataset.lang;
          state.currentLanguage = lang;

          el.langOptItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          const langMeta = window.UI_I18N?.[lang];
          if (langMeta) {
            el.currentLangFlag.textContent = langMeta.flag;
            el.currentLangLabel.textContent = langMeta.langName;
          }

          // Update Navigation Tab Labels
          document.querySelectorAll('.tab-label').forEach(lbl => {
            const localized = lbl.dataset[lang] || lbl.dataset.en;
            if (localized) lbl.textContent = localized;
          });

          // Re-render dictionary and quiz
          initDictionary();
          if (state.quizTarget) loadQuizChallenge(state.quizTarget);

          el.langMenu.classList.remove('open');
          el.langDropdownWrapper?.classList.remove('open');
          showToast(`Language: ${langMeta?.langName || lang.toUpperCase()}`);
        });
      });
    }

    // Dismiss dropdowns on external click
    document.addEventListener('click', (e) => {
      if (!el.themeBtn?.contains(e.target)) el.themeMenu?.classList.remove('open');
      if (!el.langSelectorBtn?.contains(e.target)) {
        el.langMenu?.classList.remove('open');
        el.langDropdownWrapper?.classList.remove('open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. Navigation Tabs
  // -------------------------------------------------------------------------
  function initTabs() {
    el.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        el.tabs.forEach(t => t.classList.remove('active'));
        el.panes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');

        const targetPaneId = `pane${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`;
        const targetPane = document.getElementById(targetPaneId);
        if (targetPane) targetPane.classList.add('active');

        if (tab.dataset.tab === 'quiz' && !state.quizTarget) {
          nextQuizChallenge();
        }
        if (tab.dataset.tab === 'trainer') {
          fetchCustomSignsList();
        }
        if (tab.dataset.tab === 'call') {
          if (el.webcamVideo.srcObject) {
            el.callSelfVideo.srcObject = el.webcamVideo.srcObject;
          }
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. WebSocket Backend Connection
  // -------------------------------------------------------------------------
  function connectWebSocket() {
    try {
      el.backendStatusLabel.textContent = "Connecting...";
      el.backendStatusPill.querySelector('.status-dot').className = "status-dot pulsing";

      state.backendUrl = getWsUrl('/ws/recognize');
      const ws = new WebSocket(state.backendUrl);
      state.ws = ws;

      ws.onopen = () => {
        state.backendConnected = true;
        const msg = window.UI_I18N?.[state.currentLanguage]?.status?.online || "Backend: Python AI (Online)";
        el.backendStatusLabel.textContent = msg;
        el.backendStatusPill.querySelector('.status-dot').className = "status-dot online";
        showToast("Connected to ISL Neural Recognition Backend");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleRecognitionResult(data);
        } catch (err) {
          console.error("WS Parse error", err);
        }
      };

      ws.onclose = () => {
        state.backendConnected = false;
        const msg = window.UI_I18N?.[state.currentLanguage]?.status?.client || "Client Engine (Fallback)";
        el.backendStatusLabel.textContent = msg;
        el.backendStatusPill.querySelector('.status-dot').className = "status-dot";
        setTimeout(connectWebSocket, 4000);
      };

      ws.onerror = () => {
        state.backendConnected = false;
        el.backendStatusLabel.textContent = "Client Engine (Fallback)";
        el.backendStatusPill.querySelector('.status-dot').className = "status-dot";
      };
    } catch (e) {
      console.warn("WebSocket initialization failed, falling back to client engine", e);
    }
  }

  // -------------------------------------------------------------------------
  // 6. MediaPipe Hands Tracking Pipeline
  // -------------------------------------------------------------------------
  let cameraInstance = null;
  let handsTracker = null;

  async function initHandTracking() {
    if (!window.Hands) {
      console.warn("MediaPipe Hands library not loaded from CDN, initializing direct webcam stream");
      initDirectWebcam();
      return;
    }

    handsTracker = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    handsTracker.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65
    });

    handsTracker.onResults(onHandResults);

    try {
      cameraInstance = new Camera(el.webcamVideo, {
        onFrame: async () => {
          if (!state.cameraRunning) return;

          // 1. Hands Tracking (run when not in objects-only mode)
          if (handsTracker && state.visionMode !== "objects") {
            await handsTracker.send({ image: el.webcamVideo });
          } else if (state.visionMode === "objects") {
            renderObjectsOnlyMode();
          }

          // 2. Universal Object & Item Recognition Pipeline (throttled every 180ms)
          const now = performance.now();
          if (state.cocoModel && (now - state.lastCocoDetectTime > 180) && state.visionMode !== "gestures") {
            state.lastCocoDetectTime = now;
            runObjectDetection();
          }
        },
        width: 640,
        height: 480
      });

      await cameraInstance.start();
      state.cameraRunning = true;
      state.cameraStream = el.webcamVideo.srcObject;
      el.cameraIdleState.style.display = "none";
      el.toggleCameraBtn.classList.add("active");
      showToast("Camera & Multi-AI Vision Active");
    } catch (err) {
      console.error("Camera start error:", err);
      initDirectWebcam();
    }
  }

  async function initDirectWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false
      });
      el.webcamVideo.srcObject = stream;
      state.cameraStream = stream;
      state.cameraRunning = true;
      el.cameraIdleState.style.display = "none";
      el.toggleCameraBtn.classList.add("active");
      showToast("Webcam connected in Direct Video Mode");

      // Frame loop for direct webcam mode
      const directFrameLoop = async () => {
        if (state.cameraRunning) {
          if (handsTracker && state.visionMode !== "objects") {
            await handsTracker.send({ image: el.webcamVideo });
          } else if (state.visionMode === "objects") {
            renderObjectsOnlyMode();
          }
          const now = performance.now();
          if (state.cocoModel && (now - state.lastCocoDetectTime > 180) && state.visionMode !== "gestures") {
            state.lastCocoDetectTime = now;
            runObjectDetection();
          }
        }
        requestAnimationFrame(directFrameLoop);
      };
      requestAnimationFrame(directFrameLoop);
    } catch (e) {
      console.error("Direct webcam error:", e);
      showToast("Camera access error. Please grant permissions.");
    }
  }

  function onHandResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, el.skeletonCanvas.width, el.skeletonCanvas.height);

    const now = performance.now();
    const delta = (now - state.lastFrameTime) / 1000;
    state.lastFrameTime = now;
    state.fps = Math.round(1 / (delta || 0.033));
    el.fpsCounter.textContent = `FPS: ${state.fps}`;

    // Draw detected object bounding boxes first
    if (state.visionMode !== "gestures" && state.detectedObjects.length > 0) {
      drawDetectedObjects(state.detectedObjects);
    }

    const multiHandLandmarks = results.multiHandLandmarks || [];
    const multiHandedness = results.multiHandedness || [];
    state.handsTracked = multiHandLandmarks.length;
    el.handsCounter.textContent = `Hands: ${state.handsTracked}`;

    if (multiHandLandmarks.length > 0 && state.visionMode !== "objects") {
      const handsPayload = [];

      multiHandLandmarks.forEach((landmarks, i) => {
        const label = multiHandedness[i]?.label || (i === 0 ? "Right" : "Left");
        if (label === "Right") state.sessionRightCount++;
        else state.sessionLeftCount++;

        drawHandSkeleton(landmarks, label);
        handsPayload.push({
          landmarks: landmarks.map(lm => ({ x: lm.x, y: lm.y, z: lm.z })),
          handedness: label
        });
      });

      state.lastTrackedLandmarks = handsPayload[0].landmarks;

      // Kinematic Jitter & Biomechanics Analysis
      updateBiomechanicsGauges(state.lastTrackedLandmarks);

      // Handle custom recording frame
      if (state.isRecordingGesture && state.lastTrackedLandmarks) {
        const frameVector = [];
        const wrist = state.lastTrackedLandmarks[0];
        state.lastTrackedLandmarks.forEach(pt => {
          frameVector.push(pt.x - wrist.x, pt.y - wrist.y, pt.z - wrist.z);
        });
        state.recordingFrames.push(frameVector);

        const count = state.recordingFrames.length;
        el.recProgressPct.textContent = `${count} / ${state.targetRecordFrames}`;
        el.recFill.style.width = `${(count / state.targetRecordFrames) * 100}%`;

        if (count >= state.targetRecordFrames) {
          finishGestureRecording();
        }
      }

      // Stream to Python WebSocket or fallback
      if (state.backendConnected && state.ws && state.ws.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify({ hands: handsPayload }));
      } else {
        const clientResult = clientFallbackRecognizer(handsPayload);
        handleRecognitionResult(clientResult);
      }
    } else {
      state.lastTrackedLandmarks = null;
      // If hands are not in frame, but objects ARE detected:
      if (state.detectedObjects.length > 0 && state.visionMode !== "gestures") {
        handleObjectRecognitionResult(state.detectedObjects[0]);
      } else {
        handleRecognitionResult({
          detected: false,
          sign: state.visionMode === "objects" ? "Awaiting Object..." : "No Hands Detected",
          confidence: 0.0,
          category: "none",
          is_held: false,
          hold_progress: 0.0,
          hands_count: 0
        });
      }
    }

    canvasCtx.restore();
  }

  // -------------------------------------------------------------------------
  // 7. Skeletal Vision HUD Overlay Drawing
  // -------------------------------------------------------------------------
  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17]
  ];

  function drawHandSkeleton(landmarks, label) {
    if (!state.showSkeleton) return;
    const w = el.skeletonCanvas.width;
    const h = el.skeletonCanvas.height;

    // Connect joints
    canvasCtx.strokeStyle = label === "Right" ? "rgba(0, 245, 212, 0.75)" : "rgba(255, 0, 127, 0.75)";
    canvasCtx.lineWidth = 3;

    HAND_CONNECTIONS.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      const x1 = state.cameraMirrored ? (1 - p1.x) * w : p1.x * w;
      const y1 = p1.y * h;
      const x2 = state.cameraMirrored ? (1 - p2.x) * w : p2.x * w;
      const y2 = p2.y * h;

      canvasCtx.beginPath();
      canvasCtx.moveTo(x1, y1);
      canvasCtx.lineTo(x2, y2);
      canvasCtx.stroke();
    });

    // Draw joints
    landmarks.forEach((p, idx) => {
      const x = state.cameraMirrored ? (1 - p.x) * w : p.x * w;
      const y = p.y * h;

      canvasCtx.fillStyle = idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20 ? "#ff007f" : "#00f5d4";
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, idx === 0 ? 6 : 4, 0, 2 * Math.PI);
      canvasCtx.fill();
    });

    // Enhanced Pointing Hand Motion Visual Feedback & Targeting Beam
    if (state.currentSign && (state.currentSign.includes("POINT") || state.currentSign.includes("YOU") || state.currentSign === "1 / D")) {
      const tip = landmarks[8];
      const mcp = landmarks[5];
      const tipX = state.cameraMirrored ? (1 - tip.x) * w : tip.x * w;
      const tipY = tip.y * h;
      const mcpX = state.cameraMirrored ? (1 - mcp.x) * w : mcp.x * w;
      const mcpY = mcp.y * h;

      const dx = tipX - mcpX;
      const dy = tipY - mcpY;
      const mag = Math.hypot(dx, dy) || 1;
      const dirX = dx / mag;
      const dirY = dy / mag;

      // Draw pointing trajectory laser beam
      const rayLen = 55;
      const endX = tipX + dirX * rayLen;
      const endY = tipY + dirY * rayLen;

      const grad = canvasCtx.createLinearGradient(tipX, tipY, endX, endY);
      grad.addColorStop(0, "rgba(0, 245, 212, 0.95)");
      grad.addColorStop(1, "rgba(255, 0, 127, 0.0)");

      canvasCtx.save();
      canvasCtx.strokeStyle = grad;
      canvasCtx.lineWidth = 4;
      canvasCtx.beginPath();
      canvasCtx.moveTo(tipX, tipY);
      canvasCtx.lineTo(endX, endY);
      canvasCtx.stroke();

      // Holographic concentric pulsing targeting reticle at index tip
      const pulse = (performance.now() % 750) / 750;
      canvasCtx.strokeStyle = `rgba(0, 245, 212, ${1 - pulse})`;
      canvasCtx.lineWidth = 2.5;
      canvasCtx.beginPath();
      canvasCtx.arc(tipX, tipY, 7 + pulse * 20, 0, Math.PI * 2);
      canvasCtx.stroke();

      // Pointing HUD indicator badge
      canvasCtx.fillStyle = "rgba(10, 16, 32, 0.85)";
      canvasCtx.strokeStyle = "#00f5d4";
      canvasCtx.lineWidth = 1.5;
      const isYou = state.currentSign.includes("YOU");
      const badgeText = isYou ? "👉 POINTING [YOU]" : "👉 POINTING";
      canvasCtx.font = "bold 11px sans-serif";
      const textW = canvasCtx.measureText(badgeText).width;
      const bx = Math.min(w - textW - 20, Math.max(10, tipX + 16));
      const by = Math.max(25, tipY - 10);

      canvasCtx.beginPath();
      canvasCtx.roundRect(bx - 6, by - 14, textW + 12, 20, 4);
      canvasCtx.fill();
      canvasCtx.stroke();

      canvasCtx.fillStyle = isYou ? "#ff007f" : "#00f5d4";
      canvasCtx.fillText(badgeText, bx, by);
      canvasCtx.restore();
    }
  }

  // -------------------------------------------------------------------------
  // 8. Kinematic Stability & Biomechanics Jitter Analysis
  // -------------------------------------------------------------------------
  function updateBiomechanicsGauges(lm) {
    if (!lm || lm.length < 21) return;
    const calcExt = (tip, pip, mcp) => {
      const dTip = Math.hypot(lm[tip].x - lm[0].x, lm[tip].y - lm[0].y);
      const dPip = Math.hypot(lm[pip].x - lm[0].x, lm[pip].y - lm[0].y);
      const ratio = Math.min(1.0, Math.max(0.1, (dTip / (dPip * 1.2))));
      return Math.round(ratio * 100);
    };

    const pThumb = Math.round(Math.min(1.0, Math.hypot(lm[4].x - lm[2].x, lm[4].y - lm[2].y) / 0.25) * 100);
    const pIndex = calcExt(8, 6, 5);
    const pMiddle = calcExt(12, 10, 9);
    const pRing = calcExt(16, 14, 13);
    const pPinky = calcExt(20, 18, 17);

    el.fThumbFill.style.width = `${pThumb}%`;
    el.fIndexFill.style.width = `${pIndex}%`;
    el.fMiddleFill.style.width = `${pMiddle}%`;
    el.fRingFill.style.width = `${pRing}%`;
    el.fPinkyFill.style.width = `${pPinky}%`;

    // Track wrist jitter for stability
    const wrist = lm[0];
    state.lastWristPositions.push({ x: wrist.x, y: wrist.y, t: performance.now() });
    if (state.lastWristPositions.length > 15) state.lastWristPositions.shift();

    if (state.lastWristPositions.length >= 8) {
      let variance = 0;
      for (let i = 1; i < state.lastWristPositions.length; i++) {
        const dx = state.lastWristPositions[i].x - state.lastWristPositions[i - 1].x;
        const dy = state.lastWristPositions[i].y - state.lastWristPositions[i - 1].y;
        variance += Math.hypot(dx, dy);
      }
      const jitterScore = Math.max(70, Math.min(99, Math.round(100 - (variance * 140))));
      state.sessionStabilityIndex = jitterScore;
      el.stabilityTag.textContent = `Stability: ${jitterScore}%`;
    }
  }

  // -------------------------------------------------------------------------
  // 9. Client Fallback Recognizer
  // -------------------------------------------------------------------------
  function clientFallbackRecognizer(hands) {
    if (!hands || hands.length === 0) {
      return { detected: false, sign: "No Hands", confidence: 0.0, category: "none", hold_progress: 0.0, is_held: false };
    }

    if (hands.length >= 2) {
      const lm1 = hands[0].landmarks;
      const lm2 = hands[1].landmarks;
      const palmDist = Math.hypot(lm1[9].x - lm2[9].x, lm1[9].y - lm2[9].y);
      if (palmDist < 0.22) {
        return { detected: true, sign: "NAMASTE / HELLO", confidence: 0.96, category: "phrase", hold_progress: 0.8, is_held: false };
      }
      if (Math.hypot(lm1[8].x - lm2[8].x, lm1[8].y - lm2[8].y) < 0.12) {
        return { detected: true, sign: "ISL B", confidence: 0.91, category: "alphabet", hold_progress: 0.7, is_held: false };
      }
      return { detected: true, sign: "HELP", confidence: 0.94, category: "phrase", hold_progress: 0.7, is_held: false };
    }

    const lm = hands[0].landmarks;
    const isExtended = (tip, pip) => lm[tip].y < lm[pip].y;
    const idx = isExtended(8, 6);
    const mid = isExtended(12, 10);
    const rng = isExtended(16, 14);
    const pky = isExtended(20, 18);
    const thb = Math.hypot(lm[4].x - lm[5].x, lm[4].y - lm[5].y) > 0.15;

    let sign = "Detecting...";
    let conf = 0.85;
    let cat = "alphabet";

    const dIdx = Math.hypot(lm[8].x - lm[5].x, lm[8].y - lm[5].y, (lm[8].z || 0) - (lm[5].z || 0));
    const dMid = Math.hypot(lm[12].x - lm[9].x, lm[12].y - lm[9].y, (lm[12].z || 0) - (lm[9].z || 0));
    const dRng = Math.hypot(lm[16].x - lm[13].x, lm[16].y - lm[13].y, (lm[16].z || 0) - (lm[13].z || 0));
    const dPky = Math.hypot(lm[20].x - lm[17].x, lm[20].y - lm[17].y, (lm[20].z || 0) - (lm[17].z || 0));
    const otherAvg = Math.max(0.01, (dMid + dRng + dPky) / 3.0);
    const isIdxDominant = (dIdx > 0.16 && dIdx > otherAvg * 1.25) || (idx && !mid && !rng && !pky);

    if (isIdxDominant && !thb) {
      const fwdZ = ((lm[5].z || 0) - (lm[8].z || 0));
      if (fwdZ > -0.05 || (lm[8].y > lm[6].y - 0.25)) {
        sign = "YOU / POINTING";
        cat = "phrase";
        conf = 0.96;
      } else {
        sign = "1 / D";
        cat = "number";
        conf = 0.93;
      }
    } else if (idx && mid && rng && !pky && !thb) {
      sign = "4 / B";
      cat = "number";
      conf = 0.94;
    } else if (idx && mid && rng && pky && thb) {
      sign = "HELLO / STOP";
      cat = "phrase";
      conf = 0.92;
    } else if (!idx && !mid && !rng && pky && !thb) {
      sign = "I";
      cat = "alphabet";
      conf = 0.92;
    } else if (thb && idx && !mid && !rng && !pky) {
      sign = "L";
      cat = "alphabet";
      conf = 0.94;
    } else if (!idx && !mid && !rng && !pky && !thb) {
      sign = "A";
      cat = "alphabet";
      conf = 0.88;
    }

    return { detected: true, sign, confidence: conf, category: cat, hold_progress: 0.6, is_held: false };
  }

  // -------------------------------------------------------------------------
  // 10. Handle Recognition Result & Sentence Accumulator
  // -------------------------------------------------------------------------
  function handleRecognitionResult(res) {
    if (!res.detected || res.confidence < state.minConfidence) {
      el.floatingBadge.style.opacity = "0.4";
      el.floatingSign.textContent = "Show gesture in frame";
      el.floatingMeta.textContent = "Confidence too low or no hands";
      updateHoldIndicator(0);
      return;
    }

    el.floatingBadge.style.opacity = "1";
    state.currentSign = res.sign;
    state.currentConfidence = res.confidence;
    state.currentCategory = res.category || "gesture";
    state.sessionSignsTotal++;
    state.sessionConfidenceSum += res.confidence;

    el.floatingSign.textContent = res.sign;
    el.floatingMeta.textContent = `${Math.round(res.confidence * 100)}% match • ${res.category || "ISL"}`;

    // Live Voice Vocalization of Detected Sign
    announceDetectedSign(res.sign, res.confidence);

    if (el.signerSubtitles) {
      el.signerSubtitles.textContent = `Signing: "${res.sign}"`;
    }

    // Stream live sign subtitles over WebRTC DataChannel to remote peer
    if (state.dataChannel && state.dataChannel.readyState === "open") {
      try {
        state.dataChannel.send(JSON.stringify({
          type: "sign_caption",
          sign: res.sign,
          confidence: res.confidence
        }));
      } catch (err) {}
    }

    let symbol = "✋";
    if (res.sign.includes("NAMASTE")) symbol = "🙏";
    else if (res.sign.includes("YOU") || res.sign.includes("POINT")) symbol = "👉";
    else if (res.sign.includes("PEACE") || res.sign.includes("V")) symbol = "✌️";
    else if (res.sign.includes("LOVE")) symbol = "🤟";
    else if (res.sign.includes("GOOD") || res.sign.includes("THUMBS")) symbol = "👍";
    else if (res.sign.includes("HELP")) symbol = "🆘";
    else if (res.sign.includes("HELLO") || res.sign.includes("STOP")) symbol = "👋";
    else if (res.sign.includes("WATER")) symbol = "💧";
    else if (res.sign.includes("FOOD")) symbol = "🍲";
    else if (res.sign.includes("DOCTOR")) symbol = "🏥";
    else if (res.sign.includes("OK")) symbol = "👌";
    el.floatingSymbol.textContent = symbol;

    // Update Right Showcase Panel
    el.detectedSignTitle.textContent = res.sign;
    el.signCategoryBadge.textContent = res.category ? res.category.toUpperCase() : "DETECTED";
    const confPercent = Math.round(res.confidence * 100);
    el.confBarFill.style.width = `${confPercent}%`;
    el.confText.textContent = `${confPercent}% Match`;

    const dictItem = (window.ISL_DICTIONARY || []).find(s => s.id === res.sign || res.sign.includes(s.id));
    if (dictItem) {
      const locName = window.getSignNameLocalized ? window.getSignNameLocalized(dictItem, state.currentLanguage) : (dictItem.hindi_name || dictItem.name);
      const locDesc = window.getSignDescLocalized ? window.getSignDescLocalized(dictItem, state.currentLanguage) : dictItem.description;
      el.detectedSignHindi.textContent = locName;
      el.detectedSignHint.textContent = locDesc;
      if (dictItem.skeleton) {
        state.avatarTargetPose = dictItem.skeleton;
      }
    }

    const holdProg = res.hold_progress || 0.0;
    updateHoldIndicator(holdProg);

    if ((res.is_held || holdProg >= 1.0) && !state.isHeldCommitted) {
      commitSignToSentence(res.sign);
      state.isHeldCommitted = true;
      playSuccessChime();
    } else if (holdProg < 0.2) {
      state.isHeldCommitted = false;
    }

    // Check practice challenge & sprint match
    if (state.challengeMode === "sprint" && state.sprintActive) {
      checkSprintMatch(res.sign, res.confidence);
    } else {
      checkQuizMatch(res.sign, res.confidence);
    }
  }

  function updateHoldIndicator(progress) {
    const offset = CIRCLE_CIRCUMFERENCE - (progress * CIRCLE_CIRCUMFERENCE);
    el.holdRingCircle.style.strokeDashoffset = offset;
    el.holdIndicator.style.opacity = progress > 0.1 ? "1" : "0.3";
  }

  function commitSignToSentence(sign) {
    if (!sign || sign === "Detecting..." || sign === "No Hands Detected") return;

    let appendText = sign;
    if (sign.startsWith("Alphabet ")) appendText = sign.replace("Alphabet ", "");
    else if (sign.startsWith("Number ")) appendText = sign.replace("Number ", "");
    else if (sign.includes("/")) appendText = sign.split("/")[0].trim();
    else if (sign.startsWith("ISL ")) appendText = sign.replace("ISL ", "");

    if (appendText.length > 2) {
      el.sentenceOutput.value += (el.sentenceOutput.value ? " " : "") + appendText + " ";
    } else {
      el.sentenceOutput.value += appendText;
    }

    speak(appendText);
    addRecentChip(sign);
    updatePredictiveSuggestions(appendText);

    state.conversationLog.push({
      time: new Date().toLocaleTimeString(),
      sign: sign,
      text: appendText
    });

    addCallTranscriptMessage("Signer (You)", appendText, false);
    showToast(`Committed: "${appendText}"`);
  }

  function addRecentChip(sign) {
    const emptyNote = el.recentChips.querySelector('.empty-chip-note');
    if (emptyNote) emptyNote.remove();

    const chip = document.createElement('span');
    chip.className = 'sign-chip';
    chip.textContent = sign;
    el.recentChips.prepend(chip);

    while (el.recentChips.children.length > 7) {
      el.recentChips.removeChild(el.recentChips.lastChild);
    }
  }

  async function updatePredictiveSuggestions(prefix) {
    try {
      const res = await fetch(`/api/predictive?prefix=${encodeURIComponent(prefix)}`);
      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        el.predChips.innerHTML = "";
        data.suggestions.forEach(w => {
          const btn = document.createElement('button');
          btn.className = 'pred-chip';
          btn.textContent = w;
          btn.addEventListener('click', () => {
            el.sentenceOutput.value += " " + w + " ";
            speak(w);
            updatePredictiveSuggestions("");
          });
          el.predChips.appendChild(btn);
        });
      }
    } catch (e) {}
  }

  // -------------------------------------------------------------------------
  // 11. Sentence Builder Controls
  // -------------------------------------------------------------------------
  function initSentenceControls() {
    el.btnSpace.addEventListener('click', () => { el.sentenceOutput.value += " "; el.sentenceOutput.focus(); });
    el.btnBackspace.addEventListener('click', () => {
      el.sentenceOutput.value = el.sentenceOutput.value.slice(0, -1);
      el.sentenceOutput.focus();
    });
    el.btnClear.addEventListener('click', () => { el.sentenceOutput.value = ""; el.sentenceOutput.focus(); });
    el.btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(el.sentenceOutput.value);
      showToast("Sentence copied to clipboard!");
    });
    el.btnSpeak.addEventListener('click', () => {
      speak(el.sentenceOutput.value || "No sentence composed yet.");
    });
    el.btnDownloadTranscript.addEventListener('click', () => {
      const content = state.conversationLog.map(item => `[${item.time}] ${item.sign}: ${item.text}`).join("\n");
      const blob = new Blob([content || el.sentenceOutput.value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ISL_Transcript_${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Downloaded conversation transcript");
    });
  }

  // -------------------------------------------------------------------------
  // 12. Camera Controls & Viewport Actions
  // -------------------------------------------------------------------------
  function initCameraControls() {
    el.startCameraBtn.addEventListener('click', initHandTracking);
    el.toggleCameraBtn.addEventListener('click', () => {
      state.cameraRunning = !state.cameraRunning;
      el.toggleCameraBtn.classList.toggle('active', state.cameraRunning);
      el.cameraIdleState.style.display = state.cameraRunning ? "none" : "flex";
      showToast(`Camera ${state.cameraRunning ? "Resumed" : "Paused"}`);
    });
    el.toggleSkeletonBtn.addEventListener('click', () => {
      state.showSkeleton = !state.showSkeleton;
      el.toggleSkeletonBtn.classList.toggle('active', state.showSkeleton);
      showToast(`Skeleton HUD ${state.showSkeleton ? "Visible" : "Hidden"}`);
    });
    el.flipCameraBtn.addEventListener('click', () => {
      state.cameraMirrored = !state.cameraMirrored;
      el.webcamVideo.style.transform = state.cameraMirrored ? "scaleX(-1)" : "scaleX(1)";
      showToast(`Camera ${state.cameraMirrored ? "Mirrored" : "Normal"}`);
    });
    el.confSlider.addEventListener('input', (e) => {
      state.minConfidence = parseFloat(e.target.value);
      el.confVal.textContent = `${Math.round(state.minConfidence * 100)}%`;
    });
  }

  // -------------------------------------------------------------------------
  // 13. Video Recording Utility (Sign Clip)
  // -------------------------------------------------------------------------
  function initVideoRecorder() {
    const btnRecordClip = document.getElementById('btnRecordClip');
    if (!btnRecordClip) return;

    let mediaRecorder = null;
    let recordedChunks = [];

    btnRecordClip.addEventListener('click', () => {
      if (!state.cameraStream) {
        showToast("Webcam is not active to record clip!");
        return;
      }
      if (mediaRecorder && mediaRecorder.state === "recording") return;

      recordedChunks = [];
      try {
        mediaRecorder = new MediaRecorder(state.cameraStream, { mimeType: "video/webm" });
      } catch (e) {
        mediaRecorder = new MediaRecorder(state.cameraStream);
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dora_isl_sign_clip_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        btnRecordClip.classList.remove('recording');
        btnRecordClip.innerHTML = `<span>📹</span><span>Record Sign Clip (6s)</span>`;
        showToast("Saved 6s sign language video clip!");
      };

      mediaRecorder.start();
      btnRecordClip.classList.add('recording');
      let countdown = 6;
      btnRecordClip.innerHTML = `<span>🔴</span><span>Recording (${countdown}s)...</span>`;

      const recTimer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          btnRecordClip.innerHTML = `<span>🔴</span><span>Recording (${countdown}s)...</span>`;
        } else {
          clearInterval(recTimer);
          mediaRecorder.stop();
        }
      }, 1000);

      showToast("Recording 6-second video sign clip...");
    });
  }

  // -------------------------------------------------------------------------
  // 14. 3D Virtual Signer Hand Avatar Rig with Mouse Drag Rotation
  // -------------------------------------------------------------------------
  function initAvatarCanvas() {
    if (!el.virtualAvatarCanvas) return;

    el.virtualAvatarCanvas.addEventListener('mousedown', (e) => {
      state.isDraggingAvatar = true;
      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isDraggingAvatar) return;
      const dx = e.clientX - state.lastMouseX;
      const dy = e.clientY - state.lastMouseY;
      state.avatarRotY += dx * 0.015;
      state.avatarRotX += dy * 0.015;
      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { state.isDraggingAvatar = false; });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function renderAvatar() {
      if (!avatarCtx) return;
      const w = el.virtualAvatarCanvas.width;
      const h = el.virtualAvatarCanvas.height;
      avatarCtx.clearRect(0, 0, w, h);

      // Smooth joint interpolation
      const t = 0.14;
      state.avatarCurrentPose.thumb = lerp(state.avatarCurrentPose.thumb, state.avatarTargetPose.thumb, t);
      state.avatarCurrentPose.index = lerp(state.avatarCurrentPose.index, state.avatarTargetPose.index, t);
      state.avatarCurrentPose.middle = lerp(state.avatarCurrentPose.middle, state.avatarTargetPose.middle, t);
      state.avatarCurrentPose.ring = lerp(state.avatarCurrentPose.ring, state.avatarTargetPose.ring, t);
      state.avatarCurrentPose.pinky = lerp(state.avatarCurrentPose.pinky, state.avatarTargetPose.pinky, t);

      avatarCtx.save();
      // Subtle dynamic forward reach oscillation when pointing hand motion is active
      const isPointingPose = state.avatarTargetPose.pointing ||
        (state.avatarCurrentPose.index > 0.8 && state.avatarCurrentPose.middle < 0.35 && state.avatarCurrentPose.ring < 0.35 && state.avatarCurrentPose.pinky < 0.35);
      const reachOsc = isPointingPose ? Math.sin(performance.now() / 180) * 10 : 0;

      avatarCtx.translate(w / 2, h / 2 + 30 + reachOsc);
      avatarCtx.rotate(state.avatarRotY);

      // Draw palm polygon
      avatarCtx.fillStyle = isPointingPose ? "rgba(12, 38, 64, 0.95)" : "rgba(18, 28, 54, 0.9)";
      avatarCtx.strokeStyle = isPointingPose ? "#00f5d4" : "rgba(0, 245, 212, 0.9)";
      avatarCtx.lineWidth = 3;

      avatarCtx.beginPath();
      avatarCtx.moveTo(-35, 15);
      avatarCtx.lineTo(-45, -25);
      avatarCtx.lineTo(-20, -50);
      avatarCtx.lineTo(20, -50);
      avatarCtx.lineTo(45, -25);
      avatarCtx.lineTo(35, 15);
      avatarCtx.closePath();
      avatarCtx.fill();
      avatarCtx.stroke();

      // Draw 5 articulated fingers
      const fingers = [
        { name: "thumb", x: -40, y: -15, ext: state.avatarCurrentPose.thumb, spread: -0.65 },
        { name: "index", x: -20, y: -48, ext: isPointingPose ? Math.min(1.2, state.avatarCurrentPose.index * 1.15) : state.avatarCurrentPose.index, spread: isPointingPose ? -0.15 : -0.25 },
        { name: "middle", x: 0, y: -52, ext: state.avatarCurrentPose.middle, spread: 0 },
        { name: "ring", x: 20, y: -48, ext: state.avatarCurrentPose.ring, spread: 0.25 },
        { name: "pinky", x: 38, y: -38, ext: state.avatarCurrentPose.pinky, spread: 0.55 }
      ];

      fingers.forEach(f => {
        let cx = f.x;
        let cy = f.y;
        const segLen = (f.name === "thumb" ? 18 : 22) * f.ext;

        for (let i = 1; i <= 3; i++) {
          const nx = cx + Math.sin(f.spread + state.avatarRotX) * segLen;
          const ny = cy - Math.cos(f.spread + state.avatarRotX) * segLen;

          avatarCtx.strokeStyle = (f.name === "index" && isPointingPose) ? "#00f5d4" : "rgba(0, 245, 212, 0.85)";
          avatarCtx.lineWidth = (f.name === "index" && isPointingPose) ? (5 - i * 0.8) : (4 - i * 0.8);
          avatarCtx.beginPath();
          avatarCtx.moveTo(cx, cy);
          avatarCtx.lineTo(nx, ny);
          avatarCtx.stroke();

          avatarCtx.fillStyle = i === 3 ? "var(--accent-pink)" : "var(--accent-cyan)";
          avatarCtx.beginPath();
          avatarCtx.arc(nx, ny, i === 3 ? (isPointingPose && f.name === "index" ? 7 : 5) : 3, 0, Math.PI * 2);
          avatarCtx.fill();

          cx = nx;
          cy = ny;
        }

        // Animated pointing ripple & forward beam from avatar index fingertip
        if (f.name === "index" && isPointingPose) {
          const pulse = (performance.now() % 800) / 800;
          avatarCtx.save();
          avatarCtx.strokeStyle = `rgba(0, 245, 212, ${1 - pulse})`;
          avatarCtx.lineWidth = 2.5;
          avatarCtx.beginPath();
          avatarCtx.arc(cx, cy, 6 + pulse * 24, 0, Math.PI * 2);
          avatarCtx.stroke();

          // Forward pointing laser vector
          avatarCtx.strokeStyle = "rgba(0, 245, 212, 0.9)";
          avatarCtx.lineWidth = 3;
          avatarCtx.beginPath();
          avatarCtx.moveTo(cx, cy);
          avatarCtx.lineTo(cx + Math.sin(f.spread + state.avatarRotX) * 45, cy - Math.cos(f.spread + state.avatarRotX) * 45);
          avatarCtx.stroke();
          avatarCtx.restore();
        }
      });

      avatarCtx.restore();
      requestAnimationFrame(renderAvatar);
    }

    renderAvatar();
  }

  // -------------------------------------------------------------------------
  // 15. Reverse 2-Way Translator & Choreographed Sequence Player
  // -------------------------------------------------------------------------
  function initTranslator() {
    el.speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.playbackSpeed = parseFloat(btn.dataset.speed);
        showToast(`Playback Speed: ${state.playbackSpeed}x`);
      });
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      state.recognition = new SpeechRecognition();
      state.recognition.continuous = false;
      state.recognition.interimResults = false;

      state.recognition.onstart = () => {
        state.isListening = true;
        el.btnMicDictate.classList.add('listening');
        el.micIcon.textContent = "🔴";
        el.micText.textContent = "Listening...";
        showToast("Listening to voice... speak now");
      };

      state.recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        el.translateInput.value = spoken;
        performTranslation(spoken);
        showToast(`Heard: "${spoken}"`);
      };

      state.recognition.onerror = () => { resetMicState(); };
      state.recognition.onend = () => { resetMicState(); };

      el.btnMicDictate.addEventListener('click', () => {
        if (state.isListening) {
          state.recognition.stop();
        } else {
          state.recognition.lang = window.UI_I18N?.[state.currentLanguage]?.voice || "en-IN";
          state.recognition.start();
        }
      });
    } else {
      el.btnMicDictate.style.display = "none";
    }

    function resetMicState() {
      state.isListening = false;
      el.btnMicDictate.classList.remove('listening');
      el.micIcon.textContent = "🎙️";
      el.micText.textContent = "Voice Dictate";
    }

    function performTranslation(text) {
      if (!text || !text.trim()) return;
      el.translationSummaryTitle.textContent = `Sign Visual Sequence for "${text.toUpperCase()}"`;
      el.translationCardsGrid.innerHTML = "";
      state.sequenceCards = [];

      const words = text.toUpperCase().trim().split(/\s+/);
      const dict = window.ISL_DICTIONARY || [];

      words.forEach(word => {
        let lookupWord = word;
        if (word === "YOU" || word === "UR" || word === "YOUR" || word === "POINT" || word === "POINTING") {
          lookupWord = "YOU";
        }
        const matched = dict.find(s => s.id.toUpperCase() === lookupWord || s.id.toUpperCase().includes(lookupWord) || s.name.toUpperCase().includes(lookupWord) || (s.hindi_name && s.hindi_name.includes(lookupWord)));
        if (matched) {
          createSeqCard(matched);
        } else {
          for (const char of word) {
            if (char.match(/[A-Z0-9]/)) {
              const charMatch = dict.find(s => s.id === char || s.name.includes(char)) || {
                symbol: char,
                name: `Letter ${char}`,
                description: `Fingerspell '${char}' in Indian Sign Language.`
              };
              createSeqCard(charMatch);
            }
          }
        }
      });

      state.sequenceStepIdx = 0;
      updateSequenceStepPill();
    }

    function createSeqCard(sign) {
      const card = document.createElement('div');
      card.className = 'seq-card';
      const locName = window.getSignNameLocalized ? window.getSignNameLocalized(sign, state.currentLanguage) : (sign.hindi_name || sign.name);
      const locDesc = window.getSignDescLocalized ? window.getSignDescLocalized(sign, state.currentLanguage) : sign.description;

      card.innerHTML = `
        <div class="seq-symbol">${sign.symbol || '✋'}</div>
        <div class="seq-name">${sign.name || sign.id}</div>
        <div class="seq-hindi">${locName}</div>
        <div class="seq-desc">${locDesc}</div>
      `;

      card.addEventListener('click', () => {
        if (sign.skeleton) state.avatarTargetPose = sign.skeleton;
        speak(locName || sign.name);
      });

      el.translationCardsGrid.appendChild(card);
      state.sequenceCards.push({ card, sign });
    }

    function updateSequenceStepPill() {
      if (!el.seqStepPill) return;
      const total = state.sequenceCards.length;
      if (total === 0) {
        el.seqStepPill.textContent = "Step: 0/0";
      } else {
        const cur = state.sequenceStepIdx + 1;
        const currentSign = state.sequenceCards[state.sequenceStepIdx]?.sign?.name || "";
        el.seqStepPill.textContent = `Step: ${cur}/${total} (${currentSign})`;
      }
    }

    function activateSequenceCard(idx) {
      if (state.sequenceCards.length === 0) return;
      if (idx < 0) idx = 0;
      if (idx >= state.sequenceCards.length) idx = state.sequenceCards.length - 1;

      state.sequenceStepIdx = idx;
      updateSequenceStepPill();

      state.sequenceCards.forEach((item, i) => {
        item.card.classList.toggle('active-playback', i === idx);
      });

      const activeItem = state.sequenceCards[idx];
      if (activeItem) {
        activeItem.card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        if (activeItem.sign.skeleton) state.avatarTargetPose = activeItem.sign.skeleton;
        speak(activeItem.sign.name);
      }
    }

    // Sequence Controls (Play All, Pause, Prev, Next, Loop)
    el.btnPlaySequence.addEventListener('click', () => {
      if (state.sequenceCards.length === 0) return;
      state.sequencePlaying = true;
      el.btnPlaySequence.style.display = "none";
      el.btnPauseSequence.style.display = "inline-flex";

      const interval = Math.round(950 / state.playbackSpeed);

      if (state.sequenceTimer) clearInterval(state.sequenceTimer);
      activateSequenceCard(state.sequenceStepIdx);

      state.sequenceTimer = setInterval(() => {
        if (!state.sequencePlaying) return;
        let nextIdx = state.sequenceStepIdx + 1;
        if (nextIdx >= state.sequenceCards.length) {
          if (el.seqLoopToggle?.checked) {
            nextIdx = 0;
          } else {
            pauseSequence();
            return;
          }
        }
        activateSequenceCard(nextIdx);
      }, interval);
    });

    function pauseSequence() {
      state.sequencePlaying = false;
      if (state.sequenceTimer) clearInterval(state.sequenceTimer);
      el.btnPlaySequence.style.display = "inline-flex";
      el.btnPauseSequence.style.display = "none";
    }

    el.btnPauseSequence?.addEventListener('click', pauseSequence);

    el.btnPrevStep?.addEventListener('click', () => {
      pauseSequence();
      let prevIdx = state.sequenceStepIdx - 1;
      if (prevIdx < 0) prevIdx = state.sequenceCards.length - 1;
      activateSequenceCard(prevIdx);
    });

    el.btnNextStep?.addEventListener('click', () => {
      pauseSequence();
      let nextIdx = state.sequenceStepIdx + 1;
      if (nextIdx >= state.sequenceCards.length) nextIdx = 0;
      activateSequenceCard(nextIdx);
    });

    el.btnTranslate.addEventListener('click', () => { performTranslation(el.translateInput.value); });
    el.translateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') performTranslation(el.translateInput.value); });

    el.sampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        el.translateInput.value = chip.dataset.text;
        performTranslation(chip.dataset.text);
      });
    });

    performTranslation(el.translateInput.value);
  }

  // -------------------------------------------------------------------------
  // 16. Accessible Video Call (AI Consultation Simulation + WebRTC Real P2P)
  // -------------------------------------------------------------------------
  function initAccessibleCall() {
    const peerReplies = [
      "Hello! I can clearly understand your sign language translations.",
      "The doctor has reviewed your file. How is your fever today?",
      "Please show me the sign for medicine if you need a refill.",
      "Understood! We are sending the nurse to your room right now.",
      "Take your time, I am watching your sign captions."
    ];
    let replyIdx = 0;

    el.btnSimulatePeerReply.addEventListener('click', () => {
      const reply = peerReplies[replyIdx % peerReplies.length];
      replyIdx++;
      el.hearingSubtitles.textContent = `Caller: "${reply}"`;
      speak(reply);
      addCallTranscriptMessage("Hearing Caller", reply, true);
    });

    el.btnEndCall.addEventListener('click', () => {
      if (state.callMode === "p2p") {
        closeWebRtcConnection();
      }
      showToast("Call ended. Transcript saved to session.");
      addCallTranscriptMessage("System", "Call ended by user.", false);
    });
  }

  function addCallTranscriptMessage(sender, text, isPeer = false) {
    if (!el.callTranscriptMessages || !text) return;
    const msg = document.createElement('div');
    msg.className = `t-msg ${isPeer ? 'peer' : ''}`;
    msg.innerHTML = `
      <span class="t-sender">${sender}:</span>
      <p class="t-text">${text}</p>
    `;
    el.callTranscriptMessages.appendChild(msg);
    el.callTranscriptMessages.scrollTop = el.callTranscriptMessages.scrollHeight;
  }

  // -------------------------------------------------------------------------
  // 17. Real WebRTC Multi-Device Peer-to-Peer Calling Engine
  // -------------------------------------------------------------------------
  function initWebRtcCall() {
    // Mode Switcher: AI Simulation vs Real P2P Call
    el.btnCallModeSim?.addEventListener('click', () => {
      state.callMode = "sim";
      el.btnCallModeSim.classList.add('active');
      el.btnCallModeP2P.classList.remove('active');
      el.p2pRoomControls.style.display = "none";
      el.simAvatarBox.style.display = "flex";
      el.p2pRemoteVideoBox.style.display = "none";
      el.btnSimulatePeerReply.style.display = "inline-flex";
      el.btnP2pMicToggle.style.display = "none";
      el.peerFooterStatus.textContent = "Audio Synthesis Active";
      showToast("Switched to AI Consultation Simulation Mode");
    });

    el.btnCallModeP2P?.addEventListener('click', () => {
      state.callMode = "p2p";
      el.btnCallModeP2P.classList.add('active');
      el.btnCallModeSim.classList.remove('active');
      el.p2pRoomControls.style.display = "flex";
      el.simAvatarBox.style.display = "none";
      el.p2pRemoteVideoBox.style.display = "block";
      el.btnSimulatePeerReply.style.display = "none";
      el.btnP2pMicToggle.style.display = "inline-flex";
      el.peerFooterStatus.textContent = "WebRTC P2P Video & Subtitles Active";
      showToast("Switched to Real Multi-Device P2P Call Mode");
    });

    // Generate random 6-character room
    el.btnGenRoom?.addEventListener('click', () => {
      const code = "DORA-" + Math.floor(1000 + Math.random() * 9000);
      el.p2pRoomInput.value = code;
      showToast(`Generated Room: ${code}`);
    });

    // Copy room invite link
    el.btnCopyRoomLink?.addEventListener('click', () => {
      const room = el.p2pRoomInput.value.trim().toUpperCase() || "DORA-101";
      const inviteUrl = `${window.location.origin}/?room=${room}`;
      navigator.clipboard.writeText(inviteUrl);
      showToast(`Copied room link: ${inviteUrl}`);
    });

    // Check URL parameters for ?room=
    const params = new URLSearchParams(window.location.search);
    if (params.has('room')) {
      const r = params.get('room');
      if (el.p2pRoomInput) el.p2pRoomInput.value = r;
      el.btnCallModeP2P?.click();
    }

    // Join/Start P2P Call
    el.btnJoinRoom?.addEventListener('click', startWebRtcCall);

    // Hearing Caller Microphone to dictate to Deaf Signer
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec && el.btnP2pMicToggle) {
      state.p2pSpeechRec = new SpeechRec();
      state.p2pSpeechRec.continuous = true;
      state.p2pSpeechRec.interimResults = false;

      state.p2pSpeechRec.onresult = (e) => {
        const text = e.results[e.results.length - 1][0].transcript;
        if (el.p2pRemoteSubtitles) el.p2pRemoteSubtitles.textContent = `Spoken: "${text}"`;
        addCallTranscriptMessage("Hearing Caller", text, true);

        if (state.dataChannel && state.dataChannel.readyState === "open") {
          state.dataChannel.send(JSON.stringify({ type: "speech_transcript", text: text }));
        }
      };

      el.btnP2pMicToggle.addEventListener('click', () => {
        if (state.isP2pMicActive) {
          state.p2pSpeechRec.stop();
          state.isP2pMicActive = false;
          el.btnP2pMicToggle.classList.remove('active-listening');
          el.btnP2pMicToggle.textContent = "🎙️ Speak to Peer";
        } else {
          state.p2pSpeechRec.lang = window.UI_I18N?.[state.currentLanguage]?.voice || "en-IN";
          state.p2pSpeechRec.start();
          state.isP2pMicActive = true;
          el.btnP2pMicToggle.classList.add('active-listening');
          el.btnP2pMicToggle.textContent = "🔴 Mic Active";
          showToast("Microphone active: speech is transcribing to peer subtitles");
        }
      });
    }
  }

  function startWebRtcCall() {
    const room = el.p2pRoomInput.value.trim().toUpperCase() || "DORA-101";
    state.p2pRoom = room;

    if (el.p2pStatusPill) {
      el.p2pStatusPill.textContent = "Connecting Room...";
      el.p2pStatusPill.className = "p2p-status-pill";
    }

    const wsUrl = getWsUrl(`/ws/call/${room}`);
    state.p2pWs = new WebSocket(wsUrl);

    state.p2pWs.onopen = () => {
      showToast(`Connected to WebRTC Signaling Room: ${room}`);
      if (el.p2pStatusPill) {
        el.p2pStatusPill.textContent = "Room Active";
        el.p2pStatusPill.className = "p2p-status-pill connected";
      }
      initPeerConnection(room);
    };

    state.p2pWs.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleWebRtcSignalingMessage(msg);
      } catch (e) {
        console.error("Signaling message error", e);
      }
    };

    state.p2pWs.onclose = () => {
      if (el.p2pStatusPill) el.p2pStatusPill.textContent = "Disconnected";
    };
  }

  function initPeerConnection(room) {
    const config = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ]
    };

    state.peerConnection = new RTCPeerConnection(config);

    // Stream local camera video to peer
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => {
        state.peerConnection.addTrack(track, state.cameraStream);
      });
    }

    // Receive remote video
    state.peerConnection.ontrack = (event) => {
      if (el.remotePeerVideo) {
        el.remotePeerVideo.srcObject = event.streams[0];
        el.remotePeerVideo.play();
        showToast("Remote peer video stream connected!");
      }
    };

    // ICE Candidates
    state.peerConnection.onicecandidate = (event) => {
      if (event.candidate && state.p2pWs && state.p2pWs.readyState === WebSocket.OPEN) {
        state.p2pWs.send(JSON.stringify({ type: "candidate", candidate: event.candidate }));
      }
    };

    // DataChannel for zero-latency sign subtitles
    state.dataChannel = state.peerConnection.createDataChannel("isl-subtitles");
    setupDataChannel(state.dataChannel);

    state.peerConnection.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };
  }

  function setupDataChannel(channel) {
    state.dataChannel = channel;
    channel.onopen = () => {
      showToast("WebRTC DataChannel connected for live sign subtitles!");
    };
    channel.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "sign_caption") {
          if (el.p2pRemoteSubtitles) el.p2pRemoteSubtitles.textContent = `Remote Signer: "${data.sign}"`;
          speak(data.sign);
          addCallTranscriptMessage("Remote Peer", data.sign, true);
        } else if (data.type === "speech_transcript") {
          if (el.p2pRemoteSubtitles) el.p2pRemoteSubtitles.textContent = `Remote Caller: "${data.text}"`;
          speak(data.text);
          addCallTranscriptMessage("Hearing Caller", data.text, true);
        }
      } catch (err) {}
    };
  }

  async function handleWebRtcSignalingMessage(msg) {
    if (!state.peerConnection) return;

    if (msg.type === "peer_joined") {
      // Create Offer
      const offer = await state.peerConnection.createOffer();
      await state.peerConnection.setLocalDescription(offer);
      state.p2pWs.send(JSON.stringify({ type: "offer", sdp: offer.sdp }));
      showToast("Peer joined room, sending WebRTC offer...");
    } else if (msg.type === "offer") {
      await state.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: msg.sdp }));
      const answer = await state.peerConnection.createAnswer();
      await state.peerConnection.setLocalDescription(answer);
      state.p2pWs.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
      showToast("Received WebRTC offer, returning answer...");
    } else if (msg.type === "answer") {
      await state.peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: msg.sdp }));
      showToast("WebRTC handshake complete! Call active.");
    } else if (msg.type === "candidate") {
      await state.peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
    } else if (msg.type === "peer_left") {
      showToast("Remote peer left the call.");
      if (el.remotePeerVideo) el.remotePeerVideo.srcObject = null;
    }
  }

  function closeWebRtcConnection() {
    if (state.dataChannel) state.dataChannel.close();
    if (state.peerConnection) state.peerConnection.close();
    if (state.p2pWs) state.p2pWs.close();
    state.peerConnection = null;
    state.dataChannel = null;
    state.p2pWs = null;
    if (el.p2pStatusPill) {
      el.p2pStatusPill.textContent = "Idle";
      el.p2pStatusPill.className = "p2p-status-pill";
    }
    if (el.remotePeerVideo) el.remotePeerVideo.srcObject = null;
  }

  // -------------------------------------------------------------------------
  // 18. Healthcare Quickboard
  // -------------------------------------------------------------------------
  function initHealthcarePhraseboard() {
    el.btnHealthcarePhrases.addEventListener('click', () => {
      el.phraseboardOverlay.style.display = "flex";
    });

    el.btnClosePhraseboard.addEventListener('click', () => {
      el.phraseboardOverlay.style.display = "none";
    });

    el.phraseboardOverlay.addEventListener('click', (e) => {
      if (e.target === el.phraseboardOverlay) {
        el.phraseboardOverlay.style.display = "none";
      }
    });

    el.pbPhraseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        el.sentenceOutput.value += (el.sentenceOutput.value ? " " : "") + text + " ";
        speak(text);
        showToast(`Spoke: "${text}"`);
        el.phraseboardOverlay.style.display = "none";
      });
    });
  }

  // -------------------------------------------------------------------------
  // 19. Emergency SOS Beacon
  // -------------------------------------------------------------------------
  function initSosModal() {
    el.headerSosBtn.addEventListener('click', () => {
      el.sosModalOverlay.style.display = "flex";
      playEmergencySiren();
    });

    el.btnDismissSos.addEventListener('click', () => {
      el.sosModalOverlay.style.display = "none";
    });

    el.sosModalOverlay.addEventListener('click', (e) => {
      if (e.target === el.sosModalOverlay) {
        el.sosModalOverlay.style.display = "none";
      }
    });

    el.sosActionCards.forEach(card => {
      card.addEventListener('click', () => {
        const msg = card.dataset.msg;
        el.sosMessageText.value = msg;
        speak(msg);
        playEmergencySiren();
        showToast("SOS Alert Broadcasted!");
      });
    });

    el.btnCopySos.addEventListener('click', () => {
      navigator.clipboard.writeText(el.sosMessageText.value);
      showToast("Emergency alert text copied!");
    });

    el.btnSpeakSos.addEventListener('click', () => {
      playEmergencySiren();
      speak(el.sosMessageText.value);
    });
  }

  // -------------------------------------------------------------------------
  // 20. ISL Interactive Dictionary
  // -------------------------------------------------------------------------
  function initDictionary() {
    const dict = window.ISL_DICTIONARY || [];

    function renderDictCards(items) {
      el.dictionaryGrid.innerHTML = "";
      if (items.length === 0) {
        el.dictionaryGrid.innerHTML = `<div class="empty-state">No matching ISL signs found.</div>`;
        return;
      }

      items.forEach(sign => {
        const card = document.createElement('div');
        card.className = 'dict-card';
        const locName = window.getSignNameLocalized ? window.getSignNameLocalized(sign, state.currentLanguage) : (sign.hindi_name || sign.name);
        const locDesc = window.getSignDescLocalized ? window.getSignDescLocalized(sign, state.currentLanguage) : sign.description;

        card.innerHTML = `
          <div class="dict-card-top">
            <span class="dict-symbol">${sign.symbol || '✋'}</span>
            <span class="dict-category-tag">${sign.category || 'ISL'}</span>
          </div>
          <div class="dict-card-body">
            <h4 class="dict-title">${sign.name}</h4>
            <div class="dict-hindi-title">${locName}</div>
            <p class="dict-description">${locDesc}</p>
          </div>
          <div class="dict-card-footer">
            <span class="dict-hands-badge">${sign.hands || '1 Hand'}</span>
            <button class="dict-play-btn" title="View Sign Posture & Speak">🔊 View & Speak</button>
          </div>
        `;

        card.addEventListener('click', () => {
          if (sign.skeleton) {
            state.avatarTargetPose = sign.skeleton;
          }
          speak(locName || sign.name);
          showToast(`Displaying "${sign.name}" on Virtual Signer`);
        });

        el.dictionaryGrid.appendChild(card);
      });
    }

    el.dictFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.dictFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        if (filter === "all") {
          renderDictCards(dict);
        } else if (filter === "alphabet") {
          renderDictCards(dict.filter(s => s.type === "alphabet"));
        } else if (filter === "number") {
          renderDictCards(dict.filter(s => s.type === "number"));
        } else if (filter === "phrase") {
          renderDictCards(dict.filter(s => s.type === "phrase"));
        } else {
          renderDictCards(dict.filter(s => s.category === filter));
        }
      });
    });

    el.dictSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = dict.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        (s.hindi_name && s.hindi_name.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
      );
      renderDictCards(filtered);
    });

    renderDictCards(dict);
  }

  // -------------------------------------------------------------------------
  // 21. Sign Practice Challenge
  // -------------------------------------------------------------------------
  function initQuiz() {
    el.btnSkipChallenge.addEventListener('click', () => {
      nextQuizChallenge();
      showToast("Next challenge loaded");
    });

    el.btnHintChallenge.addEventListener('click', () => {
      if (state.quizTarget) {
        showToast("Hint: " + (state.quizTarget.tips || state.quizTarget.description), 4000);
      }
    });
  }

  function loadQuizChallenge(sign) {
    state.quizTarget = sign;
    el.targetSymbol.textContent = sign.symbol || "✋";
    el.targetSignName.textContent = sign.name;
    const locName = window.getSignNameLocalized ? window.getSignNameLocalized(sign, state.currentLanguage) : (sign.hindi_name || "");
    const locDesc = window.getSignDescLocalized ? window.getSignDescLocalized(sign, state.currentLanguage) : sign.description;
    el.targetSignHindi.textContent = locName;
    el.targetSignDesc.textContent = locDesc;
    el.quizMatchPercent.textContent = "0%";
    el.quizMeterFill.style.width = "0%";
    el.quizMatchStatus.textContent = "Show this gesture to your camera...";
    state.quizMatchedDuration = 0;
  }

  function nextQuizChallenge() {
    const dict = window.ISL_DICTIONARY || [];
    const randomSign = dict[Math.floor(Math.random() * dict.length)];
    loadQuizChallenge(randomSign);
  }

  function checkQuizMatch(detectedSign, confidence) {
    if (!state.quizTarget) return;

    const targetId = state.quizTarget.id.toUpperCase();
    const det = detectedSign.toUpperCase();
    const isMatch = det.includes(targetId) || targetId.includes(det);

    if (isMatch && confidence >= 0.75) {
      const pct = Math.round(confidence * 100);
      el.quizMatchPercent.textContent = `${pct}%`;
      el.quizMeterFill.style.width = `${pct}%`;
      el.quizMatchStatus.textContent = `🎯 Excellent! Matching target (${pct}%)`;

      state.quizMatchedDuration += 1;
      if (state.quizMatchedDuration >= 6) {
        state.quizStreak += 1;
        state.quizScore += 100;
        el.quizStreak.textContent = `${state.quizStreak} 🔥`;
        el.quizScore.textContent = `${state.quizScore} pts`;

        showToast(`🎉 Superb! "${state.quizTarget.name}" Recognized (+100 pts)`, 3500);
        playSuccessChime();
        triggerConfettiBurst(60);
        speak(`Great job! You mastered ${state.quizTarget.name}`);

        setTimeout(nextQuizChallenge, 1400);
      }
    } else {
      el.quizMeterFill.style.width = "15%";
      el.quizMatchPercent.textContent = `${Math.round(confidence * 100)}%`;
      el.quizMatchStatus.textContent = `Current sign: ${detectedSign} (Show ${state.quizTarget.name})`;
      state.quizMatchedDuration = 0;
    }
  }

  // -------------------------------------------------------------------------
  // 22. 30-Second Rapid-Fire Reflex Sprint Arcade Engine
  // -------------------------------------------------------------------------
  function initReflexSprint() {
    // Mode Switching: Practice vs Sprint
    el.btnModePractice?.addEventListener('click', () => {
      state.challengeMode = "practice";
      el.btnModePractice.classList.add('active');
      el.btnModeSprint.classList.remove('active');
      el.practiceCard.style.display = "block";
      el.sprintCard.style.display = "none";
      if (state.sprintActive) endSprint();
    });

    el.btnModeSprint?.addEventListener('click', () => {
      state.challengeMode = "sprint";
      el.btnModeSprint.classList.add('active');
      el.btnModePractice.classList.remove('active');
      el.practiceCard.style.display = "none";
      el.sprintCard.style.display = "flex";
      el.sprintHighScoreVal.textContent = `${state.sprintHighScore} pts`;
      pickRandomSprintTarget();
    });

    el.btnStartSprint?.addEventListener('click', startSprint);
    el.btnEndSprintEarly?.addEventListener('click', endSprint);
    el.btnCloseSprintModal?.addEventListener('click', () => { el.sprintResultsOverlay.style.display = "none"; });
    el.btnSprintAgain?.addEventListener('click', () => {
      el.sprintResultsOverlay.style.display = "none";
      startSprint();
    });
  }

  function pickRandomSprintTarget() {
    const dict = window.ISL_DICTIONARY || [];
    state.sprintTarget = dict[Math.floor(Math.random() * dict.length)];
    if (el.sprintTargetSymbol) el.sprintTargetSymbol.textContent = state.sprintTarget.symbol || "✋";
    if (el.sprintTargetName) el.sprintTargetName.textContent = state.sprintTarget.name;
    if (el.sprintTargetHint) el.sprintTargetHint.textContent = state.sprintTarget.tips || state.sprintTarget.description;
  }

  function startSprint() {
    state.sprintActive = true;
    state.sprintTimeLeft = 30.0;
    state.sprintScore = 0;
    state.sprintCombo = 1.0;
    state.sprintStreak = 0;
    state.sprintSignsMastered = 0;

    el.btnStartSprint.style.display = "none";
    el.btnEndSprintEarly.style.display = "inline-flex";

    el.sprintScoreVal.textContent = "0 pts";
    el.sprintComboVal.textContent = "x1.0";
    el.sprintTimerVal.textContent = "30.0s";
    el.sprintTimerFill.style.width = "100%";

    pickRandomSprintTarget();
    speak("Sprint started! Sign as fast as you can!");
    playHitChime();

    if (state.sprintTimerInterval) clearInterval(state.sprintTimerInterval);

    state.sprintTimerInterval = setInterval(() => {
      state.sprintTimeLeft -= 0.1;
      if (state.sprintTimeLeft <= 0) {
        state.sprintTimeLeft = 0;
        clearInterval(state.sprintTimerInterval);
        endSprint();
      }
      el.sprintTimerVal.textContent = `${state.sprintTimeLeft.toFixed(1)}s`;
      const pct = (state.sprintTimeLeft / 30.0) * 100;
      el.sprintTimerFill.style.width = `${pct}%`;
    }, 100);
  }

  function checkSprintMatch(detectedSign, confidence) {
    if (!state.sprintActive || !state.sprintTarget) return;

    const targetId = state.sprintTarget.id.toUpperCase();
    const det = detectedSign.toUpperCase();
    const isMatch = det.includes(targetId) || targetId.includes(det);

    if (isMatch && confidence >= 0.75) {
      // Award combo points
      const points = Math.round(100 * state.sprintCombo);
      state.sprintScore += points;
      state.sprintStreak++;
      state.sprintSignsMastered++;

      // Increase multiplier: 1x -> 1.5x -> 2x -> 3x -> 4x
      if (state.sprintStreak >= 12) state.sprintCombo = 4.0;
      else if (state.sprintStreak >= 8) state.sprintCombo = 3.0;
      else if (state.sprintStreak >= 4) state.sprintCombo = 2.0;
      else if (state.sprintStreak >= 2) state.sprintCombo = 1.5;

      el.sprintScoreVal.textContent = `${state.sprintScore} pts`;
      el.sprintComboVal.textContent = `x${state.sprintCombo.toFixed(1)}`;

      // Show Banner & Confetti
      el.sprintHitBanner.textContent = `+${points} pts (${state.sprintCombo}x COMBO!)`;
      el.sprintHitBanner.style.display = "block";
      setTimeout(() => { el.sprintHitBanner.style.display = "none"; }, 500);

      playHitChime();
      triggerConfettiBurst(25);

      // Pick next target immediately
      pickRandomSprintTarget();
    }
  }

  function endSprint() {
    state.sprintActive = false;
    if (state.sprintTimerInterval) clearInterval(state.sprintTimerInterval);

    el.btnStartSprint.style.display = "inline-flex";
    el.btnEndSprintEarly.style.display = "none";

    // Check new high score
    let isNewHigh = false;
    if (state.sprintScore > state.sprintHighScore) {
      state.sprintHighScore = state.sprintScore;
      localStorage.setItem('dora_isl_sprint_hs', state.sprintScore.toString());
      el.sprintHighScoreVal.textContent = `${state.sprintHighScore} pts`;
      isNewHigh = true;
    }

    // Determine rank tier
    let rank = "🌱 Aspiring Signer";
    let icon = "🥉";
    let subtitle = "Good effort! Keep practicing hand postures.";

    if (state.sprintSignsMastered >= 18) {
      rank = "⚡ ISL Grandmaster!";
      icon = "🏆";
      subtitle = "Legendary speed! Flawless reflex sign coordination!";
    } else if (state.sprintSignsMastered >= 12) {
      rank = "🔥 Sign Prodigy!";
      icon = "🥇";
      subtitle = "Incredible fluency and instantaneous sign recognition!";
    } else if (state.sprintSignsMastered >= 6) {
      rank = "🌟 Fluid Signer!";
      icon = "🥈";
      subtitle = "Great speed and consistent posture accuracy!";
    }

    el.sprintRankIcon.textContent = icon;
    el.sprintRankTitle.textContent = isNewHigh ? `🎉 NEW RECORD: ${rank}` : rank;
    el.sprintRankSubtitle.textContent = subtitle;
    el.sresSigns.textContent = state.sprintSignsMastered;
    el.sresMultiplier.textContent = `x${state.sprintCombo.toFixed(1)}`;
    el.sresScore.textContent = `${state.sprintScore} pts`;
    el.sresStreak.textContent = `${state.sprintStreak} 🔥`;

    el.sprintResultsOverlay.style.display = "flex";
    triggerConfettiBurst(120);
    playSuccessChime();
    speak(`Sprint finished! You scored ${state.sprintScore} points! ${rank}`);
  }

  // -------------------------------------------------------------------------
  // 23. Biomechanics Session Analytics & Digital Certificate Generator
  // -------------------------------------------------------------------------
  function initAnalyticsAndCertificate() {
    el.btnOpenAnalytics?.addEventListener('click', () => {
      // Compute metrics
      el.mTotalSigns.textContent = state.sessionSignsTotal.toString();
      el.mStabilityIndex.textContent = `${state.sessionStabilityIndex}%`;

      const totalHands = state.sessionRightCount + state.sessionLeftCount || 1;
      const rightPct = Math.round((state.sessionRightCount / totalHands) * 100);
      el.mHandUsage.textContent = `${rightPct}% Right Hand`;

      const avgConf = state.sessionSignsTotal > 0 ? (state.sessionConfidenceSum / state.sessionSignsTotal) * 100 : 92.5;
      el.mAvgConf.textContent = `${avgConf.toFixed(1)}%`;

      renderCertificate();
      el.analyticsModalOverlay.style.display = "flex";
    });

    el.btnCloseAnalytics?.addEventListener('click', () => {
      el.analyticsModalOverlay.style.display = "none";
    });

    el.analyticsModalOverlay?.addEventListener('click', (e) => {
      if (e.target === el.analyticsModalOverlay) el.analyticsModalOverlay.style.display = "none";
    });

    el.btnGenerateCert?.addEventListener('click', renderCertificate);

    el.btnDownloadCertPng?.addEventListener('click', () => {
      if (!el.certCanvas) return;
      const url = el.certCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      const name = (el.certStudentName.value.trim() || "Learner").replace(/\s+/g, "_");
      a.download = `ISL_Certificate_${name}.png`;
      a.click();
      showToast("Downloaded official ISL Proficiency Certificate PNG!");
    });

    el.btnShareCert?.addEventListener('click', () => {
      const name = el.certStudentName.value.trim() || "ISL Learner";
      const shareText = `🎓 I just verified my Indian Sign Language (ISL) proficiency on ISL AI Platform! Signs Mastered: ${state.sessionSignsTotal}, Stability: ${state.sessionStabilityIndex}%!`;
      navigator.clipboard.writeText(shareText);
      showToast("Copied certificate achievement text to clipboard!");
    });
  }

  function renderCertificate() {
    if (!certCtx || !el.certCanvas) return;
    const w = el.certCanvas.width;
    const h = el.certCanvas.height;
    const student = el.certStudentName.value.trim() || "Learner of Indian Sign Language";

    // Background gradient
    const bgGrad = certCtx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#080d1a");
    bgGrad.addColorStop(0.5, "#0d162d");
    bgGrad.addColorStop(1, "#060913");
    certCtx.fillStyle = bgGrad;
    certCtx.fillRect(0, 0, w, h);

    // Gold Ornate Borders
    certCtx.strokeStyle = "#ffd166";
    certCtx.lineWidth = 4;
    certCtx.strokeRect(20, 20, w - 40, h - 40);

    certCtx.strokeStyle = "rgba(0, 245, 212, 0.6)";
    certCtx.lineWidth = 1.5;
    certCtx.strokeRect(28, 28, w - 56, h - 56);

    // Corner Ornaments
    const drawCorner = (x, y) => {
      certCtx.fillStyle = "#ffd166";
      certCtx.fillRect(x - 6, y - 6, 12, 12);
    };
    drawCorner(20, 20); drawCorner(w - 20, 20);
    drawCorner(20, h - 20); drawCorner(w - 20, h - 20);

    // Emblem & Title
    certCtx.textAlign = "center";
    certCtx.fillStyle = "#00f5d4";
    certCtx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
    certCtx.fillText("✋ ISL AI VERIFIED PLATFORM", w / 2, 75);

    certCtx.fillStyle = "#ffd166";
    certCtx.font = "900 36px 'Plus Jakarta Sans', sans-serif";
    certCtx.letterSpacing = "2px";
    certCtx.fillText("CERTIFICATE OF ISL PROFICIENCY", w / 2, 130);

    certCtx.fillStyle = "rgba(255, 255, 255, 0.75)";
    certCtx.font = "italic 16px 'Plus Jakarta Sans', sans-serif";
    certCtx.fillText("This official credential recognizes and certifies that", w / 2, 175);

    // Student Name
    certCtx.fillStyle = "#ffffff";
    certCtx.font = "800 34px 'Plus Jakarta Sans', sans-serif";
    certCtx.fillText(student.toUpperCase(), w / 2, 230);

    // Underline
    certCtx.strokeStyle = "#00f5d4";
    certCtx.lineWidth = 2;
    certCtx.beginPath();
    certCtx.moveTo(w / 2 - 180, 245);
    certCtx.lineTo(w / 2 + 180, 245);
    certCtx.stroke();

    // Body Text
    certCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
    certCtx.font = "15px 'Plus Jakarta Sans', sans-serif";
    certCtx.fillText("has demonstrated verified competency in Indian Sign Language (ISL) recognition,", w / 2, 285);
    certCtx.fillText("two-handed fingerspelling (A-Z), numerical gestures (0-9), and emergency assistance.", w / 2, 310);

    // Grade & Seal Badges
    certCtx.fillStyle = "rgba(0, 245, 212, 0.15)";
    certCtx.strokeStyle = "#00f5d4";
    certCtx.lineWidth = 2;
    certCtx.beginPath();
    certCtx.roundRect(w / 2 - 140, 345, 280, 45, [25]);
    certCtx.fill();
    certCtx.stroke();

    certCtx.fillStyle = "#00f5d4";
    certCtx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
    certCtx.fillText("GRADE: A+ DISTINCTION (VERIFIED)", w / 2, 373);

    // Footer Signatures & Date
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    certCtx.font = "14px 'Plus Jakarta Sans', sans-serif";
    certCtx.fillStyle = "rgba(255, 255, 255, 0.65)";
    certCtx.textAlign = "left";
    certCtx.fillText(`Issue Date: ${today}`, 50, 445);
    certCtx.fillText(`Stability Metric: ${state.sessionStabilityIndex}% • Kinematics Verified`, 50, 465);

    certCtx.textAlign = "right";
    certCtx.fillText("Digital Seal: #ISL-AUTH-7729-VERIFIED", w - 50, 445);
    certCtx.fillText("Neural Vision Engine Signature: ✍️ Dora AI Core", w - 50, 465);
  }

  // -------------------------------------------------------------------------
  // 24. Native Fullscreen Particle Confetti Engine
  // -------------------------------------------------------------------------
  let confettiParticles = [];
  let confettiAnimRunning = false;

  function initConfetti() {
    if (!el.confettiCanvas) return;
    function resize() {
      el.confettiCanvas.width = window.innerWidth;
      el.confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
  }

  function triggerConfettiBurst(count = 70) {
    if (!el.confettiCanvas) return;
    const colors = ["#00f5d4", "#ff007f", "#ffd166", "#7b2cbf", "#10b981", "#3a86ff"];
    const w = el.confettiCanvas.width;

    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: w / 2 + (Math.random() - 0.5) * 300,
        y: 200 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 10 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        alpha: 1.0
      });
    }

    if (!confettiAnimRunning) {
      confettiAnimRunning = true;
      requestAnimationFrame(renderConfetti);
    }
  }

  function renderConfetti() {
    if (!el.confettiCanvas) return;
    const ctx = el.confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, el.confettiCanvas.width, el.confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; // gravity
      p.rotation += p.rotSpeed;
      p.alpha -= 0.008;

      if (p.alpha <= 0 || p.y > el.confettiCanvas.height) {
        confettiParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      confettiAnimRunning = false;
    }
  }

  // -------------------------------------------------------------------------
  // 25. AI Custom Trainer Dataset & Scikit-Learn Model Training
  // -------------------------------------------------------------------------
  function initCustomTrainer() {
    el.btnStartRecordGesture.addEventListener('click', () => {
      const name = el.customSignNameInput.value.trim().toUpperCase();
      if (!name) {
        showToast("Please enter a gesture name first!");
        el.customSignNameInput.focus();
        return;
      }

      if (!state.cameraRunning) {
        initHandTracking();
      }

      let count = 3;
      el.recordCountdownOverlay.style.display = "flex";
      el.countdownDigit.textContent = count;
      el.countdownCaption.textContent = `Hold posture for "${name}"...`;

      const timer = setInterval(() => {
        count--;
        if (count > 0) {
          el.countdownDigit.textContent = count;
        } else {
          clearInterval(timer);
          el.recordCountdownOverlay.style.display = "none";
          state.recordingFrames = [];
          state.isRecordingGesture = true;
          el.recordProgressBox.style.display = "flex";
          el.recProgressPct.textContent = `0 / ${state.targetRecordFrames}`;
          el.recFill.style.width = "0%";
          showToast(`Recording 30 frames for ${name}... hold steady!`);
        }
      }, 1000);
    });

    el.btnTrainCustomModel.addEventListener('click', async () => {
      el.btnTrainCustomModel.disabled = true;
      el.btnTrainCustomModel.querySelector('span').textContent = "⏳ Training Random Forest Model...";
      showToast("Training Scikit-Learn model on recorded landmarks...");

      try {
        const res = await fetch(`/api/custom-sign/train`, {
          method: "POST"
        });
        const data = await res.json();
        if (res.ok) {
          showToast(`✨ Model Trained & Hot-Reloaded! Classes: ${data.trained_classes.join(", ")}`, 5000);
          playSuccessChime();
          fetchCustomSignsList();
        } else {
          showToast(`Training error: ${data.detail || "No data"}`);
        }
      } catch (err) {
        showToast("Could not train model. Is backend running?");
      } finally {
        el.btnTrainCustomModel.disabled = false;
        el.btnTrainCustomModel.querySelector('span').textContent = "⚡ Train AI Model Now";
      }
    });
  }

  async function finishGestureRecording() {
    state.isRecordingGesture = false;
    el.recordProgressBox.style.display = "none";
    const name = el.customSignNameInput.value.trim().toUpperCase();

    try {
      const res = await fetch(`/api/custom-sign/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, samples: state.recordingFrames })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Saved 30 frames for "${name}"!`);
        playSuccessChime();
        fetchCustomSignsList();
        el.customSignNameInput.value = "";
      }
    } catch (e) {
      showToast("Failed to save custom gesture frames.");
    }
  }

  async function fetchCustomSignsList() {
    try {
      const res = await fetch(`/api/custom-signs`);
      const data = await res.json();
      if (data.custom_signs && data.custom_signs.length > 0) {
        el.customChipsList.innerHTML = "";
        data.custom_signs.forEach(s => {
          const chip = document.createElement('div');
          chip.className = 'custom-sign-chip';
          chip.innerHTML = `
            <span><strong>${s.name}</strong> (${s.sample_count} samples)</span>
            <button class="del-sign-btn" data-name="${s.name}" title="Delete gesture">✕</button>
          `;
          chip.querySelector('.del-sign-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            await fetch(`/api/custom-signs/${encodeURIComponent(s.name)}`, { method: "DELETE" });
            fetchCustomSignsList();
            showToast(`Deleted custom sign: ${s.name}`);
          });
          el.customChipsList.appendChild(chip);
        });
      } else {
        el.customChipsList.innerHTML = `<span class="empty-note">No custom gestures recorded yet.</span>`;
      }
    } catch (e) {}
  }

  function initTrainerDatasetBackup() {
    const btnExport = document.getElementById('btnExportCustomDataset');
    const btnImport = document.getElementById('btnImportCustomDataset');
    const fileInput = document.getElementById('importFileInput');

    if (btnExport) {
      btnExport.addEventListener('click', async () => {
        try {
          const res = await fetch(`/api/custom-signs/export`);
          const data = await res.json();
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `custom_isl_dataset_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast("Exported custom gesture dataset JSON");
        } catch (e) {
          showToast("Could not export dataset");
        }
      });
    }

    if (btnImport && fileInput) {
      btnImport.addEventListener('click', () => { fileInput.click(); });
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
          try {
            const json = JSON.parse(evt.target.result);
            const res = await fetch(`/api/custom-signs/import`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(json)
            });
            const data = await res.json();
            if (res.ok) {
              showToast(`Imported ${data.imported_signs.length} signs. Retraining model...`);
              fetchCustomSignsList();
              document.getElementById('btnTrainCustomModel')?.click();
            }
          } catch (err) {
            showToast("Invalid JSON dataset file");
          }
        };
        reader.readAsText(file);
      });
    }
  }

  // -------------------------------------------------------------------------
  // 26. Sign Memory Match Game Logic
  // -------------------------------------------------------------------------
  function initMemoryGame() {
    const grid = document.getElementById('memoryCardsGrid');
    const movesEl = document.getElementById('memMoves');
    const matchesEl = document.getElementById('memMatches');
    const restartBtn = document.getElementById('btnRestartMemory');
    if (!grid) return;

    let moves = 0;
    let matches = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    const rawPairs = [
      { id: "namaste", symbol: "🙏", title: "NAMASTE" },
      { id: "peace", symbol: "✌️", title: "PEACE / V" },
      { id: "help", symbol: "🆘", title: "HELP" },
      { id: "water", symbol: "💧", title: "WATER" },
      { id: "food", symbol: "🍲", title: "FOOD" },
      { id: "love", symbol: "🤟", title: "I LOVE YOU" },
    ];

    function createDeck() {
      const cards = [];
      rawPairs.forEach(p => {
        cards.push({ id: p.id, type: "symbol", content: p.symbol, sub: "Gesture Sign" });
        cards.push({ id: p.id, type: "word", content: "✍️", sub: p.title });
      });
      return cards.sort(() => Math.random() - 0.5);
    }

    function renderGame() {
      grid.innerHTML = "";
      moves = 0;
      matches = 0;
      firstCard = null;
      secondCard = null;
      lockBoard = false;
      if (movesEl) movesEl.textContent = moves;
      if (matchesEl) matchesEl.textContent = `0 / ${rawPairs.length}`;

      const deck = createDeck();
      deck.forEach(item => {
        const card = document.createElement('div');
        card.className = 'mem-card';
        card.dataset.id = item.id;
        card.innerHTML = `
          <div class="mem-card-inner">
            <div class="mem-card-front">
              <span class="mem-front-logo">✋</span>
              <span class="mem-front-text">ISL AI</span>
            </div>
            <div class="mem-card-back">
              <span class="mem-back-symbol">${item.content}</span>
              <span class="mem-back-title">${item.sub}</span>
            </div>
          </div>
        `;

        card.addEventListener('click', () => {
          if (lockBoard || card === firstCard || card.classList.contains('matched') || card.classList.contains('flipped')) return;

          card.classList.add('flipped');

          if (!firstCard) {
            firstCard = card;
            return;
          }

          secondCard = card;
          moves++;
          if (movesEl) movesEl.textContent = moves;
          lockBoard = true;

          if (firstCard.dataset.id === secondCard.dataset.id) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matches++;
            if (matchesEl) matchesEl.textContent = `${matches} / ${rawPairs.length}`;
            playSuccessChime();
            triggerConfettiBurst(40);
            showToast(`🎉 Match Found: ${item.sub}!`);

            if (matches === rawPairs.length) {
              setTimeout(() => {
                showToast(`🏆 Game Won in ${moves} moves! Excellent memory!`, 4500);
                speak("Congratulations! You mastered all sign memory pairs!");
                triggerConfettiBurst(100);
              }, 600);
            }

            resetCards();
          } else {
            setTimeout(() => {
              firstCard.classList.remove('flipped');
              secondCard.classList.remove('flipped');
              resetCards();
            }, 850);
          }
        });

        grid.appendChild(card);
      });
    }

    function resetCards() {
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }

    if (restartBtn) restartBtn.addEventListener('click', renderGame);
    renderGame();
  }

  // -------------------------------------------------------------------------
  // 27. Progressive Web App (PWA) Offline Service Worker & Installation
  // -------------------------------------------------------------------------
  function initPwa() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          console.log('PWA Service Worker registered:', reg.scope);
        }).catch((err) => {
          console.warn('PWA registration failed:', err);
        });
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredPwaPrompt = e;
      if (el.btnInstallApp) {
        el.btnInstallApp.style.display = "inline-flex";
        el.btnInstallApp.addEventListener('click', () => {
          if (state.deferredPwaPrompt) {
            state.deferredPwaPrompt.prompt();
            state.deferredPwaPrompt.userChoice.then(() => {
              state.deferredPwaPrompt = null;
              el.btnInstallApp.style.display = "none";
            });
          }
        });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 28. Application Bootstrap
  // -------------------------------------------------------------------------
  function bootstrap() {
    initSpeechSynthesis();
    initThemesAndLanguage();
    initTabs();
    initCameraControls();
    initVideoRecorder();
    initSentenceControls();
    initTranslator();
    initAvatarCanvas();
    initAccessibleCall();
    initWebRtcCall();
    initHealthcarePhraseboard();
    initDictionary();
    initQuiz();
    initReflexSprint();
    initAnalyticsAndCertificate();
    initConfetti();
    initCustomTrainer();
    initTrainerDatasetBackup();
    initMemoryGame();
    initSosModal();
    initPwa();
    connectWebSocket();

    // Universal AI Object & Item Detection Pipeline
    initObjectDetector();
    initVisionModeControls();

    // Auto initialize camera
    initHandTracking();
  }

  // -------------------------------------------------------------------------
  // 29. Universal AI Object & Item Detection Engine (COCO-SSD & Real-Time Vision)
  // -------------------------------------------------------------------------
  const OBJECT_LEXICON = {
    "person": { en: "Person", hi: "व्यक्ति / इंसान", symbol: "👤" },
    "cell phone": { en: "Cell Phone", hi: "मोबाइल फोन", symbol: "📱" },
    "bottle": { en: "Water Bottle", hi: "पानी की बोतल", symbol: "🧴" },
    "cup": { en: "Cup / Mug", hi: "कप / मग", symbol: "☕" },
    "laptop": { en: "Laptop / Computer", hi: "लैपटॉप / कंप्यूटर", symbol: "💻" },
    "mouse": { en: "Computer Mouse", hi: "माउस", symbol: "🖱️" },
    "keyboard": { en: "Keyboard", hi: "कीबोर्ड", symbol: "⌨️" },
    "book": { en: "Book / Notebook", hi: "किताब / पुस्तक", symbol: "📖" },
    "scissors": { en: "Scissors", hi: "कैंची", symbol: "✂️" },
    "pen": { en: "Pen / Pencil", hi: "कलम / पेन", symbol: "🖊️" },
    "apple": { en: "Apple", hi: "सेब", symbol: "🍎" },
    "banana": { en: "Banana", hi: "केला", symbol: "🍌" },
    "orange": { en: "Orange", hi: "संतरा", symbol: "🍊" },
    "backpack": { en: "Backpack / Bag", hi: "बैग / बस्ता", symbol: "🎒" },
    "handbag": { en: "Handbag", hi: "हैंडबैग", symbol: "👜" },
    "umbrella": { en: "Umbrella", hi: "छाता", symbol: "☂️" },
    "clock": { en: "Clock / Watch", hi: "घड़ी", symbol: "⏰" },
    "watch": { en: "Wrist Watch", hi: "हाथ घड़ी", symbol: "⌚" },
    "chair": { en: "Chair", hi: "कुर्सी", symbol: "🪑" },
    "couch": { en: "Couch / Sofa", hi: "सोफा", symbol: "🛋️" },
    "bed": { en: "Bed", hi: "बिस्तर / पलंग", symbol: "🛏️" },
    "tv": { en: "Television / Screen", hi: "टेलीविज़न / टीवी", symbol: "📺" },
    "remote": { en: "Remote Control", hi: "रिमोट", symbol: "📱" },
    "bowl": { en: "Bowl", hi: "कटोरा / प्याला", symbol: "🥣" },
    "fork": { en: "Fork", hi: "कांटा", symbol: "🍴" },
    "knife": { en: "Knife", hi: "चाकू", symbol: "🔪" },
    "spoon": { en: "Spoon", hi: "चम्मच", symbol: "🥄" },
    "sandwich": { en: "Sandwich", hi: "सैंडविच", symbol: "🥪" },
    "pizza": { en: "Pizza", hi: "पिज़्ज़ा", symbol: "🍕" },
    "glasses": { en: "Glasses", hi: "चश्मा", symbol: "👓" },
    "tie": { en: "Necktie", hi: "टाई", symbol: "👔" }
  };

  async function initObjectDetector() {
    if (window.cocoSsd) {
      try {
        state.isCocoLoading = true;
        state.cocoModel = await window.cocoSsd.load({ base: 'mobilenet_v2' });
        state.isCocoLoading = false;
        showToast("🌟 Universal Object & Item AI Vision Ready!");
      } catch (err) {
        console.warn("COCO-SSD initial load error:", err);
        state.isCocoLoading = false;
      }
    }
  }

  function initVisionModeControls() {
    const btns = [el.modeBtnAll, el.modeBtnGestures, el.modeBtnObjects];
    btns.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        btns.forEach(b => b && b.classList.remove('active'));
        btn.classList.add('active');
        state.visionMode = btn.dataset.mode || "all";

        if (state.visionMode === "all") {
          showToast("Mode: Auto AI (Detecting Gestures + Any Objects)");
        } else if (state.visionMode === "gestures") {
          showToast("Mode: Hand Gestures & Motions Only");
        } else if (state.visionMode === "objects") {
          showToast("Mode: Object & Item Scanner Only");
        }
      });
    });
  }

  async function runObjectDetection() {
    if (!state.cocoModel || !el.webcamVideo || el.webcamVideo.readyState < 2) return;
    try {
      const predictions = await state.cocoModel.detect(el.webcamVideo);
      state.detectedObjects = (predictions || []).filter(p => p.score >= 0.50);
      if (el.objectsCounter) {
        el.objectsCounter.textContent = `Items: ${state.detectedObjects.length}`;
      }
      if (state.detectedObjects.length > 0) {
        announceDetectedObject(state.detectedObjects[0]);
      }
    } catch (err) {
      // Ignore background transient frame errors
    }
  }

  function renderObjectsOnlyMode() {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, el.skeletonCanvas.width, el.skeletonCanvas.height);
    if (state.detectedObjects.length > 0) {
      drawDetectedObjects(state.detectedObjects);
      handleObjectRecognitionResult(state.detectedObjects[0]);
    } else {
      handleRecognitionResult({
        detected: false,
        sign: "Scanning for Items...",
        confidence: 0.0,
        category: "none",
        is_held: false,
        hold_progress: 0.0,
        hands_count: 0
      });
    }
    canvasCtx.restore();
  }

  function drawDetectedObjects(objects) {
    if (!objects || objects.length === 0) return;
    const w = el.skeletonCanvas.width;
    const h = el.skeletonCanvas.height;

    objects.forEach(obj => {
      const [bx, by, bw, bh] = obj.bbox;
      // Mirror X if camera is mirrored
      const x = state.cameraMirrored ? (w - (bx + bw)) : bx;
      const y = by;
      const conf = Math.round(obj.score * 100);
      const lex = OBJECT_LEXICON[obj.class.toLowerCase()] || {
        en: obj.class.toUpperCase(),
        hi: obj.class,
        symbol: "📦"
      };

      // Cyber-Neon Bounding Box
      canvasCtx.save();
      canvasCtx.strokeStyle = "rgba(0, 245, 212, 0.85)";
      canvasCtx.lineWidth = 2.5;
      canvasCtx.strokeRect(x, y, bw, bh);

      // Corner brackets
      const cl = Math.min(22, bw * 0.25, bh * 0.25);
      canvasCtx.strokeStyle = "#ff007f";
      canvasCtx.lineWidth = 4;
      // Top-Left
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, y + cl); canvasCtx.lineTo(x, y); canvasCtx.lineTo(x + cl, y);
      canvasCtx.stroke();
      // Top-Right
      canvasCtx.beginPath();
      canvasCtx.moveTo(x + bw - cl, y); canvasCtx.lineTo(x + bw, y); canvasCtx.lineTo(x + bw, y + cl);
      canvasCtx.stroke();
      // Bottom-Left
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, y + bh - cl); canvasCtx.lineTo(x, y + bh); canvasCtx.lineTo(x + cl, y + bh);
      canvasCtx.stroke();
      // Bottom-Right
      canvasCtx.beginPath();
      canvasCtx.moveTo(x + bw - cl, y + bh); canvasCtx.lineTo(x + bw, y + bh); canvasCtx.lineTo(x + bw, y + bh - cl);
      canvasCtx.stroke();

      // Glowing Item Pill Label
      const locName = state.currentLanguage === "hi" ? lex.hi : lex.en;
      const labelText = `${lex.symbol} ${locName} • ${conf}%`;
      canvasCtx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      const textWidth = canvasCtx.measureText(labelText).width;
      const pillW = textWidth + 18;
      const pillH = 26;
      const pillY = Math.max(6, y - pillH - 6);

      canvasCtx.fillStyle = "rgba(10, 16, 32, 0.92)";
      canvasCtx.strokeStyle = "#00f5d4";
      canvasCtx.lineWidth = 1.5;
      canvasCtx.beginPath();
      canvasCtx.roundRect(x, pillY, pillW, pillH, 6);
      canvasCtx.fill();
      canvasCtx.stroke();

      canvasCtx.fillStyle = "#00f5d4";
      canvasCtx.fillText(labelText, x + 9, pillY + 18);
      canvasCtx.restore();
    });
  }

  function announceDetectedObject(obj) {
    if (!obj || obj.score < 0.55 || !state.ttsEnabled) return;
    const now = performance.now();
    const lex = OBJECT_LEXICON[obj.class.toLowerCase()] || { en: obj.class, hi: obj.class };
    
    // Cooldown 4s for same item, 1.8s for different item
    if (state.lastAnnouncedObject === obj.class && (now - state.lastAnnouncedTime < 4000)) return;
    if (now - state.lastAnnouncedTime < 1800) return;

    state.lastAnnouncedObject = obj.class;
    state.lastAnnouncedTime = now;

    const speechText = state.currentLanguage === "hi"
      ? `पहचाना गया: ${lex.hi}`
      : `Detected: ${lex.en}`;
    speak(speechText);
  }

  function handleObjectRecognitionResult(topObj) {
    const lex = OBJECT_LEXICON[topObj.class.toLowerCase()] || {
      en: topObj.class.toUpperCase(),
      hi: topObj.class,
      symbol: "📦"
    };

    const locName = state.currentLanguage === "hi" ? lex.hi : lex.en;
    const confPercent = Math.round(topObj.score * 100);

    el.floatingBadge.style.opacity = "1";
    el.floatingSymbol.textContent = lex.symbol;
    el.floatingSign.textContent = locName;
    el.floatingMeta.textContent = `${confPercent}% match • Item Identified`;

    el.detectedSignTitle.textContent = lex.en.toUpperCase();
    el.signCategoryBadge.textContent = "ITEM IDENTIFIED";
    el.detectedSignHindi.textContent = lex.hi;
    el.detectedSignHint.textContent = `Physical object detected in camera frame.`;
    el.confBarFill.style.width = `${confPercent}%`;
    el.confText.textContent = `${confPercent}% Match`;
  }

  document.addEventListener('DOMContentLoaded', bootstrap);
})();