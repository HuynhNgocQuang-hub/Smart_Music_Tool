/**
 * Web Audio API Audio Engine & Synthesizers
 * Extended with Master FX Chain (Reverb, Delay, Master Filter)
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.masterFilter = null;
    this.delayNode = null;
    this.delayGain = null;
    this.reverbNode = null;
    this.reverbGain = null;
    
    this.isPlaying = false;
    this.bpm = 120;
    this.currentBeat = 0;
    this.totalBeats = 16;
    this.timerId = null;
    this.onBeatCallback = null;
    this.metronomeEnabled = false;

    this.pitchFrequencyMap = {
      'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
      'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
      'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
    };

    this.autoTuneProcessor = typeof window !== 'undefined' && window.AutoTuneProcessor ? new window.AutoTuneProcessor() : null;
    this.customInstruments = {};
  }

  /**
   * Plugin Architecture: Register custom instrument synthesizers
   */
  registerInstrument(name, synthesizerFn) {
    if (typeof synthesizerFn === 'function') {
      this.customInstruments[name.toUpperCase()] = synthesizerFn;
    }
  }

  getFrequencyFromPitch(pitch) {
    if (this.pitchFrequencyMap[pitch]) {
      return this.pitchFrequencyMap[pitch];
    }
    const regex = /^([A-G][#b]?)(-?\d+)$/;
    const match = String(pitch).trim().match(regex);
    if (!match) return 440;
    
    const note = match[1];
    const octave = parseInt(match[2], 10);
    const noteOffsets = {
      'C': 0, 'C#': 1, 'Db': 1,
      'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4,
      'F': 5, 'F#': 6, 'Gb': 6,
      'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10,
      'B': 11
    };
    if (noteOffsets[note] === undefined) return 440;
    const midi = (octave + 1) * 12 + noteOffsets[note];
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      // Master Nodes Chain: Source -> Filter -> Delay/Reverb -> Master Gain -> Destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.8;

      this.masterFilter = this.ctx.createBiquadFilter();
      this.masterFilter.type = 'lowpass';
      this.masterFilter.frequency.value = 12000; // Open tone filter

      // Delay Node
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.value = 0.35; // Echo timing
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.value = 0.25;

      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.delayNode); // Feedback loop

      // Reverb Impulse Buffer Simulation
      this.reverbNode = this.ctx.createConvolver();
      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.value = 0.3;
      this.createSimpleReverbBuffer();

      // Routing
      this.masterFilter.connect(this.delayNode);
      this.masterFilter.connect(this.reverbNode);
      this.masterFilter.connect(this.masterGain);
      this.delayGain.connect(this.masterGain);
      this.reverbGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createSimpleReverbBuffer() {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 2.0; // 2 sec decay
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (sampleRate * 0.4));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }
    this.reverbNode.buffer = impulse;
  }

  setMasterFilterFrequency(val) {
    if (this.masterFilter) {
      this.masterFilter.frequency.value = val; // 500Hz - 16000Hz
    }
  }

  setReverbLevel(val) {
    if (this.reverbGain) {
      this.reverbGain.gain.value = val; // 0.0 - 0.8
    }
  }

  playNote(pitch, duration = 0.5, instrument = 'PIANO', volume = 0.8, pan = 0) {
    this.init();
    const freq = this.getFrequencyFromPitch(pitch);
    const now = this.ctx.currentTime;

    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) panner.pan.value = Math.max(-1, Math.min(1, pan / 50));

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);

    if (panner) {
      gainNode.connect(panner);
      panner.connect(this.masterFilter);
    } else {
      gainNode.connect(this.masterFilter);
    }

    const instUpper = (instrument || 'PIANO').toUpperCase();
    if (this.customInstruments[instUpper]) {
      this.customInstruments[instUpper]({ freq, now, duration, gainNode, volume, pitch, ctx: this.ctx });
      return;
    }

    switch (instUpper) {
      case 'PIANO':
        this.synthesizePiano(freq, now, duration, gainNode, volume);
        break;
      case 'SYNTH':
        this.synthesizeSynth(freq, now, duration, gainNode, volume);
        break;
      case 'BASS':
        this.synthesizeBass(freq, now, duration, gainNode, volume);
        break;
      case 'DRUMS':
        this.synthesizeDrums(pitch, now, gainNode, volume);
        break;
      case 'STRINGS':
        this.synthesizeStrings(freq, now, duration, gainNode, volume);
        break;
      case 'GUITAR':
        this.synthesizeGuitar(freq, now, duration, gainNode, volume);
        break;
      case 'ORGAN':
        this.synthesizeOrgan(freq, now, duration, gainNode, volume);
        break;
      case 'MARIMBA':
        this.synthesizeMarimba(freq, now, duration, gainNode, volume);
        break;
      default:
        this.synthesizePiano(freq, now, duration, gainNode, volume);
        break;
    }
  }

  synthesizePiano(freq, now, duration, gainNode, volume) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now);

    const oscGain1 = this.ctx.createGain();
    const oscGain2 = this.ctx.createGain();

    oscGain1.gain.value = 0.7 * volume;
    oscGain2.gain.value = 0.3 * volume;

    osc1.connect(oscGain1);
    osc2.connect(oscGain2);

    oscGain1.connect(gainNode);
    oscGain2.connect(gainNode);

    gainNode.gain.linearRampToValueAtTime(0.8 * volume, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.3);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.4);
    osc2.stop(now + duration + 0.4);
  }

  synthesizeSynth(freq, now, duration, gainNode, volume) {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.value = 4;

    osc.connect(filter);
    filter.connect(gainNode);

    gainNode.gain.linearRampToValueAtTime(0.7 * volume, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  synthesizeBass(freq, now, duration, gainNode, volume) {
    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq / 2, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    osc.connect(filter);
    filter.connect(gainNode);

    gainNode.gain.linearRampToValueAtTime(0.9 * volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.1);

    osc.start(now);
    osc.stop(now + duration + 0.15);
  }

  synthesizeDrums(pitch, now, gainNode, volume) {
    const osc = this.ctx.createOscillator();
    if (pitch === 'C2' || pitch === 'KICK') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
      gainNode.gain.setValueAtTime(1.0 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (pitch === 'D2' || pitch === 'SNARE') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      gainNode.gain.setValueAtTime(0.8 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.gain.setValueAtTime(0.5 * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noise.start(now);
      noise.stop(now + 0.09);
    }
  }

  synthesizeStrings(freq, now, duration, gainNode, volume) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 1.005, now);

    osc1.connect(gainNode);
    osc2.connect(gainNode);

    gainNode.gain.linearRampToValueAtTime(0.6 * volume, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.6);
    osc2.stop(now + duration + 0.6);
  }

  synthesizeGuitar(freq, now, duration, gainNode, volume) {
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(0.8 * volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.2);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration + 0.25);
  }

  synthesizeOrgan(freq, now, duration, gainNode, volume) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc3.type = 'sine';

    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 2, now);
    osc3.frequency.setValueAtTime(freq * 3, now);

    const g1 = this.ctx.createGain();
    const g2 = this.ctx.createGain();
    const g3 = this.ctx.createGain();
    g1.gain.value = 0.5 * volume;
    g2.gain.value = 0.3 * volume;
    g3.gain.value = 0.2 * volume;

    osc1.connect(g1);
    osc2.connect(g2);
    osc3.connect(g3);
    g1.connect(gainNode);
    g2.connect(gainNode);
    g3.connect(gainNode);

    gainNode.gain.setValueAtTime(0.7 * volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.1);

    osc1.start(now); osc2.start(now); osc3.start(now);
    osc1.stop(now + duration + 0.15);
    osc2.stop(now + duration + 0.15);
    osc3.stop(now + duration + 0.15);
  }

  synthesizeMarimba(freq, now, duration, gainNode, volume) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(1.0 * volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  startPlayback(bpm, onBeatCallback) {
    this.init();
    this.bpm = bpm;
    this.onBeatCallback = onBeatCallback;
    this.isPlaying = true;
    this.currentBeat = 0;

    const intervalMs = (60 / this.bpm / 4) * 1000; // 16th note resolution (0.25 beats per tick)

    this.timerId = setInterval(() => {
      if (this.onBeatCallback) {
        this.onBeatCallback(this.currentBeat);
      }
      if (this.metronomeEnabled && this.currentBeat % 4 === 0) {
        this.playMetronomeClick(this.currentBeat % 16 === 0);
      }
      this.currentBeat = (this.currentBeat + 1) % (this.totalBeats * 4);
    }, intervalMs);
  }

  stopPlayback() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.currentBeat = 0;
  }

  playMetronomeClick(isHigh = false) {
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isHigh ? 1200 : 800, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

window.audioEngine = new AudioEngine();
