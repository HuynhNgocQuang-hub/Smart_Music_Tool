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
      project.tracks.forEach(track => {
        if (track.muted) return;
        const trackGain = offlineCtx.createGain();
        trackGain.gain.value = (track.volume / 100);
        trackGain.connect(masterGain);

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
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = (instrument === 'BASS' || instrument === 'SYNTH') ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.7, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
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
