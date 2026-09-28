import * as THREE from 'three';

/**
 * High-Performance Mini Orbit Controls for Innovation 3D Viewports
 */
class MiniOrbitControls {
  constructor(camera, domElement, targetPos = new THREE.Vector3(0, 0, 0), distance = 14) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = targetPos;
    this.distance = distance;
    this.phi = Math.PI / 3.2;
    this.theta = Math.PI / 4;
    this.minDistance = 3;
    this.maxDistance = 60;
    this.isDragging = false;
    this.isPanning = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.autoRotate = false;

    this.initEvents();
    this.updateCamera();
  }

  initEvents() {
    if (!this.domElement) return;

    this.domElement.addEventListener('pointerdown', (e) => {
      if (e.button === 0) this.isDragging = true;
      if (e.button === 2) this.isPanning = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging && !this.isPanning) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      if (this.isPanning) {
        const panSpeed = 0.02 * (this.distance / 10);
        const forward = new THREE.Vector3().subVectors(this.target, this.camera.position).normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        const up = new THREE.Vector3().crossVectors(right, forward).normalize();
        this.target.addScaledVector(right, -deltaX * panSpeed);
        this.target.addScaledVector(up, deltaY * panSpeed);
      } else if (this.isDragging) {
        this.theta -= deltaX * 0.008;
        this.phi -= deltaY * 0.008;
        this.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, this.phi));
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
  }

  updateCamera() {
    const x = this.target.x + this.distance * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.target.y + this.distance * Math.cos(this.phi);
    const z = this.target.z + this.distance * Math.sin(this.phi) * Math.cos(this.theta);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }

  reset(dist = this.distance, theta = Math.PI / 4, phi = Math.PI / 3.2) {
    this.distance = dist;
    this.theta = theta;
    this.phi = phi;
    this.updateCamera();
  }
}

/* ==========================================================================
   INNOVATION 1: 3D CLIMATE-RESPONSIVE MODULAR FAÇADE SIMULATOR
   ========================================================================== */
