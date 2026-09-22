/**
 * Offline Audio Renderer & WAV Exporter
 * Renders full project timeline into a downloadable WAV file
 */

class WavExporter {
  static async exportProjectToWav(project, bpm = 120) {
    const durationSeconds = 16 * (60 / bpm); // 16 beats total duration
    const sampleRate = 44100;
    const OfflineCtx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const offlineCtx = new OfflineCtx(2, sampleRate * durationSeconds, sampleRate);

    // Master Gain
    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(offlineCtx.destination);

    const secondsPerBeat = 60 / bpm;

    if (project && project.tracks) {
      const hasSolo = project.tracks.some(t => t.solo);
      project.tracks.forEach(track => {
        if (track.muted) return;
        if (hasSolo && !track.solo) return;

        const trackGain = offlineCtx.createGain();
        trackGain.gain.value = (track.volume / 100);

        const panner = offlineCtx.createStereoPanner ? offlineCtx.createStereoPanner() : null;
        if (panner) {
          panner.pan.value = Math.max(-1, Math.min(1, (track.pan || 0) / 50));
          trackGain.connect(panner);
          panner.connect(masterGain);
        } else {
          trackGain.connect(masterGain);
        }

        if (track.clips) {
          track.clips.forEach(clip => {
            if (clip.noteEvents) {
              clip.noteEvents.forEach(note => {
                const startTime = (clip.startTime + note.startTime) * secondsPerBeat;
                const duration = note.duration * secondsPerBeat;
                this.renderNoteOffline(offlineCtx, note.pitch, startTime, duration, track.instrument, trackGain);
              });
            }
          });
        }
      });
    }

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = this.bufferToWav(renderedBuffer);
    
    // Trigger download
    const url = URL.createObjectURL(wavBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${project.name || 'My_Song'}_export.wav`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  static renderNoteOffline(ctx, pitch, startTime, duration, instrument, destination) {
    const freq = window.audioEngine ? window.audioEngine.pitchFrequencyMap[pitch] || 440 : 440;
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, startTime);

    const inst = (instrument || 'PIANO').toUpperCase();
    if (inst === 'DRUMS') {
      const osc = ctx.createOscillator();
      if (pitch === 'C2' || pitch === 'KICK') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, startTime);
        osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.15);
        noteGain.gain.setValueAtTime(0.9, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
        osc.connect(noteGain);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      } else if (pitch === 'D2' || pitch === 'SNARE') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, startTime);
        noteGain.gain.setValueAtTime(0.8, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
        osc.connect(noteGain);
        osc.start(startTime);
        osc.stop(startTime + 0.18);
      } else {
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        noise.connect(filter);
        filter.connect(noteGain);
        noteGain.gain.setValueAtTime(0.5, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
        noise.start(startTime);
        noise.stop(startTime + 0.09);
      }
      noteGain.connect(destination);
      return;
    }

    const osc = ctx.createOscillator();
    if (inst === 'SYNTH') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, startTime);
      osc.connect(filter);
      filter.connect(noteGain);
    } else if (inst === 'BASS') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq / 2, startTime);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, startTime);
      osc.connect(filter);
      filter.connect(noteGain);
    } else if (inst === 'STRINGS') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.connect(noteGain);
    } else { // PIANO / GUITAR
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.connect(noteGain);
    }

    noteGain.gain.linearRampToValueAtTime(0.7, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.2);

    noteGain.connect(destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.25);
  }

  static bufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    function setUint16(data) {
      out.setUint16(pos, data, true);
      pos += 2;
    }
    function setUint32(data) {
      out.setUint32(pos, data, true);
      pos += 4;
    }

    // RIFF chunk descriptor
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // fmt sub-chunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // SubChunk1Size (16 for PCM)
    setUint16(1); // AudioFormat (1 for PCM)
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // ByteRate
    setUint16(numOfChan * 2); // BlockAlign
    setUint16(16); // BitsPerSample

    // data sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out.buffer], { type: "audio/wav" });
  }
}

window.wavExporter = WavExporter;
