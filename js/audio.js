// ========================================================
// ALGOSSTORM — Web Audio 8-Bit Synthesizer Engine
// ========================================================

let audioCtx = null;
let soundEnabled = localStorage.getItem('algosstorm_sound') !== 'false';

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// UI Sound Effects
const soundClick = () => playTone(600, 'sine', 0.05, 0.05);

const soundSuccess = () => {
  if (!soundEnabled) return;
  playTone(523.25, 'triangle', 0.1, 0.08); // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.08), 80); // E5
  setTimeout(() => playTone(783.99, 'triangle', 0.2, 0.08), 160); // G5
};

const soundError = () => {
  if (!soundEnabled) return;
  playTone(180, 'sawtooth', 0.15, 0.08);
  setTimeout(() => playTone(140, 'sawtooth', 0.2, 0.08), 120);
};

const soundGameBeep = () => playTone(880, 'square', 0.06, 0.04);

const soundFanfare = () => {
  if (!soundEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 'triangle', 0.25, 0.08), idx * 110);
  });
};

function soundThunder() {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    
    const bufferSize = audioCtx.sampleRate * 0.45;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.45);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noise.start();
  } catch (e) {
    console.debug('Thunder audio error:', e);
  }
}

// Global Sound Toggle Control
function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('algosstorm_sound', soundEnabled);
  updateSoundUI();
  if (soundEnabled) soundSuccess();
}

function updateSoundUI() {
  const btn = document.getElementById('soundToggle');
  if (btn) {
    btn.textContent = soundEnabled ? '🔊' : '🔇';
    btn.setAttribute('aria-label', soundEnabled ? 'Mute sound' : 'Unmute sound');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('soundToggle');
  if (btn) {
    btn.onclick = toggleSound;
    updateSoundUI();
  }
});
