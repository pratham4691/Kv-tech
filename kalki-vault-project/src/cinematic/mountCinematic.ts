import { CinematicDirector } from './CinematicDirector';

declare global {
  interface Window {
    cinematicDirector?: CinematicDirector;
  }
}

export function initCinematicExperience() {
  const container = document.getElementById('cinematic-3d-viewport');
  if (!container) return;

  const director = new CinematicDirector(container);
  window.cinematicDirector = director;

  // Sound toggle button hook
  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundText = document.getElementById('sound-toggle-text');
  if (soundBtn && soundText) {
    soundBtn.addEventListener('click', () => {
      const isAudioOn = director.toggleSound();
      soundText.innerText = isAudioOn ? 'AUDIO: ACTIVE' : 'AUDIO: MUTED';
      soundBtn.classList.toggle('border-vault-cyan', isAudioOn);
      soundBtn.classList.toggle('text-vault-cyan', isAudioOn);
    });
  }

  // Hook lobe telemetry selection buttons to activate corresponding anatomical lobe
  const lobes = ['all', 'frontal', 'temporal', 'parietal', 'occipital', 'cerebellum', 'brainstem'];
  lobes.forEach(lobe => {
    const btn = document.getElementById('lobe-btn-' + lobe);
    if (btn) {
      btn.addEventListener('click', () => {
        director.brainEngine.activateLobe(lobe as any);
      });
    }
  });

  // Breathtaking 3D Card Hover Physics (Magnetic light tracing pointer coordinates)
  document.querySelectorAll('.tilt-card').forEach((card) => {
    const el = card as HTMLElement;
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Magnetic button attractor physics
  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    const el = btn as HTMLElement;
    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCinematicExperience);
} else {
  initCinematicExperience();
}
