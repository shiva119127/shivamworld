// Howler.js Audio Engine for Shivam's World Portfolio
// Dynamic zero-network PCM WAV asset generator

import { Howl, Howler } from "howler";

let isInitialized = false;
let currentVolume = 0.5;
let isMuted = false;

interface HowlSounds {
  loadingAmbience: Howl;
  completion: Howl;
  unlock: Howl;
  hubTheme: Howl;
  hover: Howl;
  click: Howl;
  mission: Howl;
  checkpoint: Howl;
  achievement: Howl;
  portalAmbience: Howl;
}

let sounds: HowlSounds | null = null;

// Standard PCM 16-bit Mono WAV generator
function generateWavUrl(duration: number, sampleRate: number, synthFn: (t: number) => number): string {
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF" (Big Endian)
  view.setUint32(4, 36 + numSamples * 2, true); // Chunk Size
  view.setUint32(8, 0x57415645, false); // "WAVE" (Big Endian)

  // Subchunk 1: fmt
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Subchunk 1 Size
  view.setUint16(20, 1, true); // Audio Format (1 = PCM)
  view.setUint16(22, 1, true); // Num Channels (1 = Mono)
  view.setUint32(24, sampleRate, true); // Sample Rate
  view.setUint32(28, sampleRate * 2, true); // Byte Rate
  view.setUint16(32, 2, true); // Block Align
  view.setUint16(34, 16, true); // Bits Per Sample

  // Subchunk 2: data
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, numSamples * 2, true); // Data Size

  // Write sample data
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, synthFn(t)));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

// Initialize the Audio Context safely
export const initAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  
  if (!isInitialized) {
    const sampleRate = 22050; // Balanced sample rate for instant compilation and low footprint

    // 1. Loading screen ambience (looping low frequency drone)
    const loadingAmbienceUrl = generateWavUrl(4.0, sampleRate, (t) => {
      const base = Math.sin(2 * Math.PI * 55 * t) * 0.6;
      const sub = Math.sin(2 * Math.PI * 27.5 * t) * 0.4;
      return (base + sub) * 0.15;
    });

    // 2. Loading completion chime (ascending crystal chime)
    const completionUrl = generateWavUrl(1.5, sampleRate, (t) => {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const idx = Math.min(3, Math.floor(t / 0.15));
      const age = t - idx * 0.15;
      if (age < 0) return 0;
      let val = 0;
      for (let i = 0; i <= idx; i++) {
        val += Math.sin(2 * Math.PI * notes[i] * (t - i * 0.15)) * Math.exp(-6 * (t - i * 0.15));
      }
      return val * 0.2;
    });

    // 3. Profile Unlock (mechanical ticks and power sweep)
    const unlockUrl = generateWavUrl(1.0, sampleRate, (t) => {
      const click = Math.sin(2 * Math.PI * (1200 - 800 * t) * t) * Math.exp(-60 * t);
      const whoosh = Math.sin(2 * Math.PI * (100 + 400 * t) * t) * Math.exp(-4 * t) * 0.3;
      return click + whoosh;
    });

    // 4. Main Hub loop theme (16s looping atmospheric pad)
    const hubThemeUrl = generateWavUrl(16.0, sampleRate, (t) => {
      const chords = [
        [164.81, 220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63, 349.23], // F
        [196.00, 261.63, 329.63, 392.00], // C
        [196.00, 246.94, 293.66, 392.00]  // G
      ];
      const chordIdx = Math.floor(t / 4.0) % 4;
      const freqs = chords[chordIdx];
      let val = 0;
      freqs.forEach((f) => {
        val += Math.sin(2 * Math.PI * f * t);
      });
      const lfo = Math.sin(2 * Math.PI * 0.1 * t) * 0.02;
      val += Math.sin(2 * Math.PI * freqs[1] * (1 + lfo) * t);
      return val * 0.05;
    });

    // 5. Interface hover click (soft digital pulse sweep)
    const hoverUrl = generateWavUrl(0.1, sampleRate, (t) => {
      return Math.sin(2 * Math.PI * (1000 + 500 * t) * t) * Math.exp(-40 * t) * 0.15;
    });

    // 6. Interface click selection (tactile selection click)
    const clickUrl = generateWavUrl(0.1, sampleRate, (t) => {
      return Math.sin(2 * Math.PI * (400 - 300 * t) * t) * Math.exp(-35 * t) * 0.25;
    });

    // 7. Quest Citadel whoosh (cinematic low frequency whoosh)
    const missionUrl = generateWavUrl(1.2, sampleRate, (t) => {
      const sweep = Math.sin(2 * Math.PI * (250 - 200 * t) * t);
      let noise = 0;
      for (let i = 0; i < 5; i++) {
        noise += Math.random() * 2 - 1;
      }
      noise /= 5;
      const env = Math.sin(Math.PI * (t / 1.2));
      return (sweep * 0.6 + noise * 0.4) * env * 0.25;
    });

    // 8. Ascent Trail / Checkpoint sound (ascending adventure chime)
    const checkpointUrl = generateWavUrl(0.6, sampleRate, (t) => {
      const notes = [440.00, 880.00];
      const idx = Math.min(1, Math.floor(t / 0.08));
      const noteT = t - idx * 0.08;
      return Math.sin(2 * Math.PI * notes[idx] * noteT) * Math.exp(-12 * noteT) * 0.2;
    });

    // 9. Hall of Legends chime (retro major arpeggio fanfare)
    const achievementUrl = generateWavUrl(1.2, sampleRate, (t) => {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      const idx = Math.min(5, Math.floor(t / 0.12));
      let val = 0;
      for (let i = 0; i <= idx; i++) {
        const age = t - i * 0.12;
        val += Math.sin(2 * Math.PI * notes[i] * age) * Math.exp(-5 * age);
      }
      return val * 0.12;
    });

    // 10. Portal / Contact activation sound (sweeping filter noise)
    const portalAmbienceUrl = generateWavUrl(4.0, sampleRate, (t) => {
      let lastOut = 0;
      const env = Math.sin(Math.PI * (t / 4.0));
      const sweep = 300 + 150 * Math.sin(2 * Math.PI * 0.2 * t);
      const tone = Math.sin(2 * Math.PI * sweep * t);
      const white = Math.random() * 2 - 1;
      return (tone * 0.4 + white * 0.6) * env * 0.08;
    });

    sounds = {
      loadingAmbience: new Howl({ src: [loadingAmbienceUrl], format: ["wav"], loop: true, volume: 0.25 }),
      completion: new Howl({ src: [completionUrl], format: ["wav"], volume: 0.3 }),
      unlock: new Howl({ src: [unlockUrl], format: ["wav"], volume: 0.3 }),
      hubTheme: new Howl({ src: [hubThemeUrl], format: ["wav"], loop: true, volume: 0.20 }), // Default to 20% volume
      hover: new Howl({ src: [hoverUrl], format: ["wav"], volume: 0.2 }),
      click: new Howl({ src: [clickUrl], format: ["wav"], volume: 0.3 }),
      mission: new Howl({ src: [missionUrl], format: ["wav"], volume: 0.35 }),
      checkpoint: new Howl({ src: [checkpointUrl], format: ["wav"], volume: 0.3 }),
      achievement: new Howl({ src: [achievementUrl], format: ["wav"], volume: 0.3 }),
      portalAmbience: new Howl({ src: [portalAmbienceUrl], format: ["wav"], loop: true, volume: 0.15 })
    };

    isInitialized = true;

    // Synchronize global settings
    const savedVolume = localStorage.getItem("shivams_world_volume");
    const savedMuted = localStorage.getItem("shivams_world_muted");
    if (savedVolume !== null) {
      currentVolume = parseFloat(savedVolume);
      Howler.volume(currentVolume);
    }
    if (savedMuted !== null) {
      isMuted = savedMuted === "true";
      Howler.mute(isMuted);
    }
  }

  return null;
};

