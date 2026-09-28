import * as THREE from 'three';

/**
 * Procedural Orbit Controls with Smooth Damping
 */
class SimpleOrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new THREE.Vector3(0, 16, 0);
    this.distance = 75;
    this.phi = Math.PI / 3.2;
    this.theta = Math.PI / 4;
    this.minDistance = 8;
    this.maxDistance = 220;
    this.minPolarAngle = 0.05;
    this.maxPolarAngle = Math.PI / 2 - 0.02;
    this.autoRotate = false;
    this.autoRotateSpeed = 0.6;

    this.isDragging = false;
    this.isPanning = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.initEvents();
    this.updateCamera();
  }

  initEvents() {
    this.domElement.addEventListener('pointerdown', (e) => {
      if (e.button === 0) this.isDragging = true;
      if (e.button === 2 || e.shiftKey) this.isPanning = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging && !this.isPanning) return;

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
        this.theta -= deltaX * 0.006;
        this.phi -= deltaY * 0.006;
        this.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.phi));
      }

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.updateCamera();
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
      this.isPanning = false;
    });

    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    this.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 1 + (e.deltaY > 0 ? 0.08 : -0.08);
      this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance * zoomFactor));
      this.updateCamera();
    }, { passive: false });

    // Touch Support
    let initialTouchDistance = 0;
    this.domElement.addEventListener('touchstart', (e) => {
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
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        this.theta -= deltaX * 0.008;
        this.phi -= deltaY * 0.008;
        this.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.phi));
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.updateCamera();
      } else if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = initialTouchDistance - currentDistance;
        this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance + diff * 0.05));
        initialTouchDistance = currentDistance;
        this.updateCamera();
      }
    });

    this.domElement.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  updateCamera() {
    const x = this.target.x + this.distance * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.target.y + this.distance * Math.cos(this.phi);
    const z = this.target.z + this.distance * Math.sin(this.phi) * Math.cos(this.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  setCameraPreset(type) {
    switch (type) {
      case 'axonometric':
        this.target.set(0, 16, 0);
        this.distance = 75;
        this.phi = Math.PI / 3.2;
        this.theta = Math.PI / 4;
        break;
      case 'front':
        this.target.set(0, 16, 0);
        this.distance = 70;
        this.phi = Math.PI / 2.2;
        this.theta = 0;
        break;
      case 'courtyard':
        this.target.set(0, 8, 0);
        this.distance = 32;
        this.phi = Math.PI / 4;
        this.theta = Math.PI / 3;
        break;
      case 'podium':
        this.target.set(0, 4, 18);
        this.distance = 38;
        this.phi = Math.PI / 2.4;
        this.theta = 0.2;
        break;
      case 'residential':
        this.target.set(0, 22, 12);
        this.distance = 42;
        this.phi = Math.PI / 2.3;
        this.theta = 0.4;
        break;
      case 'basement':
        this.target.set(0, -3, 0);
        this.distance = 45;
        this.phi = Math.PI / 3;
        this.theta = Math.PI / 2.5;
        break;
      case 'roof':
        this.target.set(0, 32, 0);
        this.distance = 42;
        this.phi = Math.PI / 6;
        this.theta = Math.PI / 4;
        break;
    }
    this.updateCamera();
  }

  update() {
    if (this.autoRotate) {
      this.theta += 0.003 * this.autoRotateSpeed;
      this.updateCamera();
    }
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

  // Architectural Materials
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xd8dee9,
    roughness: 0.75,
    metalness: 0.1
  });
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0xe5e9f0,
    roughness: 0.8,
    metalness: 0.05
  });
  const columnMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.65,
    metalness: 0.2
  });
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.7,
    metalness: 0.15
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    transmission: 0.75,
    opacity: 0.85,
    transparent: true,
    roughness: 0.08,
    metalness: 0.1,
    ior: 1.52,
    reflectivity: 0.6
  });
  const woodDeckMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.55,
    metalness: 0.15
  });
  const vegetationMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.85,
    metalness: 0.05
  });
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.45
  });
  const solarPvMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    roughness: 0.15,
    metalness: 0.85
  });
  const evChargerMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.35,
    metalness: 0.4
  });
  const louverMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.4,
    metalness: 0.45
  });
  const railingMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.3,
    metalness: 0.8
  });

  const buildingW = 40; // 40,000 mm outer width
  const buildingD = 30; // 30,000 mm outer depth
  const courtW = 16;    // 16,000 mm courtyard width
  const courtD = 14;    // 14,000 mm courtyard depth

  function registerInteractive(obj, data) {
    obj.userData = data;
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
    return grp;
  }

  function createGlassArcade(grp, outerW, outerD, innerW, innerD, h) {
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, h, 0.12), glassMat);
    southGlass.position.set(0, h / 2, outerD / 2);
    registerInteractive(southGlass, {
      name: 'Double Glazed Curtain Wall Facade',
      category: 'Architectural Glazing Envelope',
      dim: `${outerW * 1000} × ${Math.round(h * 1000)} mm`,
      area: `${outerW * h} m²`,
      family: 'LowE_Double_Glazed_ArgonInfill',
      env: 'SHGC 0.28, U-value 1.4 W/m²K, 82% VLT Daylight Autonomy',
      mat: '6-12-6 Low-E Argon-Infilled Double Glazing'
    });
    grp.add(southGlass);

    const northGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, h, 0.12), glassMat);
    northGlass.position.set(0, h / 2, -outerD / 2);
    grp.add(northGlass);

    const eastGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, outerD), glassMat);
    eastGlass.position.set(outerW / 2, h / 2, 0);
    grp.add(eastGlass);

    const westGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, outerD), glassMat);
    westGlass.position.set(-outerW / 2, h / 2, 0);
    grp.add(westGlass);

    // Internal courtyard glass arcade
    const courtGlassS = new THREE.Mesh(new THREE.BoxGeometry(innerW, h, 0.08), glassMat);
    courtGlassS.position.set(0, h / 2, innerD / 2);
    grp.add(courtGlassS);

    const courtGlassN = new THREE.Mesh(new THREE.BoxGeometry(innerW, h, 0.08), glassMat);
    courtGlassN.position.set(0, h / 2, -innerD / 2);
    grp.add(courtGlassN);

    // Columns on 8m modular grid
    for (let x = -16; x <= 16; x += 8) {
      for (let z = -12; z <= 12; z += 8) {
        if (Math.abs(x) < innerW / 2 && Math.abs(z) < innerD / 2) continue;
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.6), columnMat);
        col.position.set(x, h / 2, z);
        col.castShadow = true;
        col.receiveShadow = true;
        registerInteractive(col, {
          name: `RCC Structural Column C1 (Grid ${x >= 0 ? '+' : ''}${x}, ${z >= 0 ? '+' : ''}${z})`,
          category: 'RCC Structural Column',
          dim: '600 × 600 mm',
          area: '0.36 m²',
          family: 'M40_RCC_Column_600x600',
          env: 'IS 456 / IS 13920 Ductile Seismic Detailing (12-T25 Rebar)',
          mat: 'Grade M40 High-Strength Concrete / Fe500D TMT'
        });
        grp.add(col);
      }
    }
  }

  /* -------------------------------------------------------------
     LEVEL B1: Basement Parking & EV Hub (Y = -3.8m)
     ------------------------------------------------------------- */
  const b1Grp = levelGroups.B1;
  b1Grp.position.y = -3.8;
  b1Grp.userData = { levelName: 'Level B1: Automated Car Parking & EV Supercharging Hub', baseElevation: -3.8 };

  const b1Slab = new THREE.Mesh(new THREE.BoxGeometry(buildingW + 4, 0.4, buildingD + 4), concreteMat);
  b1Slab.position.y = 0;
  b1Slab.receiveShadow = true;
  registerInteractive(b1Slab, {
    name: 'Basement Raft Foundation & Ground Slab',
    category: 'RCC Substructure Foundation',
    dim: '44,000 × 34,000 × 400 mm',
    area: '1,496 m²',
    family: 'Raft_Foundation_Slab_M40',
    env: 'Waterproofed with Integral Crystalline Admixture',
    mat: 'Grade M40 Self-Compacting RCC'
  });
  b1Grp.add(b1Slab);

  for (let x = -16; x <= 16; x += 8) {
    for (let z = -12; z <= 12; z += 8) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.8, 0.65), columnMat);
      col.position.set(x, 1.9, z);
      col.castShadow = true;
      col.receiveShadow = true;
      registerInteractive(col, {
        name: `Basement Column C1 (Grid ${x},${z})`,
        category: 'RCC Structural Column',
        dim: '650 × 650 mm',
        area: '0.42 m²',
        family: 'M40_RCC_Basement_Column',
        env: 'Load capacity 5,200 kN with 14-T25 rebar',
        mat: 'Grade M40 Concrete / Fe500D Steel'
      });
      b1Grp.add(col);
    }
  }

  // 48 Smart EV Charging Stalls
  for (let x = -16; x <= 16; x += 4) {
    [-11, 11].forEach(zPos => {
      const stall = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.02, 5.0), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 }));
      stall.position.set(x, 0.21, zPos);
      b1Grp.add(stall);

      const charger = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.3), evChargerMat);
      charger.position.set(x, 0.8, zPos > 0 ? zPos + 2.4 : zPos - 2.4);
      charger.castShadow = true;
      registerInteractive(charger, {
        name: 'Smart Fast EV Charging Post (22kW / 60kW)',
        category: 'MEP Green Infrastructure',
        dim: '500 × 300 × 1,600 mm',
        area: '0.15 m²',
        family: 'Smart_EV_Charger_22kW_Type2',
        env: 'Solar Dynamic Load Balancing with Rooftop BIPV Grid',
        mat: 'Weatherproof Aluminium Enclosure / Type-2 Fast Cable'
      });
      b1Grp.add(charger);
    });
  }

  // Rainwater Cistern & MEP Core
  const cistern = new THREE.Mesh(new THREE.BoxGeometry(8, 2.5, 6), new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.4 }));
  cistern.position.set(0, 1.25, 0);
  registerInteractive(cistern, {
    name: 'Underground Rainwater Cistern & UV Treatment',
    category: 'MEP Water Conservation System',
    dim: '8,000 × 6,000 × 2,500 mm',
    area: '48 m² (45,000 L Storage Capacity)',
    family: 'Rainwater_Harvesting_Cistern_45kL',
    env: 'Captures 100% roof runoff; supplies 100% of landscaping & flushing needs',
    mat: 'Hydrophobic RCC with Dual-Stage Micron & UV Filtration'
  });
  b1Grp.add(cistern);

  // Vehicular Ingress Ramp
  const ramp = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 14), concreteMat);
  ramp.rotation.x = Math.PI / 12;
  ramp.position.set(-16, 1.8, 18);
  b1Grp.add(ramp);

  /* -------------------------------------------------------------
     GROUND FLOOR (Y = 0m)
     ------------------------------------------------------------- */
  const gGrp = levelGroups.G;
  gGrp.position.y = 0;
  gGrp.userData = { levelName: 'Ground Floor: Active Commercial Arcade & Central Courtyard', baseElevation: 0 };

  const gFloor = createRing(buildingW, buildingD, courtW, courtD, 0.35, slabMat);
  gFloor.position.y = 0;
  gFloor.receiveShadow = true;
  gGrp.add(gFloor);

  // Central Open Courtyard
  const courtyardBase = new THREE.Mesh(new THREE.BoxGeometry(courtW, 0.12, courtD), woodDeckMat);
  courtyardBase.position.set(0, 0.06, 0);
  courtyardBase.receiveShadow = true;
  registerInteractive(courtyardBase, {
    name: 'Central Biophilic Landscape Courtyard',
    category: 'Microclimate Atrium & Thermal Chimney',
    dim: '16,000 × 14,000 mm',
    area: '224 m² (Open-to-Sky)',
    family: 'Courtyard_Biophilic_Atrium',
    env: 'Harnesses natural convective stack effect to cool all 9 upper floors passively (4.5 ACH)',
    mat: 'Permeable Timber Deck, Native Flora, Bio-Filtration Pond'
  });
  gGrp.add(courtyardBase);

  // Bio-filtration Water Pond
  const waterPond = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.25, 5.5), waterMat);
  waterPond.position.set(0, 0.15, 0);
  registerInteractive(waterPond, {
    name: 'Bio-Filtration Reflection Water Feature',
    category: 'Biophilic Water Feature',
    dim: '6,500 × 5,500 × 300 mm',
    area: '35.7 m²',
    family: 'Water_Feature_Microclimate_Biofilter',
    env: 'Evaporative cooling lowers courtyard ambient temperature by 3.8°C',
    mat: 'Basalt Stone Lining & Recirculating Ecological Bio-filter'
  });
  gGrp.add(waterPond);

  // Courtyard Trees
  [-4.5, 4.5].forEach(tx => {
    [-3.5, 3.5].forEach(tz => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.0), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      trunk.position.set(tx, 1.0, tz);
      gGrp.add(trunk);

      const cTree = new THREE.Mesh(new THREE.DodecahedronGeometry(1.4, 1), vegetationMat);
      cTree.position.set(tx, 2.6, tz);
      cTree.castShadow = true;
      gGrp.add(cTree);
    });
  });

  // Double-height ground arcade (4.5m)
  createGlassArcade(gGrp, buildingW, buildingD, courtW, courtD, 4.5);

  /* -------------------------------------------------------------
     FIRST FLOOR (1F, Y = 4.5m)
     ------------------------------------------------------------- */
  const l1Grp = levelGroups.L1;
  l1Grp.position.y = 4.5;
  l1Grp.userData = { levelName: '1st Floor: Commercial Wellness & Co-Working Hub', baseElevation: 4.5 };

  const l1Floor = createRing(buildingW, buildingD, courtW, courtD, 0.3, slabMat);
  l1Floor.receiveShadow = true;
  l1Grp.add(l1Floor);

  // Timber Skywalk Bridge
  const skyBridge = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, courtD), woodDeckMat);
  skyBridge.position.set(0, 0.15, 0);
  registerInteractive(skyBridge, {
    name: 'Courtyard Skywalk Bridge & Viewing Platform',
    category: 'Biophilic Circulation Interface',
    dim: '3,200 × 14,000 mm',
    area: '44.8 m²',
    family: 'Circulation_Bridge_Wood_Steel',
    env: 'Elevated cross-ventilation corridor with panoramic visual connection to garden',
    mat: 'Treated FSC Hardwood Decking, Structural Steel Truss, Glass Balustrade'
  });
  l1Grp.add(skyBridge);

  // Glass balustrades on skybridge
  const brLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, courtD), glassMat);
  brLeft.position.set(-1.6, 0.7, 0);
  l1Grp.add(brLeft);

  const brRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, courtD), glassMat);
  brRight.position.set(1.6, 0.7, 0);
  l1Grp.add(brRight);

  // 1F Glass arcade (4.0m)
  createGlassArcade(l1Grp, buildingW, buildingD, courtW, courtD, 4.0);

  /* -------------------------------------------------------------
     RESIDENTIAL LEVELS: 2nd to 9th Floor (Y = 8.5 to 31.6m)
     ------------------------------------------------------------- */
  const resHeight = 3.3;
  const resLevels = ['L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'];

  resLevels.forEach((lvlKey, idx) => {
    const lvlGrp = levelGroups[lvlKey];
    const elevY = 8.5 + idx * resHeight;
    lvlGrp.position.y = elevY;
    lvlGrp.userData = { levelName: `Level ${idx + 2}: Sustainable Residential Living Units`, baseElevation: elevY };

    // Residential floor slab
    const resSlab = createRing(buildingW, buildingD, courtW, courtD, 0.25, slabMat);
    resSlab.receiveShadow = true;
    lvlGrp.add(resSlab);

    // Columns on 8m grid
    for (let x = -16; x <= 16; x += 8) {
      for (let z = -12; z <= 12; z += 8) {
        if (Math.abs(x) < courtW / 2 && Math.abs(z) < courtD / 2) continue;
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, resHeight, 0.5), columnMat);
        col.position.set(x, resHeight / 2, z);
        col.castShadow = true;
        col.receiveShadow = true;
        lvlGrp.add(col);
      }
    }

    // Concrete core shear walls around lift shafts
    const coreWallW = new THREE.Mesh(new THREE.BoxGeometry(0.3, resHeight, 4), coreMat);
    coreWallW.position.set(-courtW / 2 - 1.5, resHeight / 2, 0);
    lvlGrp.add(coreWallW);

    const coreWallE = new THREE.Mesh(new THREE.BoxGeometry(0.3, resHeight, 4), coreMat);
    coreWallE.position.set(courtW / 2 + 1.5, resHeight / 2, 0);
    lvlGrp.add(coreWallE);

    // Staggered Cantilever Balconies & Planters
    const isStaggered = idx % 2 === 0;
    [-12, -4, 4, 12].forEach((bx, i) => {
      if ((i % 2 === 0 && isStaggered) || (i % 2 !== 0 && !isStaggered)) {
        // Balcony concrete slab
        const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 2.0), concreteMat);
        balcSlab.position.set(bx, 0.11, buildingD / 2 + 1.0);
        balcSlab.castShadow = true;
        balcSlab.receiveShadow = true;
        lvlGrp.add(balcSlab);

        // Balcony Glass Railing
        const balcRailing = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.15, 0.06), glassMat);
        balcRailing.position.set(bx, 0.68, buildingD / 2 + 2.0);
        lvlGrp.add(balcRailing);

        // Stainless handrail cap
        const handrailCap = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.05, 0.08), railingMat);
        handrailCap.position.set(bx, 1.25, buildingD / 2 + 2.0);
        lvlGrp.add(handrailCap);

        // Biophilic Balcony Planter
        const planter = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.5, 0.45), vegetationMat);
        planter.position.set(bx, 0.35, buildingD / 2 + 1.75);
        registerInteractive(planter, {
          name: 'Biophilic Balcony Planter (Automated Drip)',
          category: 'Microclimate Vegetation Buffer',
          dim: '6,000 × 450 × 500 mm',
          area: '2.7 m²',
          family: 'Bio_Planter_Drip_Irrigated',
          env: 'Reduces balcony surface temperature by 4.2°C via evapotranspiration',
          mat: 'Lightweight Engineered Soil, Native Jasmine / Boston Fern'
        });
        lvlGrp.add(planter);

        // Parametric Kinetic Aerofoil Louvers (Innovation 1: Biomimetic AI Louvers)
        for (let l = 0; l < 4; l++) {
          const louver = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.08, 0.38), louverMat);
          louver.rotation.x = Math.PI / 4.5;
          louver.position.set(bx, 1.15 + l * 0.48, buildingD / 2 + 1.9);
          louver.castShadow = true;
          registerInteractive(louver, {
            name: 'Biomimetic AI Aerofoil Solar Louver',
            category: 'Passive Climate-Responsive Envelope',
            dim: '6,000 × 380 × 80 mm',
            area: '2.28 m²',
            family: 'Kinetic_Solar_Louver_Aluminium',
            env: 'Blocks 85% of peak afternoon summer glare while admitting diffuse daylight',
            mat: 'Anodized Architectural Bronze Aluminium'
          });
          lvlGrp.add(louver);
          if (kineticLouversList) kineticLouversList.push(louver);
        }
      }
    });

    // North Balconies (Symmetric)
    [-12, -4, 4, 12].forEach((bx, i) => {
      if ((i % 2 === 0 && !isStaggered) || (i % 2 !== 0 && isStaggered)) {
        const balcSlabN = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.22, 2.0), concreteMat);
        balcSlabN.position.set(bx, 0.11, -buildingD / 2 - 1.0);
        balcSlabN.castShadow = true;
        balcSlabN.receiveShadow = true;
        lvlGrp.add(balcSlabN);

        const balcRailingN = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.15, 0.06), glassMat);
        balcRailingN.position.set(bx, 0.68, -buildingD / 2 - 2.0);
        lvlGrp.add(balcRailingN);

        const planterN = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.5, 0.45), vegetationMat);
        planterN.position.set(bx, 0.35, -buildingD / 2 - 1.75);
        lvlGrp.add(planterN);
      }
    });

    // Continuous Double Glazed Facade Windows
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(buildingW, resHeight * 0.8, 0.1), glassMat);
    southGlass.position.set(0, resHeight * 0.5, buildingD / 2);
    lvlGrp.add(southGlass);

    const northGlass = new THREE.Mesh(new THREE.BoxGeometry(buildingW, resHeight * 0.8, 0.1), glassMat);
    northGlass.position.set(0, resHeight * 0.5, -buildingD / 2);
    lvlGrp.add(northGlass);

    const eastGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, resHeight * 0.8, buildingD), glassMat);
    eastGlass.position.set(buildingW / 2, resHeight * 0.5, 0);
    lvlGrp.add(eastGlass);

    const westGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, resHeight * 0.8, buildingD), glassMat);
    westGlass.position.set(-buildingW / 2, resHeight * 0.5, 0);
    lvlGrp.add(westGlass);

    // Courtyard inner perimeter glass & railings
    const courtInS = new THREE.Mesh(new THREE.BoxGeometry(courtW, 1.1, 0.06), glassMat);
    courtInS.position.set(0, 0.6, courtD / 2);
    lvlGrp.add(courtInS);

    const courtInN = new THREE.Mesh(new THREE.BoxGeometry(courtW, 1.1, 0.06), glassMat);
    courtInN.position.set(0, 0.6, -courtD / 2);
    lvlGrp.add(courtInN);
  });

  /* -------------------------------------------------------------
     ROOFTOP: Bio-Solar Sky Terrace (Y = 34.9m)
     ------------------------------------------------------------- */
  const rfGrp = levelGroups.RF;
  rfGrp.position.y = 34.9;
  rfGrp.userData = { levelName: 'Rooftop Sky Garden & Solar BIPV Pergola', baseElevation: 34.9 };

  const roofSlab = createRing(buildingW, buildingD, courtW, courtD, 0.35, slabMat);
  roofSlab.receiveShadow = true;
  registerInteractive(roofSlab, {
    name: '10F Rooftop Sky Garden Deck & Running Track',
    category: 'Bio-Solar Rooftop Amenity',
    dim: '40,000 × 30,000 × 350 mm',
    area: '976 m²',
    family: 'Roof_SkyGarden_Slab_Insulated',
    env: 'Extensive green roof + solar PV reduces urban heat island effect by 4.8°C',
    mat: 'Elastomeric Waterproofing Membrane, XPS Insulation, Timber Decking'
  });
  rfGrp.add(roofSlab);

  // Perimeter Glass Safety Barrier
  const rfParapet = new THREE.Mesh(new THREE.BoxGeometry(buildingW, 1.4, 0.08), glassMat);
  rfParapet.position.set(0, 0.7, buildingD / 2);
  rfGrp.add(rfParapet);

  const rfParapetN = new THREE.Mesh(new THREE.BoxGeometry(buildingW, 1.4, 0.08), glassMat);
  rfParapetN.position.set(0, 0.7, -buildingD / 2);
  rfGrp.add(rfParapetN);

  // 148 kWp BIPV Solar PV Pergola Canopy
  const solarCanopy = new THREE.Group();
  for (let x = -16; x <= 16; x += 4) {
    for (let z = -10; z <= 10; z += 4) {
      if (Math.abs(x) < courtW / 2 && Math.abs(z) < courtD / 2) continue;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 3.6), solarPvMat);
      panel.rotation.x = -Math.PI / 16;
      panel.position.set(x, 3.5, z);
      panel.castShadow = true;
      registerInteractive(panel, {
        name: 'Bifacial BIPV Solar Photovoltaic Panel (450W)',
        category: 'Renewable Energy Generation',
        dim: '2,000 × 1,000 mm modules',
        area: '620 m² Total Array (330 Modules)',
        family: 'BIPV_Solar_Pergola_Monocrystalline',
        env: 'Generates 185,000 kWh/yr clean electricity (-51% building EUI)',
        mat: 'Bifacial Tempered Glass / High-Efficiency Silicon Cells'
      });
      solarCanopy.add(panel);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5), columnMat);
      post.position.set(x, 1.75, z);
      solarCanopy.add(post);
    }
  }
  rfGrp.add(solarCanopy);

  // Rooftop Planter Boxes & Community Garden
  [-12, 12].forEach(px => {
    const planterBox = new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 4), vegetationMat);
    planterBox.position.set(px, 0.3, 0);
    planterBox.castShadow = true;
    registerInteractive(planterBox, {
      name: 'Rooftop Community Organic Farm Plot',
      category: 'Urban Agriculture & Rainwater Sponge',
      dim: '6,000 × 4,000 × 600 mm',
      area: '24 m² ea',
      family: 'Green_Roof_Hydroponic_Bed',
      env: 'Absorbs 85% of peak storm rainfall and provides fresh resident produce',
      mat: 'Lightweight Engineered Growing Media & Drip Irrigation'
    });
    rfGrp.add(planterBox);
  });

  return levelGroups;
}

