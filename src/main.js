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
  try {
    new InnovationsEngine(bimViewer);
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
        if (bimViewer) bimViewer.controls.setCameraPreset('axonometric');
        return;
      }
      cameraPresets.forEach(p => p.classList.remove('active'));
      preset.classList.add('active');
      if (bimViewer) bimViewer.controls.setCameraPreset(preset.dataset.camera);
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
