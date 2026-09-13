import { CinematicDirector } from './CinematicDirector';
import { AnatomicalLobe } from '../brain/BrainEngine';

declare global {
  interface Window {
    cinematicDirector?: CinematicDirector;
  }
}

const LOBE_INFO: Record<string, {
  badge: string;
  title: string;
  desc: string;
  nodes: string;
  synapses: string;
  latency: string;
  status: string;
}> = {
  all: {
    badge: 'ALL CORTICAL LOBES',
    title: 'Bi-Hemispheric Neural Defense Mesh',
    desc: 'Unified anatomical cortical matrix coordinating strategic threat modeling, post-quantum cryptography, and autonomous SOAR incident triage across all biological compartments.',
    nodes: '1,420 NODES',
    synapses: '4,860 TRACTS',
    latency: '0.42 ms',
    status: 'OPTIMAL DEFENSE'
  },
  frontal: {
    badge: 'FRONTAL LOBE: AI SYNTHESIS',
    title: 'Frontal Lobe — AI Threat Modeling & Executive Defense',
    desc: 'Anterior prefrontal cortex simulating adversary attack surfaces, zero-day behaviors, and real-time defense maneuvers before payloads execute.',
    nodes: '380 NODES',
    synapses: '1,420 TRACTS',
    latency: '0.28 ms',
    status: 'SYNTHESIS ACTIVE'
  },
  temporal: {
    badge: 'TEMPORAL LOBE: SIGINT & CRYPTO',
    title: 'Temporal Lobe — Cryptanalysis & SIGINT Shield',
    desc: 'Lateral-inferior cortex handling post-quantum Kyber-1024 / Dilithium lattice decryptions and spectral signal intelligence.',
    nodes: '210 NODES',
    synapses: '780 TRACTS',
    latency: '0.19 ms',
    status: 'QUANTUM SHIELDED'
  },
  parietal: {
    badge: 'PARIETAL LOBE: NETWORK MESH',
    title: 'Parietal Lobe — Network Telemetry & Spatial Topology',
    desc: 'Superior somatosensory arch monitoring worldwide Anycast nodes, BGP routing anomalies, and distributed DDoS scrubbers.',
    nodes: '290 NODES',
    synapses: '1,120 TRACTS',
    latency: '0.34 ms',
    status: 'MESH SECURED'
  },
  occipital: {
    badge: 'OCCIPITAL LOBE: SOC RADAR',
    title: 'Occipital Lobe — Visual SOC Threat Radar',
    desc: 'Posterior pole visual cortex feeding real-time global telemetry into the 3D threat radar and satellite intercept feeds.',
    nodes: '190 NODES',
    synapses: '640 TRACTS',
    latency: '0.15 ms',
    status: 'RADAR LOCK: 100%'
  },
  cerebellum: {
    badge: 'CEREBELLUM: SUB-MS SOAR',
    title: 'Cerebellum — Sub-Millisecond Autonomous SOAR',
    desc: 'Inferior twin folia coordinating microsecond automated incident containment, rogue process isolation, and memory boundary integrity.',
    nodes: '220 NODES',
    synapses: '850 TRACTS',
    latency: '0.08 ms',
    status: 'SUB-MS ARMED'
  },
  brainstem: {
    badge: 'BRAINSTEM: ROOT OF TRUST',
    title: 'Brainstem — Hardware Root of Trust & Zero-Trust Kernel',
    desc: 'Central descending stalk anchoring cryptographic key ceremonies, WebCrypto PBKDF2 attestation, and immutable kernel security.',
    nodes: '130 NODES',
    synapses: '480 TRACTS',
    latency: '0.04 ms',
    status: 'KERNEL ENFORCED'
  }
};

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

  // Hook lobe telemetry selection buttons to focus and activate corresponding anatomical lobe
  const lobes: AnatomicalLobe[] = ['all', 'frontal', 'temporal', 'parietal', 'occipital', 'cerebellum', 'brainstem'];
  lobes.forEach(lobe => {
    const btn = document.getElementById('lobe-btn-' + lobe);
    if (btn) {
      btn.addEventListener('click', () => {
        director.focusLobe(lobe);
        updateLobeUi(lobe);
      });
    }
  });

  // Listen to 3D raycast hover events from BrainEngine
  window.addEventListener('kalki-lobe-hover', ((e: CustomEvent<{ lobe: AnatomicalLobe }>) => {
    updateLobeUi(e.detail.lobe);
  }) as EventListener);

  function updateLobeUi(lobeKey: AnatomicalLobe) {
    lobes.forEach(k => {
      const btn = document.getElementById('lobe-btn-' + k);
      if (!btn) return;
      if (k === lobeKey) {
        btn.className = 'px-2 py-1.5 rounded-xl border text-center font-bold transition-all bg-vault-800 border-vault-cyan text-vault-cyan shadow-sm shadow-vault-cyan/30 scale-105';
      } else {
        btn.className = 'px-2 py-1.5 rounded-xl border text-center font-bold transition-all bg-vault-950 border-white/10 text-slate-400 hover:text-white hover:border-white/30';
      }
    });

    const info = LOBE_INFO[lobeKey] || LOBE_INFO.all;
    const badgeEl = document.getElementById('active-lobe-badge');
    if (badgeEl) badgeEl.innerText = info.badge;
    const titleEl = document.getElementById('telemetry-title');
    if (titleEl) titleEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-vault-cyan animate-ping"></span><span>${info.title}</span>`;
    const descEl = document.getElementById('telemetry-desc');
    if (descEl) descEl.innerText = info.desc;
    const nodesEl = document.getElementById('telemetry-nodes');
    if (nodesEl) nodesEl.innerText = info.nodes;
    const synEl = document.getElementById('telemetry-synapses');
    if (synEl) synEl.innerText = info.synapses;
    const latEl = document.getElementById('telemetry-latency');
    if (latEl) latEl.innerText = info.latency;
    const statEl = document.getElementById('telemetry-status');
    if (statEl) statEl.innerText = info.status;
  }

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

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
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

  // Section-transition triggers: Particle explosions and light flashes as user scrolls into new scenes
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        const secId = entry.target.id;
        if (secId === 'threat-radar') {
          director.atmosphereDirector.triggerLightningFlash();
          director.particleDirector.setCinematicState('TENSION');
        } else if (secId === 'quantum-lab') {
          director.particleDirector.setCinematicState('ACCELERATION');
        } else if (secId === 'academy' || secId === 'threat-matrix') {
          director.particleDirector.setCinematicState('REVEAL');
        }
      }
    });
  }, { threshold: [0.4] });

  ['threat-radar', 'quantum-lab', 'academy', 'threat-matrix', 'kill-chain'].forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCinematicExperience);
} else {
  initCinematicExperience();
}
