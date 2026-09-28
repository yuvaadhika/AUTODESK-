/**
 * AURA VERTICALIS — 5 GROUNDBREAKING ARCHITECTURAL & BIM INNOVATIONS MODULE
 * 
 * 1. Biomimetic AI Aerofoil Kinetic Facade (Real-Time Physics & Solar Tracking)
 * 2. 3D Convective Thermal Chimney & CFD Buoyancy Airflow Particle Simulator
 * 3. Digital Twin Embodied Carbon & Circular Material Passport (ISO 14040/44)
 * 4. Biophilic Acoustic & Circadian Neuro-Architecture Simulator (WELL v2 Platinum)
 * 5. AI Generative Parametric Apartment Synthesizer (Algorithmic SVG Floor Plan Morphing)
 */

export class InnovationsEngine {
  constructor(bimViewerInstance) {
    this.bimViewer = bimViewerInstance;
    this.currentFacadeMode = 'solar';
    this.ggbsPercentage = 40; // Default 40% GGBS Bio-Concrete
    this.circadianHour = 14;
    this.trafficNoiseDb = 75;

    this.generativeParams = {
      wfhWeight: 60,
      balconyDepth: 2.2,
      crossVentDirectivity: 85,
      acousticPrivacy: 70
    };

    this.initFacadeControls();
    this.initCfdControls();
    this.initCarbonPassport();
    this.initCircadianAcoustic();
    this.initGenerativeSynthesizer();
  }