/**
 * Core 3D BIM Viewer Engine
 */
export class BimViewer3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`BimViewer3D: Canvas element #${canvasId} not found.`);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);
    this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.005);

    const width = this.canvas.clientWidth || 800;
    const height = this.canvas.clientHeight || 600;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new SimpleOrbitControls(this.camera, this.canvas);

    this.buildingGroup = new THREE.Group();
    this.scene.add(this.buildingGroup);
    this.interactiveObjects = [];
    this.kineticLouvers = [];

    this.initLights();
    this.createGroundSite();
    this.levelGroups = buildFullBimBuilding(this.buildingGroup, this.interactiveObjects, this.kineticLouvers);

    this.initCfdParticleSystem();
    this.initInteractivity();
    this.initResizeObserver();

    this.currentViewMode = 'realistic';
    this.isKineticAnimated = true;
    this.cfdFlowSpeed = 1.0;
    this.cfdActive = true;

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.5);
    this.sunLight.position.set(45, 65, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 180;
    this.sunLight.shadow.camera.left = -45;
    this.sunLight.shadow.camera.right = 45;
    this.sunLight.shadow.camera.top = 45;
    this.sunLight.shadow.camera.bottom = -45;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 0.65);
    this.scene.add(this.hemiLight);
  }

  createGroundSite() {
    // Site ground plane
    const siteGeo = new THREE.PlaneGeometry(160, 160);
    const siteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.85, metalness: 0.05 });
    const site = new THREE.Mesh(siteGeo, siteMat);
    site.rotation.x = -Math.PI / 2;
    site.position.y = -0.05;
    site.receiveShadow = true;
    this.scene.add(site);

    // Architectural grid lines
    const grid = new THREE.GridHelper(160, 40, 0x94a3b8, 0xcbd5e1);
    grid.position.y = 0;
    this.scene.add(grid);

    // Building Plot boundary (48m × 36m)
    const plot = new THREE.Mesh(
      new THREE.BoxGeometry(48, 0.1, 36),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 })
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
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

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

  /**
   * INNOVATION 2: 3D Convective Thermal Chimney CFD Particle System
   */
  initCfdParticleSystem() {
    const count = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 13; // X within courtyard
      positions[i * 3 + 1] = Math.random() * 36;          // Y from 0 to 36m height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 11; // Z within courtyard
      velocities[i] = 0.08 + Math.random() * 0.12;

      // Color gradient: Cool Cyan at base -> Warm Amber at top
      const normalizedHeight = positions[i * 3 + 1] / 36;
      colors[i * 3 + 0] = 0.1 + normalizedHeight * 0.9;
      colors[i * 3 + 1] = 0.8 - normalizedHeight * 0.2;
      colors[i * 3 + 2] = 1.0 - normalizedHeight * 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.55,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.cfdParticles = new THREE.Points(geometry, material);
    this.cfdVelocities = velocities;
    this.scene.add(this.cfdParticles);
  }

  toggleCfdParticles(enable) {
    this.cfdActive = enable;
    if (this.cfdParticles) this.cfdParticles.visible = enable;
  }

  setCfdFlowSpeed(factor) {
    this.cfdFlowSpeed = factor;
  }

  /**
   * INNOVATION 1: Kinetic Facade Actuation Engine
   */
  setFacadeKineticMode(mode) {
    let targetAngle = Math.PI / 4.5;
    if (mode === 'solar') targetAngle = Math.PI / 4.2;
    else if (mode === 'vortex') targetAngle = Math.PI / 6.4;
    else if (mode === 'storm') targetAngle = 0.05;
    else if (mode === 'night') targetAngle = Math.PI / 2.1;

    this.kineticLouvers.forEach(louver => {
      louver.rotation.x = targetAngle;
    });
  }

  /**
   * INNOVATION 3 & 4: 3D Viewport Shader Mode Switching
   */
  setViewMode(mode) {
    this.currentViewMode = mode;
    this.buildingGroup.traverse(child => {
      if (child.isMesh && child.userData && child.userData.category) {
        if (mode === 'carbon') {
          // Embodied Carbon Heatmap Shader
          if (child.userData.category.includes('RCC') || child.userData.category.includes('Foundation')) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 }); // Bio-concrete (Low Carbon)
          } else if (child.userData.category.includes('Glazing') || child.userData.category.includes('Envelope')) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.7 });
          } else if (child.userData.category.includes('Louver') || child.userData.category.includes('Steel')) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
          } else if (child.userData.category.includes('Biophilic') || child.userData.category.includes('Vegetation')) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x059669 });
          }
        } else if (mode === 'cfd') {
          // Thermal Gradient Shader
          const y = child.position.y + (child.parent ? child.parent.position.y : 0);
          const tColor = new THREE.Color().setHSL(0.6 - (y / 40) * 0.6, 0.9, 0.5);
          child.material = new THREE.MeshStandardMaterial({ color: tColor, roughness: 0.6 });
        } else if (mode === 'xray') {
          // X-Ray Structural Skeleton
          if (child.userData.category.includes('RCC') || child.userData.category.includes('Column')) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0369a1, roughness: 0.3 });
          } else {
            child.material = new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.15 });
          }
        } else {
          // Realistic Default - reload standard materials on next tick or preserve
        }
      }
    });
  }

  initInteractivity() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('click', (e) => {
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

          if (elemTitle) elemTitle.textContent = obj.userData.name;
          if (elemCategory) elemCategory.textContent = obj.userData.category || 'Revit Family';
          if (elemDim) elemDim.textContent = obj.userData.dim || 'Specified in mm';
          if (elemArea) elemArea.textContent = obj.userData.area || '—';
          if (elemFamily) elemFamily.textContent = obj.userData.family || 'Autodesk_Revit_BIM';
          if (elemEnv) elemEnv.textContent = obj.userData.env || 'Optimized';
          if (elemMat) elemMat.textContent = obj.userData.mat || 'Standard Spec';
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
      this.sunLight.intensity = 1.5;
      this.ambientLight.intensity = 0.85;
      this.scene.background.setHex(0xf1f5f9);
    } else if (mode === 'golden') {
      this.setSunTime(17.5);
      this.sunLight.intensity = 1.8;
      this.ambientLight.intensity = 0.7;
      this.sunLight.color.setHex(0xffaa44);
      this.scene.background.setHex(0xfef3c7);
    } else if (mode === 'night') {
      this.sunLight.intensity = 0.2;
      this.ambientLight.intensity = 0.35;
      this.scene.background.setHex(0x0f172a);
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
    this.controls.update();

    // 1. Animate Convective Thermal CFD Particles
    if (this.cfdActive && this.cfdParticles) {
      const positions = this.cfdParticles.geometry.attributes.position.array;
      const count = positions.length / 3;
      const speed = 0.12 * this.cfdFlowSpeed;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += this.cfdVelocities[i] * speed;
        // Natural gentle vortex wobble
        positions[i * 3 + 0] += Math.sin(positions[i * 3 + 1] * 0.3 + i) * 0.015;
        positions[i * 3 + 2] += Math.cos(positions[i * 3 + 1] * 0.3 + i) * 0.015;

        // Reset particle to base of courtyard water feature when reaching top vent
        if (positions[i * 3 + 1] > 37) {
          positions[i * 3 + 1] = 0.2 + Math.random() * 0.8;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
      }
      this.cfdParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/**
 * 30-Second Cinematic Walkthrough Animation Engine
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
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.005);

    const width = this.canvas.clientWidth || 900;
    const height = this.canvas.clientHeight || 520;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 500);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
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

    // 5 Curated Architectural Keyframe Stations
    this.stations = [
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
        title: '10F Bio-Solar Roof, Community Farm & 360° Skyline',
        desc: '148 kWp bifacial solar PV canopy generating 185 MWh/yr, combined with resident urban farming plots, running track, and rainwater retention deck.',
        camPos: new THREE.Vector3(0, 56, 42),
        lookAt: new THREE.Vector3(0, 32, 0)
      }
    ];

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
    const ambient = new THREE.AmbientLight(0xffffff, 0.95);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffaed, 1.8);
    sun.position.set(40, 60, 45);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x334155, 0.6);
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

  initEventListeners() {
    const playPauseBtn = document.getElementById('btnWtPlayPause');
    const rewindBtn = document.getElementById('btnWtRewind');
    const fwdBtn = document.getElementById('btnWtForward');
    const restartBtn = document.getElementById('btnWtRestart');
    const timelineBar = document.getElementById('wtTimelineBar');

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
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
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
