// Web Audio API Synthesizer for Shivam's World Portfolio
// Provides premium, zero-asset-loading, instant sound design.

let audioCtx: AudioContext | null = null;
let globalGain: GainNode | null = null;
let currentVolume = 0.5;
let isMuted = false;

// Running sound references for loops
let loadingAmbienceNode: { oscillator1: OscillatorNode; oscillator2: OscillatorNode; gain: GainNode } | null = null;
let hubThemeNode: { oscillators: OscillatorNode[]; gain: GainNode } | null = null;
let portalAmbienceNode: { noiseSource: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null = null;

// Initialize the Audio Context safely
export const initAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    
    audioCtx = new AudioContextClass();
    globalGain = audioCtx.createGain();
    globalGain.gain.setValueAtTime(isMuted ? 0 : currentVolume, audioCtx.currentTime);
    globalGain.connect(audioCtx.destination);
  }
  
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  
  return audioCtx;
};

// Set volume scale (0 to 1)
export const setGlobalVolume = (vol: number) => {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== "undefined" && localStorage) {
    localStorage.setItem("shivams_world_volume", currentVolume.toString());
  }
  
  if (globalGain && audioCtx) {
    const targetVal = isMuted ? 0 : currentVolume;
    globalGain.gain.setTargetAtTime(targetVal, audioCtx.currentTime, 0.05);
  }
};

// Toggle mute state
export const setMutedState = (mute: boolean) => {
  isMuted = mute;
  if (typeof window !== "undefined" && localStorage) {
    localStorage.setItem("shivams_world_muted", isMuted ? "true" : "false");
  }
  
  if (globalGain && audioCtx) {
    const targetVal = isMuted ? 0 : currentVolume;
    globalGain.gain.setTargetAtTime(targetVal, audioCtx.currentTime, 0.05);
  }
};

// 1. Loading Screen Ambience: Low frequency detuned drone
export const playLoadingAmbience = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain || loadingAmbienceNode) return;

  // Create two oscillators for detuned warmth
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  osc1.type = "sawtooth";
  osc1.frequency.value = 55; // A1
  osc1.detune.value = -10;

  osc2.type = "triangle";
  osc2.frequency.value = 55.2; // slightly offset
  osc2.detune.value = 10;

  filter.type = "lowpass";
  filter.frequency.value = 120; // steep lowpass for dark drone

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  // Fade in ambience
  gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(globalGain);

  osc1.start();
  osc2.start();

  loadingAmbienceNode = { oscillator1: osc1, oscillator2: osc2, gain: gainNode };
};

export const stopLoadingAmbience = () => {
  const ctx = audioCtx;
  if (!ctx || !loadingAmbienceNode) return;

  const node = loadingAmbienceNode;
  loadingAmbienceNode = null;

  node.gain.gain.setValueAtTime(node.gain.gain.value, ctx.currentTime);
  node.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

  setTimeout(() => {
    try {
      node.oscillator1.stop();
      node.oscillator2.stop();
    } catch (e) {}
  }, 600);
};

// 2. Loading Completion Chime: Bright crystalline drop
export const playCompletionSound = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain) return;

  const playChime = (freq: number, delay: number, dur: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(globalGain!);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + dur + 0.1);
  };

  playChime(523.25, 0, 0.6); // C5
  playChime(659.25, 0.1, 0.6); // E5
  playChime(783.99, 0.2, 0.8); // G5
  playChime(1046.50, 0.3, 1.2); // C6
};

// 3. Profile Unlock: Cybernetic click + mechanical disengage
export const playUnlockSound = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain) return;

  // Mechanical click sequence
  const playTick = (delay: number, pitch: number, vol: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(pitch, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.02);

    osc.connect(gain);
    gain.connect(globalGain!);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.05);
  };

  // Ticks representing locking mechanism releasing
  playTick(0, 1200, 0.08);
  playTick(0.06, 1000, 0.08);
  playTick(0.12, 1400, 0.08);

  // Power sweep
  const sweepOsc = ctx.createOscillator();
  const sweepGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  sweepOsc.type = "sawtooth";
  sweepOsc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);
  sweepOsc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
  filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.6);

  sweepGain.gain.setValueAtTime(0, ctx.currentTime);
  sweepGain.gain.setValueAtTime(0, ctx.currentTime + 0.15);
  sweepGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.25);
  sweepGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

  sweepOsc.connect(filter);
  filter.connect(sweepGain);
  sweepGain.connect(globalGain);

  sweepOsc.start(ctx.currentTime + 0.15);
  sweepOsc.stop(ctx.currentTime + 0.8);
};

