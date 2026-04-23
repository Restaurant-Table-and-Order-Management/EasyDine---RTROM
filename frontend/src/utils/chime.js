/**
 * Plays a premium 3-note confirmation chime using the Web Audio API.
 * No external audio files required.
 */
export const playConfirmationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const audioCtx = new AudioContext();
    const playNote = (freq, startTime, duration) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Smooth envelope: fast attack, slow decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;

    // Sequence: C5, E5, G5
    playNote(523.25, now, 0.4);       // Note 1: C5 starts at 0ms
    playNote(659.25, now + 0.3, 0.4); // Note 2: E5 starts at 300ms
    playNote(783.99, now + 0.6, 0.5); // Note 3: G5 starts at 600ms

  } catch (error) {
    console.error('Audio chime failed:', error);
  }
};
