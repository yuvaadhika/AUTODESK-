# AURA VERTICALIS — Sustainable B+G+9 Mixed-Use BIM Development
> **Centrally Located Biophilic & Climate-Responsive Mixed-Use Architectural Prototype**

---

## 🏛️ Project Overview
**AURA VERTICALIS** is a forward-thinking, centrally located **B+G+9 (11 Total Levels)** mixed-use urban development. The project harmoniously synthesizes active commercial and retail vitality on the lower levels with serene, nature-integrated luxury residential living above, founded upon an automated basement parking and EV supercharging hub.

- **Total Height:** 38,700 mm (+34,900 mm Above Ground Level)
- **Plot Dimensions (Assumed mm):** 48,000 mm (W) × 36,000 mm (D) = **1,728 m²**
- **Building Footprint:** 40,000 mm × 30,000 mm = **1,200 m²**
- **Total Gross Built-Up Area (BUA):** **12,850 m²**
- **Structural Grid:** 8,000 mm × 8,000 mm Reinforced Concrete Frame
- **Energy Reduction (Forma EUI):** **62.8 kWh/m²/yr (-51% vs ASHRAE baseline)**

---

## 🏢 Comprehensive Program & Zoning

| Level | Floor Level | Key Program & Spatial Functions | Area (m²) | Height (mm) |
| :--- | :--- | :--- | :--- | :--- |
| **B1** | Level -1 | **Automated EV Parking Hub:** 48 Fast Charging Bays, 45kL Cistern, Substation, Dual Pressurized Fire Stairs | 1,728 m² | 3,800 mm |
| **Ground** | Level 0 | **Active Commercial Arcade:** Double-height retail, artisan cafe, grand residential lobby, 224 m² central courtyard | 1,500 m² | 4,500 mm |
| **1F** | Level +1 | **Commercial & Wellness Deck:** Co-working hub, fitness gym, child crèche, skybridge viewing deck | 1,450 m² | 4,000 mm |
| **2F – 9F** | Levels +2 to +9 | **Residential Sanctuary (64 Units):** 1BHK (55m²), 2BHK (92m²), 3BHK (145m²), cantilevered balconies & planters | 7,200 m² | 3,300 mm ea |
| **10F** | Level +10 (Roof) | **Bio-Solar Sky Terrace:** 148 kWp BIPV solar pergola, community urban farm plots, jogging circuit | 972 m² | 3,600 mm |

---

## 🌿 Core Architectural & Environmental Innovations

### 1. Breathable Central Courtyard (Thermal Chimney)
- Open-to-sky **16,000 mm × 14,000 mm (224 m²)** central landscaped atrium.
- Harnesses natural convective stack pressure to continuously pull cool air through shaded ground walkways and vent warm air up through the 38.7m shaft.
- Achieves **4.5 air changes per hour (ACH)** passively without mechanical assistance.

### 2. Parametric Climate-Responsive Facade
- Motorized aerofoil aluminum solar louvers set at 42° inclination to block 85% of peak summer infrared heat while reflecting ambient daylight into unit interiors.
- High-performance Low-E double glazing (**SHGC 0.28, U-value 1.4 W/m²K**).
- Continuous cantilevered balconies (**1,800 mm projection**) with automated drip-irrigated native bio-planters providing 4.2°C evaporative microclimate cooling.

### 3. Structural Modeling & Engineering Detailing
- **Grid:** 8,000 × 8,000 mm column bays with post-tensioned two-way flat slabs (175 mm depth) and drop panels (2500 × 2500 × 75 mm).
- **Columns (C1):** 600 × 600 mm Grade M40 concrete reinforced with 12-T25 rebar and 8mm confinement ties with 135° seismic hooks per IS 13920.
- **Beams (B1):** 300 × 600 mm Grade M35 concrete with Top 3-T20 & Bottom 4-T25 rebar.
- **Tile Flooring & Finishes:** 600 × 600 mm vitrified tiles over acoustic sound underlay (ΔLw = 21 dB) and multi-layer elastomeric waterproofing.

### 4. Autodesk Forma Site & Environmental Simulation
- **Spatial Daylight Autonomy (sDA > 300 lx):** 82.4% (LEED Platinum ready).
- **Energy Use Intensity (EUI):** 62.8 kWh/m²/yr (51% energy savings).
- **Clean Solar Generation:** 148 kWp bifacial BIPV generating 185 MWh/year.
- **Embodied Carbon:** 310 kgCO₂e/m² (-38% reduction via GGBS/fly ash concrete mix).

---

## 💻 Web Prototype Features

1. **Interactive 3D BIM Viewer (Three.js WebGL):**
   - Procedural full B+G+9 model rendering with Orbit/Pan/Zoom.
   - **Exploded View Slider:** Smooth vertical floor separation slider to inspect every floor individually.
   - **BIM Layer Visibility Toggles:** Architecture, RCC Skeleton, Solar Louvers, Courtyard Landscape, Basement EV, and MEP.
   - **Raycasting BIM Inspector:** Click any element in 3D to inspect real-time dimensions, materials, and Revit family properties.
   - **Autodesk Forma Sun-Path Simulator:** Real-time time of day slider (06:00 to 18:00) with dynamic directional lighting and shadows.

2. **30-Second Cinematic Walkthrough Animation:**
   - 5 curated camera keyframe stations with timeline scrubber, play/pause, speed controls (1x, 1.5x, 2x), and live narration subtitles.
   - Web Audio API organic biophilic soundscape generator.

3. **Architectural Floor Plans & Unit Layouts:**
   - Vector SVG floor plans for B1, G, 1F, Typical Residential 2-9F, and Rooftop.
   - Room-by-room metric schedule (in mm) and interactive 1BHK, 2BHK, 3BHK unit typologies.

4. **Structural 2D CAD & Detailing Suite:**
   - Engineering cross-sections for Beam B1, Column C1, Flat Slab S1, Fire Stairs, and Floor Finishes.
   - Automated Bar Bending Schedule (BBS) steel calculations and design parameters.

5. **Autodesk Forma Climate Dashboard:**
   - Interactive Chart.js visualizers for Daylight Autonomy, Wind Stack CFD, EUI savings, and Carbon Lifecycle Assessment.

6. **7-Slide Jury Presentation Deck:**
   - Fullscreen presentation mode with keyboard arrow navigation.
   - **One-Click Export to PowerPoint (.pptx)** and **Architectural PDF Dossier**.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 📐 Design Standards Compliance
- **Structural Codes:** IS 456:2000 (Plain and Reinforced Concrete), IS 13920:2016 (Ductile Design and Detailing of RCC Structures), IS 1893:2016 (Criteria for Earthquake Resistant Design).
- **Energy Codes:** ECBC 2017 (Energy Conservation Building Code), ASHRAE 90.1-2019, NBC 2016 (National Building Code of India).
- **Sustainability Rating:** Targeted LEED Platinum / IGBC Platinum (Forma Score: 94.8 / 100).
