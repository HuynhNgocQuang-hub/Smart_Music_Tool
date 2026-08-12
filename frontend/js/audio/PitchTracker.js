/**
 * Microphone Recorder & Pitch Detection (Hum/Sing to Melody)
 * Uses Web Audio MediaStream & Autocorrelation Algorithm
 */

class PitchTracker {
  constructor() {
    this.audioCtx = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.analyser = null;
    this.stream = null;
    this.extractedNotes = [];
  }

  async startRecording(onPitchDetectedCallback) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      
      const source = this.audioCtx.createMediaStreamSource(this.stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      this.extractedNotes = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };

      this.mediaRecorder.start();

      // Pitch Detection Loop
      this.detectPitchLoop(onPitchDetectedCallback);

    } catch (err) {
      console.error("Microphone permission denied or unsupported:", err);
      alert("Không thể truy cập Micro. Vui lòng cho phép Micro trên trình duyệt để thu âm.");
      this.isRecording = false;
    }
  }

  detectPitchLoop(callback) {
    if (!this.isRecording) return;

    const buffer = new Float32Array(this.analyser.fftSize);
    this.analyser.getFloatTimeDomainData(buffer);

    const pitch = this.autoCorrelate(buffer, this.audioCtx.sampleRate);
    if (pitch !== -1) {
      const noteName = this.freqToNote(pitch);
      if (noteName) {
        this.extractedNotes.push({
          pitch: noteName,
          timestamp: this.audioCtx.currentTime
        });
        if (callback) callback(noteName, pitch);
      }
    }

    requestAnimationFrame(() => this.detectPitchLoop(callback));
  }

  stopRecording() {
    return new Promise((resolve) => {
      this.isRecording = false;
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
          }
          const formattedNotes = this.processExtractedNotes(this.extractedNotes);
          resolve({ blob: audioBlob, notes: formattedNotes });
        };
        this.mediaRecorder.stop();
      } else {
        resolve({ blob: null, notes: [] });
      }
    });
  }

  autoCorrelate(buf, sampleRate) {
    let SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      let val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1; // Silent

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Float32Array(SIZE);
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buf[j] * buf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  freqToNote(freq) {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let jn = 12 * (Math.log(freq / 440) / Math.log(2));
    let midiNote = Math.round(jn) + 69;
    if (midiNote < 48 || midiNote > 84) return null; // Restrict to C3 - C6
    let noteName = noteNames[midiNote % 12];
    let octave = Math.floor(midiNote / 12) - 1;
    return noteName + octave;
  }

  processExtractedNotes(rawNotes) {
    if (!rawNotes || rawNotes.length === 0) return [];
    const result = [];
    let currentNote = null;

    for (let i = 0; i < rawNotes.length; i++) {
      let n = rawNotes[i];
      if (!currentNote) {
        currentNote = { pitch: n.pitch, startTime: i * 0.25, duration: 0.25, velocity: 100 };
      } else if (currentNote.pitch === n.pitch) {
        currentNote.duration += 0.25;
      } else {
        result.push(currentNote);
        currentNote = { pitch: n.pitch, startTime: i * 0.25, duration: 0.25, velocity: 100 };
      }
    }
    if (currentNote) result.push(currentNote);
    return result;
  }
}

window.pitchTracker = new PitchTracker();
