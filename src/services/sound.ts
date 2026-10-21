/**
 * Web Audio Engine for Kairat: 404
 * Procedural retro arcade synthesizer + phone rings + funny SFX + voice lines
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private sfxVolume = 0.8;
  private musicVolume = 0.4;
  private soundEnabled = true;
  private musicEnabled = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.musicGainNode = this.ctx.createGain();
        this.sfxGainNode = this.ctx.createGain();

        this.musicGainNode.gain.value = this.musicEnabled ? this.musicVolume : 0;
        this.sfxGainNode.gain.value = this.soundEnabled ? this.sfxVolume : 0;

        this.musicGainNode.connect(this.ctx.destination);
        this.sfxGainNode.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSettings(sound: boolean, music: boolean, sfxVol = 0.8, musVol = 0.4) {
    this.soundEnabled = sound;
    this.musicEnabled = music;
    this.sfxVolume = sfxVol;
    this.musicVolume = musVol;

    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(sound ? sfxVol : 0, this.ctx.currentTime);
    }
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(music ? musVol : 0, this.ctx.currentTime);
    }

    if (!music && this.isMusicPlaying) {
      this.stopMusic();
    } else if (music && !this.isMusicPlaying) {
      this.startMusic();
    }
  }

  // Play a procedural chip-tune tone
  private playTone(freq: number, type: OscillatorType, duration: number, startDelay = 0, volMultiplier = 1) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGainNode) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startDelay);

      const startTime = this.ctx.currentTime + startDelay;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.3 * volMultiplier, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {
      // Audio play suppressed
    }
  }

  // --- SOUND EFFECTS ---

  public playClick() {
    this.playTone(800, 'sine', 0.05, 0, 0.4);
  }

  public playCoin() {
    this.playTone(987.77, 'square', 0.08, 0, 0.6); // B5
    this.playTone(1318.51, 'square', 0.16, 0.08, 0.7); // E6
  }

  public playJump() {
    this.initCtx();
    if (!this.ctx || !this.sfxGainNode || !this.soundEnabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playHit() {
    this.initCtx();
    if (!this.ctx || !this.sfxGainNode || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playPhoneRing() {
    // Authentic vibrating smartphone call ring
    this.playTone(440, 'triangle', 0.15, 0, 0.5);
    this.playTone(480, 'triangle', 0.15, 0, 0.5);
    this.playTone(440, 'triangle', 0.15, 0.25, 0.5);
    this.playTone(480, 'triangle', 0.15, 0.25, 0.5);
  }

  public playTelegramNotification() {
    this.playTone(587.33, 'sine', 0.06, 0, 0.5); // D5
    this.playTone(880, 'sine', 0.12, 0.06, 0.7); // A5
  }

  public playDodge() {
    this.playTone(520, 'sine', 0.08, 0, 0.4);
    this.playTone(780, 'sine', 0.08, 0.06, 0.5);
  }

  public playGasPuff() {
    // Comical cartoon whoosh / puff sound
    this.initCtx();
    if (!this.ctx || !this.sfxGainNode || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playBossLaser() {
    this.initCtx();
    if (!this.ctx || !this.sfxGainNode || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playPowerup() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.1, idx * 0.07, 0.6);
    });
  }

  public playVictoryFanfare() {
    const melody = [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((freq, idx) => {
      this.playTone(freq, 'square', 0.22, idx * 0.12, 0.6);
    });
  }

  public playGameOver() {
    const notes = [392, 349.23, 311.13, 261.63];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sawtooth', 0.25, idx * 0.15, 0.5);
    });
  }

  // Russian voice lines using Web Speech Synthesis if available
  public speakQuote(phrase: string) {
    if (!this.soundEnabled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'ru-RU';
        utterance.rate = 1.05;
        utterance.pitch = 0.9;
        utterance.volume = this.sfxVolume;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Voice synthesis fallback
      }
    }
  }

  // --- BACKGROUND MUSIC GENERATOR (Retro Cyberpunk Synth Loop) ---
  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    this.initCtx();
    this.isMusicPlaying = true;

    // Bassline and pulse pattern: Am -> F -> C -> G
    const bassPatterns = [
      [110, 110, 164.81, 110], // A2
      [87.31, 87.31, 130.81, 87.31], // F2
      [130.81, 130.81, 196, 130.81], // C3
      [98, 98, 146.83, 98], // G2
    ];

    let patternIdx = 0;
    let step = 0;

    const tick = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;
      if (this.ctx.state === 'suspended') return;

      const currentFreq = bassPatterns[patternIdx][step];
      const now = this.ctx.currentTime;

      // Play soft punchy bass pulse
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(currentFreq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.musicGainNode);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch {
        // audio context glitch
      }

      step++;
      if (step >= 4) {
        step = 0;
        patternIdx = (patternIdx + 1) % bassPatterns.length;
      }
    };

    this.musicInterval = window.setInterval(tick, 220);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public triggerVibration(pattern: number | number[] = 50) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignored if blocked
      }
    }
  }
}

export const sound = new SoundEngine();
