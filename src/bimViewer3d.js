import * as THREE from 'three';

/**
 * Procedural Orbit Controls implementation for robust browser compatibility
 */
class SimpleOrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new THREE.Vector3(0, 15, 0);
    this.distance = 75;
    this.phi = Math.PI / 3;
    this.theta = Math.PI / 4;
    this.minDistance = 10;
    this.maxDistance = 180;
    this.minPolarAngle = 0.05;
    this.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground
    this.autoRotate = false;
    this.autoRotateSpeed = 0.5;

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
        // Pan
        const panSpeed = 0.03 * (this.distance / 50);
        const forward = new THREE.Vector3().subVectors(this.target, this.camera.position).normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        const up = new THREE.Vector3().crossVectors(right, forward).normalize();

        this.target.addScaledVector(right, -deltaX * panSpeed);
        this.target.addScaledVector(up, deltaY * panSpeed);
      } else if (this.isDragging) {
        // Orbit
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

    // Touch Support for mobile / iPad
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
 * Core 3D BIM Viewer Engine
 */
export class BimViewer3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf1f5f9);
    this.scene.fog = new THREE.FogExp2(0xf1f5f9, 0.006);

    this.camera = new THREE.PerspectiveCamera(45, this.canvas.clientWidth / this.canvas.clientHeight, 0.5, 500);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new SimpleOrbitControls(this.camera, this.canvas);

    // Groups for exploded view and layer isolation
    this.buildingGroup = new THREE.Group();
    this.scene.add(this.buildingGroup);

    this.levelGroups = {
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

    this.layerGroups = {
      arch: new THREE.Group(),
      structure: new THREE.Group(),
      louvers: new THREE.Group(),
      landscape: new THREE.Group(),
      basementEV: new THREE.Group(),
      mep: new THREE.Group()
    };

    this.interactiveObjects = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initLights();
    this.createGroundSite();
    this.buildProceduralBimModel();
    this.initInteractivity();
    this.initResizeListener();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    this.sunLight.position.set(40, 60, 35);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 200;
    this.sunLight.shadow.camera.left = -45;
    this.sunLight.shadow.camera.right = 45;
    this.sunLight.shadow.camera.top = 45;
    this.sunLight.shadow.camera.bottom = -45;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Warm bounce light
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 0.6);
    this.scene.add(this.hemiLight);
  }

  createGroundSite() {
    // Ground site plane (48m x 36m in model scale, 1 unit = 1 meter)
    const siteGeo = new THREE.PlaneGeometry(160, 160);
    const siteMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.8,
      metalness: 0.1
    });
    const site = new THREE.Mesh(siteGeo, siteMat);
    site.rotation.x = -Math.PI / 2;
    site.position.y = -0.05;
    site.receiveShadow = true;
    this.scene.add(site);

    // Grid helper overlay
    const grid = new THREE.GridHelper(160, 40, 0x94a3b8, 0xcbd5e1);
    grid.position.y = 0;
    this.scene.add(grid);

    // Plot Boundary (48m x 36m)
    const plotGeo = new THREE.BoxGeometry(48, 0.1, 36);
    const plotMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.6
    });
    const plot = new THREE.Mesh(plotGeo, plotMat);
    plot.position.set(0, 0.05, 0);
    plot.receiveShadow = true;
    this.scene.add(plot);

    // Surrounding trees and street layout
    this.createSiteContextTrees();
  }

  createSiteContextTrees() {
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });

    const treePositions = [
      [-26, 0, -18], [-26, 0, 0], [-26, 0, 18],
      [26, 0, -18], [26, 0, 0], [26, 0, 18],
      [-16, 0, -22], [0, 0, -22], [16, 0, -22],
      [-18, 0, 22], [0, 0, 22], [18, 0, 22]
    ];

    treePositions.forEach(pos => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5), treeTrunkMat);
      trunk.position.set(pos[0], 1.25, pos[2]);
      trunk.castShadow = true;
      this.scene.add(trunk);

      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8, 1), treeFoliageMat);
      foliage.position.set(pos[0], 3.2, pos[2]);
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      this.scene.add(foliage);
    });
  }

  buildProceduralBimModel() {
    // Add level groups to building group
    Object.values(this.levelGroups).forEach(grp => this.buildingGroup.add(grp));

    // Materials Palette
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.85, metalness: 0.1 });
    const columnMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.2 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.7,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.5
    });
    const woodDeckMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
    const vegetationMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8 });
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.4 });
    const solarPvMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.2, metalness: 0.8 });
    const evChargerMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.5 });
    const louverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4, metalness: 0.3 }); // Champagne Bronze

    // Base dimensions (40m width x 30m depth, central courtyard 16m x 14m)
    const buildingW = 40;
    const buildingD = 30;
    const courtW = 16;
    const courtD = 14;

    /* -------------------------------------------------------------
       LEVEL B1: Basement Parking & EV Hub (Height = -3.8m)
       ------------------------------------------------------------- */
    const b1Grp = this.levelGroups.B1;
    b1Grp.position.y = -3.8;
    b1Grp.userData = { levelName: 'Level B1: Automated Car Parking & EV Supercharging Hub', baseElevation: -3.8 };

    // Basement Retaining Walls & Slab
    const b1Slab = new THREE.Mesh(new THREE.BoxGeometry(buildingW, 0.4, buildingD), concreteMat);
    b1Slab.position.y = 0;
    b1Slab.receiveShadow = true;
    b1Grp.add(b1Slab);

    // Basement Columns Grid (8m x 8m)
    for (let x = -16; x <= 16; x += 8) {
      for (let z = -12; z <= 12; z += 8) {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, 3.8, 0.6), columnMat);
        col.position.set(x, 1.9, z);
        col.castShadow = true;
        col.receiveShadow = true;
        col.userData = {
          name: `Column C1 (Grid ${x},${z})`,
          category: 'RCC Structural Column',
          dim: '600 × 600 mm',
          area: '0.36 m²',
          family: 'M40_RCC_Column_600x600',
          env: 'Load bearing 4500 kN capacity with 12-T25 rebar',
          mat: 'M40 Concrete / Fe500D TMT Steel'
        };
        this.interactiveObjects.push(col);
        b1Grp.add(col);
      }
    }

    // EV Parking Bays & Chargers
    for (let x = -14; x <= 14; x += 4) {
      // North & South parking stalls
      [-10, 10].forEach(zPos => {
        const stallMarking = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.02, 5.0), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
        stallMarking.position.set(x, 0.21, zPos);
        b1Grp.add(stallMarking);

        const charger = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.3), evChargerMat);
        charger.position.set(x, 0.8, zPos > 0 ? zPos + 2.4 : zPos - 2.4);
        charger.castShadow = true;
        charger.userData = {
          name: 'Fast EV Charging Station',
          category: 'MEP Green Infrastructure',
          dim: '500 × 300 × 1600 mm',
          area: '0.15 m²',
          family: 'Smart_EV_Charger_22kW_Type2',
          env: 'Dynamic Load Balancing with Rooftop Solar Grid',
          mat: 'Weatherproof Enclosure / Type-2 Fast Cable'
        };
        this.interactiveObjects.push(charger);
        b1Grp.add(charger);
      });
    }

    // EV Basement Ramp
    const rampGeo = new THREE.BoxGeometry(6, 0.3, 14);
    const ramp = new THREE.Mesh(rampGeo, concreteMat);
    ramp.rotation.x = Math.PI / 12;
    ramp.position.set(-16, 1.8, 18);
    b1Grp.add(ramp);

    /* -------------------------------------------------------------
       GROUND FLOOR: Commercial Active Promenade & Biophilic Courtyard (Y = 0)
       ------------------------------------------------------------- */
    const gGrp = this.levelGroups.G;
    gGrp.position.y = 0;
    gGrp.userData = { levelName: 'Ground Floor: Active Commercial Arcade & Central Courtyard', baseElevation: 0 };

    // Podium Slab with central courtyard cutout
    const gFloor = this.createRingFloor(buildingW, buildingD, courtW, courtD, 0.3, concreteMat);
    gFloor.position.y = 0;
    gFloor.receiveShadow = true;
    gGrp.add(gFloor);

    // Central Courtyard Biophilic Elements
    const courtyardBase = new THREE.Mesh(new THREE.BoxGeometry(courtW, 0.1, courtD), woodDeckMat);
    courtyardBase.position.set(0, 0.05, 0);
    courtyardBase.userData = {
      name: 'Central Biophilic Landscape Courtyard',
      category: 'Microclimate Atrium & Thermal Chimney',
      dim: '16,000 × 14,000 mm',
      area: '224 m² (Open-to-Sky)',
      family: 'Courtyard_Biophilic_Atrium',
      env: 'Harnesses natural convective stack effect to cool all 9 upper floors passively',
      mat: 'Permeable Timber Deck, Native Flora, Bio-Filtration Pond'
    };
    this.interactiveObjects.push(courtyardBase);
    gGrp.add(courtyardBase);

    // Courtyard Reflection Pond
    const waterPond = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 5), waterMat);
    waterPond.position.set(0, 0.15, 0);
    gGrp.add(waterPond);

    // Courtyard Trees
    [-4, 4].forEach(tx => {
      [-3, 3].forEach(tz => {
        const cTree = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), vegetationMat);
        cTree.position.set(tx, 2.5, tz);
        cTree.castShadow = true;
        gGrp.add(cTree);
      });
    });

    // Double Height Commercial Glass Arcade (Height = 4.5m)
    this.createCurtainWallRing(gGrp, buildingW, buildingD, courtW, courtD, 4.5, glassMat, columnMat);

    /* -------------------------------------------------------------
       FIRST FLOOR (1F): Commercial, Wellness & Co-Working Hub (Y = 4.5)
       ------------------------------------------------------------- */
    const l1Grp = this.levelGroups.L1;
    l1Grp.position.y = 4.5;
    l1Grp.userData = { levelName: '1st Floor: Commercial Wellness & Co-Working Hub', baseElevation: 4.5 };

    const l1Floor = this.createRingFloor(buildingW, buildingD, courtW, courtD, 0.3, concreteMat);
    l1Floor.position.y = 0;
    l1Floor.receiveShadow = true;
    l1Grp.add(l1Floor);

    // Sky Bridge across Courtyard
    const skyBridge = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, courtD), woodDeckMat);
    skyBridge.position.set(0, 0.15, 0);
    skyBridge.userData = {
      name: 'Courtyard Skywalk Bridge',
      category: 'Biophilic Circulation Interface',
      dim: '3,000 × 14,000 mm',
      area: '42 m²',
      family: 'Circulation_Bridge_Wood_Steel',
      env: 'Panoramic visual connection to lush central microclimate garden',
      mat: 'Treated Hardwood Decking, Stainless Steel Handrail'
    };
    this.interactiveObjects.push(skyBridge);
    l1Grp.add(skyBridge);

    // 1F Glass Facade & Columns (Height = 4.0m)
    this.createCurtainWallRing(l1Grp, buildingW, buildingD, courtW, courtD, 4.0, glassMat, columnMat);

    /* -------------------------------------------------------------
       RESIDENTIAL LEVELS: 2nd to 9th Floor (8 Levels, Y = 8.5 to 34.9m)
       ------------------------------------------------------------- */
    const resHeight = 3.3; // 3.3m floor to floor
    const resLevels = ['L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'];

    resLevels.forEach((lvlKey, idx) => {
      const lvlGrp = this.levelGroups[lvlKey];
      const elevY = 8.5 + idx * resHeight;
      lvlGrp.position.y = elevY;
      lvlGrp.userData = { levelName: `Level ${idx + 2}: Sustainable Residential Living Units`, baseElevation: elevY };

      // Floor Slab
      const resSlab = this.createRingFloor(buildingW, buildingD, courtW, courtD, 0.25, concreteMat);
      resSlab.receiveShadow = true;
      lvlGrp.add(resSlab);

      // Structural Columns (8m Grid)
      for (let x = -16; x <= 16; x += 8) {
        for (let z = -12; z <= 12; z += 8) {
          if (Math.abs(x) < courtW / 2 && Math.abs(z) < courtD / 2) continue; // Skip courtyard void
          const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, resHeight, 0.5), columnMat);
          col.position.set(x, resHeight / 2, z);
          col.castShadow = true;
          lvlGrp.add(col);
        }
      }

      // Exterior Walls & Windows
      this.createResidentialFacade(lvlGrp, buildingW, buildingD, courtW, courtD, resHeight, glassMat, concreteMat, louverMat, vegetationMat, idx);
    });

    /* -------------------------------------------------------------
       ROOFTOP: Bio-Solar Sky Terrace (Y = 34.9m)
       ------------------------------------------------------------- */
    const rfGrp = this.levelGroups.RF;
    rfGrp.position.y = 34.9;
    rfGrp.userData = { levelName: 'Rooftop Sky Garden & Solar BIPV Pergola', baseElevation: 34.9 };

    const roofSlab = this.createRingFloor(buildingW, buildingD, courtW, courtD, 0.35, concreteMat);
    roofSlab.receiveShadow = true;
    rfGrp.add(roofSlab);

    // BIPV Solar Pergola Canopy
    const solarCanopy = new THREE.Group();
    for (let x = -16; x <= 16; x += 4) {
      for (let z = -10; z <= 10; z += 4) {
        if (Math.abs(x) < courtW / 2 && Math.abs(z) < courtD / 2) continue;
        const panel = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.05, 3.6), solarPvMat);
        panel.rotation.x = -Math.PI / 16; // 11.25 deg solar tilt
        panel.position.set(x, 3.5, z);
        panel.castShadow = true;
        panel.userData = {
          name: 'Bifacial BIPV Solar Photovoltaic Panel (450W)',
          category: 'Renewable Energy Generation',
          dim: '2,000 × 1,000 mm modules',
          area: '620 m² Total Array',
          family: 'BIPV_Solar_Pergola_Monocrystalline',
          env: 'Generates 185,000 kWh/yr clean electricity (-51% building EUI)',
          mat: 'Bifacial Tempered Glass / High-Efficiency Silicon Cells'
        };
        this.interactiveObjects.push(panel);
        solarCanopy.add(panel);

        // Steel post
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5), columnMat);
        post.position.set(x, 1.75, z);
        solarCanopy.add(post);
      }
    }
    rfGrp.add(solarCanopy);

    // Rooftop Urban Farm & Planters
    [-12, 12].forEach(px => {
      const planterBox = new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 4), vegetationMat);
      planterBox.position.set(px, 0.3, 0);
      rfGrp.add(planterBox);
    });

    // Glass safety balustrades around perimeter & courtyard
    this.createRooftopBalustrades(rfGrp, buildingW, buildingD, courtW, courtD, glassMat);
  }

  createRingFloor(outerW, outerD, innerW, innerD, thickness, material) {
    const group = new THREE.Group();
    const northSlab = new THREE.Mesh(new THREE.BoxGeometry(outerW, thickness, (outerD - innerD) / 2), material);
    northSlab.position.set(0, thickness / 2, (outerD + innerD) / 4);
    group.add(northSlab);

    const southSlab = new THREE.Mesh(new THREE.BoxGeometry(outerW, thickness, (outerD - innerD) / 2), material);
    southSlab.position.set(0, thickness / 2, -(outerD + innerD) / 4);
    group.add(southSlab);

    const eastSlab = new THREE.Mesh(new THREE.BoxGeometry((outerW - innerW) / 2, thickness, innerD), material);
    eastSlab.position.set((outerW + innerW) / 4, thickness / 2, 0);
    group.add(eastSlab);

    const westSlab = new THREE.Mesh(new THREE.BoxGeometry((outerW - innerW) / 2, thickness, innerD), material);
    westSlab.position.set(-(outerW + innerW) / 4, thickness / 2, 0);
    group.add(westSlab);

    return group;
  }

  createCurtainWallRing(group, outerW, outerD, innerW, innerD, height, glassMat, colMat) {
    // Exterior perimeter glass
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, height, 0.1), glassMat);
    southGlass.position.set(0, height / 2, outerD / 2);
    group.add(southGlass);

    const northGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, height, 0.1), glassMat);
    northGlass.position.set(0, height / 2, -outerD / 2);
    group.add(northGlass);

    const eastGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, outerD), glassMat);
    eastGlass.position.set(outerW / 2, height / 2, 0);
    group.add(eastGlass);

    const westGlass = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, outerD), glassMat);
    westGlass.position.set(-outerW / 2, height / 2, 0);
    group.add(westGlass);

    // Courtyard inner perimeter glass
    const courtSouthGlass = new THREE.Mesh(new THREE.BoxGeometry(innerW, height, 0.08), glassMat);
    courtSouthGlass.position.set(0, height / 2, -innerD / 2);
    group.add(courtSouthGlass);

    const courtNorthGlass = new THREE.Mesh(new THREE.BoxGeometry(innerW, height, 0.08), glassMat);
    courtNorthGlass.position.set(0, height / 2, innerD / 2);
    group.add(courtNorthGlass);

    // Columns
    for (let x = -16; x <= 16; x += 8) {
      for (let z = -12; z <= 12; z += 8) {
        if (Math.abs(x) < innerW / 2 && Math.abs(z) < innerD / 2) continue;
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.6, height, 0.6), colMat);
        col.position.set(x, height / 2, z);
        col.castShadow = true;
        group.add(col);
      }
    }
  }

  createResidentialFacade(group, outerW, outerD, innerW, innerD, height, glassMat, wallMat, louverMat, planterMat, floorIdx) {
    // Staggered Cantilever Balconies on South and North Facades (1.8m projection)
    const isStaggered = floorIdx % 2 === 0;

    [-12, -4, 4, 12].forEach((bx, i) => {
      if ((i % 2 === 0 && isStaggered) || (i % 2 !== 0 && !isStaggered)) {
        // South Balcony Box
        const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 1.8), wallMat);
        balcSlab.position.set(bx, 0.1, outerD / 2 + 0.9);
        balcSlab.castShadow = true;
        group.add(balcSlab);

        // Balcony Glass Railing
        const balcRailing = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 0.05), glassMat);
        balcRailing.position.set(bx, 0.65, outerD / 2 + 1.8);
        group.add(balcRailing);

        // Integrated Green Planter Box
        const planter = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.5, 0.4), planterMat);
        planter.position.set(bx, 0.35, outerD / 2 + 1.6);
        planter.userData = {
          name: 'Biophilic Balcony Planter (Automated Drip)',
          category: 'Microclimate Vegetation Buffer',
          dim: '5,800 × 400 × 500 mm',
          area: '2.3 m²',
          family: 'Bio_Planter_Drip_Irrigated',
          env: 'Reduces surface temperature by 4.2°C via evapotranspiration',
          mat: 'Lightweight Engineered Soil, Native Jasmine / Boston Fern'
        };
        this.interactiveObjects.push(planter);
        group.add(planter);

        // Parametric Solar Louvers (Angled Aerofoils)
        for (let l = 0; l < 4; l++) {
          const louver = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.08, 0.35), louverMat);
          louver.rotation.x = Math.PI / 4.5; // 40 degree solar cutoff
          louver.position.set(bx, 1.2 + l * 0.45, outerD / 2 + 1.75);
          louver.userData = {
            name: 'Parametric Solar Aerofoil Louver',
            category: 'Passive Climate-Responsive Envelope',
            dim: '5,800 × 350 × 80 mm',
            area: '2.0 m²',
            family: 'Kinetic_Solar_Louver_Aluminium',
            env: 'Blocks 85% of harsh afternoon summer glare while admitting diffuse daylight',
            mat: 'Anodized Architectural Bronze Aluminium'
          };
          this.interactiveObjects.push(louver);
          group.add(louver);
        }
      }
    });

    // Main window walls
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, height * 0.75, 0.08), glassMat);
    southGlass.position.set(0, height * 0.55, outerD / 2);
    group.add(southGlass);

    const northGlass = new THREE.Mesh(new THREE.BoxGeometry(outerW, height * 0.75, 0.08), glassMat);
    northGlass.position.set(0, height * 0.55, -outerD / 2);
    group.add(northGlass);

    // Spandrel Wall Panels (Concrete thermal mass)
    const southSpandrel = new THREE.Mesh(new THREE.BoxGeometry(outerW, height * 0.25, 0.2), wallMat);
    southSpandrel.position.set(0, height * 0.125, outerD / 2);
    group.add(southSpandrel);

    const northSpandrel = new THREE.Mesh(new THREE.BoxGeometry(outerW, height * 0.25, 0.2), wallMat);
    northSpandrel.position.set(0, height * 0.125, -outerD / 2);
    group.add(northSpandrel);
  }

  createRooftopBalustrades(group, outerW, outerD, innerW, innerD, glassMat) {
    const railH = 1.2;
    const outerSouth = new THREE.Mesh(new THREE.BoxGeometry(outerW, railH, 0.05), glassMat);
    outerSouth.position.set(0, railH / 2, outerD / 2);
    group.add(outerSouth);

    const outerNorth = new THREE.Mesh(new THREE.BoxGeometry(outerW, railH, 0.05), glassMat);
    outerNorth.position.set(0, railH / 2, -outerD / 2);
    group.add(outerNorth);

    const outerEast = new THREE.Mesh(new THREE.BoxGeometry(0.05, railH, outerD), glassMat);
    outerEast.position.set(outerW / 2, railH / 2, 0);
    group.add(outerEast);

    const outerWest = new THREE.Mesh(new THREE.BoxGeometry(0.05, railH, outerD), glassMat);
    outerWest.position.set(-outerW / 2, railH / 2, 0);
    group.add(outerWest);
  }

  initInteractivity() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData && obj.userData.name) {
          this.showInspectorMetadata(obj.userData);
        }
      }
    });
  }

  showInspectorMetadata(data) {
    const elemTitle = document.getElementById('elemTitle');
    const elemCategory = document.getElementById('elemCategory');
    const elemDim = document.getElementById('elemDim');
    const elemArea = document.getElementById('elemArea');
    const elemFamily = document.getElementById('elemFamily');
    const elemEnv = document.getElementById('elemEnv');
    const elemMat = document.getElementById('elemMat');

    if (elemTitle) elemTitle.textContent = data.name || 'BIM Element';
    if (elemCategory) elemCategory.textContent = data.category || 'Revit Family';
    if (elemDim) elemDim.textContent = data.dim || 'Specified in mm';
    if (elemArea) elemArea.textContent = data.area || '—';
    if (elemFamily) elemFamily.textContent = data.family || 'Autodesk_Revit_BIM';
    if (elemEnv) elemEnv.textContent = data.env || 'Environmental performance optimized';
    if (elemMat) elemMat.textContent = data.mat || 'Standard Specification';
  }

  setExplodedSpread(factor) {
    // factor from 0.0 to 1.0
    const maxOffset = 6.0; // vertical separation multiplier

    const order = ['B1', 'G', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'RF'];
    order.forEach((key, idx) => {
      const grp = this.levelGroups[key];
      if (grp) {
        const base = grp.userData.baseElevation || 0;
        const spreadOffset = (idx - 1) * maxOffset * factor;
        grp.position.y = base + spreadOffset;
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
    // Filter through meshes by type or material
    this.buildingGroup.traverse(child => {
      if (child.isMesh && child.userData) {
        if (layerKey === 'louvers' && child.userData.category && child.userData.category.includes('Louver')) {
          child.visible = isVisible;
        } else if (layerKey === 'landscape' && child.userData.category && (child.userData.category.includes('Biophilic') || child.userData.category.includes('Vegetation'))) {
          child.visible = isVisible;
        } else if (layerKey === 'basementEV' && child.userData.category && child.userData.category.includes('EV')) {
          child.visible = isVisible;
        } else if (layerKey === 'mep' && child.userData.category && child.userData.category.includes('Renewable')) {
          child.visible = isVisible;
        } else if (layerKey === 'structure' && child.userData.category && child.userData.category.includes('RCC')) {
          child.visible = isVisible;
        }
      }
    });
  }

  setSunTime(hour) {
    // hour from 6 to 18
    const angle = ((hour - 6) / 12) * Math.PI; // 0 to PI
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

    // Color grading based on time
    if (hour < 7.5 || hour > 16.5) {
      // Golden Hour
      this.sunLight.color.setHex(0xffaa5e);
      this.ambientLight.color.setHex(0xffe8d6);
      this.scene.background.setHex(0xfef3c7);
      this.scene.fog.color.setHex(0xfef3c7);
    } else {
      // Daylight
      this.sunLight.color.setHex(0xfffaed);
      this.ambientLight.color.setHex(0xffffff);
      this.scene.background.setHex(0xf1f5f9);
      this.scene.fog.color.setHex(0xf1f5f9);
    }
  }

  setLightingMode(mode) {
    if (mode === 'day') {
      this.setSunTime(14);
    } else if (mode === 'golden') {
      this.setSunTime(17.5);
    } else if (mode === 'night') {
      this.sunLight.intensity = 0.2;
      this.ambientLight.intensity = 0.35;
      this.scene.background.setHex(0x0f172a);
      this.scene.fog.color.setHex(0x0f172a);
    }
  }

  toggleShadows(enable) {
    this.renderer.shadowMap.enabled = enable;
  }

  initResizeListener() {
    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      if (width > 0 && height > 0) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
      }
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

/**
 * 30-Second Cinematic Walkthrough Animation Engine
 */
export class WalkthroughEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Cinematic architectural dark tone
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.008);

    this.camera = new THREE.PerspectiveCamera(50, this.canvas.clientWidth / this.canvas.clientHeight, 0.2, 300);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    this.duration = 30.0; // 30 seconds total
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
        camPos: new THREE.Vector3(0, 2.5, 32),
        lookAt: new THREE.Vector3(0, 4, 10)
      },
      {
        time: 6,
        name: 'Station 2: Central Biophilic Courtyard',
        title: 'Open-Air Botanical Atrium & Thermal Chimney',
        desc: 'The 224 m² central courtyard acts as a natural microclimate cooling stack, featuring native trees, bio-filtration water ponds, and timber boardwalks.',
        camPos: new THREE.Vector3(-4, 3, 2),
        lookAt: new THREE.Vector3(0, 12, 0)
      },
      {
        time: 13,
        name: 'Station 3: 1F Commercial Deck & Skybridge',
        title: 'Level 1 Wellness, Co-Working & Elevated Terraces',
        desc: 'Cantilevered alfresco dining decks and glazed meeting pods connected via timber sky bridges with direct panoramic vistas down into the courtyard garden.',
        camPos: new THREE.Vector3(10, 6.5, 8),
        lookAt: new THREE.Vector3(0, 5, 0)
      },
      {
        time: 20,
        name: 'Station 4: Sustainable Residential Sanctuary',
        title: 'Modular Apartments, Cantilevered Balconies & Kinetic Facade',
        desc: 'Generous 3.3m floor-to-floor heights with deep shading balconies, integrated bio-planters, and motorized aerofoil louvers blocking harsh afternoon solar radiation.',
        camPos: new THREE.Vector3(-14, 21, 18),
        lookAt: new THREE.Vector3(0, 20, 10)
      },
      {
        time: 27,
        name: 'Station 5: Rooftop Sky Garden & Solar Array',
        title: '10F Bio-Solar Roof, Community Farm & 360° Skyline',
        desc: '148 kWp bifacial solar PV canopy generating 185 MWh/yr, combined with resident urban farming plots, running track, and rainwater retention deck.',
        camPos: new THREE.Vector3(0, 42, 22),
        lookAt: new THREE.Vector3(0, 35, 0)
      }
    ];

    this.initLighting();
    this.buildSceneModel();
    this.initEventListeners();

    this.lastTimestamp = performance.now();
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  initLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff5ea, 1.6);
    sun.position.set(30, 50, 40);
    sun.castShadow = true;
    this.scene.add(sun);
  }

  buildSceneModel() {
    // Simplified high-aesthetic building model for walkthrough rendering
    const bim = new BimViewer3D();
    // We clone or build a similar building structure into this.scene
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transmission: 0.6, transparent: true, opacity: 0.8 });
    const louverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });

    // Ground
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

    // Multi-floor structure
    const totalHeight = 35;
    for (let y = 0; y <= totalHeight; y += 3.3) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(38, 0.25, 28), concreteMat);
      slab.position.set(0, y, 0);
      this.scene.add(slab);
    }

    // Glass curtain wall envelope
    const glassBox = new THREE.Mesh(new THREE.BoxGeometry(37.5, totalHeight, 27.5), glassMat);
    glassBox.position.set(0, totalHeight / 2, 0);
    this.scene.add(glassBox);

    // Central Courtyard Void
    const courtyardVoid = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 14), woodMat);
    courtyardVoid.position.set(0, 0.2, 0);
    this.scene.add(courtyardVoid);

    // Louvers & balcony projections
    for (let f = 2; f <= 9; f++) {
      const y = 8.5 + (f - 2) * 3.3;
      const balc = new THREE.Mesh(new THREE.BoxGeometry(38, 0.3, 3), concreteMat);
      balc.position.set(0, y, 15);
      this.scene.add(balc);

      const planter = new THREE.Mesh(new THREE.BoxGeometry(37, 0.4, 0.4), greenMat);
      planter.position.set(0, y + 0.3, 16.2);
      this.scene.add(planter);
    }

    // Rooftop Solar Pergola
    const roofCanopy = new THREE.Mesh(new THREE.BoxGeometry(36, 0.1, 26), new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9 }));
    roofCanopy.position.set(0, totalHeight + 3.5, 0);
    this.scene.add(roofCanopy);
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
      btn.addEventListener('click', (e) => {
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
    // Find current interval between stations
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
    // Smooth cubic ease
    const easeT = localT * localT * (3 - 2 * localT);

    this.camera.position.lerpVectors(s0.camPos, s1.camPos, easeT);
    const targetLook = new THREE.Vector3().lerpVectors(s0.lookAt, s1.lookAt, easeT);
    this.camera.lookAt(targetLook);

    // Update Narration overlay text
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

    // Highlight active waypoint chip
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