// 4. Main Hub Loop Theme: Ethereal ambient pad (looping)
export const playHubTheme = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain || hubThemeNode) return;

  const freqs = [110, 165, 220, 330]; // A2, E3, A3, E4
  const oscs: OscillatorNode[] = [];
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(250, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3.0); // Slow fade-in

  // Setup multiple soft triangle/sine oscillators
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Slow vibrato LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.5 + Math.random() * 0.3; // Very slow
    lfoGain.gain.value = 1.5; // detune depth
    lfo.connect(lfoGain);
    lfoGain.connect(osc.detune);
    
    lfo.start();
    osc.connect(filter);
    osc.start();
    oscs.push(osc);
  });

  filter.connect(gainNode);
  gainNode.connect(globalGain);

  hubThemeNode = { oscillators: oscs, gain: gainNode };
};

// Mute music volume slightly when exploring details
export const setHubThemeMuted = (dimmed: boolean) => {
  const ctx = audioCtx;
  if (!ctx || !hubThemeNode) return;
  const targetVal = dimmed ? 0.05 : 0.15;
  hubThemeNode.gain.gain.setValueAtTime(hubThemeNode.gain.gain.value, ctx.currentTime);
  hubThemeNode.gain.gain.linearRampToValueAtTime(targetVal, ctx.currentTime + 0.8);
};

export const stopHubTheme = () => {
  const ctx = audioCtx;
  if (!ctx || !hubThemeNode) return;

  const node = hubThemeNode;
  hubThemeNode = null;

  node.gain.gain.setValueAtTime(node.gain.gain.value, ctx.currentTime);
  node.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

  setTimeout(() => {
    try {
      node.oscillators.forEach(osc => osc.stop());
    } catch (e) {}
  }, 1100);
};

// 5. Interface Hover Sound: Snappy microscopic high-frequency sweep
export const playHoverSound = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.025, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(globalGain);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

// 6. Interface Click Sound: Solid analog tactile click
export const playClickSound = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(350, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(globalGain);

  osc.start();
  osc.stop(ctx.currentTime + 0.07);
};

// 7. Quest / Mission Activation: Cinematic low swoosh
export const playMissionSound = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.5);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.5);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(globalGain);

  osc.start();
  osc.stop(ctx.currentTime + 0.65);
};

// 8. Checkpoint Level Selection: Electronic retro select chime
export const playCheckpointSound = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
  osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(globalGain);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

// 9. Achievement Unlocked: Retro major-chord victory fanfare
export const playAchievementUnlock = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain) return;

  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5 (Major Arpeggio)
  
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const delay = idx * 0.07;
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.45);
    
    osc.connect(gain);
    gain.connect(globalGain!);
    
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.5);
  });
};

// 10. Portal / Contact Ambience: Filtered sweeping noise simulating cosmic wind
export const playPortalAmbience = () => {
  const ctx = initAudioContext();
  if (!ctx || !globalGain || portalAmbienceNode) return;

  // Synthesize white noise buffer
  const bufferSize = 2 * ctx.sampleRate; // 2 seconds
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 2.0;
  filter.frequency.setValueAtTime(300, ctx.currentTime);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5); // Smooth wind fade-in

  // LFO to slowly sweep wind frequency
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.15; // very slow cycle (6 seconds)
  lfoGain.gain.value = 150; // modulate filter range

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(globalGain);

  lfo.start();
  noiseSource.start();

  portalAmbienceNode = { noiseSource, filter, gain: gainNode };
};

export const stopPortalAmbience = () => {
  const ctx = audioCtx;
  if (!ctx || !portalAmbienceNode) return;

  const node = portalAmbienceNode;
  portalAmbienceNode = null;

  node.gain.gain.setValueAtTime(node.gain.gain.value, ctx.currentTime);
  node.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

  setTimeout(() => {
    try {
      node.noiseSource.stop();
    } catch (e) {}
  }, 1100);
};