class Inno1Facade3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329);

    const w = this.canvas.clientWidth || 600;
    const h = this.canvas.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(10, 6, 12);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    this.controls = new MiniOrbitControls(this.camera, this.canvas, new THREE.Vector3(0, 1.8, 0), 13);

    this.louvers = [];
    this.solarRaysGroup = new THREE.Group();
    this.targetLouverAngle = 42.5 * (Math.PI / 180);
    this.currentLouverAngle = this.targetLouverAngle;

    this.initLights();
    this.buildFacadeModel();
    this.buildSunIndicator();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambient);

    this.sunLight = new THREE.DirectionalLight(0xfff5db, 2.5);
    this.sunLight.position.set(12, 14, 15);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.scene.add(this.sunLight);
  }

  buildFacadeModel() {
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.45, roughness: 0.1, transmission: 0.85 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.65, roughness: 0.35 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });

    // Floor Slab (Lower)
    const slabLow = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 6), concreteMat);
    slabLow.position.set(0, -0.2, 0);
    slabLow.receiveShadow = true;
    this.scene.add(slabLow);

    // Floor Slab (Upper)
    const slabHigh = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 6), concreteMat);
    slabHigh.position.set(0, 4.2, 0);
    slabHigh.castShadow = true;
    this.scene.add(slabHigh);

    // Rear Wall & Room Interior
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 0.2), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    backWall.position.set(0, 2, -2.9);
    this.scene.add(backWall);

    // Recessed Double-Glazed Window Frame
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.4, 0.15), frameMat);
    winFrame.position.set(0, 2, 0.5);
    this.scene.add(winFrame);

    const winGlass = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.2, 0.05), glassMat);
    winGlass.position.set(0, 2, 0.5);
    this.scene.add(winGlass);

    // Cantilevered Balcony Slab (1,800mm projection)
    const balcony = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.25, 2.2), concreteMat);
    balcony.position.set(0, 0.12, 1.8);
    balcony.receiveShadow = true;
    this.scene.add(balcony);

    // Balcony Glass Railing
    const balcGlass = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.1, 0.05), glassMat);
    balcGlass.position.set(0, 0.7, 2.9);
    this.scene.add(balcGlass);

    const handrail = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.06, 0.08), frameMat);
    handrail.position.set(0, 1.25, 2.9);
    this.scene.add(handrail);

    // Biophilic Hanging Planter Box
    const planterBox = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.5, 0.45), foliageMat);
    planterBox.position.set(0, 0.35, 2.65);
    this.scene.add(planterBox);

    // 4 Motorized Anodized Bronze Aerofoil Louvers
    for (let i = 0; i < 4; i++) {
      const louverGroup = new THREE.Group();
      louverGroup.position.set(0, 1.0 + i * 0.75, 2.9);

      // Pivot rod
      const rodL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7), frameMat);
      rodL.position.set(-3.3, 0, 0);
      louverGroup.add(rodL);

      const rodR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7), frameMat);
      rodR.position.set(3.3, 0, 0);
      louverGroup.add(rodR);

      // Louver Blade
      const blade = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.06, 0.45), bronzeMat);
      blade.castShadow = true;
      blade.receiveShadow = true;
      louverGroup.add(blade);

      this.scene.add(louverGroup);
      this.louvers.push({ group: louverGroup, blade: blade });
    }

    this.scene.add(this.solarRaysGroup);
    this.updateSolarRays();
  }

  buildSunIndicator() {
    const sunGeom = new THREE.SphereGeometry(0.6, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    this.sunMesh = new THREE.Mesh(sunGeom, sunMat);
    this.sunMesh.position.copy(this.sunLight.position);
    this.scene.add(this.sunMesh);
  }

  updateSolarRays() {
    while (this.solarRaysGroup.children.length > 0) {
      this.solarRaysGroup.remove(this.solarRaysGroup.children[0]);
    }

    const rayMat = new THREE.LineDashedMaterial({ color: 0xf59e0b, dashSize: 0.3, gapSize: 0.15, linewidth: 2 });
    const sunPos = this.sunLight.position;

    for (let x = -2.8; x <= 2.8; x += 1.4) {
      for (let y = 1.0; y <= 3.2; y += 0.8) {
        const points = [];
        points.push(sunPos.clone());
        const hitPoint = new THREE.Vector3(x, y, 2.9);
        points.push(hitPoint);

        // Deflected ray vector
        const isClosed = Math.abs(this.currentLouverAngle) > 0.4;
        if (isClosed) {
          // Bounces away
          points.push(new THREE.Vector3(x + 1.2, y + 1.5, 4.5));
        } else {
          // Penetrates inside as diffuse light
          points.push(new THREE.Vector3(x * 0.8, y, -1.5));
        }

        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geom, rayMat);
        line.computeLineDistances();
        this.solarRaysGroup.add(line);
      }
    }
  }

  setMode(mode) {
    if (mode === 'solar') this.targetLouverAngle = 42.5 * (Math.PI / 180);
    else if (mode === 'vortex') this.targetLouverAngle = 28.0 * (Math.PI / 180);
    else if (mode === 'storm') this.targetLouverAngle = 0.0;
    else if (mode === 'night') this.targetLouverAngle = 85.0 * (Math.PI / 180);
  }

  setLouverAngle(deg) {
    this.targetLouverAngle = deg * (Math.PI / 180);
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  animate() {
    requestAnimationFrame(this.animate);
    // Smooth louver rotation interpolation
    const diff = this.targetLouverAngle - this.currentLouverAngle;
    if (Math.abs(diff) > 0.002) {
      this.currentLouverAngle += diff * 0.1;
      this.louvers.forEach(l => {
        l.blade.rotation.x = this.currentLouverAngle;
      });
      this.updateSolarRays();
    }
    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   INNOVATION 2: 3D CONVECTIVE THERMAL CHIMNEY & CFD STACK SIMULATOR
   ========================================================================== */
class Inno2Stack3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329);

    const w = this.canvas.clientWidth || 600;
    const h = this.canvas.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 150);
    this.camera.position.set(22, 18, 26);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new MiniOrbitControls(this.camera, this.canvas, new THREE.Vector3(0, 10, 0), 32);

    this.flowSpeed = 1.0;
    this.particlesActive = true;
    this.damperAngle = 0.6; // radians
    this.damperMeshList = [];

    this.initLights();
    this.buildAtriumSection();
    this.initParticlePhysics();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const sun = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    sun.position.set(10, 30, 15);
    this.scene.add(sun);
  }

  buildAtriumSection() {
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, transparent: true, opacity: 0.85, roughness: 0.6 });
    const poolMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.8 });
    const floorSlabMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const damperMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });

    // Ground Base & Reflection Pond (16m x 14m)
    const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(22, 0.5, 20), wallMat);
    baseSlab.position.set(0, -0.25, 0);
    this.scene.add(baseSlab);

    const pond = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 10), poolMat);
    pond.position.set(0, 0.05, 0);
    this.scene.add(pond);

    // Multi-Tier Atrium Ring Walkways (Cutaway Front View)
    for (let lvl = 1; lvl <= 9; lvl++) {
      const y = lvl * 2.4;
      // North & East & West perimeter slabs
      const slabN = new THREE.Mesh(new THREE.BoxGeometry(20, 0.2, 4), floorSlabMat);
      slabN.position.set(0, y, -8);
      this.scene.add(slabN);

      const slabW = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 16), floorSlabMat);
      slabW.position.set(-8, y, 0);
      this.scene.add(slabW);

      const slabE = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 16), floorSlabMat);
      slabE.position.set(8, y, 0);
      this.scene.add(slabE);
    }

    // Skybridge at Level 1 (Y = 2.4)
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    bridge.position.set(0, 2.4, 0);
    this.scene.add(bridge);

    // Rooftop Exhaust Cowl & Tilting Damper Louvers (Y = 23.5)
    const roofCowl = new THREE.Mesh(new THREE.BoxGeometry(18, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    roofCowl.position.set(0, 23.5, 0);
    this.scene.add(roofCowl);

    // Operable Damper Blades
    for (let i = -5; i <= 5; i += 2.5) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 1.8), damperMat);
      blade.position.set(0, 24.2, i);
      blade.rotation.x = this.damperAngle;
      this.scene.add(blade);
      this.damperMeshList.push(blade);
    }
  }

  initParticlePhysics() {
    this.particleCount = 500;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    this.particleVelocities = [];

    const coolColor = new THREE.Color(0x38bdf8);
    const midColor = new THREE.Color(0x10b981);
    const hotColor = new THREE.Color(0xf59e0b);

    for (let i = 0; i < this.particleCount; i++) {
      const x = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 10;
      const y = Math.random() * 24;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const t = y / 24;
      const col = t < 0.5 ? coolColor.clone().lerp(midColor, t * 2) : midColor.clone().lerp(hotColor, (t - 0.5) * 2);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      this.particleVelocities.push({
        vy: 0.06 + Math.random() * 0.08,
        swirl: (Math.random() - 0.5) * 0.02
      });
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.particleSystem = new THREE.Points(geom, pMat);
    this.scene.add(this.particleSystem);
  }

  setDamper(percentage) {
    this.flowSpeed = percentage / 100;
    this.damperAngle = (percentage / 100) * 0.8;
    this.damperMeshList.forEach(b => {
      b.rotation.x = this.damperAngle;
    });
  }

  toggleParticles(active) {
    this.particlesActive = active;
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  animate() {
    requestAnimationFrame(this.animate);

    if (this.particlesActive && this.particleSystem) {
      const pos = this.particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < this.particleCount; i++) {
        const vel = this.particleVelocities[i];
        pos[i * 3 + 1] += vel.vy * this.flowSpeed * 1.5;
        pos[i * 3] += Math.sin(pos[i * 3 + 1] * 0.5) * vel.swirl;
        pos[i * 3 + 2] += Math.cos(pos[i * 3 + 1] * 0.5) * vel.swirl;

        // Reset particle to ground when exiting roof
        if (pos[i * 3 + 1] > 24) {
          pos[i * 3 + 1] = 0.2 + Math.random() * 0.5;
          pos[i * 3] = (Math.random() - 0.5) * 11;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
        }
      }
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   INNOVATION 3: 3D DIGITAL MATERIAL PASSPORT & CARBON HEATMAP
   ========================================================================== */
class Inno3Material3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329);

    const w = this.canvas.clientWidth || 600;
    const h = this.canvas.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(12, 10, 14);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new MiniOrbitControls(this.camera, this.canvas, new THREE.Vector3(0, 3, 0), 16);

    this.ggbsPercentage = 40;
    this.components = {};

    this.initLights();
    this.buildStructuralAssembly();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(15, 20, 15);
    this.scene.add(dir);
  }

  buildStructuralAssembly() {
    this.concreteMat = new THREE.MeshStandardMaterial({
      color: this.getCarbonColor(40),
      roughness: 0.5
    });

    const rebarMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.2 });
    const timberMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, transmission: 0.8 });

    // 1. Column C1 (600 x 600 mm)
    const colGeom = new THREE.BoxGeometry(1.6, 6, 1.6);
    this.columnMesh = new THREE.Mesh(colGeom, this.concreteMat);
    this.columnMesh.position.set(0, 3, 0);
    this.scene.add(this.columnMesh);
    this.components.column = this.columnMesh;

    // Drop Panel (2.5m x 2.5m x 0.3m)
    const dropPanel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 4.2), this.concreteMat);
    dropPanel.position.set(0, 5.8, 0);
    this.scene.add(dropPanel);

    // Flat Slab (175mm depth)
    const slab = new THREE.Mesh(new THREE.BoxGeometry(10, 0.35, 10), this.concreteMat);
    slab.position.set(0, 6.1, 0);
    this.scene.add(slab);
    this.components.slab = slab;

    // 2. Rebar Mesh (Visible rebar cage inside/around)
    const rebarGroup = new THREE.Group();
    for (let x = -0.6; x <= 0.6; x += 0.4) {
      for (let z = -0.6; z <= 0.6; z += 0.4) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 6.2), rebarMat);
        bar.position.set(x, 3.1, z);
        rebarGroup.add(bar);
      }
    }
    this.scene.add(rebarGroup);
    this.components.rebar = rebarGroup;

    // 3. FSC Certified Timber Skydeck
    const timberDeck = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 6), timberMat);
    timberDeck.position.set(5.5, 6.2, 0);
    this.scene.add(timberDeck);
    this.components.timber = timberDeck;

    // 4. Low-E Curtain Wall Module
    const glassWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.5, 6), glassMat);
    glassWall.position.set(-4.5, 3, 0);
    this.scene.add(glassWall);
    this.components.glazing = glassWall;

    // 3D Highlight Ring Indicator
    const ringGeom = new THREE.RingGeometry(2.5, 2.7, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    this.highlightRing = new THREE.Mesh(ringGeom, ringMat);
    this.highlightRing.rotation.x = Math.PI / 2;
    this.highlightRing.position.set(0, 0.05, 0);
    this.scene.add(this.highlightRing);
  }

  getCarbonColor(pct) {
    // 0% GGBS (High carbon) -> Reddish Grey (#64748b / #991b1b)
    // 60% GGBS (Low carbon) -> Vibrant Emerald (#10b981)
    const t = pct / 60;
    const highC = new THREE.Color(0x64748b);
    const lowC = new THREE.Color(0x10b981);
    return highC.lerp(lowC, t);
  }

  setGgbs(pct) {
    this.ggbsPercentage = pct;
    const col = this.getCarbonColor(pct);
    this.concreteMat.color.copy(col);
  }

  selectPassport(key) {
    if (this.components[key]) {
      const pos = this.components[key].position || new THREE.Vector3(0, 3, 0);
      this.highlightRing.position.set(pos.x, 0.05, pos.z);
    }
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   INNOVATION 4: 3D BIOPHILIC ACOUSTIC & CIRCADIAN NEURO-ARCHITECTURE
   ========================================================================== */
class Inno4Circadian3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329);

    const w = this.canvas.clientWidth || 600;
    const h = this.canvas.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(11, 7, 13);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new MiniOrbitControls(this.camera, this.canvas, new THREE.Vector3(0, 2, 0), 14);

    this.soundWaves = [];
    this.initLights();
    this.buildRoomModel();
    this.initAcousticWaves();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.sunLight.position.set(12, 14, 10);
    this.scene.add(this.sunLight);
  }

  buildRoomModel() {
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 }); // Wood floor
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.4, transmission: 0.85 });

    // Living Room Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 8), floorMat);
    floor.position.set(-1, -0.1, 0);
    this.scene.add(floor);

    // Back & Left Walls
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 0.2), wallMat);
    backWall.position.set(-1, 2, -3.9);
    this.scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 8), wallMat);
    leftWall.position.set(-4.9, 2, 0);
    this.scene.add(leftWall);

    // Sofa Furniture
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.8, 1.4), sofaMat);
    sofa.position.set(-1.5, 0.4, -2.2);
    this.scene.add(sofa);

    // Coffee Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.9), new THREE.MeshStandardMaterial({ color: 0x475569 }));
    table.position.set(-1.5, 0.2, -0.8);
    this.scene.add(table);

    // Balcony Sliding Glass Door
    const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.6, 6), glassMat);
    glassDoor.position.set(3, 1.8, 0);
    this.scene.add(glassDoor);

    // Balcony Extension with Dense Green Wall (Acoustic Buffer)
    const balconyFloor = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    balconyFloor.position.set(5, -0.1, 0);
    this.scene.add(balconyFloor);

    // Vertical Botanical Wall (Acoustic Noise Absorber)
    const greenWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 7.6), foliageMat);
    greenWall.position.set(6.6, 1.8, 0);
    this.scene.add(greenWall);
  }

  initAcousticWaves() {
    this.waveGroup = new THREE.Group();
    this.scene.add(this.waveGroup);

    // Create concentric acoustic sound wave rings radiating from street (X = 12)
    for (let i = 0; i < 6; i++) {
      const ringGeom = new THREE.TorusGeometry(2 + i * 1.5, 0.08, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.75 });
      const wave = new THREE.Mesh(ringGeom, ringMat);
      wave.rotation.y = Math.PI / 2;
      wave.position.set(10 - i * 1.8, 1.8, 0);
      this.waveGroup.add(wave);
      this.soundWaves.push(wave);
    }
  }

  setCircadianHour(hour) {
    let sunCol = new THREE.Color(0xfffaed);
    let skyCol = new THREE.Color(0x0b1329);
    let sunIntensity = 2.2;

    if (hour < 6 || hour > 19) {
      sunCol = new THREE.Color(0xd97706); // 2700K Warm amber
      skyCol = new THREE.Color(0x050814); // Night
      sunIntensity = 0.4;
    } else if (hour >= 6 && hour < 9) {
      sunCol = new THREE.Color(0xfbbf24); // 4000K Morning
      skyCol = new THREE.Color(0x0f172a);
      sunIntensity = 1.6;
    } else if (hour >= 9 && hour <= 16) {
      sunCol = new THREE.Color(0xffffff); // 6500K Sky White
      skyCol = new THREE.Color(0x0b1329);
      sunIntensity = 2.5;
    } else {
      sunCol = new THREE.Color(0xe11d48); // 3000K Sunset
      skyCol = new THREE.Color(0x180b29);
      sunIntensity = 1.2;
    }

    this.sunLight.color.copy(sunCol);
    this.sunLight.intensity = sunIntensity;
    this.scene.background.copy(skyCol);
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Animate acoustic sound waves traveling through green wall
    this.soundWaves.forEach((wave, idx) => {
      wave.position.x -= 0.04;
      if (wave.position.x < -2) {
        wave.position.x = 10;
      }

      // If outside green wall (X > 6.6): Red/High noise (75 dB)
      // If inside room (X < 3.0): Green/Calm tranquil noise (38 dB)
      if (wave.position.x > 6.6) {
        wave.material.color.setHex(0xef4444);
        wave.material.opacity = 0.8;
      } else if (wave.position.x > 3.0) {
        wave.material.color.setHex(0xf59e0b);
        wave.material.opacity = 0.5;
      } else {
        wave.material.color.setHex(0x10b981);
        wave.material.opacity = 0.25;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   INNOVATION 5: 3D PARAMETRIC MODULAR SPACE PLANNING ENGINE
   ========================================================================== */
class Inno5Planning3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1329);

    const w = this.canvas.clientWidth || 600;
    const h = this.canvas.clientHeight || 450;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(13, 14, 15);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.controls = new MiniOrbitControls(this.camera, this.canvas, new THREE.Vector3(0, 1, 0), 18);

    this.initLights();
    this.buildApartmentModel();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.3));
    const dir = new THREE.DirectionalLight(0xfffaed, 2.0);
    dir.position.set(15, 25, 15);
    this.scene.add(dir);
  }

  buildApartmentModel() {
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc });
    const wfhWallMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const balcMat = new THREE.MeshStandardMaterial({ color: 0x15803d });

    // Main Floor Slab
    this.floorMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 8), floorMat);
    this.floorMesh.position.set(0, -0.1, 0);
    this.scene.add(this.floorMesh);

    // Perimeter Outer Walls
    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(10, 2.8, 0.2), wallMat);
    wallBack.position.set(0, 1.4, -3.9);
    this.scene.add(wallBack);

    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 8), wallMat);
    wallLeft.position.set(-4.9, 1.4, 0);
    this.scene.add(wallLeft);

    // Master Bedroom Partition
    const bedWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 4.5), wallMat);
    bedWall.position.set(-1.2, 1.4, -1.6);
    this.scene.add(bedWall);

    // Dynamic WFH Flex Partition Wall (Morphs position)
    this.wfhPartition = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 3.2), wfhWallMat);
    this.wfhPartition.position.set(1.8, 1.4, -2.2);
    this.scene.add(this.wfhPartition);

    // WFH Pod Desk
    this.wfhDesk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.8), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    this.wfhDesk.position.set(3.0, 0.35, -2.2);
    this.scene.add(this.wfhDesk);

    // Parametric Cantilever Balcony (Expands depth from 1.5m to 3.0m)
    this.balconyGroup = new THREE.Group();
    this.balconySlab = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 2.2), balcMat);
    this.balconySlab.position.set(0, -0.1, 5.0);
    this.balconyGroup.add(this.balconySlab);

    const railing = new THREE.Mesh(new THREE.BoxGeometry(8, 1.1, 0.06), new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 }));
    railing.position.set(0, 0.55, 6.0);
    this.balconyGroup.add(railing);
    this.scene.add(this.balconyGroup);
  }

  setWfhWeight(pct) {
    // Morphs WFH partition position in 3D
    const targetX = 0.8 + (pct / 100) * 1.8;
    this.wfhPartition.position.x = targetX;
    this.wfhDesk.position.x = targetX + 1.2;
  }

  setBalconyDepth(depth) {
    // Scales balcony depth in 3D
    const scaleZ = depth / 2.0;
    this.balconySlab.scale.z = scaleZ;
    this.balconySlab.position.z = 3.9 + depth * 0.5;
  }

  setTypology(type) {
    if (type === '1bhk') {
      this.floorMesh.scale.set(0.75, 1, 0.8);
    } else if (type === '2bhk') {
      this.floorMesh.scale.set(1.0, 1, 1.0);
    } else if (type === '3bhk') {
      this.floorMesh.scale.set(1.35, 1, 1.2);
    }
  }

  resize() {
    if (!this.canvas) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  }
}