  /* ==========================================================================
     INNOVATION 1: Biomimetic AI Kinetic Facade Controller
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

        // Update telemetry metrics based on mode
        if (this.currentFacadeMode === 'solar') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '42.5° (Solar Tracking)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.18 (Imperceptible Glare)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '-85% Peak Solar Heat Gain';
        } else if (this.currentFacadeMode === 'vortex') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '28.0° (Wind Funneling)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.22 (Low Glare)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '+38% Courtyard Fresh Air Influx';
        } else if (this.currentFacadeMode === 'storm') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '0.0° (Streamlined Drag Reduction)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.35 (Diffused)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '-46% Facade Wind Pressure Load';
        } else if (this.currentFacadeMode === 'night') {
          if (facadeAngleDisplay) facadeAngleDisplay.textContent = '85.0° (Sky Radiative Cooling)';
          if (facadeGlareDisplay) facadeGlareDisplay.textContent = 'DGP 0.00 (Zero Glare)';
          if (facadeThermalDisplay) facadeThermalDisplay.textContent = '-5.2°C Night Heat Radiative Dissipation';
        }
      });
    });
  }

  /* ==========================================================================
     INNOVATION 2: Convective Thermal Chimney CFD & Stack Particle Engine
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
        cfdToggleBtn.textContent = isActive ? 'CFD Airflow Particles: ACTIVE' : 'CFD Airflow Particles: PAUSED';
        if (this.bimViewer && this.bimViewer.toggleCfdParticles) {
          this.bimViewer.toggleCfdParticles(isActive);
        }
      });
    }

    if (damperSlider) {
      damperSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        if (damperVal) damperVal.textContent = `${pct}% Open`;

        // Calculate dynamic stack ventilation telemetry
        const calculatedAch = (1.5 + (pct / 100) * 3.8).toFixed(1);
        const calculatedTempDrop = (1.2 + (pct / 100) * 3.6).toFixed(1);
        const calculatedVelocity = (0.8 + (pct / 100) * 2.6).toFixed(1);

        if (achVal) achVal.textContent = `${calculatedAch} ACH (Passive Zero-Fan)`;
        if (tempDropVal) tempDropVal.textContent = `-${calculatedTempDrop}°C Core Cooling`;

        const velEl = document.getElementById('chimneyVelocityVal');
        if (velEl) velEl.textContent = `${calculatedVelocity} m/s Stack Velocity`;

        if (this.bimViewer && this.bimViewer.setCfdFlowSpeed) {
          this.bimViewer.setCfdFlowSpeed(pct / 100);
        }
      });
    }
  }

  /* ==========================================================================
     INNOVATION 3: Embodied Carbon Heatmap & Circular Material Passport
     ========================================================================== */
  initCarbonPassport() {
    const ggbsSlider = document.getElementById('ggbsSlider');
    const ggbsVal = document.getElementById('ggbsVal');
    const carbonBudgetVal = document.getElementById('carbonBudgetVal');
    const co2SavedTotal = document.getElementById('co2SavedTotal');
    const carbonPayback = document.getElementById('carbonPaybackVal');

    const updateCarbonMetrics = (pct) => {
      this.ggbsPercentage = pct;
      if (ggbsVal) ggbsVal.textContent = `${pct}% GGBS Bio-Slag Replacement`;

      // Baseline OPC concrete = 520 kgCO2e/m²; 60% GGBS reduces down to 260 kgCO2e/m²
      const embodiedIntensity = Math.round(520 - (pct / 100) * 260);
      const totalTonsSaved = Math.round((pct / 100) * 2700);
      const paybackYears = (4.8 - (pct / 100) * 2.8).toFixed(1);

      if (carbonBudgetVal) carbonBudgetVal.textContent = `${embodiedIntensity} kgCO₂e/m² (-${Math.round((520 - embodiedIntensity) / 5.2)}%)`;
      if (co2SavedTotal) co2SavedTotal.textContent = `${totalTonsSaved.toLocaleString()} Metric Tons CO₂`;
      if (carbonPayback) carbonPayback.textContent = `${paybackYears} Years Net-Zero Offset`;
    };

    if (ggbsSlider) {
      ggbsSlider.addEventListener('input', (e) => {
        updateCarbonMetrics(parseInt(e.target.value, 10));
      });
      updateCarbonMetrics(40);
    }

    // Material Passport Selector Cards
    const passportPills = document.querySelectorAll('.passport-pill');
    const passportDisplay = document.getElementById('passportCardDisplay');

    const materialPassports = {
      concrete: {
        title: "Eco-Engineered M40 RCC Structure (GGBS 40% Blend)",
        eui: "185 kgCO₂e/m³",
        circularity: "94% Recyclable Aggregate at End of Life",
        disassembly: "Modular Precast Elements with Bolted Dry Connections",
        origin: "Local Slag By-Product (Within 45 km radius)",
        standard: "ISO 14040/44 LCA Certified • EPD Verified"
      },
      glazing: {
        title: "Low-E Double Glazed Unit (6-12-6 Argon Infilled)",
        eui: "42 kgCO₂e/m²",
        circularity: "100% Closed-Loop Recyclable Glass & Aluminium Frame",
        disassembly: "Pressure Plate Clamping for Tool-Free Pane Replacement",
        origin: "Architectural Low-Iron Glass with Magnetron Sputter Coating",
        standard: "Cradle to Cradle Certified (Silver Level)"
      },
      timber: {
        title: "Thermally Modified FSC Hardwood Decking & Skybridges",
        eui: "-110 kgCO₂e/m³ (Carbon Sink Net Negative)",
        circularity: "100% Biodegradable & Reusable Structural Timbers",
        disassembly: "Hidden Stainless Clip Fixings without Chemical Adhesives",
        origin: "FSC-Certified Sustainably Managed Plantation Forestry",
        standard: "PEFC & FSC Chain of Custody Standard"
      },
      bipv: {
        title: "Bifacial Monocrystalline Solar PV Pergola Glass (450W)",
        eui: "28 kgCO₂e/panel (Embodied) vs -185 MWh/yr (Generated Clean Energy)",
        circularity: "88% Silicon & Silver Recovery via Dedicated E-Waste Protocol",
        disassembly: "Slide-in Modular Channel Track System",
        origin: "High-Efficiency N-Type TOPCon Solar Cells",
        standard: "IEC 61215 / IEC 61730 International Quality Standard"
      }
    };

    passportPills.forEach(pill => {
      pill.addEventListener('click', () => {
        passportPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const key = pill.dataset.passport;
        const mat = materialPassports[key];
        if (mat && passportDisplay) {
          passportDisplay.innerHTML = `
            <div class="passport-header">
              <span class="passport-qr">📱 [QR PASSPORT VERIFIED]</span>
              <h4>${mat.title}</h4>
            </div>
            <div class="passport-grid">
              <div class="passport-item">
                <span class="p-label">Embodied Carbon</span>
                <span class="p-val highlight-green">${mat.eui}</span>
              </div>
              <div class="passport-item">
                <span class="p-label">Circularity Index</span>
                <span class="p-val">${mat.circularity}</span>
              </div>
              <div class="passport-item">
                <span class="p-label">Disassembly Method</span>
                <span class="p-val">${mat.disassembly}</span>
              </div>
              <div class="passport-item">
                <span class="p-label">Supply Chain & Origin</span>
                <span class="p-val">${mat.origin}</span>
              </div>
              <div class="passport-item full-width">
                <span class="p-label">Compliance Standard</span>
                <span class="p-val">${mat.standard}</span>
              </div>
            </div>
          `;
        }
      });
    });
  }

