import { BimViewer3D, WalkthroughEngine } from './bimViewer3d.js';
import { initFloorPlans } from './floorPlans.js';
import { initStructuralCAD } from './structuralCAD.js';
import { initEnvironmentalForma, resizeFormaCharts } from './environmentalForma.js';
import { PresentationDeck } from './presentationDeck.js';
import { InnovationsEngine } from './innovations.js';

/**
 * Web Audio API Biophilic Soundscape Generator
 */
class BiophilicSoundscape {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.gainNode = null;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  start() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      const bufferSize = 2 * this.audioCtx.sampleRate;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      whiteNoise.start(0);
      this.isPlaying = true;
    } catch (e) {
      console.warn('Audio not allowed without user gesture', e);
    }
  }

  stop() {
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.isPlaying = false;
  }
}

/**
 * Master Application Initialization
 */
function initApp() {
  // 1. Initialize 3D BIM Viewer
  let bimViewer = null;
  try {
    bimViewer = new BimViewer3D('bimCanvas');
  } catch (err) {
    console.error('BIM Viewer init error:', err);
  }

  // 2. Initialize Walkthrough Engine
  let walkthrough = null;
  try {
    walkthrough = new WalkthroughEngine('walkthroughCanvas');
  } catch (err) {
    console.error('Walkthrough init error:', err);
  }

  // 3. Initialize 5 Groundbreaking Innovations Engine
  let innovationsEngine = null;
  try {
    innovationsEngine = new InnovationsEngine(bimViewer);
  } catch (err) {
    console.error('Innovations engine init error:', err);
  }

  // 4. Initialize Floor Plans
  try {
    initFloorPlans();
  } catch (err) {
    console.error('Floor plans init error:', err);
  }

  // 5. Initialize Structural CAD
  try {
    initStructuralCAD();
  } catch (err) {
    console.error('Structural CAD init error:', err);
  }

  // 6. Initialize Forma Climate Analytics
  try {
    initEnvironmentalForma();
  } catch (err) {
    console.error('Forma init error:', err);
  }

  // 7. Initialize Presentation Deck
  try {
    new PresentationDeck();
  } catch (err) {
    console.error('Presentation deck init error:', err);
  }

  // 8. Biophilic Audio Toggle
  const soundscape = new BiophilicSoundscape();
  const audioBtn = document.getElementById('btnAudioToggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = soundscape.toggle();
      audioBtn.classList.toggle('active', active);
    });
  }

  // 9. Navigation View Tabs Switching
  const navTabs = document.querySelectorAll('.nav-tab');
  const viewPanels = document.querySelectorAll('.view-panel');
  const mobileNav = document.getElementById('mainNav');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');

  function switchView(viewKey) {
    navTabs.forEach(t => t.classList.toggle('active', t.dataset.view === viewKey));
    viewPanels.forEach(p => {
      p.classList.toggle('active', p.id === `view-${viewKey}`);
    });

    if (mobileNav) mobileNav.classList.remove('mobile-open');

    // Trigger responsive renderers after layout change
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (viewKey === 'walkthrough' && walkthrough) {
        walkthrough.resize();
        walkthrough.updateCameraToTime(walkthrough.currentTime);
      } else if (viewKey === 'bim3d' && bimViewer) {
        bimViewer.resizeRendererToDisplaySize();
      } else if (viewKey === 'innovations' && innovationsEngine) {
        innovationsEngine.resizeActive3D();
      } else if (viewKey === 'environmental') {
        resizeFormaCharts();
      }
    }, 40);
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchView(tab.dataset.view);
    });
  });

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('mobile-open');
    });
  }

  // Quick Walkthrough Trigger from 3D View
  const btnStartWalkthrough = document.getElementById('btnStartWalkthroughFrom3d');
  if (btnStartWalkthrough) {
    btnStartWalkthrough.addEventListener('click', () => {
      switchView('walkthrough');
      if (walkthrough) {
        walkthrough.seek(0);
        walkthrough.play();
      }
    });
  }

  // 3D Exploded View Slider
  const explodedSlider = document.getElementById('explodedSlider');
  if (explodedSlider && bimViewer) {
    explodedSlider.addEventListener('input', (e) => {
      const factor = parseFloat(e.target.value) / 100;
      bimViewer.setExplodedSpread(factor);
    });
  }

  // 3D Level Isolation Pills
  const levelPills = document.querySelectorAll('.pill-lvl');
  levelPills.forEach(pill => {
    pill.addEventListener('click', () => {
      levelPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (bimViewer) bimViewer.isolateLevel(pill.dataset.lvl);
    });
  });

  // 3D Shader Viewport Mode Buttons
  const shaderModeBtns = document.querySelectorAll('.btn-shader-mode');
  shaderModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shaderModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (bimViewer) bimViewer.setViewMode(btn.dataset.shader);
    });
  });

  // 4D BIM Construction Phasing Slider & Automation
  const bim4dSlider = document.getElementById('bim4dTimelineSlider');
  const btnBim4dPlay = document.getElementById('btnBim4dPlay');
  let is4dPlaying = false;
  let anim4dTimer = null;

  if (bim4dSlider && bimViewer) {
    bim4dSlider.addEventListener('input', (e) => {
      bimViewer.setConstructionMonth(parseInt(e.target.value, 10));
    });
  }

  if (btnBim4dPlay && bimViewer && bim4dSlider) {
    btnBim4dPlay.addEventListener('click', () => {
      is4dPlaying = !is4dPlaying;
      btnBim4dPlay.textContent = is4dPlaying ? 'Pause 4D Phasing' : 'Play 4D Phasing';
      btnBim4dPlay.classList.toggle('active', is4dPlaying);

      if (is4dPlaying) {
        if (parseInt(bim4dSlider.value, 10) >= 24) bim4dSlider.value = 1;
        anim4dTimer = setInterval(() => {
          let cur = parseInt(bim4dSlider.value, 10) + 1;
          if (cur > 24) {
            cur = 24;
            is4dPlaying = false;
            clearInterval(anim4dTimer);
            btnBim4dPlay.textContent = 'Play 4D Phasing';
            btnBim4dPlay.classList.remove('active');
          }
          bim4dSlider.value = cur;
          bimViewer.setConstructionMonth(cur);
        }, 550);
      } else {
        clearInterval(anim4dTimer);
      }
    });
  }

  // 4D Milestone Quick Step Pills
  document.querySelectorAll('.pill-4d-milestone').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill-4d-milestone').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const m = parseInt(pill.dataset.month, 10);
      if (bim4dSlider) bim4dSlider.value = m;
      if (bimViewer) bimViewer.setConstructionMonth(m);
    });
  });

  // FPS First-Person Walkthrough Explorer Handlers
  const btnToggleFpsMode = document.getElementById('btnToggleFpsMode');
  const btnExitFps = document.getElementById('btnExitFps');
  if (btnToggleFpsMode && bimViewer) {
    btnToggleFpsMode.addEventListener('click', () => {
      const active = !bimViewer.isFpsMode;
      bimViewer.toggleFpsMode(active);
      btnToggleFpsMode.classList.toggle('active', active);
    });
  }
  if (btnExitFps && bimViewer) {
    btnExitFps.addEventListener('click', () => {
      bimViewer.toggleFpsMode(false);
      if (btnToggleFpsMode) btnToggleFpsMode.classList.remove('active');
    });
  }

  // FPS Teleport Location Buttons
  document.querySelectorAll('.btn-fps-spawn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-fps-spawn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (bimViewer) bimViewer.teleportFpsTo(btn.dataset.spawn);
    });
  });

  // Walkthrough Innovation Tour Selector Chips
  document.querySelectorAll('.btn-tour-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.btn-tour-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const tourKey = chip.dataset.tour;
      const selector = document.getElementById('wtTourSelector');
      if (selector) selector.value = tourKey;
      if (walkthrough) walkthrough.switchTour(tourKey);
    });
  });

  // 3D Layer Toggles
  const layerCheckboxes = [
    { id: 'layerArch', key: 'arch' },
    { id: 'layerStructure', key: 'structure' },
    { id: 'layerLouvers', key: 'louvers' },
    { id: 'layerLandscape', key: 'landscape' },
    { id: 'layerBasementEV', key: 'basementEV' },
    { id: 'layerMEP', key: 'mep' }
  ];

  layerCheckboxes.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el && bimViewer) {
      el.addEventListener('change', (e) => {
        bimViewer.setLayerVisibility(key, e.target.checked);
      });
    }
  });

  // Camera Presets
  const cameraPresets = document.querySelectorAll('.btn-preset');
  cameraPresets.forEach(preset => {
    preset.addEventListener('click', () => {
      if (preset.id === 'btnResetView') {
        if (bimViewer) bimViewer.setCameraPreset('axonometric');
        return;
      }
      cameraPresets.forEach(p => p.classList.remove('active'));
      preset.classList.add('active');
      if (bimViewer) bimViewer.setCameraPreset(preset.dataset.camera);
    });
  });

  // Sun Path Slider
  const sunSlider = document.getElementById('sunTimeSlider');
  if (sunSlider && bimViewer) {
    sunSlider.addEventListener('input', (e) => {
      bimViewer.setSunTime(parseFloat(e.target.value));
    });
  }

  // Sun Lighting Mode Buttons
  const sunModeBtns = document.querySelectorAll('.btn-sun-mode');
  sunModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'btnToggleShadows') {
        const isShadow = btn.textContent.includes('ON');
        btn.textContent = isShadow ? 'Shadows: OFF' : 'Shadows: ON';
        if (bimViewer) bimViewer.toggleShadows(!isShadow);
        return;
      }
      sunModeBtns.forEach(b => {
        if (b.id !== 'btnToggleShadows') b.classList.remove('active');
      });
      btn.classList.add('active');
      if (bimViewer) bimViewer.setLightingMode(btn.dataset.mode);
    });
  });

  // Fullscreen Button
  const fullscreenBtn = document.getElementById('btnFullscreenToggle');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.warn(err));
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Export Modal Handlers
  const quickExportBtn = document.getElementById('btnQuickExport');
  const exportModal = document.getElementById('exportModal');
  const closeModalBtn = document.getElementById('btnCloseModal');

  if (quickExportBtn && exportModal) {
    quickExportBtn.addEventListener('click', () => {
      exportModal.classList.remove('hidden');
    });
  }

  if (closeModalBtn && exportModal) {
    closeModalBtn.addEventListener('click', () => {
      exportModal.classList.add('hidden');
    });
  }

  if (exportModal) {
    exportModal.addEventListener('click', (e) => {
      if (e.target === exportModal) {
        exportModal.classList.add('hidden');
      }
    });
  }

  // Specs PDF Print trigger
  const exportSpecsBtn = document.getElementById('btnExportSpecsPdf');
  if (exportSpecsBtn) {
    exportSpecsBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// Immediate + Safe DOM check execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
