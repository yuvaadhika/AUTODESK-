import * as THREE from 'three';

/**
 * Self-Contained High-Performance Damped Orbit Controls
 */
class SmoothOrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new THREE.Vector3(0, 16, 0);
    this.distance = 72;
    this.phi = Math.PI / 3.2;
    this.theta = Math.PI / 4;
    this.minDistance = 6;
    this.maxDistance = 220;
    this.minPolarAngle = 0.05;
    this.maxPolarAngle = Math.PI / 2 - 0.02;
    this.autoRotate = false;
    this.autoRotateSpeed = 0.6;
    this.dampingFactor = 0.1;

    this.currentTheta = this.theta;
    this.currentPhi = this.phi;
    this.currentDistance = this.distance;
    this.currentTarget = this.target.clone();

    this.isDragging = false;
    this.isPanning = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.enabled = true;

    this.initEvents();
    this.updateCamera();
  }

  initEvents() {
    if (!this.domElement) return;

    this.domElement.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      if (e.button === 0) this.isDragging = true;
      if (e.button === 2 || e.shiftKey) this.isPanning = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.enabled || (!this.isDragging && !this.isPanning)) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      if (this.isPanning) {
        const panSpeed = 0.035 * (this.distance / 50);
        const forward = new THREE.Vector3().subVectors(this.target, this.camera.position).normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        const up = new THREE.Vector3().crossVectors(right, forward).normalize();

        this.target.addScaledVector(right, -deltaX * panSpeed);
        this.target.addScaledVector(up, deltaY * panSpeed);
      } else if (this.isDragging) {
        this.theta -= deltaX * 0.007;
        this.phi -= deltaY * 0.007;
        this.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.phi));
      }

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
      this.isPanning = false;
    });

    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    this.domElement.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      const zoomFactor = 1 + (e.deltaY > 0 ? 0.08 : -0.08);
      this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance * zoomFactor));
    }, { passive: false });

    // Touch Support
    let initialTouchDistance = 0;
    this.domElement.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        initialTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    this.domElement.addEventListener('touchmove', (e) => {
      if (!this.enabled) return;
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        this.theta -= deltaX * 0.008;
        this.phi -= deltaY * 0.008;
        this.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.phi));
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = initialTouchDistance / (dist || 1);
        this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance * factor));
        initialTouchDistance = dist;
      }
    });

    this.domElement.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  updateCamera() {
    const x = this.currentTarget.x + this.currentDistance * Math.sin(this.currentPhi) * Math.sin(this.currentTheta);
    const y = this.currentTarget.y + this.currentDistance * Math.cos(this.currentPhi);
    const z = this.currentTarget.z + this.currentDistance * Math.sin(this.currentPhi) * Math.cos(this.currentTheta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.currentTarget);
  }

  setCameraPreset(preset) {
    switch (preset) {
      case 'axonometric':
        this.target.set(0, 16, 0);
        this.distance = 72;
        this.phi = Math.PI / 3.4;
        this.theta = Math.PI / 4;
        break;
      case 'front':
        this.target.set(0, 16, 0);
        this.distance = 64;
        this.phi = Math.PI / 2.05;
        this.theta = 0;
        break;
      case 'courtyard':
        this.target.set(0, 14, 0);
        this.distance = 28;
        this.phi = Math.PI / 2.6;
        this.theta = Math.PI / 3.5;
        break;
      case 'podium':
        this.target.set(0, 4, 0);
        this.distance = 36;
        this.phi = Math.PI / 2.3;
        this.theta = Math.PI / 6;
        break;
      case 'residential':
        this.target.set(0, 22, 0);
        this.distance = 42;
        this.phi = Math.PI / 2.5;
        this.theta = -Math.PI / 4;
        break;
      case 'basement':
        this.target.set(0, -2.5, 0);
        this.distance = 38;
        this.phi = Math.PI / 3.2;
        this.theta = Math.PI / 4;
        break;
      case 'roof':
        this.target.set(0, 31, 0);
        this.distance = 46;
        this.phi = Math.PI / 5;
        this.theta = Math.PI / 4;
        break;
      case 'fps_courtyard':
        this.target.set(0, 1.7, 10);
        this.distance = 12;
        this.phi = Math.PI / 2.1;
        this.theta = 0;
        break;
    }
  }

  update() {
    if (!this.enabled) return;
    if (this.autoRotate && !this.isDragging) {
      this.theta += 0.003 * this.autoRotateSpeed;
    }
    this.currentTheta += (this.theta - this.currentTheta) * this.dampingFactor;
    this.currentPhi += (this.phi - this.currentPhi) * this.dampingFactor;
    this.currentDistance += (this.distance - this.currentDistance) * this.dampingFactor;
    this.currentTarget.lerp(this.target, this.dampingFactor);
    this.updateCamera();
  }
}

/**
 * Procedural B+G+9 Mixed-Use BIM Model Builder
 */