/* ==========================================================================
   MASTER INNOVATIONS ENGINE CONTROLLER
   ========================================================================== */
export class InnovationsEngine {
  constructor(bimViewerInstance) {
    this.bimViewer = bimViewerInstance;
    this.activeInno = 1;

    // Instantiate all 5 independent 3D Viewport Engines
    this.inno1 = new Inno1Facade3D('canvas-inno-1');
    this.inno2 = new Inno2Stack3D('canvas-inno-2');
    this.inno3 = new Inno3Material3D('canvas-inno-3');
    this.inno4 = new Inno4Circadian3D('canvas-inno-4');
    this.inno5 = new Inno5Planning3D('canvas-inno-5');

    this.initNavigationTabs();
    this.initInteractiveWidgets();
  }

  initNavigationTabs() {
    const tabs = document.querySelectorAll('.inno-nav-pill');
    const sections = document.querySelectorAll('.inno-workbench-section');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const innoNum = parseInt(tab.dataset.inno, 10);
        this.activeInno = innoNum;

        tabs.forEach(t => t.classList.toggle('active', parseInt(t.dataset.inno, 10) === innoNum));
        sections.forEach(s => s.classList.toggle('active', parseInt(s.dataset.inno, 10) === innoNum));

        // Resize 3D renderer on tab switch
        setTimeout(() => this.resizeActive3D(), 50);
      });
    });
  }

  initInteractiveWidgets() {
    // 1. Facade Mode & Slider
    const facadeBtns = document.querySelectorAll('.btn-facade-mode');
    const facadeSlider = document.getElementById('inno1LouverSlider');
    const facadeAngleVal = document.getElementById('facadeAngleVal');

    facadeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        facadeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.facadeMode;
        if (this.inno1) this.inno1.setMode(mode);

        if (mode === 'solar') {
          if (facadeAngleVal) facadeAngleVal.textContent = '42.5° (Solar Shading Mode)';
          if (facadeSlider) facadeSlider.value = 42.5;
        } else if (mode === 'vortex') {
          if (facadeAngleVal) facadeAngleVal.textContent = '28.0° (Wind Scoop Catching)';
          if (facadeSlider) facadeSlider.value = 28;
        } else if (mode === 'storm') {
          if (facadeAngleVal) facadeAngleVal.textContent = '0.0° (Flush Aerodynamic Storm)';
          if (facadeSlider) facadeSlider.value = 0;
        } else if (mode === 'night') {
          if (facadeAngleVal) facadeAngleVal.textContent = '85.0° (Night Convective Ventilation)';
          if (facadeSlider) facadeSlider.value = 85;
        }
      });
    });

    if (facadeSlider) {
      facadeSlider.addEventListener('input', (e) => {
        const deg = parseFloat(e.target.value);
        if (facadeAngleVal) facadeAngleVal.textContent = `${deg.toFixed(1)}° Custom Angle`;
        if (this.inno1) this.inno1.setLouverAngle(deg);
      });
    }

    // 2. CFD Damper Slider & Toggle
    const damperSlider = document.getElementById('chimneyDamperSlider');
    const damperVal = document.getElementById('chimneyDamperVal');
    const achVal = document.getElementById('chimneyAchVal');
    const cfdToggleBtn = document.getElementById('btnToggleCfdParticles');

    if (damperSlider) {
      damperSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        if (damperVal) damperVal.textContent = `${pct}% Open`;
        const calculatedAch = (1.5 + (pct / 100) * 3.8).toFixed(1);
        if (achVal) achVal.textContent = `${calculatedAch} ACH (Target Airflow)`;
        if (this.inno2) this.inno2.setDamper(pct);
      });
    }

    if (cfdToggleBtn) {
      cfdToggleBtn.addEventListener('click', () => {
        const active = cfdToggleBtn.classList.toggle('active');
        cfdToggleBtn.textContent = active ? 'CFD Stack Particles: ACTIVE' : 'CFD Stack Particles: PAUSED';
        if (this.inno2) this.inno2.toggleParticles(active);
      });
    }

    // 3. GGBS Material Passport Slider & Pills
    const ggbsSlider = document.getElementById('ggbsSlider');
    const ggbsVal = document.getElementById('ggbsVal');
    const carbonBudgetVal = document.getElementById('carbonBudgetVal');
    const passportPills = document.querySelectorAll('.passport-pill');

    if (ggbsSlider) {
      ggbsSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        if (ggbsVal) ggbsVal.textContent = `${pct}% GGBS Slag Blend`;
        const intensity = Math.round(520 - (pct / 100) * 260);
        if (carbonBudgetVal) carbonBudgetVal.textContent = `${intensity} kgCO₂e/m² (-${Math.round((520 - intensity) / 5.2)}%)`;
        if (this.inno3) this.inno3.setGgbs(pct);
      });
    }

    passportPills.forEach(pill => {
      pill.addEventListener('click', () => {
        passportPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const key = pill.dataset.passport;
        if (this.inno3) this.inno3.selectPassport(key);
      });
    });

    // 4. Circadian Hour Slider
    const circadianSlider = document.getElementById('circadianHourSlider');
    const circadianTimeDisplay = document.getElementById('circadianTimeDisplay');

    if (circadianSlider) {
      circadianSlider.addEventListener('input', (e) => {
        const hr = parseFloat(e.target.value);
        const hStr = Math.floor(hr).toString().padStart(2, '0');
        const mStr = (hr % 1 === 0.5) ? '30' : '00';
        if (circadianTimeDisplay) circadianTimeDisplay.textContent = `${hStr}:${mStr}`;
        if (this.inno4) this.inno4.setCircadianHour(hr);
      });
    }

    // 5. Parametric Space Planning Controls
    const wfhSlider = document.getElementById('wfhWeightSlider');
    const wfhVal = document.getElementById('wfhWeightVal');
    const balconySlider = document.getElementById('inno5BalconySlider');
    const balconyVal = document.getElementById('inno5BalconyVal');
    const typologyBtns = document.querySelectorAll('.btn-inno-typology');

    if (wfhSlider) {
      wfhSlider.addEventListener('input', (e) => {
        const pct = parseInt(e.target.value, 10);
        if (wfhVal) wfhVal.textContent = `${pct}% WFH Flex`;
        if (this.inno5) this.inno5.setWfhWeight(pct);
      });
    }

    if (balconySlider) {
      balconySlider.addEventListener('input', (e) => {
        const depth = parseFloat(e.target.value);
        if (balconyVal) balconyVal.textContent = `${depth.toFixed(1)}m Depth`;
        if (this.inno5) this.inno5.setBalconyDepth(depth);
      });
    }

    typologyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        typologyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.dataset.type;
        if (this.inno5) this.inno5.setTypology(type);
      });
    });
  }

  resizeActive3D() {
    if (this.inno1) this.inno1.resize();
    if (this.inno2) this.inno2.resize();
    if (this.inno3) this.inno3.resize();
    if (this.inno4) this.inno4.resize();
    if (this.inno5) this.inno5.resize();
  }
}
