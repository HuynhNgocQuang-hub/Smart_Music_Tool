/**
 * AutoTuneProcessor - Real-time Pitch Correction & Quantization Processor
 */
class AutoTuneProcessor {
  constructor() {
    this.key = 'C';
    this.scaleType = 'major'; // 'major', 'minor', 'chromatic'
    this.correctionSpeed = 0.5; // 0 (natural/slow) to 1 (robotic/instant)
    
    this.noteFrequencies = {
      'C': [65.41, 130.81, 261.63, 523.25, 1046.50],
      'C#': [69.30, 138.59, 277.18, 554.37, 1108.73],
      'D': [73.42, 146.83, 293.66, 587.33, 1174.66],
      'D#': [77.78, 155.56, 311.13, 622.25, 1244.51],
      'E': [82.41, 164.81, 329.63, 659.25, 1318.51],
      'F': [87.31, 174.61, 349.23, 698.46, 1396.91],
      'F#': [92.50, 185.00, 369.99, 739.99, 1479.98],
      'G': [98.00, 196.00, 392.00, 783.99, 1567.98],
      'G#': [103.83, 207.65, 415.30, 830.61, 1661.22],
      'A': [110.00, 220.00, 440.00, 880.00, 1760.00],
      'A#': [116.54, 233.08, 466.16, 932.33, 1864.66],
      'B': [123.47, 246.94, 493.88, 987.77, 1975.53]
    };
  }

  setKeyAndScale(key = 'C', scaleType = 'major') {
    this.key = key;
    this.scaleType = scaleType;
  }

  setSpeed(speed = 0.5) {
    this.correctionSpeed = Math.max(0, Math.min(1, speed));
  }

  snapToNearestPitch(inputFreq) {
    if (!inputFreq || inputFreq <= 0) return inputFreq;
    
    // Convert frequency to MIDI note number
    const midi = Math.round(69 + 12 * Math.log2(inputFreq / 440));
    const targetFreq = 440 * Math.pow(2, (midi - 69) / 12);
    
    // Blend based on correction speed
    return inputFreq + (targetFreq - inputFreq) * this.correctionSpeed;
  }
}

if (typeof window !== 'undefined') {
  window.AutoTuneProcessor = AutoTuneProcessor;
}