// Set global volume (0 to 1)
export const setGlobalVolume = (vol: number) => {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== "undefined" && localStorage) {
    localStorage.setItem("shivams_world_volume", currentVolume.toString());
  }
  Howler.volume(currentVolume);
};

// Toggle mute state
export const setMutedState = (mute: boolean) => {
  isMuted = mute;
  if (typeof window !== "undefined" && localStorage) {
    localStorage.setItem("shivams_world_muted", isMuted ? "true" : "false");
  }
  Howler.mute(isMuted);
};

// Play/Stop control mapping

export const playLoadingAmbience = () => {
  initAudioContext();
  if (sounds) sounds.loadingAmbience.play();
};

export const stopLoadingAmbience = () => {
  if (sounds) {
    sounds.loadingAmbience.fade(sounds.loadingAmbience.volume(), 0, 400);
    setTimeout(() => {
      sounds?.loadingAmbience.stop();
      sounds?.loadingAmbience.volume(0.25);
    }, 450);
  }
};

export const playCompletionSound = () => {
  initAudioContext();
  if (sounds) sounds.completion.play();
};

export const playUnlockSound = () => {
  initAudioContext();
  if (sounds) sounds.unlock.play();
};

export const playHubTheme = () => {
  initAudioContext();
  if (sounds) {
    sounds.hubTheme.volume(0.2);
    sounds.hubTheme.play();
  }
};

export const setHubThemeMuted = (dimmed: boolean) => {
  if (sounds) {
    const targetVal = dimmed ? 0.05 : 0.20;
    sounds.hubTheme.fade(sounds.hubTheme.volume(), targetVal, 800);
  }
};

export const stopHubTheme = () => {
  if (sounds) {
    sounds.hubTheme.fade(sounds.hubTheme.volume(), 0, 1000);
    setTimeout(() => {
      sounds?.hubTheme.stop();
    }, 1100);
  }
};

export const playHoverSound = () => {
  initAudioContext();
  if (sounds) sounds.hover.play();
};

export const playClickSound = () => {
  initAudioContext();
  if (sounds) sounds.click.play();
};

export const playMissionSound = () => {
  initAudioContext();
  if (sounds) sounds.mission.play();
};

export const playCheckpointSound = () => {
  initAudioContext();
  if (sounds) sounds.checkpoint.play();
};

export const playAchievementUnlock = () => {
  initAudioContext();
  if (sounds) sounds.achievement.play();
};

export const playPortalAmbience = () => {
  initAudioContext();
  if (sounds) sounds.portalAmbience.play();
};

export const stopPortalAmbience = () => {
  if (sounds) {
    sounds.portalAmbience.fade(sounds.portalAmbience.volume(), 0, 1000);
    setTimeout(() => {
      sounds?.portalAmbience.stop();
      sounds?.portalAmbience.volume(0.15);
    }, 1100);
  }
};
