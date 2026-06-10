// Web Audio API helper for dynamic, synthesizer soundtrack
class AudioEngine {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isTicking: boolean = false;
  private tickInterval: any = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.setValueAtTime(0.0, this.ctx.currentTime);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  playChord(frequencies: number[], duration: number = 4) {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    // Resume context if suspended (browser security)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Stop current oscillators
    this.stopAll();

    const now = this.ctx.currentTime;
    
    // Fade in
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(0, now);
    this.gainNode.gain.linearRampToValueAtTime(0.12, now + 0.5); // quiet volume

    const waveType: OscillatorType = 'triangle'; // softer sound

    frequencies.forEach((freq) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, now);
      
      // Add slight detune for lush synthesizer effect
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      oscGain.gain.setValueAtTime(0.3, now);
      
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      
      osc.start(now);
      this.oscillators.push(osc);
    });

    // Fade out at end
    this.gainNode.gain.setValueAtTime(0.12, now + duration - 0.5);
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Schedule stop
    setTimeout(() => {
      this.stopAll();
    }, duration * 1000);
  }

  stopAll() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.oscillators = [];
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.setValueAtTime(0.0, this.ctx.currentTime);
      } catch (e) {}
    }
  }

  // Generate a neat little tick/click effect for video timeline change
  playTick() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const bgmEngine = new AudioEngine();