  /* ==========================================================================
     INNOVATION 4: Biophilic Acoustic & Circadian Neuro-Architecture
     ========================================================================== */
  initCircadianAcoustic() {
    const circadianSlider = document.getElementById('circadianHourSlider');
    const circadianTimeLabel = document.getElementById('circadianTimeLabel');
    const cctVal = document.getElementById('circadianCctVal');
    const melanopicVal = document.getElementById('melanopicLuxVal');
    const cortisolVal = document.getElementById('cortisolScoreVal');

    const noiseSlider = document.getElementById('trafficNoiseSlider');
    const noiseInputVal = document.getElementById('trafficNoiseVal');
    const courtyardNoiseVal = document.getElementById('courtyardNoiseVal');
    const acousticDampeningVal = document.getElementById('acousticDampeningVal');

    if (circadianSlider) {
      circadianSlider.addEventListener('input', (e) => {
        const hour = parseFloat(e.target.value);
        this.circadianHour = hour;

        const hStr = Math.floor(hour).toString().padStart(2, '0');
        const mStr = (hour % 1 === 0.5) ? '30' : '00';
        if (circadianTimeLabel) circadianTimeLabel.textContent = `${hStr}:${mStr}`;

        // Circadian CCT & Melanopic Stimulus curve
        let cct = 4000;
        let melanopic = 180;
        let cortisolDrop = 28;

        if (hour >= 6 && hour < 9) {
          cct = Math.round(2700 + (hour - 6) * 700);
          melanopic = Math.round(80 + (hour - 6) * 60);
          cortisolDrop = 22;
        } else if (hour >= 9 && hour <= 15) {
          cct = 6500;
          melanopic = 320;
          cortisolDrop = 36;
        } else if (hour > 15 && hour <= 19) {
          cct = Math.round(6500 - (hour - 15) * 1050);
          melanopic = Math.round(320 - (hour - 15) * 65);
          cortisolDrop = 34;
        } else {
          cct = 2200;
          melanopic = 35;
          cortisolDrop = 42;
        }

        if (cctVal) cctVal.textContent = `${cct}K (Correlated Color Temp)`;
        if (melanopicVal) melanopicVal.textContent = `${melanopic} Melanopic EDI (WELL Stimulus)`;
        if (cortisolVal) cortisolVal.textContent = `-${cortisolDrop}% Cortisol Stress Index`;
      });
    }

    if (noiseSlider) {
      noiseSlider.addEventListener('input', (e) => {
        const noise = parseInt(e.target.value, 10);
        this.trafficNoiseDb = noise;
        if (noiseInputVal) noiseInputVal.textContent = `${noise} dB (Street Traffic Noise)`;

        // Green walls & water cascade provide -37 dB acoustic attenuation
        const dampening = 37;
        const courtDb = Math.max(32, noise - dampening);

        if (courtyardNoiseVal) courtyardNoiseVal.textContent = `${courtDb} dB (Acoustic Sanctuary)`;
        if (acousticDampeningVal) acousticDampeningVal.textContent = `-${dampening} dB Green Bio-Barrier Buffer`;
      });
    }
  }

