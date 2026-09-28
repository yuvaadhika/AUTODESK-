/**
 * AURA VERTICALIS — 5 CORE ARCHITECTURAL & BIM INNOVATIONS MODULE
 * 
 * 1. Climate-Responsive Modular Façade System (Parametric Solar & Wind Shading)
 * 2. Convective Thermal Chimney & CFD Stack Ventilation (Open-to-Sky Courtyard)
 * 3. Digital BIM Model & Circular Material Passports (ISO 14040/44 EPDs & GGBS Slag)
 * 4. Biophilic Acoustic & Circadian Architecture (WELL v2 Platinum & -37 dB Buffer)
 * 5. Parametric Unit Configuration & Modular Space Planning Engine
 */

export class InnovationsEngine {
  constructor(bimViewerInstance) {
    this.bimViewer = bimViewerInstance;
    this.currentFacadeMode = 'solar';
    this.ggbsPercentage = 40;
    this.circadianHour = 14;

    this.initFacadeControls();
    this.initCfdControls();
    this.initCarbonPassport();
    this.initCircadianAcoustic();
    this.initGenerativeSynthesizer();
  }

  /* ==========================================================================
     INNOVATION 1: Climate-Responsive Modular Façade System
     ========================================================================== */
  initFacadeControls() {
    const facadeModeBtns = document.querySelectorAll('.btn-facade-mode');
    const facadeAngleDisplay = document.getElementById('facadeAngleVal');
    const facadeGlareDisplay = document.getElementById('facadeGlareVal');
    const facadeThermalDisplay = document.getElementById('facadeThermalVal');

    facadeModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        facadeModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFacadeMode = btn.dataset.facadeMode;

        if (this.bimViewer && this.bimViewer.setFacadeKineticMode) {
          this.bimViewer.setFacadeKineticMode(this.currentFacadeMode);
        }

        if (this.currentFacadeMode === 'solar') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '42.5° (Solar Shading Mode)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.18 (Imperceptible Glare)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '-85% Peak Direct Solar Gain';
        } else if (this.currentFacadeMode === 'vortex') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '28.0° (Wind Scoop Catching)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.22 (Comfort Glare Index)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '+38% Courtyard Fresh Air Induction';
        } else if (this.currentFacadeMode === 'storm') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '0.0° (Flush Aerodynamic Storm)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.35 (Diffused Light)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '-46% Facade Wind Pressure';
        } else if (this.currentFacadeMode === 'night') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '85.0° (Night Convective Ventilation)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.00 (Zero Glare)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '-5.2°C Structural Nocturnal Cooling';
        }
      });
    });
  }

  /* ==========================================================================
     INNOVATION 2: Convective Thermal Chimney & CFD Stack Ventilation
     ========================================================================== */
  initCfdControls() {
    const cfdToggleBtn = document.getElementById('btnToggleCfdParticles');
    const damperSlider = document.getElementById('chimneyDamperSlider');
    const damperVal = document.getElementById('chimneyDamperVal');
    const achVal = document.getElementById('chimneyAchVal');
    const tempDropVal = document.getElementById('chimneyTempDropVal');

    if (cfdToggleBtn) {
      cfdToggleBtn.addEventListener('click', () => {
        const isActive = cfdToggleBtn.classList.toggle('active');
        cfdToggleBtn.textContent = isActive ? 'CFD Stack Particles: ACTIVE' : 'CFD Stack Particles: PAUSED';
        if (this.bimViewer && this.bimViewer.toggleCfdParticles) {
          this.bimViewer.toggleCfdParticles(isActive);
        }
      });
    }

    if (damperSlider) {
      damperSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        if (damperVal) damperVal.textContent = `${pct}% Open`;

        const calculatedAch = (1.5 + (pct / 100) * 3.8).toFixed(1);
        const calculatedTempDrop = (1.2 + (pct / 100) * 3.6).toFixed(1);

        if (achVal) achVal.textContent = `${calculatedAch} ACH (Target Passive Airflow)`;
        if (tempDropVal) tempDropVal.textContent = `-${calculatedTempDrop}°C Courtyard Microclimate`;

        if (this.bimViewer && this.bimViewer.setCfdFlowSpeed) {
          this.bimViewer.setCfdFlowSpeed(pct / 100);
        }
      });
    }
  }

  /* ==========================================================================
     INNOVATION 3: Digital BIM Model & Circular Material Passports
     ========================================================================== */
  initCarbonPassport() {
    const ggbsSlider = document.getElementById('ggbsSlider');
    const ggbsVal = document.getElementById('ggbsVal');
    const carbonBudgetVal = document.getElementById('carbonBudgetVal');
    const co2SavedTotal = document.getElementById('co2SavedTotal');
    const carbonPayback = document.getElementById('carbonPaybackVal');

    const updateCarbonMetrics = (pct) => {
      this.ggbsPercentage = pct;
      if (ggbsVal) ggbsVal.textContent = `${pct}% GGBS Slag Blend`;

      const embodiedIntensity = Math.round(520 - (pct / 100) * 260);
      const totalTonsSaved = Math.round((pct / 100) * 2700);
      const paybackYears = (4.8 - (pct / 100) * 2.8).toFixed(1);

      if (carbonBudgetVal) carbonBudgetVal.textContent = `${embodiedIntensity} kgCO₂e/m² (-${Math.round((520 - embodiedIntensity) / 5.2)}%)`;
      if (co2SavedTotal) co2SavedTotal.textContent = `${totalTonsSaved.toLocaleString()} Metric Tons CO₂`;
      if (carbonPayback) carbonPayback.textContent = `${paybackYears} Years Carbon Offset`;
    };

    if (ggbsSlider) {
      ggbsSlider.addEventListener('input', (e) => {
        updateCarbonMetrics(parseInt(e.target.value, 10));
      });
      updateCarbonMetrics(40);
    }
  }

  /* ==========================================================================
     INNOVATION 4: Biophilic Acoustic & Circadian Architecture
     ========================================================================== */
  initCircadianAcoustic() {
    const circadianSlider = document.getElementById('circadianHourSlider');
    const circadianTimeDisplay = document.getElementById('circadianTimeDisplay');
    const melanopicVal = document.getElementById('melanopicLuxVal');
    const interiorNoiseVal = document.getElementById('interiorNoiseVal');

    if (circadianSlider) {
      circadianSlider.addEventListener('input', (e) => {
        const hour = parseFloat(e.target.value);
        this.circadianHour = hour;

        const hStr = Math.floor(hour).toString().padStart(2, '0');
        const mStr = (hour % 1 === 0.5) ? '30' : '00';
        
        let cctDesc = '6500K Sky White';
        let melanopic = 480;
        let noiseLevel = 38;

        if (hour < 7 || hour > 19) {
          cctDesc = '2700K Warm Amber';
          melanopic = 65;
          noiseLevel = 32;
        } else if (hour >= 7 && hour < 10) {
          cctDesc = '4000K Neutral Morning';
          melanopic = 240;
          noiseLevel = 42;
        } else if (hour >= 10 && hour <= 16) {
          cctDesc = '6500K Sky White';
          melanopic = 480;
          noiseLevel = 38;
        } else {
          cctDesc = '3000K Soft Sunset';
          melanopic = 140;
          noiseLevel = 35;
        }

        if (circadianTimeDisplay) circadianTimeDisplay.textContent = `${hStr}:${mStr} (${cctDesc})`;
        if (melanopicVal) melanopicVal.textContent = `${melanopic} EML (WELL Target)`;
        if (interiorNoiseVal) interiorNoiseVal.textContent = `${noiseLevel} dB (Tranquil Interior)`;
      });
    }
  }

  /* ==========================================================================
     INNOVATION 5: Parametric Unit Configuration & Modular Space Planning Engine
     ========================================================================== */
  initGenerativeSynthesizer() {
    const wfhSlider = document.getElementById('wfhWeightSlider');
    const wfhVal = document.getElementById('wfhWeightVal');
    const unitTypeVal = document.getElementById('genUnitTypeVal');
    const areaVal = document.getElementById('genAreaVal');

    if (wfhSlider) {
      wfhSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        if (wfhVal) wfhVal.textContent = `${pct}% WFH Flexibility`;

        let unitType = '2BHK Deluxe Suite (92 m²)';
        let area = 92.0;
        let efficiency = 91.2;

        if (pct < 30) {
          unitType = '1BHK Studio Suite (55 m²)';
          area = 55.0;
          efficiency = 88.5;
        } else if (pct >= 30 && pct <= 70) {
          unitType = '2BHK Deluxe Suite (92 m²)';
          area = 92.0;
          efficiency = 91.2;
        } else {
          unitType = '3BHK Corner Penthouse (145 m²)';
          area = 145.0;
          efficiency = 94.0;
        }

        if (unitTypeVal) unitTypeVal.textContent = unitType;
        if (areaVal) areaVal.textContent = `${area} m² (Efficiency ${efficiency}%)`;
      });
    }
  }
}
