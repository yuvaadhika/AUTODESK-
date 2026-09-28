/**
 * Structural 2D CAD & Engineering Detailing Module
 * Proposed Structural System, Reinforcement Detailing, Sections & Schedules (IS 456 & IS 13920)
 */

export const cadDrawingsData = {
  beam: {
    title: "DRAWING S-01: PROPOSED CONTINUOUS BEAM B1 (300 × 600 mm) REINFORCEMENT & SECTIONS",
    scale: "Scale 1:25 | Proposed Concrete: M35 | Proposed Steel: Fe500D TMT",
    bbs: [
      { mark: "B1-01", dia: "25 mm", shape: "Bottom Straight Bars (Continuous)", cutL: "8,650", no: "4", wt: "133.4" },
      { mark: "B1-02", dia: "20 mm", shape: "Top Continuous Hanger Bars", cutL: "8,650", no: "3", wt: "64.0" },
      { mark: "B1-03", dia: "16 mm", shape: "Top Extra Bars (Over Support L/3)", cutL: "2,800", no: "2", wt: "8.8" },
      { mark: "B1-04", dia: "8 mm", shape: "2-Legged Stirrups (Shear Zone @ 100 c/c)", cutL: "1,650", no: "32", wt: "20.8" },
      { mark: "B1-05", dia: "8 mm", shape: "2-Legged Stirrups (Midspan @ 200 c/c)", cutL: "1,650", no: "20", wt: "13.0" }
    ],
    svg: `
      <!-- Blueprint Grid Lines -->
      <g stroke="#1e293b" stroke-width="0.75" stroke-dasharray="3">
        <line x1="50" y1="100" x2="950" y2="100"/>
        <line x1="50" y1="220" x2="950" y2="220"/>
        <line x1="50" y1="340" x2="950" y2="340"/>
        <line x1="200" y1="40" x2="200" y2="400"/>
        <line x1="800" y1="40" x2="800" y2="400"/>
      </g>

      <!-- LONGITUDINAL ELEVATION OF PROPOSED BEAM B1 -->
      <!-- Columns at supports -->
      <rect x="120" y="60" width="80" height="280" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <text x="160" y="200" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">COL C1</text>

      <rect x="740" y="60" width="80" height="280" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <text x="780" y="200" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">COL C1</text>

      <!-- Beam Concrete Outline (300 x 600 mm) -->
      <rect x="120" y="120" width="700" height="150" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>

      <!-- Rebar - Top Continuous Bars (3-T20) -->
      <line x1="140" y1="140" x2="800" y2="140" stroke="#f59e0b" stroke-width="4"/>
      <polyline points="140,180 140,140 200,140" stroke="#f59e0b" stroke-width="4" fill="none"/>
      <polyline points="800,180 800,140 740,140" stroke="#f59e0b" stroke-width="4" fill="none"/>

      <!-- Rebar - Top Extra Support Bars (2-T16) -->
      <line x1="140" y1="150" x2="360" y2="150" stroke="#ef4444" stroke-width="3"/>
      <line x1="580" y1="150" x2="800" y2="150" stroke="#ef4444" stroke-width="3"/>

      <!-- Rebar - Bottom Continuous Bars (4-T25) -->
      <line x1="140" y1="250" x2="800" y2="250" stroke="#10b981" stroke-width="5"/>
      <polyline points="140,210 140,250 200,250" stroke="#10b981" stroke-width="5" fill="none"/>
      <polyline points="800,210 800,250 740,250" stroke="#10b981" stroke-width="5" fill="none"/>

      <!-- Stirrups (Vertical Links) -->
      <!-- Confinement Zone Left (100 c/c) -->
      <g stroke="#38bdf8" stroke-width="2">
        <line x1="210" y1="135" x2="210" y2="255"/>
        <line x1="235" y1="135" x2="235" y2="255"/>
        <line x1="260" y1="135" x2="260" y2="255"/>
        <line x1="285" y1="135" x2="285" y2="255"/>
        <line x1="310" y1="135" x2="310" y2="255"/>
        <line x1="335" y1="135" x2="335" y2="255"/>
        <line x1="360" y1="135" x2="360" y2="255"/>

        <!-- Midspan Zone (200 c/c) -->
        <line x1="410" y1="135" x2="410" y2="255"/>
        <line x1="460" y1="135" x2="460" y2="255"/>
        <line x1="510" y1="135" x2="510" y2="255"/>

        <!-- Confinement Zone Right (100 c/c) -->
        <line x1="580" y1="135" x2="580" y2="255"/>
        <line x1="605" y1="135" x2="605" y2="255"/>
        <line x1="630" y1="135" x2="630" y2="255"/>
        <line x1="655" y1="135" x2="655" y2="255"/>
        <line x1="680" y1="135" x2="680" y2="255"/>
        <line x1="705" y1="135" x2="705" y2="255"/>
        <line x1="730" y1="135" x2="730" y2="255"/>
      </g>

      <!-- Annotations & Callouts -->
      <text x="470" y="100" text-anchor="middle" font-size="12" font-weight="bold" fill="#f59e0b">PROPOSED TOP: 3-T20 CONTINUOUS HANGERS</text>
      <text x="250" y="80" text-anchor="middle" font-size="11" font-weight="bold" fill="#ef4444">TOP EXTRA: 2-T16 (L/3 Support)</text>
      <text x="470" y="290" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">PROPOSED BOTTOM: 4-T25 MAIN REBAR</text>
      <text x="270" y="320" text-anchor="middle" font-size="10" fill="#38bdf8">2-L T8 @ 100 c/c (2d = 1200mm Confinement)</text>
      <text x="470" y="320" text-anchor="middle" font-size="10" fill="#94a3b8">2-L T8 @ 200 c/c</text>

      <!-- Span Dimension -->
      <g stroke="#ffffff" stroke-width="1.5">
        <line x1="200" y1="360" x2="740" y2="360"/>
        <line x1="200" y1="352" x2="200" y2="368"/>
        <line x1="740" y1="352" x2="740" y2="368"/>
        <text x="470" y="380" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">CLEAR SPAN = 8,000 mm</text>
      </g>

      <!-- CROSS SECTION AT SUPPORT & MIDSPAN -->
      <!-- Section at Support (A-A) -->
      <rect x="180" y="440" width="90" height="150" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="225" y="425" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">SEC A-A (SUPPORT)</text>
      <circle cx="195" cy="455" r="5" fill="#f59e0b"/>
      <circle cx="225" cy="455" r="5" fill="#f59e0b"/>
      <circle cx="255" cy="455" r="5" fill="#f59e0b"/>
      <circle cx="210" cy="468" r="4" fill="#ef4444"/>
      <circle cx="240" cy="468" r="4" fill="#ef4444"/>
      <circle cx="195" cy="575" r="6" fill="#10b981"/>
      <circle cx="215" cy="575" r="6" fill="#10b981"/>
      <circle cx="235" cy="575" r="6" fill="#10b981"/>
      <circle cx="255" cy="575" r="6" fill="#10b981"/>
      <text x="225" y="610" text-anchor="middle" font-size="9" fill="#94a3b8">300 × 600 mm</text>

      <!-- Section at Mid-span (B-B) -->
      <rect x="650" y="440" width="90" height="150" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="695" y="425" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">SEC B-B (MID-SPAN)</text>
      <circle cx="665" cy="455" r="5" fill="#f59e0b"/>
      <circle cx="695" cy="455" r="5" fill="#f59e0b"/>
      <circle cx="725" cy="455" r="5" fill="#f59e0b"/>
      <circle cx="665" cy="575" r="6" fill="#10b981"/>
      <circle cx="685" cy="575" r="6" fill="#10b981"/>
      <circle cx="705" cy="575" r="6" fill="#10b981"/>
      <circle cx="725" cy="575" r="6" fill="#10b981"/>
      <text x="695" y="610" text-anchor="middle" font-size="9" fill="#94a3b8">300 × 600 mm</text>
    `
  },

  column: {
    title: "DRAWING S-02: PROPOSED COLUMN C1 (600 × 600 mm) REBAR SCHEDULE & DUCTILE TIES",
    scale: "Scale 1:20 | Proposed Concrete: M40 | Steel: Fe500D TMT",
    bbs: [
      { mark: "C1-01", dia: "25 mm", shape: "Longitudinal Rebar (Vertical 12 Nos)", cutL: "4,200", no: "12", wt: "194.0" },
      { mark: "C1-02", dia: "8 mm", shape: "Outer Confinement Tie with 135° Seismic Hooks", cutL: "2,450", no: "28", wt: "27.0" },
      { mark: "C1-03", dia: "8 mm", shape: "Inner Diamond Link / Cross Ties", cutL: "1,850", no: "28", wt: "20.4" }
    ],
    svg: `
      <!-- Column Cross Section (600 x 600 mm) -->
      <rect x="250" y="100" width="300" height="300" fill="#1e293b" stroke="#38bdf8" stroke-width="4" rx="6"/>
      <rect x="270" y="120" width="260" height="260" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="2"/>

      <!-- Diamond Link (Inner Lateral Tie) -->
      <polygon points="400,125 525,250 400,375 275,250" fill="none" stroke="#38bdf8" stroke-width="2.5"/>

      <!-- 12 Longitudinal Bars (12-T25) -->
      <!-- Top Row (4 bars) -->
      <circle cx="280" cy="130" r="10" fill="#10b981"/>
      <circle cx="360" cy="130" r="10" fill="#10b981"/>
      <circle cx="440" cy="130" r="10" fill="#10b981"/>
      <circle cx="520" cy="130" r="10" fill="#10b981"/>

      <!-- Mid Top (2 bars) -->
      <circle cx="280" cy="210" r="10" fill="#10b981"/>
      <circle cx="520" cy="210" r="10" fill="#10b981"/>

      <!-- Mid Bot (2 bars) -->
      <circle cx="280" cy="290" r="10" fill="#10b981"/>
      <circle cx="520" cy="290" r="10" fill="#10b981"/>

      <!-- Bot Row (4 bars) -->
      <circle cx="280" cy="370" r="10" fill="#10b981"/>
      <circle cx="360" cy="370" r="10" fill="#10b981"/>
      <circle cx="440" cy="370" r="10" fill="#10b981"/>
      <circle cx="520" cy="370" r="10" fill="#10b981"/>

      <!-- Dimensions -->
      <g stroke="#ffffff" stroke-width="1.5">
        <line x1="250" y1="70" x2="550" y2="70"/>
        <line x1="250" y1="65" x2="250" y2="75"/>
        <line x1="550" y1="65" x2="550" y2="75"/>
        <text x="400" y="60" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">600 mm</text>

        <line x1="580" y1="100" x2="580" y2="400"/>
        <line x1="575" y1="100" x2="585" y2="100"/>
        <line x1="575" y1="400" x2="585" y2="400"/>
        <text x="610" y="255" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff" transform="rotate(90 610 255)">600 mm</text>
      </g>

      <!-- Rebar Annotation -->
      <text x="400" y="440" text-anchor="middle" font-size="13" font-weight="bold" fill="#10b981">PROPOSED: 12 - T25 mm LONGITUDINAL REBAR (Fe500D)</text>
      <text x="400" y="465" text-anchor="middle" font-size="11" fill="#f59e0b">8mm OUTER TIE + INNER DIAMOND LINK (135° SEISMIC HOOKS)</text>
      <text x="400" y="485" text-anchor="middle" font-size="11" fill="#94a3b8">CLEAR COVER = 40 mm | PROPOSED CONCRETE M40</text>

      <!-- Confinement Elevation Schematic (Right side) -->
      <g transform="translate(680, 80)">
        <rect x="0" y="20" width="100" height="420" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <!-- Joint confinement zone -->
        <rect x="0" y="20" width="100" height="80" fill="#334155"/>
        <text x="50" y="65" text-anchor="middle" font-size="9" fill="#f59e0b">Lo (100 c/c)</text>

        <rect x="0" y="360" width="100" height="80" fill="#334155"/>
        <text x="50" y="405" text-anchor="middle" font-size="9" fill="#f59e0b">Lo (100 c/c)</text>

        <text x="50" y="235" text-anchor="middle" font-size="10" fill="#94a3b8">Mid Zone</text>
        <text x="50" y="250" text-anchor="middle" font-size="9" fill="#94a3b8">(150 c/c)</text>
      </g>
    `
  },

  slab: {
    title: "DRAWING S-03: PROPOSED TWO-WAY FLAT SLAB (175 mm) & DROP PANEL REINFORCEMENT",
    scale: "Scale 1:50 | Proposed Concrete: M35 | Cover: 25 mm",
    bbs: [
      { mark: "S1-01", dia: "10 mm", shape: "Bottom Mesh Both Ways (@ 150 c/c)", cutL: "8,200", no: "54", wt: "273.0" },
      { mark: "S1-02", dia: "12 mm", shape: "Top Extra Bars over Column Strip (@ 120 c/c)", cutL: "3,200", no: "28", wt: "79.5" },
      { mark: "S1-03", dia: "8 mm", shape: "Chair Spacers (@ 1000 c/c)", cutL: "900", no: "40", wt: "14.2" }
    ],
    svg: `
      <!-- Flat Slab Grid (8,000 x 8,000 mm Bay) -->
      <rect x="150" y="80" width="540" height="400" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>

      <!-- Drop Panels over Columns (2500 x 2500 x 75 mm drop) -->
      <rect x="110" y="40" width="90" height="90" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
      <rect x="640" y="40" width="90" height="90" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
      <rect x="110" y="430" width="90" height="90" fill="#334155" stroke="#f59e0b" stroke-width="2"/>
      <rect x="640" y="430" width="90" height="90" fill="#334155" stroke="#f59e0b" stroke-width="2"/>

      <!-- Column Outlines (600 x 600 mm) -->
      <rect x="135" y="65" width="40" height="40" fill="#475569"/>
      <rect x="665" y="65" width="40" height="40" fill="#475569"/>
      <rect x="135" y="455" width="40" height="40" fill="#475569"/>
      <rect x="665" y="455" width="40" height="40" fill="#475569"/>

      <!-- Bottom Rebar Mesh (T10 @ 150 c/c) -->
      <g stroke="#10b981" stroke-width="1.5" stroke-dasharray="6">
        <line x1="160" y1="180" x2="680" y2="180"/>
        <line x1="160" y1="240" x2="680" y2="240"/>
        <line x1="160" y1="300" x2="680" y2="300"/>
        <line x1="160" y1="360" x2="680" y2="360"/>
        <line x1="280" y1="90" x2="280" y2="470"/>
        <line x1="380" y1="90" x2="380" y2="470"/>
        <line x1="480" y1="90" x2="480" y2="470"/>
        <line x1="580" y1="90" x2="580" y2="470"/>
      </g>

      <!-- Top Column Strip Extra Bars (T12 @ 120 c/c) -->
      <g stroke="#ef4444" stroke-width="2.5">
        <line x1="130" y1="120" x2="320" y2="120"/>
        <line x1="520" y1="120" x2="710" y2="120"/>
        <line x1="130" y1="440" x2="320" y2="440"/>
        <line x1="520" y1="440" x2="710" y2="440"/>
      </g>

      <!-- Annotations -->
      <text x="420" y="275" text-anchor="middle" font-size="13" font-weight="bold" fill="#10b981">PROPOSED BOTTOM MESH: T10 @ 150 mm c/c (BOTH WAYS)</text>
      <text x="420" y="300" text-anchor="middle" font-size="11" fill="#38bdf8">SLAB THICKNESS = 175 mm | CLEAR COVER = 25 mm</text>
      <text x="225" y="150" text-anchor="middle" font-size="10" font-weight="bold" fill="#ef4444">TOP EXTRA: T12 @ 120 c/c</text>
      <text x="690" y="150" text-anchor="middle" font-size="10" font-weight="bold" fill="#f59e0b">DROP PANEL: 2500×2500×75mm</text>
    `
  },

  stairs: {
    title: "DRAWING S-04: PROPOSED DOGLEGGED FIRE ESCAPE STAIRCASE SECTION & REINFORCEMENT",
    scale: "Scale 1:25 | Proposed Waist Slab: 150 mm | Tread: 300 mm | Riser: 150 mm",
    bbs: [
      { mark: "ST-01", dia: "12 mm", shape: "Main Tensile Rebar (@ 120 c/c)", cutL: "4,600", no: "14", wt: "57.1" },
      { mark: "ST-02", dia: "8 mm", shape: "Distribution Steel (@ 150 c/c)", cutL: "1,600", no: "30", wt: "18.9" },
      { mark: "ST-03", dia: "10 mm", shape: "Landing Anchor Bars", cutL: "1,800", no: "12", wt: "13.3" }
    ],
    svg: `
      <!-- Floor Slab Level 1 -->
      <rect x="60" y="440" width="220" height="50" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
      <text x="140" y="470" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">LOWER LANDING</text>

      <!-- Stepped Stair Profile -->
      <polygon points="
        260,440 260,400 310,400 310,350 360,350 360,300 410,300 410,250 460,250 460,200 510,200 510,150 560,150 560,100 780,100 780,150 600,150 260,490
      " fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>

      <!-- Upper Landing -->
      <rect x="560" y="100" width="260" height="50" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
      <text x="690" y="130" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">UPPER MID-LANDING</text>

      <!-- Main Tension Rebar (T12 @ 120 c/c) -->
      <polyline points="100,470 280,470 580,130 760,130" stroke="#10b981" stroke-width="4" fill="none"/>
      
      <!-- Distribution Rebar Dots (T8 @ 150 c/c) -->
      <g fill="#f59e0b">
        <circle cx="300" cy="425" r="4"/>
        <circle cx="350" cy="375" r="4"/>
        <circle cx="400" cy="325" r="4"/>
        <circle cx="450" cy="275" r="4"/>
        <circle cx="500" cy="225" r="4"/>
        <circle cx="550" cy="175" r="4"/>
      </g>

      <!-- Tread / Riser Dimension -->
      <text x="335" y="335" font-size="10" font-weight="bold" fill="#ffffff">Riser = 150 mm</text>
      <text x="385" y="285" font-size="10" font-weight="bold" fill="#ffffff">Tread = 300 mm</text>
      <text x="420" y="550" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">PROPOSED MAIN BARS: T12 @ 120 mm c/c</text>
      <text x="420" y="575" text-anchor="middle" font-size="10" fill="#f59e0b">DISTRIBUTION: T8 @ 150 mm c/c | WAIST SLAB = 150 mm</text>
    `
  },

  flooring: {
    title: "DRAWING S-05: PROPOSED FLOORING, WATERPROOFING & WALL JUNCTION DETAIL",
    scale: "Scale 1:10 | Floor Finish: 600 × 600 mm Vitrified Tiles",
    bbs: [
      { mark: "FL-01", dia: "—", shape: "600 × 600 mm Premium Vitrified GVT Tiles", cutL: "600", no: "18,400", wt: "—" },
      { mark: "FL-02", dia: "—", shape: "Polymer Cementitious Mortar Bed (20 mm)", cutL: "—", no: "—", wt: "—" },
      { mark: "FL-03", dia: "—", shape: "Acoustic Impact Sound Insulation Layer (5 mm)", cutL: "—", no: "—", wt: "—" },
      { mark: "FL-04", dia: "—", shape: "Elastomeric Waterproofing Membrane (2 Coats)", cutL: "—", no: "—", wt: "—" },
      { mark: "FL-05", dia: "—", shape: "RCC Structural Slab (175 mm M35 Concrete)", cutL: "—", no: "—", wt: "—" }
    ],
    svg: `
      <!-- Wall Cut (Left) -->
      <rect x="80" y="80" width="120" height="460" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
      <text x="140" y="260" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff" transform="rotate(-90 140 260)">AAC BLOCK WALL (200 mm)</text>

      <!-- Skirting Tile -->
      <rect x="200" y="280" width="12" height="80" fill="#f59e0b"/>
      <text x="230" y="325" font-size="10" fill="#f59e0b">Skirting 100mm</text>

      <!-- FLOOR LAYERS (Step-by-step from top to bottom) -->
      <!-- 1. 600x600 Vitrified Tile (10mm) -->
      <rect x="200" y="360" width="680" height="16" fill="#f59e0b" stroke="#ffffff" stroke-width="1"/>
      <line x1="500" y1="360" x2="500" y2="376" stroke="#1e293b" stroke-width="2"/>
      <text x="550" y="345" font-size="11" font-weight="bold" fill="#f59e0b">1. 600 × 600 mm Vitrified Tile (10 mm) with 3mm Spacer Joint</text>

      <!-- 2. Mortar Bed (20mm) -->
      <rect x="200" y="376" width="680" height="24" fill="#64748b"/>
      <text x="550" y="392" font-size="10" fill="#ffffff">2. Polymer Modified Adhesive Bed (20 mm)</text>

      <!-- 3. Acoustic Impact Sound Underlay (5mm) -->
      <rect x="200" y="400" width="680" height="8" fill="#38bdf8"/>
      <text x="550" y="407" font-size="9" font-weight="bold" fill="#0369a1">3. Acoustic Impact Sound Insulation (ΔLw = 21 dB)</text>

      <!-- 4. Waterproofing Membrane (3mm) -->
      <rect x="200" y="408" width="680" height="6" fill="#10b981"/>
      <text x="550" y="414" font-size="9" font-weight="bold" fill="#15803d">4. Dual-Coat Elastomeric Waterproofing Membrane</text>

      <!-- 5. Screed to Slope (30mm avg) -->
      <rect x="200" y="414" width="680" height="30" fill="#94a3b8"/>
      <text x="550" y="434" font-size="10" fill="#1e293b">5. Cement-Sand Screed Layer (1:4 blend)</text>

      <!-- 6. RCC Structural Slab (175mm) -->
      <rect x="200" y="444" width="680" height="100" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="550" y="500" font-size="13" font-weight="bold" fill="#38bdf8">6. Reinforced Concrete Slab (175 mm Grade M35)</text>
      <!-- Rebar in slab -->
      <line x1="220" y1="520" x2="860" y2="520" stroke="#10b981" stroke-width="3"/>
    `
  }
};

export function initStructuralCAD() {
  const drawingTabs = document.querySelectorAll('.btn-cad-tab');
  const dwgTitle = document.getElementById('cadDwgTitle');
  const cadSvg = document.getElementById('cadSvg');
  const bbsBody = document.getElementById('bbsTableBody');

  function renderCAD(dwgKey) {
    const d = cadDrawingsData[dwgKey];
    if (!d) return;

    if (dwgTitle) dwgTitle.textContent = d.title;
    if (cadSvg) cadSvg.innerHTML = d.svg;

    if (bbsBody) {
      bbsBody.innerHTML = d.bbs.map(row => `
        <tr>
          <td><strong>${row.mark}</strong></td>
          <td style="color: var(--accent-green); font-weight: 700;">${row.dia}</td>
          <td>${row.shape}</td>
          <td>${row.cutL}</td>
          <td>${row.no}</td>
          <td style="font-weight: 700;">${row.wt}</td>
        </tr>
      `).join('');
    }
  }

  drawingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      drawingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCAD(tab.dataset.drawing);
    });
  });

  // Initial load
  renderCAD('beam');
}