  /* ==========================================================================
     INNOVATION 5: AI Generative Parametric Apartment Synthesizer
     ========================================================================== */
  initGenerativeSynthesizer() {
    const wfhSlider = document.getElementById('genWfhSlider');
    const balconySlider = document.getElementById('genBalconySlider');
    const ventSlider = document.getElementById('genVentSlider');
    const svgContainer = document.getElementById('genSvgPreview');

    const genCarpetVal = document.getElementById('genCarpetVal');
    const genSdaVal = document.getElementById('genSdaVal');
    const genAchVal = document.getElementById('genAchVal');
    const genEffVal = document.getElementById('genEffVal');

    const synthesizeLayout = () => {
      const wfh = parseInt(wfhSlider?.value || 60, 10);
      const balc = parseFloat(balconySlider?.value || 2.2);
      const vent = parseInt(ventSlider?.value || 85, 10);

      // Algorithmic dimensions calculation
      const baseArea = 92.0; // 2BHK standard carpet
      const wfhBonus = (wfh / 100) * 14.5;
      const balconyArea = (balc * 6.2).toFixed(1);
      const totalCarpet = (baseArea + wfhBonus).toFixed(1);
      const sdaRating = (78 + (balc / 3.0) * 14).toFixed(1);
      const crossVentRating = (3.2 + (vent / 100) * 2.4).toFixed(1);
      const spatialEfficiency = (88 + (wfh / 100) * 6).toFixed(1);

      if (genCarpetVal) genCarpetVal.textContent = `${totalCarpet} m² (Balcony ${balconyArea} m²)`;
      if (genSdaVal) genSdaVal.textContent = `${sdaRating}% Spatial Daylight Autonomy`;
      if (genAchVal) genAchVal.textContent = `${crossVentRating} ACH Natural Flow`;
      if (genEffVal) genEffVal.textContent = `${spatialEfficiency}% Usable Spatial Ratio`;

      // Morph dynamic SVG Floor Plan layout
      if (svgContainer) {
        const balcVisualHeight = Math.round(balc * 35);
        const wfhVisualWidth = Math.round(140 + (wfh / 100) * 80);

        svgContainer.innerHTML = `
          <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="genGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="800" height="480" fill="url(#genGrid)" />

            <!-- Boundary Walls -->
            <rect x="60" y="50" width="680" height="340" fill="#ffffff" stroke="#1e3a8a" stroke-width="4" rx="4"/>

            <!-- Cantilever Balcony (Morphing Depth) -->
            <rect x="60" y="${50 - balcVisualHeight}" width="680" height="${balcVisualHeight}" fill="#ecfdf5" stroke="#10b981" stroke-width="2" stroke-dasharray="4"/>
            <text x="400" y="${50 - balcVisualHeight / 2 + 5}" text-anchor="middle" font-size="12" font-weight="bold" fill="#047857">DEEP BIOPHILIC BALCONY & SKY PLANTER (${balc}m / ${balconyArea} m²)</text>

            <!-- Living / Dining Lounge -->
            <rect x="70" y="60" width="${660 - wfhVisualWidth}" height="200" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
            <text x="${70 + (660 - wfhVisualWidth) / 2}" y="150" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">LIVING & BIOPHILIC DINING LOUNGE</text>
            <text x="${70 + (660 - wfhVisualWidth) / 2}" y="175" text-anchor="middle" font-size="11" fill="#64748b">Direct Daylight & Stack Air Intake (${sdaRating}% sDA)</text>

            <!-- Algorithmic Morphing WFH Work Studio -->
            <rect x="${730 - wfhVisualWidth}" y="60" width="${wfhVisualWidth - 10}" height="200" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
            <text x="${730 - wfhVisualWidth / 2}" y="145" text-anchor="middle" font-size="12" font-weight="bold" fill="#1d4ed8">AI SYNTHESIZED</text>
            <text x="${730 - wfhVisualWidth / 2}" y="165" text-anchor="middle" font-size="12" font-weight="bold" fill="#1d4ed8">WFH FOCUS POD</text>
            <text x="${730 - wfhVisualWidth / 2}" y="185" text-anchor="middle" font-size="10" fill="#3b82f6">${wfhBonus.toFixed(1)} m² Flex Space</text>

            <!-- Master Suite Bedroom -->
            <rect x="70" y="270" width="340" height="110" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
            <text x="240" y="325" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">MASTER SUITE (18.5 m²)</text>
            <text x="240" y="345" text-anchor="middle" font-size="10" fill="#64748b">Cross-Ventilation Vector (IS 456 Compliant)</text>

            <!-- Guest / Secondary Bedroom -->
            <rect x="420" y="270" width="310" height="110" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
            <text x="575" y="325" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">BEDROOM 2 (14.2 m²)</text>

            <!-- Cross-ventilation airflow vectors -->
            <path d="M 120 40 Q 250 140 380 40" fill="none" stroke="#0284c7" stroke-width="3" stroke-dasharray="6" marker-end="url(#arrow)"/>
            <path d="M 450 40 Q 580 140 700 40" fill="none" stroke="#0284c7" stroke-width="3" stroke-dasharray="6"/>
          </svg>
        `;
      }
    };

    [wfhSlider, balconySlider, ventSlider].forEach(sl => {
      if (sl) sl.addEventListener('input', synthesizeLayout);
    });

    // Initial synthesis
    synthesizeLayout();
  }
}