function buildFullBimBuilding(containerGroup, interactiveList = null, kineticLouversList = null) {
  const levelGroups = {
    B1: new THREE.Group(),
    G: new THREE.Group(),
    L1: new THREE.Group(),
    L2: new THREE.Group(),
    L3: new THREE.Group(),
    L4: new THREE.Group(),
    L5: new THREE.Group(),
    L6: new THREE.Group(),
    L7: new THREE.Group(),
    L8: new THREE.Group(),
    L9: new THREE.Group(),
    RF: new THREE.Group()
  };

  Object.values(levelGroups).forEach(grp => containerGroup.add(grp));

  // High-Contrast Architectural Materials Palette
  const concreteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.55, metalness: 0.1 });
  const slabMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.65, metalness: 0.05 });
  const slabEdgeMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.3 });
  const columnMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5, metalness: 0.25 });
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.65, metalness: 0.2 });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.42,
    roughness: 0.1,
    metalness: 0.2,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.7 });
  const woodDeckMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5, metalness: 0.15 });
  const vegetationMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.75, metalness: 0.05 });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.7 });
  const solarPvMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.2, metalness: 0.9 });
  const evChargerMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35, metalness: 0.4 });
  const louverMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.6 });
  const railingMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 });

  const buildingW = 40; // 40,000 mm outer width
  const buildingD = 30; // 30,000 mm outer depth
  const courtW = 16;    // 16,000 mm courtyard width
  const courtD = 14;    // 14,000 mm courtyard depth

  function registerInteractive(obj, data) {
    obj.userData = data;
    obj.userData.originalMat = obj.material;
    if (interactiveList) interactiveList.push(obj);
  }

  function createRing(outerW, outerD, innerW, innerD, thickness, mat) {
    const grp = new THREE.Group();
    const nD = (outerD - innerD) / 2;
    const sD = (outerD - innerD) / 2;
    const eW = (outerW - innerW) / 2;
    const wW = (outerW - innerW) / 2;

    const northSlab = new THREE.Mesh(new THREE.BoxGeometry(outerW, thickness, nD), mat);
    northSlab.position.set(0, thickness / 2, (outerD + innerD) / 4);
    northSlab.receiveShadow = true;
    northSlab.castShadow = true;
    grp.add(northSlab);

    const southSlab = new THREE.Mesh(new THREE.BoxGeometry(outerW, thickness, sD), mat);
    southSlab.position.set(0, thickness / 2, -(outerD + innerD) / 4);
    southSlab.receiveShadow = true;
    southSlab.castShadow = true;
    grp.add(southSlab);

    const eastSlab = new THREE.Mesh(new THREE.BoxGeometry(eW, thickness, innerD), mat);
    eastSlab.position.set((outerW + innerW) / 4, thickness / 2, 0);
    eastSlab.receiveShadow = true;
    eastSlab.castShadow = true;
    grp.add(eastSlab);

    const westSlab = new THREE.Mesh(new THREE.BoxGeometry(wW, thickness, innerD), mat);
    westSlab.position.set(-(outerW + innerW) / 4, thickness / 2, 0);
    westSlab.receiveShadow = true;
    westSlab.castShadow = true;
    grp.add(westSlab);

    // Dark crisp slab edge perimeter border
    const edgeThickness = 0.08;
    const sEdge = new THREE.Mesh(new THREE.BoxGeometry(outerW + 0.2, thickness, edgeThickness), slabEdgeMat);
    sEdge.position.set(0, thickness / 2, outerD / 2);
    grp.add(sEdge);

    const nEdge = new THREE.Mesh(new THREE.BoxGeometry(outerW + 0.2, thickness, edgeThickness), slabEdgeMat);
    nEdge.position.set(0, thickness / 2, -outerD / 2);
    grp.add(nEdge);

    const eEdge = new THREE.Mesh(new THREE.BoxGeometry(edgeThickness, thickness, outerD + 0.2), slabEdgeMat);
    eEdge.position.set(outerW / 2, thickness / 2, 0);
    grp.add(eEdge);

    const wEdge = new THREE.Mesh(new THREE.BoxGeometry(edgeThickness, thickness, outerD + 0.2), slabEdgeMat);
    wEdge.position.set(-outerW / 2, thickness / 2, 0);
    grp.add(wEdge);

    return grp;
  }

  function createGlassArcade(grp, outerW, outerD, innerW, innerD, h) {
    // Outer Curtain Wall Glazing
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, h * 0.9, 0.08), glassMat);
    southGlass.position.set(0, h * 0.5, outerD / 2);
    registerInteractive(southGlass, {
      name: 'Double Glazed Curtain Wall Facade',
      category: 'Architectural Glazing Envelope',
      dim: `${outerW * 1000} × ${Math.round(h * 1000)} mm`,
      area: `${outerW * h} m²`,
      family: 'System Family: Curtain Wall LowE_Double_Glazed',
      env: 'SHGC 0.22, U-value 1.40 W/m²K, 64% VLT Daylight Autonomy',
      mat: '6mm Low-E Glass + 12mm Argon Space + 6mm Clear Float Glass',
      carbon: '62 kg CO₂e/m² (Recycled Frame + Double Glazing)',
      seismic: 'IS 1893 / IS 875 Wind Pressure Resistance (1.85 kPa)',
      fire: '2-Hour Integrity & Insulation (IS 1642 Standard)'
    });
    grp.add(southGlass);

    const northGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, h * 0.9, 0.08), glassMat);
    northGlass.position.set(0, h * 0.5, -outerD / 2);
    grp.add(northGlass);

    const eastGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, h * 0.9, outerD), glassMat);
    eastGlass.position.set(outerW / 2, h * 0.5, 0);
    grp.add(eastGlass);

    const westGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, h * 0.9, outerD), glassMat);
    westGlass.position.set(-outerW / 2, h * 0.5, 0);
    grp.add(westGlass);

    // Architectural Vertical Mullions every 4m
    for (let x = -outerW / 2; x <= outerW / 2; x += 4) {
      const mullionS = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 0.15), frameMat);
      mullionS.position.set(x, h / 2, outerD / 2 + 0.04);
      grp.add(mullionS);

      const mullionN = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 0.15), frameMat);
      mullionN.position.set(x, h / 2, -outerD / 2 - 0.04);
      grp.add(mullionN);
    }

    // Courtyard Inner Glazing
    const courtGlassS = new THREE.Mesh(new THREE.BoxGeometry(innerW, h * 0.85, 0.06), glassMat);
    courtGlassS.position.set(0, h * 0.5, innerD / 2);
    grp.add(courtGlassS);

    const courtGlassN = new THREE.Mesh(new THREE.BoxGeometry(innerW, h * 0.85, 0.06), glassMat);
    courtGlassN.position.set(0, h * 0.5, -innerD / 2);
    grp.add(courtGlassN);

    // Columns on 8m modular grid
    for (let x = -16; x <= 16; x += 8) {
      for (let z = -12; z <= 12; z += 8) {
        if (Math.abs(x) < innerW / 2 && Math.abs(z) < innerD / 2) continue;
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.7, h, 0.7), columnMat);
        col.position.set(x, h / 2, z);
        col.castShadow = true;
        col.receiveShadow = true;
        registerInteractive(col, {
          name: `RCC Structural Column C${Math.round(x + 20)}_${Math.round(z + 20)}`,
          category: 'RCC Structural Skeleton',
          dim: '700 mm × 700 mm',
          area: '0.49 m² Sectional Area',
          family: 'M_Concrete-Column-Rectangular-IS13920',
          env: '40% GGBS Pozzolanic Low-Carbon Binder Mix',
          mat: 'M40 Self-Compacting Concrete + Fe550D TMT Reinforcement',
          carbon: '242 kg CO₂e/m³ (-44% reduction vs OPC standard)',
          seismic: 'IS 13920:2016 Ductile Detailing (135° Hook Ties @ 100mm c/c)',
          fire: '4-Hour Fire Resistance (IS 1642 Standard)'
        });
        grp.add(col);
      }
    }
  }

  // ==================== LEVEL B1: BASEMENT EV PARKING ====================
  const grpB1 = levelGroups.B1;
  grpB1.userData = { name: 'Level B1: Basement EV Charging & Parking', baseElevation: -3.5, phaseMonth: 3 };
  grpB1.position.y = -3.5;

  const b1Slab = new THREE.Mesh(new THREE.BoxGeometry(buildingW, 0.5, buildingD), concreteMat);
  b1Slab.position.y = -0.25;
  b1Slab.receiveShadow = true;
  grpB1.add(b1Slab);

  for (let x = -16; x <= 16; x += 8) {
    for (let z = -12; z <= 12; z += 8) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3.2, 0.7), columnMat);
      col.position.set(x, 1.6, z);
      grpB1.add(col);
    }
  }

  // 24 EV Charging Stations
  for (let i = -14; i <= 14; i += 4) {
    const charger = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 0.4), evChargerMat);
    charger.position.set(i, 0.7, -13);
    registerInteractive(charger, {
      name: 'Level-2 22kW Fast EV Charger Bay',
      category: 'Smart Renewable EV Infrastructure',
      dim: '400 mm × 400 mm × 1400 mm',
      area: 'Dedicated Fast Charging Bay',
      family: 'EV_FastCharger_DualPort_22kW',
      env: 'Direct Solar PV Microgrid Coupled • Smart Dynamic Load Balancing',
      mat: 'Recycled Aluminum Enclosure + Type 2 Fast Connector',
      carbon: 'Net Zero Operational Carbon via Rooftop BIPV',
      seismic: 'Secured Anchorage to Basement Raft Slab',
      fire: 'Automatic Aerosol Fire Suppression Integrated'
    });
    grpB1.add(charger);
  }

  // ==================== GROUND FLOOR: ACTIVE RETAIL PROMENADE & ATRIUM ====================
  const grpG = levelGroups.G;
  grpG.userData = { name: 'Level G: Ground Retail Arcade & Biophilic Atrium', baseElevation: 0, phaseMonth: 6 };
  grpG.position.y = 0;

  const gSlabRing = createRing(buildingW, buildingD, courtW, courtD, 0.35, slabMat);
  grpG.add(gSlabRing);
  createGlassArcade(grpG, buildingW, buildingD, courtW, courtD, 4.5);

  // Central Courtyard Reflection Pond & Water Wall
  const pond = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 10), waterMat);
  pond.position.set(0, 0.1, 0);
  registerInteractive(pond, {
    name: 'Central Courtyard Bio-Filtration Reflection Pond',
    category: 'Biophilic Microclimate Core',
    dim: '12,000 mm × 10,000 mm × 450 mm',
    area: '120 m² Water Feature',
    family: 'WaterBody_EvaporativeCooling_Basin',
    env: 'Passive Evaporative Cooling (-3.8°C Microclimate Air Temperature)',
    mat: 'Recycled Greywater + Native Aquatic Plants (Lotus & Reeds)',
    carbon: 'Natural Carbon Sink & Wetland Filtration System',
    seismic: 'Flexible Expansion Joints Isolated from Foundation',
    fire: 'Emergency Fire Standpipe Reserve Connection (50,000 Liters)'
  });
  grpG.add(pond);

  // Courtyard Central Native Tree Island
  const courtTreeTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 4.0), new THREE.MeshStandardMaterial({ color: 0x78350f }));
  courtTreeTrunk.position.set(0, 2.0, 0);
  grpG.add(courtTreeTrunk);

  const courtTreeCanopy = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4, 1), vegetationMat);
  courtTreeCanopy.position.set(0, 4.8, 0);
  grpG.add(courtTreeCanopy);

  // ==================== LEVEL 1: COMMERCIAL WELLNESS & CO-WORKING DECK ====================
  const grpL1 = levelGroups.L1;
  grpL1.userData = { name: 'Level 1: Commercial Wellness, Cafe & Skybridges', baseElevation: 4.5, phaseMonth: 8 };
  grpL1.position.y = 4.5;

  const l1SlabRing = createRing(buildingW, buildingD, courtW, courtD, 0.3, slabMat);
  grpL1.add(l1SlabRing);
  createGlassArcade(grpL1, buildingW, buildingD, courtW, courtD, 3.6);

  // Cantilevered Timber Skybridge crossing the courtyard
  const skybridge = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, courtD), woodDeckMat);
  skybridge.position.set(0, 0.15, 0);
  registerInteractive(skybridge, {
    name: 'Level 1 Cantilevered Timber Skybridge',
    category: 'Biophilic Walkway Architecture',
    dim: '2,200 mm × 14,000 mm span',
    area: '30.8 m² Circulation Deck',
    family: 'Timber_Skybridge_Glulam_Deck',
    env: 'Enhances Natural Airflow Flowpaths through Courtyard Atrium',
    mat: 'FSC-Certified Mass Engineered Glulam Timber + Steel Tension Rods',
    carbon: '-220 kg CO₂e/m³ (Carbon Negative Sequestered Mass Timber)',
    seismic: 'Slotted Pin Joints for Differential Thermal & Seismic Movement',
    fire: '1.5-Hour Char Layer Fire Resistance'
  });
  grpL1.add(skybridge);

  // ==================== LEVELS 2 TO 9: MODULAR RESIDENTIAL APARTMENTS ====================
  const residentialKeys = ['L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'];
  const resBaseElevation = 8.1;
  const floorHeight = 3.3;

  residentialKeys.forEach((key, idx) => {
    const grp = levelGroups[key];
    const elev = resBaseElevation + idx * floorHeight;
    const phaseM = 10 + Math.floor(idx * 0.8);
    grp.userData = { name: `Level ${idx + 2}: Residential Units (6 Apts/Floor)`, baseElevation: elev, phaseMonth: phaseM };
    grp.position.y = elev;

    // Floor Slab Ring
    const slabRing = createRing(buildingW, buildingD, courtW, courtD, 0.25, slabMat);
    grp.add(slabRing);

    // Exterior Apartment Glazed Walls
    createGlassArcade(grp, buildingW, buildingD, courtW, courtD, floorHeight);

    // Cantilevered Balconies on South and East facades
    const balconySouth = new THREE.Mesh(new THREE.BoxGeometry(buildingW - 4, 0.2, 2.2), concreteMat);
    balconySouth.position.set(0, 0.1, buildingD / 2 + 1.1);
    grp.add(balconySouth);

    const railingSouth = new THREE.Mesh(new THREE.BoxGeometry(buildingW - 4, 1.0, 0.05), railingMat);
    railingSouth.position.set(0, 0.6, buildingD / 2 + 2.15);
    grp.add(railingSouth);

    // Green Planter Boxes along balconies
    const planter = new THREE.Mesh(new THREE.BoxGeometry(buildingW - 6, 0.4, 0.5), vegetationMat);
    planter.position.set(0, 0.3, buildingD / 2 + 1.8);
    registerInteractive(planter, {
      name: `Level ${idx + 2} Integrated Balcony Bio-Planter Buffer`,
      category: 'Biophilic Living Façade',
      dim: `${(buildingW - 6) * 1000} × 500 × 400 mm`,
      area: 'Living Vegetative Shading Buffer',
      family: 'LivingWall_Balcony_BioPlanter_Subirrigated',
      env: 'Microclimate Cooling, Acoustic Noise Damping (-12 dB), Particulate PM2.5 Absorption',
      mat: 'Recycled Polymer Lightweight Soil + Automated Drip Irrigation Fed by STP Recycled Water',
      carbon: 'Living Vegetative Carbon Sequestration',
      seismic: 'Integrated into Cantilevered RCC Slab',
      fire: 'Class A Non-Combustible Lightweight Planter Substrate'
    });
    grp.add(planter);

    // Parametric Kinetic Aerofoil Louvers on South Facade
    const louverGroup = new THREE.Group();
    louverGroup.position.set(0, floorHeight * 0.5, buildingD / 2 + 0.35);

    for (let l = -buildingW / 2 + 2; l <= buildingW / 2 - 2; l += 1.8) {
      const louver = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.45), louverMat);
      louver.position.set(l, 0, 0);
      louver.rotation.x = Math.PI / 4.2; // 42.5° optimal solar cut-off angle
      louver.castShadow = true;

      registerInteractive(louver, {
        name: `Parametric Kinetic Façade Louver Module L${idx + 2}_${Math.round(l + 20)}`,
        category: 'Climate-Adaptive Shading Louver',
        dim: '1,600 mm × 450 mm Aerofoil Blade',
        area: '0.72 m² Shading Aperture',
        family: 'Parametric_Aerofoil_Louver_42Deg',
        env: 'Blocks 85% Direct Solar Heat Gain, Preserves 82.4% Spatial Daylight Autonomy (sDA)',
        mat: 'Extruded Recycled Architectural Aluminum (EN AW-6063-T6) with Anodized Finish',
        carbon: 'Low Embodied Carbon Recycled Aluminum (2.1 kg CO₂e/kg)',
        seismic: 'Flexible Pin Connection to Exterior Curtain Wall Mullions',
        fire: 'Class A1 Non-Combustible Material Standard'
      });

      if (kineticLouversList) kineticLouversList.push(louver);
      louverGroup.add(louver);
    }
    grp.add(louverGroup);
  });

  // ==================== LEVEL RF: ROOFTOP SKY FOREST & 148 kWp SOLAR CANOPY ====================
  const grpRF = levelGroups.RF;
  const rfElevation = resBaseElevation + residentialKeys.length * floorHeight;
  grpRF.userData = { name: 'Level RF: Rooftop Bio-Solar Sky Terrace & Urban Agriculture', baseElevation: rfElevation, phaseMonth: 20 };
  grpRF.position.y = rfElevation;

  const rfSlabRing = createRing(buildingW, buildingD, courtW, courtD, 0.4, slabMat);
  grpRF.add(rfSlabRing);

  // Glass Courtyard Guardrails on Roof
  const roofGuardrail = new THREE.Mesh(new THREE.BoxGeometry(courtW, 1.1, 0.08), glassMat);
  roofGuardrail.position.set(0, 0.55, courtD / 2);
  grpRF.add(roofGuardrail);

  // 148 kWp Bifacial Photovoltaic Solar Glass Pergola
  const solarPergola = new THREE.Group();
  for (let sx = -14; sx <= 14; sx += 4.5) {
    for (let sz = -10; sz <= 10; sz += 4.5) {
      if (Math.abs(sx) < 6 && Math.abs(sz) < 5) continue;
      const pvPanel = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.06, 4.0), solarPvMat);
      pvPanel.position.set(sx, 3.2, sz);
      pvPanel.rotation.x = -0.15; // 8.5° tilt for optimal tropical generation & self-cleaning rain runoff
      pvPanel.castShadow = true;

      registerInteractive(pvPanel, {
        name: `148 kWp Bifacial Solar BIPV Module PV_${Math.round(sx + 15)}_${Math.round(sz + 15)}`,
        category: 'Renewable Solar Energy Infrastructure',
        dim: '4,000 mm × 4,000 mm Array String',
        area: '16.0 m² Active Photovoltaic Area',
        family: 'BIPV_Bifacial_Glass_Solar_Canopy_148kWp',
        env: 'Generates 185 MWh/year Clean Electricity (Offsets 51% Building EUI Load)',
        mat: 'Bifacial Monocrystalline PERC Cells + Anti-Reflective Toughened Double Glass',
        carbon: 'Avoids 152 Tonnes CO₂e Emissions Annually',
        seismic: 'Structural Steel Space Frame Anchored to RCC Core Columns',
        fire: 'Class A Fire-Rated Solar BIPV Assembly'
      });
      solarPergola.add(pvPanel);
    }
  }

  // Steel Pergola Support Posts
  for (let px = -14; px <= 14; px += 9) {
    for (let pz = -9; pz <= 9; pz += 9) {
      if (Math.abs(px) < 6 && Math.abs(pz) < 5) continue;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2), frameMat);
      post.position.set(px, 1.6, pz);
      post.castShadow = true;
      solarPergola.add(post);
    }
  }
  grpRF.add(solarPergola);

  // Rooftop Resident Urban Agriculture Garden Plots
  const farmPlot1 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.35, 4), vegetationMat);
  farmPlot1.position.set(-10, 0.2, 0);
  registerInteractive(farmPlot1, {
    name: 'Rooftop Community Organic Urban Farm & Hydroponic Deck',
    category: 'Biophilic Urban Agriculture',
    dim: '8,000 mm × 4,000 mm × 350 mm Soil Bed',
    area: '32.0 m² Organic Agriculture Area',
    family: 'UrbanFarm_Hydroponic_Community_Bed',
    env: 'Supplies Fresh Microgreens to Residents, Lowers Urban Heat Island (UHI) by 4.2°C',
    mat: 'Expanded Clay Aggregate + Coco Peat + Sub-Surface Drip Irrigation',
    carbon: 'Local Zero-Food-Miles Carbon Sink',
    seismic: 'Distributed Roof Deck Dead Load (1.8 kN/m²)',
    fire: 'Saturated Vegetative Substrate (Non-Combustible)'
  });
  grpRF.add(farmPlot1);

  const farmPlot2 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.35, 4), vegetationMat);
  farmPlot2.position.set(10, 0.2, 0);
  grpRF.add(farmPlot2);

  // Central Dual Elevator & Stair Core (Continuous through full height)
  const coreTotalH = rfElevation + 3.5;
  const coreEast = new THREE.Mesh(new THREE.BoxGeometry(4.0, coreTotalH, 5.0), coreMat);
  coreEast.position.set(12, coreTotalH / 2 - 3.5, 0);
  registerInteractive(coreEast, {
    name: 'RCC Seismic Shear Core & Egress Stairwell 1',
    category: 'RCC Structural Skeleton',
    dim: '4,000 mm × 5,000 mm × 38,000 mm (B1 to Roof)',
    area: '20 m² Core Footprint',
    family: 'M_ShearWall_Core_Continuous_IS13920',
    env: 'Thermal Mass Buffer on Eastern Facade',
    mat: 'M40 Reinforced Concrete (40% GGBS Pozzolanic Replacement) + Fe550D Rebar',
    carbon: '248 kg CO₂e/m³ (-43% reduction vs Standard Concrete)',
    seismic: 'Primary Lateral Force Resisting System (Zone III Ductile Shear Wall)',
    fire: '4-Hour Fire Resistance Rating (IS 1642 Standard)'
  });
  containerGroup.add(coreEast);

  const coreWest = new THREE.Mesh(new THREE.BoxGeometry(4.0, coreTotalH, 5.0), coreMat);
  coreWest.position.set(-12, coreTotalH / 2 - 3.5, 0);
  containerGroup.add(coreWest);

  return levelGroups;
}

