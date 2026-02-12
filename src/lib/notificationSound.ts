/**
 * Plays a subtle notification sound using the Web Audio API.
 * No external audio files needed — synthesized at runtime.
 *
 * The sound is a soft two-tone chime (C5 → E5) that's pleasant
 * and unobtrusive, similar to modern chat apps.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContext();
    }
    // Resume if suspended (browser autoplay policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playNotificationSound(volume = 0.3): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Two-tone chime: C5 (523Hz) then E5 (659Hz)
  const frequencies = [523.25, 659.25];
  const duration = 0.12;
  const gap = 0.08;

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    const start = now + i * (duration + gap);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + duration + 0.01);
  });
}
