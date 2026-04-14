import confetti from 'canvas-confetti';

export function fireConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#00897b'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#00897b'],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export function fireBigConfetti() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#00897b', '#c0392b', '#1976d2'],
  };

  confetti({ ...defaults, particleCount: 50, scalar: 1.2, shapes: ['circle', 'square'] });
  confetti({ ...defaults, particleCount: 30, scalar: 1.5, shapes: ['circle'] });
}