/**
 * MASTER 3D BIM VIEWER ENGINE WITH FIRST-PERSON, 4D CONSTRUCTION & HEATMAPS
 */
export class BimViewer3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`BimViewer3D: Canvas element #${canvasId} not found.`);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329); // Sleek deep architectural navy slate

    const width = this.canvas.clientWidth || 900;
    const height = this.canvas.clientHeight || 650;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 600);
    this.camera.position.set(48, 45, 52);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Self-contained smooth orbit controls
    this.controls = new SmoothOrbitControls(this.camera, this.canvas);

    this.buildingGroup = new THREE.Group();
    this.scene.add(this.buildingGroup);
    this.interactiveObjects = [];
    this.kineticLouvers = [];

    this.initLights();
    this.createGroundSite();
    this.levelGroups = buildFullBimBuilding(this.buildingGroup, this.interactiveObjects, this.kineticLouvers);

    this.initCfdParticleSystem();
    this.initInteractivity();
    this.initFpsControls();
    this.initConstructionCrane();
    this.initResizeObserver();

    this.currentViewMode = 'realistic';
    this.isKineticAnimated = true;
    this.cfdFlowSpeed = 1.0;
    this.cfdActive = true;
    this.constructionMonth = 24;
    this.isFpsMode = false;

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.sunLight.position.set(50, 75, 45);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -50;
    this.sunLight.shadow.camera.right = 50;
    this.sunLight.shadow.camera.top = 50;
    this.sunLight.shadow.camera.bottom = -50;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight(0x90cdf4, 0x1e293b, 0.85);
    this.scene.add(this.hemiLight);
  }

  createGroundSite() {
    // Site ground plane
    const siteGeo = new THREE.PlaneGeometry(180, 180);
    const siteMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9, metalness: 0.05 });
    const site = new THREE.Mesh(siteGeo, siteMat);
    site.rotation.x = -Math.PI / 2;
    site.position.y = -0.05;
    site.receiveShadow = true;
    this.scene.add(site);

    // Glowing architectural cyan/slate grid
    const grid = new THREE.GridHelper(180, 45, 0x38bdf8, 0x1e293b);
    grid.position.y = 0;
    this.scene.add(grid);

    // Building Plot boundary (48m × 36m)
    const plot = new THREE.Mesh(
      new THREE.BoxGeometry(48, 0.15, 36),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
    );
    plot.position.set(0, 0.05, 0);
    plot.receiveShadow = true;
    this.scene.add(plot);

    // Site perimeter trees
    const treePositions = [
      [-26, 0, -18], [-26, 0, 0], [-26, 0, 18],
      [26, 0, -18], [26, 0, 0], [26, 0, 18],
      [-16, 0, -22], [0, 0, -22], [16, 0, -22],
      [-18, 0, 22], [0, 0, 22], [18, 0, 22]
    ];
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 });

    treePositions.forEach(pos => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5), treeTrunkMat);
      trunk.position.set(pos[0], 1.25, pos[2]);
      trunk.castShadow = true;
      this.scene.add(trunk);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 1), treeFoliageMat);
      foliage.position.set(pos[0], 3.2, pos[2]);
      foliage.castShadow = true;
      this.scene.add(foliage);
    });
  }

  initConstructionCrane() {
    this.craneGroup = new THREE.Group();
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.8 });
    const craneMast = new THREE.Mesh(new THREE.BoxGeometry(1.2, 48, 1.2), craneMat);
    craneMast.position.set(-22, 24, -16);
    this.craneGroup.add(craneMast);

    const craneJib = new THREE.Mesh(new THREE.BoxGeometry(38, 1.0, 1.0), craneMat);
    craneJib.position.set(-8, 48, -16);
    this.craneGroup.add(craneJib);

    const counterJib = new THREE.Mesh(new THREE.BoxGeometry(12, 1.0, 1.0), craneMat);
    counterJib.position.set(-28, 48, -16);
    this.craneGroup.add(counterJib);

    this.craneGroup.visible = false;
    this.scene.add(this.craneGroup);
  }

  initCfdParticleSystem() {
    try {
      const particleCount = 250;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 12; // Courtyard X
        positions[i * 3 + 1] = Math.random() * 36;          // Upward Stack Y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Courtyard Z

        // Cyan-to-emerald gradient for natural buoyancy cooling flow
        const yNorm = positions[i * 3 + 1] / 36;
        colors[i * 3 + 0] = 0.05 + yNorm * 0.2;
        colors[i * 3 + 1] = 0.75 + yNorm * 0.25;
        colors[i * 3 + 2] = 0.95 - yNorm * 0.35;

        velocities[i] = 0.8 + Math.random() * 0.7;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      this.cfdParticles = new THREE.Points(geometry, material);
      this.cfdVelocities = velocities;
      this.scene.add(this.cfdParticles);
    } catch (e) {
      console.warn('CFD Particle System init error:', e);
    }
  }

  toggleCfdParticles(enable) {
    this.cfdActive = enable;
    if (this.cfdParticles) this.cfdParticles.visible = enable;
  }

  setCfdFlowSpeed(factor) {
    this.cfdFlowSpeed = factor;
  }

  /**
   * 3D Viewport Shader Mode & Thermal Heatmap Mode
   */
  setViewMode(mode) {
    this.currentViewMode = mode;
    this.buildingGroup.traverse(child => {
      if (child.isMesh && child.userData) {
        if (mode === 'carbon') {
          if (child.userData.category && (child.userData.category.includes('RCC') || child.userData.category.includes('Foundation'))) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 });
          } else if (child.userData.category && (child.userData.category.includes('Glazing') || child.userData.category.includes('Envelope'))) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.6, depthWrite: false });
          } else if (child.userData.category && (child.userData.category.includes('Louver') || child.userData.category.includes('Steel'))) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
          } else if (child.userData.category && (child.userData.category.includes('Biophilic') || child.userData.category.includes('Vegetation'))) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x059669 });
          }
        } else if (mode === 'thermal' || mode === 'cfd') {
          const y = child.position.y + (child.parent ? child.parent.position.y : 0);
          const isSouth = (child.position.z + (child.parent ? child.parent.position.z : 0)) > 5;
          const heatColor = isSouth ? new THREE.Color(0xef4444).lerp(new THREE.Color(0xf59e0b), y / 35) : new THREE.Color(0x0284c7).lerp(new THREE.Color(0x10b981), y / 35);
          child.material = new THREE.MeshStandardMaterial({ color: heatColor, roughness: 0.5 });
        } else if (mode === 'xray') {
          if (child.userData.category && (child.userData.category.includes('RCC') || child.userData.category.includes('Column'))) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0369a1, roughness: 0.3 });
          } else {
            child.material = new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.15, roughness: 0.1, depthWrite: false });
          }
        } else {
          // Restore original material
          if (child.userData.originalMat) {
            child.material = child.userData.originalMat;
          }
        }
      }
    });
  }

  setCameraPreset(type) {
    if (this.controls) {
      this.controls.setCameraPreset(type);
    }
  }

  /**
   * 4D BIM CONSTRUCTION PHASING TIMELINE (MONTH 1 - 24)
   */
  setConstructionMonth(month) {
    this.constructionMonth = month;
    if (this.craneGroup) this.craneGroup.visible = (month < 24 && month >= 3);

    Object.keys(this.levelGroups).forEach(key => {
      const grp = this.levelGroups[key];
      const pMonth = grp.userData.phaseMonth || 24;
      grp.visible = (pMonth <= month);
    });

    const mLabel = document.getElementById('bim4dMonthDisplay');
    const concreteVal = document.getElementById('bim4dConcreteVal');
    const carbonVal = document.getElementById('bim4dCarbonVal');
    const milestoneDesc = document.getElementById('bim4dMilestoneDesc');

    if (mLabel) mLabel.textContent = `Month ${month} of 24`;

    const concreteTotal = Math.round((month / 24) * 4850);
    const carbonTotal = ( (month / 24) * 412.5 ).toFixed(1);

    if (concreteVal) concreteVal.textContent = `${concreteTotal.toLocaleString()} m³`;
    if (carbonVal) carbonVal.textContent = `${carbonTotal} tCO₂e Saved`;

    let desc = 'BIM Execution & Full Commissioning';
    if (month <= 3) desc = 'M01-M03: Basement Excavation, Diaphragm Walls & Raft Piles';
    else if (month <= 7) desc = 'M04-M07: Ground Retail Podium & Level 1 Concrete Framing';
    else if (month <= 14) desc = 'M08-M14: Tower Residential Levels 2-9 RCC Skeleton (IS 13920)';
    else if (month <= 18) desc = 'M15-M18: Double Glazed Curtain Wall, Kinetic Louvers & MEP Risers';
    else if (month <= 22) desc = 'M19-M22: 148 kWp Solar BIPV Pergola, Sky Forest & Interior Finishes';
    else desc = 'M23-M24: Handover, GRIHA 5-Star Inspection & Digital Twin Commissioning';

    if (milestoneDesc) milestoneDesc.textContent = desc;
  }

  /**
   * FIRST PERSON 3D WALKTHROUGH CONTROLLER (WASD + MOUSE LOOK)
   */
  initFpsControls() {
    this.fpsKeys = { forward: false, backward: false, left: false, right: false, up: false, down: false };
    this.fpsYaw = 0;
    this.fpsPitch = 0;
    this.fpsSpeed = 0.35;

    window.addEventListener('keydown', (e) => {
      if (!this.isFpsMode) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.fpsKeys.forward = true;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.fpsKeys.backward = true;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.fpsKeys.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.fpsKeys.right = true;
      if (e.code === 'Space') this.fpsKeys.up = true;
      if (e.code === 'ShiftLeft' || e.code === 'KeyC') this.fpsKeys.down = true;
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isFpsMode) return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') this.fpsKeys.forward = false;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.fpsKeys.backward = false;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.fpsKeys.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.fpsKeys.right = false;
      if (e.code === 'Space') this.fpsKeys.up = false;
      if (e.code === 'ShiftLeft' || e.code === 'KeyC') this.fpsKeys.down = false;
    });

    // Mouse Look in FPS mode
    let isMouseDown = false;
    let prevMouse = { x: 0, y: 0 };
    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.isFpsMode && e.button === 0) {
        isMouseDown = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isFpsMode && isMouseDown) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        this.fpsYaw -= dx * 0.004;
        this.fpsPitch -= dy * 0.004;
        this.fpsPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.fpsPitch));
        prevMouse = { x: e.clientX, y: e.clientY };
        this.updateFpsCameraRotation();
      }
    });

    window.addEventListener('pointerup', () => { isMouseDown = false; });
  }

  toggleFpsMode(enable) {
    this.isFpsMode = enable;
    if (this.controls) this.controls.enabled = !enable;

    const fpsHud = document.getElementById('fpsHudOverlay');
    if (fpsHud) fpsHud.classList.toggle('active', enable);

    if (enable) {
      this.teleportFpsTo('courtyard');
    } else {
      this.setCameraPreset('axonometric');
    }
  }

  teleportFpsTo(locationKey) {
    if (locationKey === 'courtyard') {
      this.camera.position.set(0, 1.8, 4);
      this.fpsYaw = 0;
      this.fpsPitch = 0.1;
    } else if (locationKey === 'apartment_3bhk') {
      this.camera.position.set(12, 16.2, 8);
      this.fpsYaw = -Math.PI / 2;
      this.fpsPitch = 0;
    } else if (locationKey === 'sky_forest') {
      this.camera.position.set(0, 32.5, 6);
      this.fpsYaw = Math.PI / 4;
      this.fpsPitch = -0.1;
    } else if (locationKey === 'promenade') {
      this.camera.position.set(0, 1.8, 24);
      this.fpsYaw = Math.PI;
      this.fpsPitch = 0.15;
    }
    this.updateFpsCameraRotation();
  }

  updateFpsCameraRotation() {
    const forward = new THREE.Vector3(
      -Math.sin(this.fpsYaw) * Math.cos(this.fpsPitch),
      Math.sin(this.fpsPitch),
      -Math.cos(this.fpsYaw) * Math.cos(this.fpsPitch)
    ).normalize();
    const target = this.camera.position.clone().add(forward);
    this.camera.lookAt(target);

    // Update Compass Indicator
    const compass = document.getElementById('fpsCompassHeading');
    if (compass) {
      const deg = Math.round(((-this.fpsYaw * 180) / Math.PI + 360) % 360);
      let dir = 'N';
      if (deg > 45 && deg <= 135) dir = 'E';
      else if (deg > 135 && deg <= 225) dir = 'S';
      else if (deg > 225 && deg <= 315) dir = 'W';
      compass.textContent = `${dir} (${deg}°)`;
    }
  }

  updateFpsMovement() {
    if (!this.isFpsMode) return;

    const moveVector = new THREE.Vector3();
    const forward = new THREE.Vector3(-Math.sin(this.fpsYaw), 0, -Math.cos(this.fpsYaw)).normalize();
    const right = new THREE.Vector3(Math.cos(this.fpsYaw), 0, -Math.sin(this.fpsYaw)).normalize();

    if (this.fpsKeys.forward) moveVector.add(forward);
    if (this.fpsKeys.backward) moveVector.sub(forward);
    if (this.fpsKeys.right) moveVector.add(right);
    if (this.fpsKeys.left) moveVector.sub(right);

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize().multiplyScalar(this.fpsSpeed);
      this.camera.position.add(moveVector);
    }

    if (this.fpsKeys.up) this.camera.position.y += 0.2;
    if (this.fpsKeys.down) this.camera.position.y = Math.max(1.2, this.camera.position.y - 0.2);

    this.updateFpsCameraRotation();
  }

  /**
   * RAYCASTER BIM ELEMENT PROPERTIES INSPECTOR
   */
  initInteractivity() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('click', (e) => {
      if (this.isFpsMode) return;
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData && obj.userData.name) {
          const elemTitle = document.getElementById('elemTitle');
          const elemCategory = document.getElementById('elemCategory');
          const elemDim = document.getElementById('elemDim');
          const elemArea = document.getElementById('elemArea');
          const elemFamily = document.getElementById('elemFamily');
          const elemEnv = document.getElementById('elemEnv');
          const elemMat = document.getElementById('elemMat');
          const elemCarbon = document.getElementById('elemCarbon');
          const elemSeismic = document.getElementById('elemSeismic');
          const elemFire = document.getElementById('elemFire');

          if (elemTitle) elemTitle.textContent = obj.userData.name;
          if (elemCategory) elemCategory.textContent = obj.userData.category || 'Revit Family';
          if (elemDim) elemDim.textContent = obj.userData.dim || 'Specified in mm';
          if (elemArea) elemArea.textContent = obj.userData.area || '—';
          if (elemFamily) elemFamily.textContent = obj.userData.family || 'Autodesk_Revit_BIM';
          if (elemEnv) elemEnv.textContent = obj.userData.env || 'Optimized';
          if (elemMat) elemMat.textContent = obj.userData.mat || 'Standard Spec';
          if (elemCarbon) elemCarbon.textContent = obj.userData.carbon || 'Low-Embodied Carbon Certified';
          if (elemSeismic) elemSeismic.textContent = obj.userData.seismic || 'IS 13920 Seismic Ductile Standard';
          if (elemFire) elemFire.textContent = obj.userData.fire || '2-Hour Fire Integrity';
        }
      }
    });
  }

  initResizeObserver() {
    if (typeof ResizeObserver !== 'undefined' && this.canvas) {
      this.resizeObserver = new ResizeObserver(() => {
        this.resizeRendererToDisplaySize();
      });
      if (this.canvas.parentElement) {
        this.resizeObserver.observe(this.canvas.parentElement);
      }
    }
    window.addEventListener('resize', () => {
      this.resizeRendererToDisplaySize();
    });
  }

  setExplodedSpread(factor) {
    const maxOffset = 5.5;
    const order = ['B1', 'G', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'RF'];
    order.forEach((key, idx) => {
      const grp = this.levelGroups[key];
      if (grp) {
        const base = grp.userData.baseElevation !== undefined ? grp.userData.baseElevation : 0;
        grp.position.y = base + (idx - 1) * maxOffset * factor;
      }
    });
  }

  isolateLevel(lvlCode) {
    Object.keys(this.levelGroups).forEach(key => {
      const grp = this.levelGroups[key];
      if (lvlCode === 'all') {
        grp.visible = true;
      } else if (lvlCode === 'B1') {
        grp.visible = (key === 'B1');
      } else if (lvlCode === 'G') {
        grp.visible = (key === 'G');
      } else if (lvlCode === 'L1') {
        grp.visible = (key === 'L1');
      } else if (lvlCode === 'L2_9') {
        grp.visible = ['L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'].includes(key);
      } else if (lvlCode === 'RF') {
        grp.visible = (key === 'RF');
      }
    });
  }

  setLayerVisibility(layerKey, isVisible) {
    this.buildingGroup.traverse(child => {
      if (child.isMesh && child.userData) {
        if (layerKey === 'arch' && child.userData.category && (child.userData.category.includes('Glazing') || child.userData.category.includes('Envelope'))) {
          child.visible = isVisible;
        } else if (layerKey === 'louvers' && child.userData.category && child.userData.category.includes('Louver')) {
          child.visible = isVisible;
        } else if (layerKey === 'landscape' && child.userData.category && (child.userData.category.includes('Biophilic') || child.userData.category.includes('Vegetation') || child.userData.category.includes('Water') || child.userData.category.includes('Courtyard') || child.userData.category.includes('Planter') || child.userData.category.includes('Agriculture'))) {
          child.visible = isVisible;
        } else if (layerKey === 'basementEV' && child.userData.category && child.userData.category.includes('EV')) {
          child.visible = isVisible;
        } else if (layerKey === 'mep' && child.userData.category && (child.userData.category.includes('Renewable') || child.userData.category.includes('MEP') || child.userData.category.includes('Solar'))) {
          child.visible = isVisible;
        } else if (layerKey === 'structure' && child.userData.category && (child.userData.category.includes('RCC') || child.userData.category.includes('Column') || child.userData.category.includes('Foundation'))) {
          child.visible = isVisible;
        }
      }
    });
  }

  setSunTime(hour) {
    const angle = ((hour - 6) / 12) * Math.PI;
    const sunX = Math.cos(angle) * 70;
    const sunY = Math.sin(angle) * 65 + 10;
    const sunZ = 35 + Math.sin(angle) * 15;
    this.sunLight.position.set(sunX, sunY, sunZ);

    const timeLabel = document.getElementById('sunTimeLabel');
    if (timeLabel) {
      const hStr = Math.floor(hour).toString().padStart(2, '0');
      const mStr = (hour % 1 === 0.5) ? '30' : '00';
      const solarAngle = Math.round(Math.sin(angle) * 75);
      timeLabel.textContent = `${hStr}:${mStr} (Solar Angle: ${solarAngle}° ${hour < 12 ? 'E' : 'W'})`;
    }
  }

  setLightingMode(mode) {
    if (mode === 'day') {
      this.setSunTime(14);
      this.sunLight.intensity = 2.2;
      this.ambientLight.intensity = 1.2;
      this.scene.background.setHex(0x0b1329);
    } else if (mode === 'golden') {
      this.setSunTime(17.5);
      this.sunLight.intensity = 2.4;
      this.ambientLight.intensity = 0.95;
      this.sunLight.color.setHex(0xffaa44);
      this.scene.background.setHex(0x181329);
    } else if (mode === 'night') {
      this.sunLight.intensity = 0.35;
      this.ambientLight.intensity = 0.5;
      this.scene.background.setHex(0x020617);
    }
  }

  toggleShadows(enable) {
    this.renderer.shadowMap.enabled = enable;
  }

  resizeRendererToDisplaySize() {
    if (!this.canvas) return false;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width > 0 && height > 0) {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.floor(width * pixelRatio);
      const targetHeight = Math.floor(height * pixelRatio);

      const needResize = this.canvas.width !== targetWidth || this.canvas.height !== targetHeight;
      if (needResize) {
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        return true;
      }
    }
    return false;
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.resizeRendererToDisplaySize();
    if (this.controls && !this.isFpsMode) this.controls.update();
    if (this.isFpsMode) this.updateFpsMovement();

    // 1. Animate Convective Thermal CFD Particles
    if (this.cfdActive && this.cfdParticles && this.cfdVelocities && this.cfdParticles.geometry && this.cfdParticles.geometry.attributes.position) {
      const positions = this.cfdParticles.geometry.attributes.position.array;
      const count = positions.length / 3;
      const speed = 0.14 * this.cfdFlowSpeed;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += this.cfdVelocities[i] * speed;
        positions[i * 3 + 0] += Math.sin(positions[i * 3 + 1] * 0.3 + i) * 0.015;
        positions[i * 3 + 2] += Math.cos(positions[i * 3 + 1] * 0.3 + i) * 0.015;

        if (positions[i * 3 + 1] > 37) {
          positions[i * 3 + 1] = 0.2 + Math.random() * 0.8;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
      }
      this.cfdParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Animate Kinetic Louvers Subtle Breathing Oscillation
    if (this.isKineticAnimated && this.kineticLouvers.length > 0) {
      const time = performance.now() * 0.001;
      this.kineticLouvers.forEach((louver, idx) => {
        louver.rotation.x = Math.PI / 4.2 + Math.sin(time * 0.8 + idx * 0.1) * 0.04;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/**
 * 30-SECOND CINEMATIC WALKTHROUGH ENGINE WITH 7 DEDICATED INNOVATION TOURS
 */
export class WalkthroughEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`WalkthroughEngine: Canvas element #${canvasId} not found.`);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);

    const width = this.canvas.clientWidth || 900;
    const height = this.canvas.clientHeight || 520;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 500);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.duration = 30.0;
    this.currentTime = 0.0;
    this.isPlaying = false;
    this.speedMultiplier = 1.0;
    this.activeTourKey = 'master';

    // 7 CURATED 30-SECOND INNOVATION WALKTHROUGH TOURS
    this.tourDatabase = {
      master: [
        {
          time: 0,
          name: 'Station 1: Urban Approach & Active Promenade',
          title: 'Ground Commercial Promenade & Pedestrian Plaza',
          desc: 'Double-height commercial glass arcade welcoming pedestrians with active retail boutiques, shaded outdoor seating, and seamless flow into the central green courtyard.',
          camPos: new THREE.Vector3(0, 8, 52),
          lookAt: new THREE.Vector3(0, 12, 0)
        },
        {
          time: 6,
          name: 'Station 2: Central Biophilic Courtyard',
          title: 'Open-Air Botanical Atrium & Thermal Chimney',
          desc: 'The 224 m² central courtyard acts as a natural microclimate cooling stack, featuring native trees, bio-filtration water ponds, and timber boardwalks.',
          camPos: new THREE.Vector3(0, 6, 6),
          lookAt: new THREE.Vector3(0, 26, 0)
        },
        {
          time: 13,
          name: 'Station 3: 1F Commercial Deck & Skybridge',
          title: 'Level 1 Wellness, Co-Working & Elevated Terraces',
          desc: 'Cantilevered alfresco dining decks and glazed meeting pods connected via timber sky bridges with direct panoramic vistas down into the courtyard garden.',
          camPos: new THREE.Vector3(26, 14, 24),
          lookAt: new THREE.Vector3(0, 10, 0)
        },
        {
          time: 20,
          name: 'Station 4: Sustainable Residential Sanctuary',
          title: 'Modular Apartments, Cantilevered Balconies & Kinetic Facade',
          desc: 'Generous 3.3m floor-to-floor heights with deep shading balconies, integrated bio-planters, and motorized aerofoil louvers blocking harsh afternoon solar radiation.',
          camPos: new THREE.Vector3(-28, 26, 36),
          lookAt: new THREE.Vector3(0, 20, 0)
        },
        {
          time: 27,
          name: 'Station 5: Rooftop Sky Garden & Solar Array',
          title: 'Roof Terrace Bio-Solar Skydeck, Community Farm & 360° Skyline',
          desc: '148 kWp bifacial solar PV canopy generating 185 MWh/yr, combined with resident urban farming plots, running track, and rainwater retention deck.',
          camPos: new THREE.Vector3(0, 56, 42),
          lookAt: new THREE.Vector3(0, 32, 0)
        }
      ],

      inno_atrium: [
        {
          time: 0,
          name: 'Station 1: Courtyard Inlet & Water Reflection Pool',
          title: 'Innovation 1: Microclimate Evaporative Base',
          desc: 'Ground-level water reflection ponds cool oncoming ambient breezes through latent heat evaporation before entering the vertical stack.',
          camPos: new THREE.Vector3(0, 2.5, 18),
          lookAt: new THREE.Vector3(0, 4.0, 0)
        },
        {
          time: 6,
          name: 'Station 2: 16m × 14m Central Stack Core',
          title: 'Innovation 1: Thermal Buoyancy Engine',
          desc: 'Rising solar radiation heats the upper atrium air, drawing cool fresh air through shaded perimeter corridors at 4.5 Air Changes per Hour.',
          camPos: new THREE.Vector3(0, 12, 4),
          lookAt: new THREE.Vector3(0, 28, 0)
        },
        {
          time: 13,
          name: 'Station 3: Mid-Tower Breathable Corridors',
          title: 'Innovation 1: Dual-Aspect Cross-Ventilation',
          desc: 'Every residential unit enjoys dual-aspect orientation with fresh air drawn from the courtyard core across living spaces to the exterior balconies.',
          camPos: new THREE.Vector3(14, 18, 12),
          lookAt: new THREE.Vector3(0, 18, 0)
        },
        {
          time: 20,
          name: 'Station 4: Natural Sky Daylight Autonomy',
          title: 'Innovation 1: 82.4% Spatial Daylight Autonomy',
          desc: 'Continuous vertical light well floods interior circulation corridors with natural light, eliminating daytime artificial lighting loads.',
          camPos: new THREE.Vector3(-12, 26, -8),
          lookAt: new THREE.Vector3(0, 18, 0)
        },
        {
          time: 27,
          name: 'Station 5: Venturi Top Aerodynamic Exhaust',
          title: 'Innovation 1: Zero-Energy Passive Stack Discharge',
          desc: 'Stepped rooftop profile accelerates negative suction pressure at the roof exhaust, expelling warm indoor air without mechanical draft fans.',
          camPos: new THREE.Vector3(0, 45, 14),
          lookAt: new THREE.Vector3(0, 30, 0)
        }
      ],

      inno_facade: [
        {
          time: 0,
          name: 'Station 1: South-West Solar Exposure Approach',
          title: 'Innovation 2: Extreme Sun Angle Defense',
          desc: 'South and West facades endure peak tropical radiation exceeding 840 W/m². The climate-adaptive envelope provides multi-layered protection.',
          camPos: new THREE.Vector3(-18, 16, 38),
          lookAt: new THREE.Vector3(-4, 16, 15)
        },
        {
          time: 6,
          name: 'Station 2: 42.5° Parametric Aerofoil Louvers',
          title: 'Innovation 2: 85% Direct Heat Gain Rejection',
          desc: 'Aerodynamic aluminum louvers angled precisely at 42.5° block high-angle solar rays while allowing indirect ambient light to penetrate.',
          camPos: new THREE.Vector3(-8, 20, 24),
          lookAt: new THREE.Vector3(0, 20, 15)
        },
        {
          time: 13,
          name: 'Station 3: Double Low-E Argon Glazing',
          title: 'Innovation 2: High Performance Thermal Envelope',
          desc: '6-12-6 Low-E double glazing with Argon infill achieves a thermal U-value of 1.4 W/m²K and Solar Heat Gain Coefficient (SHGC) of 0.22.',
          camPos: new THREE.Vector3(12, 22, 22),
          lookAt: new THREE.Vector3(4, 22, 14)
        },
        {
          time: 20,
          name: 'Station 4: Glare Mitigation & Daylight Comfort',
          title: 'Innovation 2: ASE Glare Index < 10%',
          desc: 'Reduces Annual Sunlight Exposure (ASE) glare below 10%, creating glare-free residential reading and home-working environments.',
          camPos: new THREE.Vector3(18, 14, 28),
          lookAt: new THREE.Vector3(8, 14, 12)
        },
        {
          time: 27,
          name: 'Station 5: Automated Seasonal Tracking',
          title: 'Innovation 2: Dynamic Summer & Monsoon Actuation',
          desc: 'Louvers adjust automatically based on seasonal sun azimuths, optimizing cooling in May and maximizing winter morning solar warmth.',
          camPos: new THREE.Vector3(0, 34, 38),
          lookAt: new THREE.Vector3(0, 24, 15)
        }
      ],

      inno_structure: [
        {
          time: 0,
          name: 'Station 1: Substructure Raft & 600x600 Base Columns',
          title: 'Innovation 3: Low-Carbon High-Strength Foundation',
          desc: 'Heavy foundation columns utilize 40% GGBS cement replacement, reducing embodied carbon by 51% while enhancing sulfate resistance.',
          camPos: new THREE.Vector3(-22, -1, 28),
          lookAt: new THREE.Vector3(0, 4, 0)
        },
        {
          time: 6,
          name: 'Station 2: Standardized 8m × 8m Modular Grid',
          title: 'Innovation 3: Structural Efficiency & Repetition',
          desc: 'Standardized 8,000mm framing grid minimizes formwork waste, accelerates construction cycle by 35%, and supports flexible unit plans.',
          camPos: new THREE.Vector3(26, 12, 26),
          lookAt: new THREE.Vector3(0, 12, 0)
        },
        {
          time: 13,
          name: 'Station 3: IS 13920 Seismic Ductile Ties (135° Hooks)',
          title: 'Innovation 3: Ductile Earthquake Resilience',
          desc: 'Beam-column joints detailed with high-ductility 135° seismic cross-ties spaced at 100mm c/c to ensure energy dissipation in seismic events.',
          camPos: new THREE.Vector3(14, 18, 18),
          lookAt: new THREE.Vector3(8, 18, 8)
        },
        {
          time: 20,
          name: 'Station 4: Central Dual Shear Core Walls',
          title: 'Innovation 3: Lateral Wind & Seismic Stability',
          desc: 'Twin reinforced concrete cores house fire egress stairwells and elevators while resisting over 75% of building lateral wind loads.',
          camPos: new THREE.Vector3(-18, 22, -4),
          lookAt: new THREE.Vector3(0, 20, 0)
        },
        {
          time: 27,
          name: 'Station 5: Post-Tensioned Flat Slabs & Cantilevers',
          title: 'Innovation 3: 200mm Thin Slabs with High Clearances',
          desc: 'PT flat slabs eliminate dropped beams, providing generous 3.0m net ceiling clearances for integrated residential MEP services.',
          camPos: new THREE.Vector3(0, 42, 32),
          lookAt: new THREE.Vector3(0, 28, 0)
        }
      ],

      inno_water: [
        {
          time: 0,
          name: 'Station 1: Rooftop Catchment & Bioswale Drains',
          title: 'Innovation 4: 100% Rainwater Harvesting Loop',
          desc: 'Rooftop rainwater is gathered via sloped drainage pavers and channeled down dedicated gravity risers.',
          camPos: new THREE.Vector3(0, 36, 26),
          lookAt: new THREE.Vector3(0, 31, 0)
        },
        {
          time: 6,
          name: 'Station 2: Vertical Dual-Plumbing Greywater Risers',
          title: 'Innovation 4: Source Segregated Plumbing',
          desc: 'Greywater from residential showers and sinks is segregated from blackwater and piped down to the basement treatment facility.',
          camPos: new THREE.Vector3(-18, 20, 18),
          lookAt: new THREE.Vector3(-8, 16, 6)
        },
        {
          time: 13,
          name: 'Station 3: Basement 120 kLD MBBR Sewage Treatment Plant',
          title: 'Innovation 4: Decentralized Water Purification',
          desc: 'Moving Bed Biofilm Reactor (MBBR) STP treats 120,000 liters/day to non-potable flushing and irrigation standards.',
          camPos: new THREE.Vector3(-14, -2, 14),
          lookAt: new THREE.Vector3(0, -2, 0)
        },
        {
          time: 20,
          name: 'Station 4: Pressurized Dual-Plumbing Flush Network',
          title: 'Innovation 4: 43.8 Million Liters Saved Annually',
          desc: 'Treated water is pumped to a dedicated overhead tank, supplying 100% of residential toilet flushing and landscape irrigation demands.',
          camPos: new THREE.Vector3(14, 16, 12),
          lookAt: new THREE.Vector3(4, 16, 2)
        },
        {
          time: 27,
          name: 'Station 5: Bioswale Micro-Wetlands & Aquifer Recharge',
          title: 'Innovation 4: Zero Runoff Urban Development',
          desc: 'Excess storm runoff passes through permeable ground pavers and deep recharge borewells to replenish the local municipal water table.',
          camPos: new THREE.Vector3(0, 6, 28),
          lookAt: new THREE.Vector3(0, 1, 6)
        }
      ],

      inno_solar: [
        {
          time: 0,
          name: 'Station 1: Rooftop Sky Forest Entrance',
          title: 'Innovation 5: High-Altitude Biophilic Oasis',
          desc: 'Residents step out into a lush rooftop vegetative garden featuring native trees, fragrance gardens, and shaded walking circuits.',
          camPos: new THREE.Vector3(0, 33, 22),
          lookAt: new THREE.Vector3(0, 32, 0)
        },
        {
          time: 6,
          name: 'Station 2: 148 kWp Bifacial Solar Glass Pergola',
          title: 'Innovation 5: Dual-Function Energy Canopy',
          desc: 'Bifacial solar photovoltaic glass modules generate power from direct overhead sunlight and reflected albedo from the light-colored roof pavers.',
          camPos: new THREE.Vector3(-12, 35, 14),
          lookAt: new THREE.Vector3(0, 34, 0)
        },
        {
          time: 13,
          name: 'Station 3: 185 MWh/year Clean Solar Output',
          title: 'Innovation 5: 51% Net Energy Use Offset',
          desc: 'Generates sufficient electricity to power 100% of building common area lighting, EV chargers, water booster pumps, and ventilation fans.',
          camPos: new THREE.Vector3(14, 38, 16),
          lookAt: new THREE.Vector3(0, 33, 0)
        },
        {
          time: 20,
          name: 'Station 4: Resident Community Agriculture & Hydroponics',
          title: 'Innovation 5: Hyper-Local Food Production',
          desc: 'Community organic agriculture beds irrigated by recycled greywater produce fresh vegetables and foster social connection among residents.',
          camPos: new THREE.Vector3(-8, 33, -6),
          lookAt: new THREE.Vector3(-4, 32, 0)
        },
        {
          time: 27,
          name: 'Station 5: 360° Panoramic Urban Lookout',
          title: 'Innovation 5: Urban Heat Island Cooling Shield',
          desc: 'Green roof layer lowers roof surface temperature from 62°C to 28°C, shielding penthouse apartments from radiant heat transfer.',
          camPos: new THREE.Vector3(0, 52, 38),
          lookAt: new THREE.Vector3(0, 32, 0)
        }
      ],

      inno_4dbim: [
        {
          time: 0,
          name: 'Station 1: Month 01-03 Substructure & Piling',
          title: '4D BIM Phasing: Diaphragm Wall & Excavation',
          desc: 'Deep pile caps, perimeter retaining walls, and basement raft slab poured with low-carbon GGBS concrete mix.',
          camPos: new THREE.Vector3(-26, 4, 32),
          lookAt: new THREE.Vector3(0, 0, 0)
        },
        {
          time: 6,
          name: 'Station 2: Month 04-07 Commercial Podium Framing',
          title: '4D BIM Phasing: Level G & Level 1 Concrete Pour',
          desc: 'Double-height retail arcade and Level 1 commercial wellness deck framing completed using modular formwork.',
          camPos: new THREE.Vector3(28, 14, 28),
          lookAt: new THREE.Vector3(0, 6, 0)
        },
        {
          time: 13,
          name: 'Station 3: Month 08-14 Tower Residential Framing',
          title: '4D BIM Phasing: Levels 2 to 9 Modular RCC (IS 13920)',
          desc: 'Progressive 12-day floor slab cycle executing residential units with seismic ductile detailing and central shear core rising.',
          camPos: new THREE.Vector3(-28, 26, 32),
          lookAt: new THREE.Vector3(0, 18, 0)
        },
        {
          time: 20,
          name: 'Station 4: Month 15-18 Facade & MEP Installation',
          title: '4D BIM Phasing: Curtain Wall, Louvers & MEP Risers',
          desc: 'Double-glazed curtain wall panels, 42.5° kinetic louvers, and vertical plumbing risers installed concurrently.',
          camPos: new THREE.Vector3(26, 28, 22),
          lookAt: new THREE.Vector3(0, 22, 0)
        },
        {
          time: 27,
          name: 'Station 5: Month 19-24 Solar Array & Commissioning',
          title: '4D BIM Phasing: Handover & GRIHA 5-Star Validation',
          desc: '148 kWp solar pergola commissioned, rooftop sky forest planted, and digital twin delivered to facility managers.',
          camPos: new THREE.Vector3(0, 56, 42),
          lookAt: new THREE.Vector3(0, 32, 0)
        }
      ]
    };

    this.stations = this.tourDatabase.master;

    this.initLighting();
    this.createGroundSite();

    this.buildingGroup = new THREE.Group();
    this.scene.add(this.buildingGroup);
    buildFullBimBuilding(this.buildingGroup, null);

    this.initEventListeners();
    this.initResizeObserver();

    // Set initial camera to Station 0
    this.updateCameraToTime(0);

    this.lastTimestamp = performance.now();
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  initLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffaed, 2.2);
    sun.position.set(40, 60, 45);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x334155, 0.85);
    this.scene.add(hemi);
  }

  createGroundSite() {
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const plot = new THREE.Mesh(new THREE.BoxGeometry(48, 0.1, 36), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    plot.position.set(0, 0.05, 0);
    plot.receiveShadow = true;
    this.scene.add(plot);

    const treePositions = [
      [-26, 0, -18], [-26, 0, 0], [-26, 0, 18],
      [26, 0, -18], [26, 0, 0], [26, 0, 18],
      [-16, 0, -22], [0, 0, -22], [16, 0, -22],
      [-18, 0, 22], [0, 0, 22], [18, 0, 22]
    ];
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d });

    treePositions.forEach(pos => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5), treeTrunkMat);
      trunk.position.set(pos[0], 1.25, pos[2]);
      trunk.castShadow = true;
      this.scene.add(trunk);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 1), treeFoliageMat);
      foliage.position.set(pos[0], 3.2, pos[2]);
      foliage.castShadow = true;
      this.scene.add(foliage);
    });
  }

  initResizeObserver() {
    if (typeof ResizeObserver !== 'undefined' && this.canvas) {
      this.resizeObserver = new ResizeObserver(() => {
        this.resizeRendererToDisplaySize();
      });
      if (this.canvas.parentElement) {
        this.resizeObserver.observe(this.canvas.parentElement);
      }
    }
    window.addEventListener('resize', () => {
      this.resizeRendererToDisplaySize();
    });
  }

  resizeRendererToDisplaySize() {
    if (!this.canvas) return false;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (width > 0 && height > 0) {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.floor(width * pixelRatio);
      const targetHeight = Math.floor(height * pixelRatio);

      const needResize = this.canvas.width !== targetWidth || this.canvas.height !== targetHeight;
      if (needResize) {
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        return true;
      }
    }
    return false;
  }

  resize() {
    this.resizeRendererToDisplaySize();
  }

  switchTour(tourKey) {
    if (this.tourDatabase[tourKey]) {
      this.activeTourKey = tourKey;
      this.stations = this.tourDatabase[tourKey];
      this.seek(0);
      this.play();

      // Update Waypoint Chips in UI
      const chipContainer = document.querySelector('.waypoints-chips-row');
      if (chipContainer) {
        chipContainer.innerHTML = '';
        this.stations.forEach((st, idx) => {
          const btn = document.createElement('button');
          btn.className = `chip-waypoint ${idx === 0 ? 'active' : ''}`;
          btn.dataset.waypoint = idx;
          btn.textContent = `${idx + 1}. ${st.title.split(':')[1] || st.title}`;
          btn.addEventListener('click', () => this.seek(st.time));
          chipContainer.appendChild(btn);
        });
      }
    }
  }

  initEventListeners() {
    const playPauseBtn = document.getElementById('btnWtPlayPause');
    const rewindBtn = document.getElementById('btnWtRewind');
    const fwdBtn = document.getElementById('btnWtForward');
    const restartBtn = document.getElementById('btnWtRestart');
    const timelineBar = document.getElementById('wtTimelineBar');
    const tourSelector = document.getElementById('wtTourSelector');

    if (tourSelector) {
      tourSelector.addEventListener('change', (e) => {
        this.switchTour(e.target.value);
      });
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => this.togglePlay());
    }
    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => this.seek(Math.max(0, this.currentTime - 5)));
    }
    if (fwdBtn) {
      fwdBtn.addEventListener('click', () => this.seek(Math.min(this.duration, this.currentTime + 5)));
    }
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.seek(0);
        this.play();
      });
    }

    if (timelineBar) {
      timelineBar.addEventListener('click', (e) => {
        const rect = timelineBar.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seek(pct * this.duration);
      });
    }

    // Speed buttons
    document.querySelectorAll('.btn-speed').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-speed').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.speedMultiplier = parseFloat(btn.dataset.speed) || 1.0;
      });
    });

    // Waypoint chips
    document.querySelectorAll('.chip-waypoint, .station-marker').forEach(btn => {
      btn.addEventListener('click', () => {
        const stIdx = parseInt(btn.dataset.waypoint || btn.dataset.station, 10);
        if (this.stations[stIdx]) {
          this.seek(this.stations[stIdx].time);
        }
      });
    });
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  play() {
    this.isPlaying = true;
    this.resizeRendererToDisplaySize();
    const playIcon = document.getElementById('iconWtPlay');
    const pauseIcon = document.getElementById('iconWtPause');
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
  }

  pause() {
    this.isPlaying = false;
    const playIcon = document.getElementById('iconWtPlay');
    const pauseIcon = document.getElementById('iconWtPause');
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
  }

  seek(time) {
    this.currentTime = time;
    this.updateCameraToTime(this.currentTime);
    this.updateUI();
  }

  updateCameraToTime(t) {
    let s0 = this.stations[0];
    let s1 = this.stations[1];

    for (let i = 0; i < this.stations.length - 1; i++) {
      if (t >= this.stations[i].time && t <= this.stations[i + 1].time) {
        s0 = this.stations[i];
        s1 = this.stations[i + 1];
        break;
      }
    }

    if (t >= this.stations[this.stations.length - 1].time) {
      s0 = this.stations[this.stations.length - 1];
      s1 = s0;
    }

    const interval = s1.time - s0.time;
    const localT = interval > 0 ? (t - s0.time) / interval : 0;
    const easeT = localT * localT * (3 - 2 * localT);

    this.camera.position.lerpVectors(s0.camPos, s1.camPos, easeT);
    const targetLook = new THREE.Vector3().lerpVectors(s0.lookAt, s1.lookAt, easeT);
    this.camera.lookAt(targetLook);

    const liveStatus = document.getElementById('wtWaypointName');
    const narrationTime = document.getElementById('narrationTime');
    const narrationTitle = document.getElementById('narrationTitle');
    const narrationDesc = document.getElementById('narrationDesc');

    if (liveStatus) liveStatus.textContent = s0.name;
    if (narrationTime) {
      const curSec = Math.floor(t).toString().padStart(2, '0');
      narrationTime.textContent = `00:${curSec} / 00:30`;
    }
    if (narrationTitle) narrationTitle.textContent = s0.title;
    if (narrationDesc) narrationDesc.textContent = s0.desc;
  }

  updateUI() {
    const progressFill = document.getElementById('wtProgressFill');
    const currentTimeLbl = document.getElementById('wtCurrentTime');

    const pct = (this.currentTime / this.duration) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (currentTimeLbl) {
      const s = Math.floor(this.currentTime).toString().padStart(2, '0');
      currentTimeLbl.textContent = `00:${s}`;
    }

    const activeStationIdx = this.stations.findIndex((st, i) => {
      const nextTime = this.stations[i + 1] ? this.stations[i + 1].time : 31;
      return this.currentTime >= st.time && this.currentTime < nextTime;
    });

    document.querySelectorAll('.chip-waypoint').forEach((chip, i) => {
      chip.classList.toggle('active', i === activeStationIdx);
    });
    document.querySelectorAll('.station-marker').forEach((marker, i) => {
      marker.classList.toggle('active', i === activeStationIdx);
    });
  }

  render(timestamp) {
    requestAnimationFrame(this.render);

    this.resizeRendererToDisplaySize();

    const dt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    if (this.isPlaying) {
      this.currentTime += dt * this.speedMultiplier;
      if (this.currentTime >= this.duration) {
        this.currentTime = this.duration;
        this.pause();
      }
      this.updateCameraToTime(this.currentTime);
      this.updateUI();
    }

    this.renderer.render(this.scene, this.camera);
  }
}
