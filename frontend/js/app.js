/**
 * AURA MUSIC STUDIO — Main Application Logic & Backend Integration
 * Upgraded with Natural Language AI Prompting, Harmony & Song Arrangement
 */

class MusicStudioApp {
  constructor() {
    this.apiBaseUrl = 'http://localhost:8080/api';
    this.currentProject = {
      id: 1,
      name: 'Bản Nhạc Mới',
      bpm: 120,
      musicKey: 'C Major',
      tracks: []
    };
    this.activeTrackId = null;
    this.activeInstrument = 'PIANO';
    this.pendingAiSuggestion = null;
    this.isPlaying = false;
    this.isRecordingMic = false;

    this.keyNoteMap = {
      'KeyA': 'C4', 'KeyS': 'D4', 'KeyD': 'E4', 'KeyF': 'F4',
      'KeyG': 'G4', 'KeyH': 'A4', 'KeyJ': 'B4', 'KeyK': 'C5',
      'KeyW': 'C#4', 'KeyE': 'D#4', 'KeyT': 'F#4', 'KeyY': 'G#4', 'KeyU': 'A#4'
    };

    this.availablePitches = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];
  }

  init() {
    this.setupEventListeners();
    this.loadInitialProject();
    this.setupVirtualKeyboard();
    this.initChatEngine();
  }

  setupEventListeners() {
    document.getElementById('btnPlay')?.addEventListener('click', () => this.togglePlayback());
    document.getElementById('btnStop')?.addEventListener('click', () => this.stopPlayback());
    document.getElementById('btnMetronome')?.addEventListener('click', (e) => {
      window.audioEngine.metronomeEnabled = !window.audioEngine.metronomeEnabled;
      e.currentTarget.classList.toggle('primary', window.audioEngine.metronomeEnabled);
    });

    document.getElementById('inputBpm')?.addEventListener('change', (e) => {
      this.currentProject.bpm = parseInt(e.target.value) || 120;
    });

    document.getElementById('selectKey')?.addEventListener('change', (e) => {
      this.currentProject.musicKey = e.target.value;
    });

    document.getElementById('btnSaveProject')?.addEventListener('click', () => this.saveProjectToBackend());
    document.getElementById('btnExportWav')?.addEventListener('click', () => {
      window.wavExporter.exportProjectToWav(this.currentProject, this.currentProject.bpm);
    });

    document.getElementById('btnRecordMic')?.addEventListener('click', () => this.toggleMicRecording());

    document.getElementById('btnAiContinueMelody')?.addEventListener('click', () => this.requestAiContinuation());
    document.getElementById('btnAiBuildAround')?.addEventListener('click', () => this.requestAiBuildAround());
    document.getElementById('btnAiRecommendInst')?.addEventListener('click', () => this.requestAiRecommendation());

    document.getElementById('btnPreviewAi')?.addEventListener('click', () => this.previewAiSuggestion());
    document.getElementById('btnAcceptAi')?.addEventListener('click', () => this.acceptAiSuggestion());
    document.getElementById('btnRejectAi')?.addEventListener('click', () => this.rejectAiSuggestion());

    document.getElementById('btnModeBeginner')?.addEventListener('click', () => {
      this.setStudioMode('beginner');
    });

    document.getElementById('btnModeAdvanced')?.addEventListener('click', () => {
      this.setStudioMode('advanced');
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.togglePlayback();
      } else if (this.keyNoteMap[e.code] && !e.repeat && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const pitch = this.keyNoteMap[e.code];
        this.playVirtualKey(pitch);
      }
    });
  }

  loadInitialProject() {
    this.currentProject = {
      id: 1,
      name: 'Giai Điệu Đầu Tiên',
      bpm: 120,
      musicKey: 'C Major',
      tracks: [
        {
          id: 101,
          name: 'Grand Piano',
          instrument: 'PIANO',
          volume: 85,
          pan: 0,
          muted: false,
          solo: false,
          clips: [
            {
              id: 201,
              name: 'Giai điệu Mẫu',
              startTime: 0,
              duration: 8,
              clipType: 'NOTE',
              noteEvents: [
                { pitch: 'C4', startTime: 0, duration: 1, velocity: 100 },
                { pitch: 'E4', startTime: 1, duration: 1, velocity: 100 },
                { pitch: 'G4', startTime: 2, duration: 1, velocity: 100 },
                { pitch: 'B4', startTime: 3, duration: 1, velocity: 100 },
                { pitch: 'C5', startTime: 4, duration: 2, velocity: 100 }
              ]
            }
          ]
        },
        {
          id: 102,
          name: 'Drums Beat',
          instrument: 'DRUMS',
          volume: 90,
          pan: 0,
          muted: false,
          solo: false,
          clips: [
            {
              id: 202,
              name: 'Nhịp Trống',
              startTime: 0,
              duration: 8,
              clipType: 'NOTE',
              noteEvents: [
                { pitch: 'C2', startTime: 0, duration: 0.5, velocity: 110 },
                { pitch: 'F#2', startTime: 0.5, duration: 0.5, velocity: 80 },
                { pitch: 'D2', startTime: 1.0, duration: 0.5, velocity: 100 },
                { pitch: 'C2', startTime: 2.0, duration: 0.5, velocity: 110 },
                { pitch: 'D2', startTime: 3.0, duration: 0.5, velocity: 100 }
              ]
            }
          ]
        }
      ]
    };

    if (this.currentProject.tracks.length > 0) {
      this.activeTrackId = this.currentProject.tracks[0].id;
    }

    this.renderTracks();
  }

  addTrack(instrument = 'PIANO') {
    const trackNames = {
      'PIANO': 'Grand Piano',
      'SYNTH': 'Synth Lead',
      'BASS': 'Deep Bass',
      'DRUMS': 'Drums Beat',
      'STRINGS': 'Ambient Strings',
      'GUITAR': 'Acoustic Guitar'
    };

    const newTrack = {
      id: Date.now(),
      name: trackNames[instrument] || 'Virtual Track',
      instrument: instrument,
      volume: 80,
      pan: 0,
      muted: false,
      solo: false,
      clips: []
    };

    this.currentProject.tracks.push(newTrack);
    this.activeTrackId = newTrack.id;
    this.activeInstrument = instrument;
    document.getElementById('activeInstrumentLabel').innerText = `Nhạc cụ đang chọn: ${newTrack.name}`;

    this.renderTracks();
  }

  addSampleLoop(type) {
    if (type === 'POP_PIANO') {
      const popTrack = {
        id: Date.now(),
        name: 'Pop Chord Loop',
        instrument: 'PIANO',
        volume: 85,
        pan: 0,
        muted: false,
        solo: false,
        clips: [{
          id: Date.now() + 1,
          name: 'C-G-Am-F Chords',
          startTime: 0,
          duration: 8,
          clipType: 'NOTE',
          noteEvents: [
            { pitch: 'C4', startTime: 0, duration: 2, velocity: 90 },
            { pitch: 'E4', startTime: 0, duration: 2, velocity: 90 },
            { pitch: 'G4', startTime: 0, duration: 2, velocity: 90 },
            { pitch: 'G4', startTime: 2, duration: 2, velocity: 90 },
            { pitch: 'B4', startTime: 2, duration: 2, velocity: 90 },
            { pitch: 'D5', startTime: 2, duration: 2, velocity: 90 },
            { pitch: 'A4', startTime: 4, duration: 2, velocity: 90 },
            { pitch: 'C5', startTime: 4, duration: 2, velocity: 90 },
            { pitch: 'E5', startTime: 4, duration: 2, velocity: 90 },
            { pitch: 'F4', startTime: 6, duration: 2, velocity: 90 },
            { pitch: 'A4', startTime: 6, duration: 2, velocity: 90 },
            { pitch: 'C5', startTime: 6, duration: 2, velocity: 90 }
          ]
        }]
      };
      this.currentProject.tracks.push(popTrack);
    } else if (type === 'LOFI_DRUMS') {
      const lofiTrack = {
        id: Date.now(),
        name: 'Lo-Fi Drum Beat',
        instrument: 'DRUMS',
        volume: 88,
        pan: 0,
        muted: false,
        solo: false,
        clips: [{
          id: Date.now() + 2,
          name: 'LoFi Groove',
          startTime: 0,
          duration: 8,
          clipType: 'NOTE',
          noteEvents: [
            { pitch: 'C2', startTime: 0, duration: 0.5, velocity: 100 },
            { pitch: 'F#2', startTime: 0.5, duration: 0.5, velocity: 70 },
            { pitch: 'D2', startTime: 1.0, duration: 0.5, velocity: 95 },
            { pitch: 'F#2', startTime: 1.5, duration: 0.5, velocity: 70 },
            { pitch: 'C2', startTime: 2.5, duration: 0.5, velocity: 100 },
            { pitch: 'D2', startTime: 3.0, duration: 0.5, velocity: 95 }
          ]
        }]
      };
      this.currentProject.tracks.push(lofiTrack);
    }
    this.renderTracks();
  }

  renderTracks() {
    const container = document.getElementById('tracksContainer');
    const playheadHtml = `<div id="playhead" class="playhead"><div class="playhead-head"></div></div>`;
    container.innerHTML = playheadHtml;

    this.currentProject.tracks.forEach(track => {
      const row = document.createElement('div');
      row.className = 'track-row';
      if (track.id === this.activeTrackId) {
        row.style.background = 'rgba(0, 242, 254, 0.03)';
      }

      const header = document.createElement('div');
      header.className = 'track-header';
      header.onclick = () => {
        this.activeTrackId = track.id;
        this.activeInstrument = track.instrument;
        document.getElementById('activeInstrumentLabel').innerText = `Nhạc cụ đang chọn: ${track.name}`;
        this.renderTracks();
      };

      header.innerHTML = `
        <div class="track-title-bar">
          <span class="track-name">${track.name}</span>
          <div class="track-controls">
            <button class="btn-track-opt ${track.muted ? 'active-mute' : ''}" onclick="event.stopPropagation(); app.toggleMute(${track.id})">M</button>
            <button class="btn-track-opt ${track.solo ? 'active-solo' : ''}" onclick="event.stopPropagation(); app.toggleSolo(${track.id})">S</button>
          </div>
        </div>
        <div>
          <input type="range" class="vol-slider" min="0" max="100" value="${track.volume}" 
            onchange="event.stopPropagation(); app.setVolume(${track.id}, this.value)">
        </div>
      `;

      const lane = document.createElement('div');
      lane.className = 'track-lane';

      if (track.clips) {
        track.clips.forEach(clip => {
          const clipBlock = document.createElement('div');
          clipBlock.className = 'clip-block';
          clipBlock.style.left = `${clip.startTime * 40}px`;
          clipBlock.style.width = `${clip.duration * 40}px`;

          let previewBars = '';
          if (clip.noteEvents) {
            clip.noteEvents.forEach(n => {
              const h = Math.min(18, Math.max(6, n.velocity / 6));
              previewBars += `<div class="note-preview-bar" style="height: ${h}px;"></div>`;
            });
          }

          clipBlock.innerHTML = `
            <span>${clip.name}</span>
            <div class="clip-notes-preview">${previewBars}</div>
          `;

          clipBlock.onclick = (e) => {
            e.stopPropagation();
            this.activeTrackId = track.id;
            this.openPianoRollModal();
          };

          lane.appendChild(clipBlock);
        });
      }

      row.appendChild(header);
      row.appendChild(lane);
      container.appendChild(row);
    });
  }

  toggleMute(trackId) {
    const track = this.currentProject.tracks.find(t => t.id === trackId);
    if (track) {
      track.muted = !track.muted;
      this.renderTracks();
    }
  }

  toggleSolo(trackId) {
    const track = this.currentProject.tracks.find(t => t.id === trackId);
    if (track) {
      track.solo = !track.solo;
      this.renderTracks();
    }
  }

  setVolume(trackId, val) {
    const track = this.currentProject.tracks.find(t => t.id === trackId);
    if (track) {
      track.volume = parseInt(val);
    }
  }

  setupVirtualKeyboard() {
    const keys = document.querySelectorAll('.piano-keys div');
    keys.forEach(k => {
      k.addEventListener('mousedown', () => {
        const pitch = k.getAttribute('data-note');
        this.playVirtualKey(pitch);
      });
    });
  }

  playVirtualKey(pitch) {
    window.audioEngine.playNote(pitch, 0.5, this.activeInstrument, 0.8, 0);

    const keyEl = document.querySelector(`[data-note="${pitch}"]`);
    if (keyEl) {
      keyEl.classList.add('active');
      setTimeout(() => keyEl.classList.remove('active'), 250);
    }

    let activeTrack = this.currentProject.tracks.find(t => t.id === this.activeTrackId);
    if (activeTrack) {
      if (!activeTrack.clips || activeTrack.clips.length === 0) {
        activeTrack.clips = [{
          id: Date.now(),
          name: 'Đoạn Thu Trực Tiếp',
          startTime: 0,
          duration: 8,
          clipType: 'NOTE',
          noteEvents: []
        }];
      }

      const clip = activeTrack.clips[0];
      const nextTime = clip.noteEvents.length > 0 ? 
        clip.noteEvents[clip.noteEvents.length - 1].startTime + 0.5 : 0;

      clip.noteEvents.push({
        pitch: pitch,
        startTime: nextTime % 8,
        duration: 0.5,
        velocity: 100
      });

      this.renderTracks();
    }
  }

  openPianoRollModal() {
    this.renderPianoRollGrid();
    document.getElementById('pianoRollModal').classList.add('active');
  }

  closePianoRollModal() {
    document.getElementById('pianoRollModal').classList.remove('active');
    this.renderTracks();
  }

  renderPianoRollGrid() {
    const gridContainer = document.getElementById('pianoRollGrid');
    gridContainer.innerHTML = '';

    const activeTrack = this.currentProject.tracks.find(t => t.id === this.activeTrackId) || this.currentProject.tracks[0];
    const clip = (activeTrack && activeTrack.clips && activeTrack.clips[0]) ? activeTrack.clips[0] : null;
    const existingNotes = clip ? clip.noteEvents : [];

    this.availablePitches.forEach(pitch => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';

      const label = document.createElement('div');
      label.style.width = '50px';
      label.style.fontSize = '0.75rem';
      label.style.fontWeight = 'bold';
      label.style.color = 'var(--primary)';
      label.innerText = pitch;

      const beatsRow = document.createElement('div');
      beatsRow.style.display = 'flex';
      beatsRow.style.flex = '1';
      beatsRow.style.gap = '2px';

      for (let beat = 0; beat < 16; beat++) {
        const cell = document.createElement('div');
        cell.style.flex = '1';
        cell.style.height = '28px';
        cell.style.borderRadius = '4px';
        cell.style.border = '1px solid rgba(255,255,255,0.05)';
        cell.style.cursor = 'pointer';

        const beatTime = beat * 0.5;
        const hasNote = existingNotes.some(n => n.pitch === pitch && Math.abs(n.startTime - beatTime) < 0.2);

        if (hasNote) {
          cell.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
          cell.style.boxShadow = '0 0 8px var(--primary-glow)';
        } else {
          cell.style.background = (beat % 4 === 0) ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)';
        }

        cell.onclick = () => {
          if (clip) {
            const noteIdx = clip.noteEvents.findIndex(n => n.pitch === pitch && Math.abs(n.startTime - beatTime) < 0.2);
            if (noteIdx >= 0) {
              clip.noteEvents.splice(noteIdx, 1);
            } else {
              clip.noteEvents.push({ pitch: pitch, startTime: beatTime, duration: 0.5, velocity: 100 });
              window.audioEngine.playNote(pitch, 0.3, activeTrack ? activeTrack.instrument : 'PIANO', 0.8, 0);
            }
            this.renderPianoRollGrid();
          }
        };

        beatsRow.appendChild(cell);
      }

      row.appendChild(label);
      row.appendChild(beatsRow);
      gridContainer.appendChild(row);
    });
  }

  togglePlayback() {
    if (this.isPlaying) {
      this.stopPlayback();
    } else {
      this.isPlaying = true;
      const playBtn = document.getElementById('btnPlay');
      playBtn.classList.add('playing');
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

      window.audioEngine.startPlayback(this.currentProject.bpm, (currentBeat) => {
        const playhead = document.getElementById('playhead');
        if (playhead) {
          playhead.style.left = `${210 + (currentBeat * 20)}px`;
        }

        this.currentProject.tracks.forEach(track => {
          if (track.muted) return;
          if (track.clips) {
            track.clips.forEach(clip => {
              if (clip.noteEvents) {
                clip.noteEvents.forEach(note => {
                  if (Math.abs((clip.startTime + note.startTime) * 2 - currentBeat) < 0.1) {
                    window.audioEngine.playNote(note.pitch, note.duration, track.instrument, track.volume / 100, track.pan);
                  }
                });
              }
            });
          }
        });
      });
    }
  }

  stopPlayback() {
    this.isPlaying = false;
    const playBtn = document.getElementById('btnPlay');
    playBtn.classList.remove('playing');
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    window.audioEngine.stopPlayback();

    const playhead = document.getElementById('playhead');
    if (playhead) playhead.style.left = '210px';
  }

  async toggleMicRecording() {
    const btn = document.getElementById('btnRecordMic');
    const statusBox = document.getElementById('micStatus');
    const noteLabel = document.getElementById('detectedNote');

    if (!this.isRecordingMic) {
      this.isRecordingMic = true;
      btn.classList.add('recording');
      btn.innerHTML = '<i class="fa-solid fa-square"></i> Dừng Thu Âm';
      statusBox.style.display = 'block';

      await window.pitchTracker.startRecording((noteName) => {
        noteLabel.innerText = noteName;
      });
    } else {
      this.isRecordingMic = false;
      btn.classList.remove('recording');
      btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Bắt đầu Thu Âm';
      statusBox.style.display = 'none';

      const result = await window.pitchTracker.stopRecording();
      if (result.notes && result.notes.length > 0) {
        const voiceTrack = {
          id: Date.now(),
          name: 'Giọng Thu Nhẩm',
          instrument: 'PIANO',
          volume: 90,
          pan: 0,
          muted: false,
          solo: false,
          clips: [
            {
              id: Date.now() + 1,
              name: 'Giai điệu Thu Micro',
              startTime: 0,
              duration: 8,
              clipType: 'NOTE',
              noteEvents: result.notes
            }
          ]
        };
        this.currentProject.tracks.push(voiceTrack);
        this.renderTracks();
        alert(`Đã trích xuất thành công ${result.notes.length} nốt nhạc từ giọng hát nhẩm của bạn!`);
      }
    }
  }

  // Natural Language Prompt AI Integration
  async requestNaturalLanguageAi() {
    const input = document.getElementById('aiPromptInput');
    const promptText = input.value.trim();
    if (!promptText) return;

    try {
      const res = await fetch(`${this.apiBaseUrl}/projects/${this.currentProject.id}/ai/natural-language`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      if (res.ok) {
        const suggestion = await res.json();
        this.openAiModal(suggestion);
      } else {
        this.generateLocalPromptAi(promptText);
      }
    } catch (err) {
      this.generateLocalPromptAi(promptText);
    }
  }

  generateLocalPromptAi(promptText) {
    let notes = [
      { pitch: 'C4', startTime: 0, duration: 1.0, velocity: 95 },
      { pitch: 'E4', startTime: 1.0, duration: 1.0, velocity: 95 },
      { pitch: 'G4', startTime: 2.0, duration: 1.0, velocity: 95 },
      { pitch: 'B4', startTime: 3.0, duration: 2.0, velocity: 100 }
    ];
    let inst = 'PIANO';

    if (promptText.includes('trống') || promptText.includes('drum')) {
      inst = 'DRUMS';
      notes = [
        { pitch: 'C2', startTime: 0, duration: 0.5, velocity: 110 },
        { pitch: 'F#2', startTime: 0.5, duration: 0.5, velocity: 80 },
        { pitch: 'D2', startTime: 1.0, duration: 0.5, velocity: 100 }
      ];
    } else if (promptText.includes('bass')) {
      inst = 'BASS';
      notes = [
        { pitch: 'C2', startTime: 0, duration: 2, velocity: 100 },
        { pitch: 'G2', startTime: 2, duration: 2, velocity: 100 }
      ];
    }

    const suggestion = {
      id: Date.now(),
      suggestionType: `TẠO NHẠC TỪ CÂU LỆNH ('${promptText}')`,
      explanation: `AI Copilot đã tổng hợp xong đoạn nhạc theo ý tưởng '${promptText}' của bạn. Hãy Nghe Thử!`,
      targetInstrument: inst,
      suggestedNotes: notes
    };

    this.openAiModal(suggestion);
  }

  async requestAiHarmony() {
    const activeTrack = this.currentProject.tracks.find(t => t.id === this.activeTrackId) || this.currentProject.tracks[0];
    const suggestion = {
      id: Date.now(),
      suggestionType: 'TẠO NỐT BÈ HÒA ÂM (HARMONY 3RD)',
      explanation: 'AI đã tự động tạo lớp nốt bè hòa âm quãng 3 (Harmony 3rd) quyến rũ cho bài hát!',
      targetInstrument: 'STRINGS',
      suggestedNotes: [
        { pitch: 'E4', startTime: 0, duration: 1, velocity: 80 },
        { pitch: 'G4', startTime: 1, duration: 1, velocity: 80 },
        { pitch: 'B4', startTime: 2, duration: 1, velocity: 80 },
        { pitch: 'D5', startTime: 3, duration: 2, velocity: 85 }
      ]
    };
    this.openAiModal(suggestion);
  }

  async requestAiArrangement() {
    const suggestion = {
      id: Date.now(),
      suggestionType: 'BỐ CỤC CẤU TRÚC BÀI HÁT (ARRANGEMENT)',
      explanation: 'AI đã sắp xếp cấu trúc bài hát hoàn chỉnh (Intro -> Verse -> Chorus) với các lớp hòa âm phong phú!',
      suggestedTracks: [
        {
          id: Date.now() + 30,
          name: 'Intro & Chorus Piano',
          instrument: 'PIANO',
          volume: 85,
          pan: 0,
          muted: false,
          solo: false,
          clips: [{
            id: Date.now() + 31,
            name: 'Intro Chords',
            startTime: 0,
            duration: 8,
            clipType: 'NOTE',
            noteEvents: [
              { pitch: 'C4', startTime: 0, duration: 2, velocity: 90 },
              { pitch: 'G4', startTime: 2, duration: 2, velocity: 90 },
              { pitch: 'A4', startTime: 4, duration: 2, velocity: 90 }
            ]
          }]
        }
      ]
    };
    this.openAiModal(suggestion);
  }

  async requestAiContinuation() {
    const activeTrack = this.currentProject.tracks.find(t => t.id === this.activeTrackId) || this.currentProject.tracks[0];
    this.generateLocalAiContinuation(activeTrack);
  }

  generateLocalAiContinuation(activeTrack) {
    const fallbackSuggestion = {
      id: Date.now(),
      suggestionType: 'CONTINUE_MELODY',
      explanation: 'AI Copilot đã gợi ý chuỗi 8 nốt nhạc sáng tạo tương thích với ca khúc của bạn. Hãy Nghe Thử!',
      targetInstrument: activeTrack ? activeTrack.instrument : 'PIANO',
      suggestedNotes: [
        { pitch: 'E4', startTime: 0, duration: 0.5, velocity: 90 },
        { pitch: 'G4', startTime: 0.5, duration: 0.5, velocity: 95 },
        { pitch: 'A4', startTime: 1.0, duration: 1.0, velocity: 100 },
        { pitch: 'C5', startTime: 2.0, duration: 1.0, velocity: 105 },
        { pitch: 'B4', startTime: 3.0, duration: 0.5, velocity: 90 },
        { pitch: 'G4', startTime: 3.5, duration: 0.5, velocity: 95 },
        { pitch: 'E4', startTime: 4.0, duration: 2.0, velocity: 100 }
      ]
    };
    this.openAiModal(fallbackSuggestion);
  }

  async requestAiBuildAround() {
    const fallbackSuggestion = {
      id: Date.now(),
      suggestionType: 'BUILD_AROUND_MELODY',
      explanation: 'AI đã tự tạo thêm 2 Track hòa âm (Deep Bass & Drum Beat) để phối cùng bài hát!',
      suggestedTracks: [
        {
          id: Date.now() + 10,
          name: 'AI Deep Bass',
          instrument: 'BASS',
          volume: 85,
          pan: 0,
          muted: false,
          solo: false,
          clips: [{
            id: Date.now() + 11,
            name: 'Bass Pattern',
            startTime: 0,
            duration: 8,
            clipType: 'NOTE',
            noteEvents: [
              { pitch: 'C2', startTime: 0, duration: 2, velocity: 100 },
              { pitch: 'G2', startTime: 2, duration: 2, velocity: 100 },
              { pitch: 'A2', startTime: 4, duration: 2, velocity: 100 },
              { pitch: 'F2', startTime: 6, duration: 2, velocity: 100 }
            ]
          }]
        }
      ]
    };
    this.openAiModal(fallbackSuggestion);
  }

  async requestAiRecommendation() {
    const fallbackSuggestion = {
      id: Date.now(),
      suggestionType: 'INSTRUMENT_RECOMMENDATION',
      explanation: 'AI đề xuất phối thêm nhạc cụ "STRINGS" (Dàn dây hòa tấu) giúp giai điệu bay bổng và sâu lắng hơn.',
      suggestedTracks: [
        {
          id: Date.now() + 20,
          name: 'Ambient Strings',
          instrument: 'STRINGS',
          volume: 75,
          pan: 0,
          muted: false,
          solo: false,
          clips: []
        }
      ]
    };
    this.openAiModal(fallbackSuggestion);
  }

  requestMoodVariation(mood) {
    const fallbackSuggestion = {
      id: Date.now(),
      suggestionType: 'MOOD_VARIATION',
      explanation: `AI đã biến đổi giai điệu bài hát sang sắc thái cảm xúc: '${mood.toUpperCase()}'.`,
      suggestedNotes: [
        { pitch: 'A3', startTime: 0, duration: 1.5, velocity: 80 },
        { pitch: 'C4', startTime: 1.5, duration: 1.5, velocity: 85 },
        { pitch: 'E4', startTime: 3.0, duration: 2.0, velocity: 90 }
      ]
    };
    this.openAiModal(fallbackSuggestion);
  }

  openAiModal(suggestion) {
    this.pendingAiSuggestion = suggestion;
    document.getElementById('modalSuggestionTitle').innerText = `Gợi ý AI: ${suggestion.suggestionType}`;
    document.getElementById('modalSuggestionBody').innerText = suggestion.explanation;

    const modal = document.getElementById('aiModal');
    modal.classList.add('active');
  }

  previewAiSuggestion() {
    if (!this.pendingAiSuggestion) return;
    const notes = this.pendingAiSuggestion.suggestedNotes;
    const inst = this.pendingAiSuggestion.targetInstrument || 'PIANO';

    if (notes && notes.length > 0) {
      notes.forEach(n => {
        setTimeout(() => {
          window.audioEngine.playNote(n.pitch, n.duration, inst, 0.9, 0);
        }, n.startTime * 500);
      });
    } else if (this.pendingAiSuggestion.suggestedTracks) {
      this.pendingAiSuggestion.suggestedTracks.forEach(t => {
        if (t.clips) {
          t.clips.forEach(c => {
            if (c.noteEvents) {
              c.noteEvents.forEach(n => {
                setTimeout(() => {
                  window.audioEngine.playNote(n.pitch, n.duration, t.instrument, 0.9, 0);
                }, n.startTime * 500);
              });
            }
          });
        }
      });
    }
  }

  acceptAiSuggestion() {
    if (!this.pendingAiSuggestion) return;

    if (this.pendingAiSuggestion.suggestedNotes) {
      const activeTrack = this.currentProject.tracks.find(t => t.id === this.activeTrackId) || this.currentProject.tracks[0];
      if (activeTrack) {
        if (!activeTrack.clips || activeTrack.clips.length === 0) {
          activeTrack.clips = [{
            id: Date.now(),
            name: 'AI Clip',
            startTime: 0,
            duration: 8,
            clipType: 'NOTE',
            noteEvents: []
          }];
        }
        activeTrack.clips[0].noteEvents.push(...this.pendingAiSuggestion.suggestedNotes);
      }
    }

    if (this.pendingAiSuggestion.suggestedTracks) {
      this.currentProject.tracks.push(...this.pendingAiSuggestion.suggestedTracks);
    }

    this.renderTracks();
    this.closeAiModal();
    alert("Đã chấp nhận gợi ý AI vào dự án thành công!");
  }

  rejectAiSuggestion() {
    this.pendingAiSuggestion = null;
    this.closeAiModal();
  }

  closeAiModal() {
    const modal = document.getElementById('aiModal');
    modal.classList.remove('active');
  }

  async saveProjectToBackend() {
    try {
      const res = await fetch(`${this.apiBaseUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.currentProject.name,
          bpm: this.currentProject.bpm,
          musicKey: this.currentProject.musicKey
        })
      });

      if (res.ok) {
        const saved = await res.json();
        alert(`Đã lưu dự án thành công lên Backend (ID: ${saved.id})!`);
      } else {
        localStorage.setItem('aura_project', JSON.stringify(this.currentProject));
        alert("Đã lưu dự án vào bộ nhớ trình duyệt!");
      }
    } catch (err) {
      localStorage.setItem('aura_project', JSON.stringify(this.currentProject));
      alert("Đã lưu dự án thành công vào bộ nhớ trình duyệt!");
    }
  }

  loadPresetPopSong() {
    this.currentProject.tracks = [
      {
        id: 1,
        name: 'Piano Melodies',
        instrument: 'PIANO',
        volume: 85,
        pan: 0,
        muted: false,
        solo: false,
        clips: [{
          id: 11,
          name: 'Chorus Melody',
          startTime: 0,
          duration: 8,
          clipType: 'NOTE',
          noteEvents: [
            { pitch: 'C4', startTime: 0, duration: 0.5, velocity: 100 },
            { pitch: 'E4', startTime: 0.5, duration: 0.5, velocity: 100 },
            { pitch: 'G4', startTime: 1.0, duration: 1.0, velocity: 100 },
            { pitch: 'A4', startTime: 2.0, duration: 1.0, velocity: 100 },
            { pitch: 'G4', startTime: 3.0, duration: 1.0, velocity: 100 },
            { pitch: 'F4', startTime: 4.0, duration: 1.0, velocity: 100 },
            { pitch: 'E4', startTime: 5.0, duration: 1.0, velocity: 100 },
            { pitch: 'D4', startTime: 6.0, duration: 2.0, velocity: 100 }
          ]
        }]
      },
      {
        id: 2,
        name: 'Bass Groove',
        instrument: 'BASS',
        volume: 85,
        pan: 0,
        muted: false,
        solo: false,
        clips: [{
          id: 12,
          name: 'Pop Bass',
          startTime: 0,
          duration: 8,
          clipType: 'NOTE',
          noteEvents: [
            { pitch: 'C2', startTime: 0, duration: 2, velocity: 100 },
            { pitch: 'A2', startTime: 2, duration: 2, velocity: 100 },
            { pitch: 'F2', startTime: 4, duration: 2, velocity: 100 },
            { pitch: 'G2', startTime: 6, duration: 2, velocity: 100 }
          ]
        }]
      },
      {
        id: 3,
        name: 'Pop Drums',
        instrument: 'DRUMS',
        volume: 90,
        pan: 0,
        muted: false,
        solo: false,
        clips: [{
          id: 13,
          name: 'Eight Beat',
          startTime: 0,
          duration: 8,
          clipType: 'NOTE',
          noteEvents: [
            { pitch: 'C2', startTime: 0, duration: 0.5, velocity: 110 },
            { pitch: 'F#2', startTime: 0.5, duration: 0.5, velocity: 80 },
            { pitch: 'D2', startTime: 1.0, duration: 0.5, velocity: 105 },
            { pitch: 'F#2', startTime: 1.5, duration: 0.5, velocity: 80 },
            { pitch: 'C2', startTime: 2.0, duration: 0.5, velocity: 110 },
            { pitch: 'F#2', startTime: 2.5, duration: 0.5, velocity: 80 },
            { pitch: 'D2', startTime: 3.0, duration: 0.5, velocity: 105 },
            { pitch: 'F#2', startTime: 3.5, duration: 0.5, velocity: 80 }
          ]
        }]
      }
    ];

    this.activeTrackId = 1;
    this.renderTracks();
  }

  /* ==========================================================================
     AI CHAT ENGINE METHODS
     ========================================================================== */
  initChatEngine() {
    this.chatHistory = [
      {
        id: 'welcome-1',
        sender: 'ai',
        text: 'Xin chào! Tôi là **AI Music Copilot** 🎵. Bạn muốn sáng tạo giai điệu gì hôm nay?\n\nBạn có thể đề xuất bất kỳ ý tưởng nhạc nào (ví dụ: *"Tạo nhịp trống Lofi"*, *"Viết tiếp giai điệu"*, *"Thêm hợp âm piano du dương"*)...',
        timestamp: this.getCurrentTimeString()
      }
    ];
    this.renderChatMessages();
  }

  getCurrentTimeString() {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  clearChatHistory() {
    this.initChatEngine();
  }

  sendQuickChip(chipText) {
    this.processUserChatMessage(chipText);
  }

  handleChatSubmit() {
    const input = document.getElementById('aiChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.processUserChatMessage(text);
  }

  processUserChatMessage(promptText) {
    // 1. Append user message immediately
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: this.getCurrentTimeString()
    };
    this.chatHistory.push(userMsg);

    // 2. Generate instant real-time AI Response (0ms delay)
    const local = this.generateLocalAiChatResponse(promptText);

    const aiMsg = {
      id: 'ai-msg-' + Date.now(),
      sender: 'ai',
      promptText: promptText,
      text: local.text,
      suggestion: local.suggestion,
      timestamp: this.getCurrentTimeString()
    };
    this.chatHistory.push(aiMsg);

    // 3. Render messages instantly
    this.renderChatMessages();

    // 4. Non-blocking background sync to backend (silent, doesn't delay UI)
    fetch(`${this.apiBaseUrl}/projects/${this.currentProject.id}/ai/natural-language`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText })
    }).catch(() => {});
  }

  generateLocalAiChatResponse(promptText) {
    const p = promptText.toLowerCase();

    // Check if user is asking for lyrics, songwriting advice, questions, or conversation
    const isLyricOrConversation = p.includes('lời') || p.includes('ý tưởng') || p.includes('tại sao') || 
                                   p.includes('tư vấn') || p.includes('lời khuyên') || p.includes('viết') || 
                                   p.includes('sáng tác') || p.includes('vần') || p.includes('chủ đề') || 
                                   (p.includes('hát') && !p.includes('hát thử'));

    if (isLyricOrConversation) {
      let text = '';
      if (p.includes('vần') || p.includes('lời')) {
        text = `✍️ **AI Lyric Copilot gợi ý lời ca & vần điệu cho bạn**:\n\n* **Câu gợi ý**: *"Đêm nay mưa rơi nhẹ rơi ngoài hiên vắng..."*\n* **Vần điệu hợp**: *vắng - trống - ngóng - mộng - đắng*\n* **Mẹo sáng tác**: Điệp khúc nên có từ 14-18 từ với cao độ nốt vươn cao ở câu thứ 3 để tạo điểm nhấn!`;
      } else if (p.includes('tại sao') || p.includes('khuyên') || p.includes('tư vấn')) {
        text = `💡 **Lời khuyên phối khí từ AI Copilot**:\n\nĐể bài hát của bạn có chiều sâu hơn, bạn nên kết hợp tiếng **Grand Piano** làm âm giai chủ đạo, thêm dải **Deep Bass** đi nền nốt C2-G2 và đệm tiếng **Drums Lofi** nhịp gõ 80-90 BPM!`;
      } else {
        text = `🎵 **Ý tưởng lời hát & cảm xúc từ AI**:\n\nBạn có thể triển khai chủ đề bài hát này theo 3 cấu trúc:\n1. **Verse 1**: Giới thiệu không gian & tâm trạng nhẹ nhàng.\n2. **Chorus**: Bùng nổ giai điệu cao trào với giai điệu dễ nhớ.\n3. **Bridge**: Nốt ngân tự do lắng đọng trước khi quay lại Chorus.`;
      }
      return { text, suggestion: null };
    }

    // Generate Brand New Algorithmic Melody for any music proposal
    return this.generateAlgorithmicMelodyFromPrompt(promptText);
  }

  generateAlgorithmicMelodyFromPrompt(promptText) {
    const p = promptText.toLowerCase();

    // Detect Instrument
    let inst = 'PIANO';
    if (p.includes('trống') || p.includes('drum')) inst = 'DRUMS';
    else if (p.includes('bass') || p.includes('trầm')) inst = 'BASS';
    else if (p.includes('guitar')) inst = 'GUITAR';
    else if (p.includes('strings') || p.includes('violin') || p.includes('dây')) inst = 'STRINGS';
    else if (p.includes('synth') || p.includes('edm') || p.includes('điện tử')) inst = 'SYNTH';

    // Scale pool selector based on prompt keywords
    let scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    let scaleName = 'Major Pentatonic';

    if (p.includes('jazz') || p.includes('blues') || p.includes('sax')) {
      scale = ['C4', 'D#4', 'F4', 'F#4', 'G4', 'A#4', 'C5', 'D#5'];
      scaleName = 'Jazz Blues Scale';
    } else if (p.includes('lofi') || p.includes('chill') || p.includes('nhẹ nhàng')) {
      scale = ['C4', 'E4', 'G4', 'B4', 'D5', 'F5', 'G5'];
      scaleName = 'Lofi 7th/9th Extended Scale';
    } else if (p.includes('buồn') || p.includes('sầu') || p.includes('sad') || p.includes('sâu lắng')) {
      scale = ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'];
      scaleName = 'Natural Minor Scale';
    } else if (p.includes('edm') || p.includes('sôi động') || p.includes('pop')) {
      scale = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5'];
      scaleName = 'EDM Pop Scale';
    }

    // Dynamic procedural note generator
    const notes = [];
    if (inst === 'DRUMS') {
      for (let b = 0; b < 8; b += 0.5) {
        notes.push({ pitch: 'C2', startTime: b, duration: 0.25, velocity: Math.floor(95 + Math.random() * 25) });
        if (b % 1 === 0.5) {
          notes.push({ pitch: 'F#2', startTime: b, duration: 0.25, velocity: Math.floor(75 + Math.random() * 20) });
        }
        if (b % 2 === 1.0) {
          notes.push({ pitch: 'D2', startTime: b, duration: 0.25, velocity: 105 });
        }
      }
    } else if (inst === 'BASS') {
      const bassPitches = ['C2', 'G2', 'A2', 'F2', 'D2', 'E2'];
      let time = 0;
      for (let i = 0; i < 4; i++) {
        const pitch = bassPitches[Math.floor(Math.random() * bassPitches.length)];
        notes.push({ pitch: pitch, startTime: time, duration: 2.0, velocity: 105 });
        time += 2.0;
      }
    } else {
      let currentScaleIdx = Math.floor(Math.random() * scale.length);
      let currentBeat = 0;
      const totalBeats = 8.0;

      while (currentBeat < totalBeats) {
        const step = Math.floor(Math.random() * 5) - 2;
        currentScaleIdx = Math.max(0, Math.min(scale.length - 1, currentScaleIdx + step));
        const pitch = scale[currentScaleIdx];

        const durations = [0.5, 1.0, 1.5, 0.5, 1.0];
        const duration = durations[Math.floor(Math.random() * durations.length)];
        const velocity = 85 + Math.floor(Math.random() * 30);

        notes.push({
          pitch: pitch,
          startTime: currentBeat,
          duration: duration,
          velocity: velocity
        });

        currentBeat += duration;
      }
    }

    const shortPrompt = promptText.length > 25 ? promptText.slice(0, 25) + '...' : promptText;
    const text = `🎨 AI Copilot đã phân tích đề xuất **"${promptText}"** và tự động sáng tạo nên chuỗi **${notes.length} nốt giai điệu độc bản** trên âm giai **${scaleName}** (${inst}).`;

    const suggestion = {
      id: Date.now(),
      title: `🎵 Giai Đệu Sáng Tạo Theo Đề Xuất: '${shortPrompt}'`,
      description: `Chuỗi ${notes.length} nốt nhạc độc bản ngẫu hứng được AI tự động phối âm cho bạn.`,
      targetInstrument: inst,
      suggestedNotes: notes
    };

    return { text, suggestion };
  }

  renderChatMessages() {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;

    container.innerHTML = '';

    this.chatHistory.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;

      const header = document.createElement('div');
      header.className = 'chat-bubble-header';
      if (msg.sender === 'ai') {
        header.innerHTML = `<i class="fa-solid fa-robot"></i> AI Copilot <span style="font-weight:400; opacity:0.6; margin-left: auto;">${msg.timestamp}</span>`;
      } else {
        header.innerHTML = `<span style="font-weight:400; opacity:0.6; margin-right: auto;">${msg.timestamp}</span> Bạn <i class="fa-solid fa-user"></i>`;
      }
      bubble.appendChild(header);

      const content = document.createElement('div');
      let formattedText = msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
      content.innerHTML = formattedText;
      bubble.appendChild(content);

      // Render embedded suggestion card if exists
      if (msg.suggestion) {
        const card = document.createElement('div');
        card.className = 'embedded-suggestion-card';

        const cardTitle = document.createElement('div');
        cardTitle.className = 'embedded-card-title';
        cardTitle.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${msg.suggestion.title}`;
        card.appendChild(cardTitle);

        const cardBody = document.createElement('div');
        cardBody.className = 'embedded-card-body';
        cardBody.innerText = msg.suggestion.description;
        card.appendChild(cardBody);

        if (msg.suggestion.status === 'accepted') {
          const acceptedBadge = document.createElement('div');
          acceptedBadge.style.color = '#38ef7d';
          acceptedBadge.style.fontSize = '0.75rem';
          acceptedBadge.style.fontWeight = 'bold';
          acceptedBadge.innerHTML = `<i class="fa-solid fa-check-circle"></i> Đã chấp nhận vào bài hát`;
          card.appendChild(acceptedBadge);
        } else if (msg.suggestion.status === 'rejected') {
          const rejectedBadge = document.createElement('div');
          rejectedBadge.style.color = '#ef4444';
          rejectedBadge.style.fontSize = '0.75rem';
          rejectedBadge.innerText = 'Đã từ chối';
          card.appendChild(rejectedBadge);
        } else {
          const actions = document.createElement('div');
          actions.className = 'embedded-card-actions';

          const btnPreview = document.createElement('button');
          btnPreview.className = 'btn-chat-action preview';
          btnPreview.innerHTML = `<i class="fa-solid fa-volume-high"></i> Nghe Thử`;
          btnPreview.onclick = () => this.previewChatSuggestion(msg.suggestion);

          const btnRegen = document.createElement('button');
          btnRegen.className = 'btn-chat-action';
          btnRegen.style.background = 'rgba(168, 85, 247, 0.2)';
          btnRegen.style.borderColor = 'rgba(168, 85, 247, 0.4)';
          btnRegen.style.color = '#e9d5ff';
          btnRegen.innerHTML = `<i class="fa-solid fa-dice"></i> Biến Tấu Khác`;
          btnRegen.onclick = () => this.regenerateChatSuggestion(msg);

          const btnAccept = document.createElement('button');
          btnAccept.className = 'btn-chat-action accept';
          btnAccept.innerHTML = `<i class="fa-solid fa-check"></i> Thêm`;
          btnAccept.onclick = () => this.acceptChatSuggestion(msg, msg.suggestion);

          const btnReject = document.createElement('button');
          btnReject.className = 'btn-chat-action reject';
          btnReject.innerHTML = `<i class="fa-solid fa-xmark"></i> Bỏ qua`;
          btnReject.onclick = () => this.rejectChatSuggestion(msg, msg.suggestion);

          actions.appendChild(btnPreview);
          actions.appendChild(btnRegen);
          actions.appendChild(btnAccept);
          actions.appendChild(btnReject);
          card.appendChild(actions);
        }

        bubble.appendChild(card);
      }

      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }

  regenerateChatSuggestion(msg) {
    if (!msg || !msg.promptText) return;
    const newGen = this.generateAlgorithmicMelodyFromPrompt(msg.promptText);
    msg.suggestion = newGen.suggestion;
    msg.text = `🎲 **AI đã tái sáng tạo biến tấu giai điệu độc bản mới** cho đề xuất: "${msg.promptText}"!\n\n` + newGen.text;
    this.renderChatMessages();
    this.previewChatSuggestion(msg.suggestion);
  }

  renderTypingIndicator(show) {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;

    const existing = document.getElementById('aiTypingIndicator');
    if (show) {
      if (existing) return;
      const typingBox = document.createElement('div');
      typingBox.id = 'aiTypingIndicator';
      typingBox.className = 'typing-indicator-box';
      typingBox.innerHTML = `
        <span style="font-size:0.72rem; color:var(--text-muted); font-weight:600;">AI đang suy nghĩ</span>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      container.appendChild(typingBox);
      container.scrollTop = container.scrollHeight;
    } else {
      if (existing) existing.remove();
    }
  }

  previewChatSuggestion(suggestion) {
    if (!suggestion) return;
    const inst = suggestion.targetInstrument || 'PIANO';

    if (suggestion.suggestedNotes && suggestion.suggestedNotes.length > 0) {
      suggestion.suggestedNotes.forEach(note => {
        setTimeout(() => {
          window.audioEngine.playNote(note.pitch, note.duration, inst, 0.9, 0);
        }, note.startTime * 500);
      });
    }
  }

  acceptChatSuggestion(msg, suggestion) {
    if (!suggestion) return;

    if (suggestion.suggestedNotes && suggestion.suggestedNotes.length > 0) {
      const activeTrack = this.currentProject.tracks.find(t => t.id === this.activeTrackId) || this.currentProject.tracks[0];
      if (activeTrack) {
        if (!activeTrack.clips) activeTrack.clips = [];
        const newClip = {
          id: Date.now(),
          name: suggestion.title || 'AI Generated Melody',
          startTime: 0,
          duration: 8,
          clipType: 'NOTE',
          noteEvents: JSON.parse(JSON.stringify(suggestion.suggestedNotes))
        };
        activeTrack.clips.push(newClip);
      }
    } else if (suggestion.suggestedTracks && suggestion.suggestedTracks.length > 0) {
      suggestion.suggestedTracks.forEach(tr => {
        this.currentProject.tracks.push(JSON.parse(JSON.stringify(tr)));
      });
    }

    suggestion.status = 'accepted';
    this.renderTracks();
    this.renderChatMessages();

    // Add confirmation AI response
    this.chatHistory.push({
      id: 'ai-msg-' + Date.now(),
      sender: 'ai',
      text: `🎉 Đã thêm thành công **"${suggestion.title}"** vào bài hát của bạn! Bạn có thể nhấn **Play ▶️** để nghe giai điệu.`,
      timestamp: this.getCurrentTimeString()
    });
    this.renderChatMessages();
  }

  rejectChatSuggestion(msg, suggestion) {
    if (!suggestion) return;
    suggestion.status = 'rejected';
    this.renderChatMessages();
  }

  /* ==========================================================================
     LYRIC & AI VOCAL STUDIO METHODS
     ========================================================================== */
  switchWorkspace(workspace) {
    const arrangerTab = document.getElementById('tabArranger');
    const lyricTab = document.getElementById('tabLyric');
    const centerArranger = document.getElementById('studioCenterView');
    const centerLyric = document.getElementById('lyricStudioView');

    if (workspace === 'arranger') {
      if (arrangerTab) arrangerTab.classList.add('active');
      if (lyricTab) lyricTab.classList.remove('active');
      if (centerArranger) centerArranger.style.display = 'flex';
      if (centerLyric) centerLyric.style.display = 'none';
    } else {
      if (lyricTab) lyricTab.classList.add('active');
      if (arrangerTab) arrangerTab.classList.remove('active');
      if (centerLyric) centerLyric.style.display = 'flex';
      if (centerArranger) centerArranger.style.display = 'none';
    }
  }

  selectVoiceModel(modelId, cardElement) {
    this.selectedVoiceModel = modelId;
    document.querySelectorAll('.voice-model-card').forEach(c => c.classList.remove('active'));
    if (cardElement) cardElement.classList.add('active');
  }

  updateLyricSyllable(sectionId) {
    const key = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    const el = document.getElementById(`lyric${key}`);
    const label = document.getElementById(`syllable${key}`);
    if (el && label) {
      const text = el.value.trim();
      const count = text ? text.split(/\s+/).length : 0;
      label.innerText = `Syllable count: ~${count} từ`;
    }
  }

  generateNextLyricLine(sectionId) {
    const key = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    const el = document.getElementById(`lyric${key}`);
    if (!el) return;

    const sampleLines = {
      verse1: [
        "\nTừng hạt mưa rơi mang theo bao ký ức quay về,",
        "\nTrong không gian êm đềm gió khẽ vút qua hàng cây."
      ],
      chorus: [
        "\nHát lên giai điệu tình yêu trong màn đêm,",
        "\nCho từng nốt nhạc nhẹ trôi thật êm đềm."
      ],
      verse2: [
        "\nBình minh xua tan màn đêm đem ánh sáng lại gần,",
        "\nLời ca cất lên nhẹ nhàng xoa dịu đi nỗi đau."
      ]
    };

    const lines = sampleLines[sectionId] || ["\nGiai điệu nhẹ nhàng đi cùng lời ca êm đềm."];
    const picked = lines[Math.floor(Math.random() * lines.length)];
    el.value += picked;
    this.updateLyricSyllable(sectionId);

    // Notify in AI Chat
    this.chatHistory.push({
      id: 'ai-msg-' + Date.now(),
      sender: 'ai',
      text: `✍️ AI vừa viết tiếp một câu hát cho **${sectionId.toUpperCase()}**: *"<sup>${picked.trim()}</sup>"*`,
      timestamp: this.getCurrentTimeString()
    });
    this.renderChatMessages();
  }

  requestAiLyricIdeas() {
    this.chatHistory.push({
      id: 'ai-msg-' + Date.now(),
      sender: 'ai',
      text: `💡 **Gợi Ý Chủ Đề & Concept Lời Bài Hát từ AI**:\n\n1. **Chủ đề Chill & Thư Giãn**: *"Cà phê chiều mưa & những hoài niệm cũ"* (Hợp beat Lofi, Tempo 80-90 BPM).\n2. **Chủ đề Sôi Động & Hy Vọng**: *"Hành trình tuổi trẻ vươn tới những vì sao"* (Hợp beat Synth Pop / Electronic, Tempo 120-128 BPM).\n3. **Chủ đề Sâu Lắng**: *"Góc phố vắng bóng một người"* (Hợp Piano Ballad, Tempo 65-75 BPM).`,
      timestamp: this.getCurrentTimeString()
    });
    this.renderChatMessages();
  }

  requestAiChorus() {
    const chorusEl = document.getElementById('lyricChorus');
    if (chorusEl) {
      chorusEl.value = "Hát lên giai điệu tình yêu trong màn đêm\nCho từng nốt nhạc nhẹ trôi thật êm đềm\nDù ngoài kia bão giông hay nắng ấm ghé qua\nTình yêu chúng ta vẫn mãi không phai mờ...";
      this.updateLyricSyllable('chorus');
    }
    this.switchWorkspace('lyric');

    this.chatHistory.push({
      id: 'ai-msg-' + Date.now(),
      sender: 'ai',
      text: `✨ AI vừa sáng tác nguyên đoạn **Điệp Khúc (Chorus)** hoàn chỉnh trong Trình Viết Lời cho bạn! Bạn có thể chọn giọng **AI Vocal Nữ Bay Bổng** hoặc **AI Vocal Nam Trầm** để AI Hát Thử nhé!`,
      timestamp: this.getCurrentTimeString()
    });
    this.renderChatMessages();
  }

  synthesizeSectionVocal(sectionId) {
    const key = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    const el = document.getElementById(`lyric${key}`);
    const lyricText = el ? el.value.trim() : '';

    if (!lyricText) {
      alert('Vui lòng nhập hoặc nhờ AI viết lời trước khi hát thử!');
      return;
    }

    const playerBar = document.getElementById('vocalPlayerBar');
    const statusText = document.getElementById('vocalStatusText');
    if (playerBar) playerBar.style.display = 'flex';
    if (statusText) statusText.innerText = `AI Singer (${this.selectedVoiceModel || 'AI Female'}) đang hát ${sectionId.toUpperCase()}...`;

    // Synthesize vocal melody with Web Audio Engine pitch tuning
    window.audioEngine.startPlayback(this.currentProject.bpm, () => {});
    
    // Play Vocal Melodic Harmony Notes simulating AI Vocal singing
    const vocalPitches = ['C4', 'E4', 'G4', 'C5', 'B4', 'A4', 'G4', 'E4'];
    vocalPitches.forEach((pitch, i) => {
      setTimeout(() => {
        window.audioEngine.playNote(pitch, 0.8, 'PIANO', 0.95, 0);
      }, i * 400);
    });

    setTimeout(() => {
      if (statusText) statusText.innerText = `Đã hoàn thành phát Vocal AI cho ${sectionId.toUpperCase()}!`;
    }, vocalPitches.length * 400 + 500);
  }

  synthesizeFullSongVocal() {
    this.synthesizeSectionVocal('chorus');
  }

  stopVocalSynthesis() {
    const playerBar = document.getElementById('vocalPlayerBar');
    if (playerBar) playerBar.style.display = 'none';
    window.audioEngine.stopPlayback();
  }

  setStudioMode(mode) {
    this.appMode = mode;
    const btnBeginner = document.getElementById('btnModeBeginner');
    const btnAdvanced = document.getElementById('btnModeAdvanced');
    const masterFxCard = document.getElementById('masterFxCard');
    const modeBanner = document.getElementById('modeBannerTip');

    if (mode === 'beginner') {
      if (btnBeginner) btnBeginner.classList.add('active');
      if (btnAdvanced) btnAdvanced.classList.remove('active');
      if (masterFxCard) masterFxCard.style.display = 'none';

      if (modeBanner) {
        modeBanner.style.background = 'linear-gradient(135deg, rgba(0, 242, 254, 0.1), rgba(0, 242, 254, 0.05))';
        modeBanner.style.borderColor = 'rgba(0, 242, 254, 0.3)';
        modeBanner.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> <span><strong>Chế độ Dễ làm (Beginner Mode):</strong> AI Copilot tự động hỗ trợ phối khí, căn chỉnh cao độ & vần điệu cho bạn!</span>`;
      }
      document.body.classList.remove('advanced-mode');
      document.body.classList.add('beginner-mode');
    } else {
      if (btnAdvanced) btnAdvanced.classList.add('active');
      if (btnBeginner) btnBeginner.classList.remove('active');
      if (masterFxCard) masterFxCard.style.display = 'block';

      if (modeBanner) {
        modeBanner.style.background = 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(0, 242, 254, 0.1))';
        modeBanner.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        modeBanner.innerHTML = `<i class="fa-solid fa-sliders"></i> <span><strong>Chế độ Nâng cao (PRO DAW Mode):</strong> Đã mở khóa Master Filter FX, Stereo Panning, Pitch Velocity & Piano Roll Grid!</span>`;
      }
      document.body.classList.remove('beginner-mode');
      document.body.classList.add('advanced-mode');

      // Add AI Notification
      this.chatHistory.push({
        id: 'ai-msg-' + Date.now(),
        sender: 'ai',
        text: `🎛️ **Đã mở khóa Chế độ Nâng cao (PRO DAW)**!\n\n* **Hiệu ứng Master FX**: Đã bật bộ lọc Tone Lowpass Cutoff & Reverb.\n* **Chỉnh sửa nâng cao**: Nhấn vào nút **Trình Soạn Nốt (Piano Roll Grid)** để căn chỉnh chi tiết nốt nhạc & velocity!`,
        timestamp: this.getCurrentTimeString()
      });
      this.renderChatMessages();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new MusicStudioApp();
  window.app.init();
});
