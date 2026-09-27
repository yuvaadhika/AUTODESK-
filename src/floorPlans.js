/**
 * Architectural Floor Plans & Unit Layouts Engine
 * Assumed Metric Dimensions (in mm) with Interactive Vector SVG Plans
 */

export const floorPlanData = {
  B1: {
    title: "Level B1: Automated Basement Parking & EV Supercharging Hub",
    dim: "48,000 mm × 36,000 mm",
    totalArea: "1,728 m²",
    height: "3,800 mm (Clearance 3,200 mm)",
    legend: [
      { name: "EV Fast Charging Bays (48)", color: "#10b981" },
      { name: "Two-Way Drive Aisle (6.0m)", color: "#94a3b8" },
      { name: "MEP & Water Cistern (45kL)", color: "#0284c7" },
      { name: "Fire Egress & Lift Cores", color: "#f97316" }
    ],
    schedule: [
      { space: "EV Fast Charging Stalls (48 Nos)", dim: "2,600 × 5,000 mm ea", area: "624 m²", vent: "Mechanical Ventilation (10 ACH)" },
      { space: "Two-Way Vehicular Aisles", dim: "6,000 mm wide", area: "480 m²", vent: "Exhaust Plenum Ducts" },
      { space: "Underground Rainwater Cistern", dim: "8,000 × 6,000 × 3,500 mm", area: "48 m² (45,000 L)", vent: "Pressure Relief Vent" },
      { space: "Transformer & HT/LT Electrical Substation", dim: "8,000 × 8,000 mm", area: "64 m²", vent: "Dedicated Forced Air Cooling" },
      { space: "Dual Fire Escape Stairwells + 4 Lifts", dim: "6,000 × 4,000 mm ea", area: "48 m²", vent: "Positive Pressure Air Shaft (50 Pa)" }
    ],
    svg: `
      <!-- Grid Lines -->
      <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4">
        <line x1="100" y1="50" x2="100" y2="650"/>
        <line x1="260" y1="50" x2="260" y2="650"/>
        <line x1="420" y1="50" x2="420" y2="650"/>
        <line x1="580" y1="50" x2="580" y2="650"/>
        <line x1="740" y1="50" x2="740" y2="650"/>
        <line x1="900" y1="50" x2="900" y2="650"/>
        <line x1="50" y1="120" x2="950" y2="120"/>
        <line x1="50" y1="260" x2="950" y2="260"/>
        <line x1="50" y1="400" x2="950" y2="400"/>
        <line x1="50" y1="540" x2="950" y2="540"/>
      </g>

      <!-- Boundary Walls (48,000 × 36,000 mm) -->
      <rect x="80" y="80" width="840" height="540" fill="#f8fafc" stroke="#1e293b" stroke-width="6" rx="4"/>

      <!-- Structural Columns (8,000 × 8,000 mm Grid) -->
      <g fill="#475569">
        <rect x="94" y="114" width="12" height="12"/>
        <rect x="254" y="114" width="12" height="12"/>
        <rect x="414" y="114" width="12" height="12"/>
        <rect x="574" y="114" width="12" height="12"/>
        <rect x="734" y="114" width="12" height="12"/>
        <rect x="894" y="114" width="12" height="12"/>

        <rect x="94" y="254" width="12" height="12"/>
        <rect x="254" y="254" width="12" height="12"/>
        <rect x="414" y="254" width="12" height="12"/>
        <rect x="574" y="254" width="12" height="12"/>
        <rect x="734" y="254" width="12" height="12"/>
        <rect x="894" y="254" width="12" height="12"/>

        <rect x="94" y="394" width="12" height="12"/>
        <rect x="254" y="394" width="12" height="12"/>
        <rect x="414" y="394" width="12" height="12"/>
        <rect x="574" y="394" width="12" height="12"/>
        <rect x="734" y="394" width="12" height="12"/>
        <rect x="894" y="394" width="12" height="12"/>

        <rect x="94" y="534" width="12" height="12"/>
        <rect x="254" y="534" width="12" height="12"/>
        <rect x="414" y="534" width="12" height="12"/>
        <rect x="574" y="534" width="12" height="12"/>
        <rect x="734" y="534" width="12" height="12"/>
        <rect x="894" y="534" width="12" height="12"/>
      </g>

      <!-- Parking Bays Top Row (EV Stalls) -->
      <g fill="#dcfce7" stroke="#16a34a" stroke-width="1.5">
        <rect x="120" y="90" width="55" height="100"/>
        <rect x="180" y="90" width="55" height="100"/>
        <rect x="240" y="90" width="55" height="100"/>
        <rect x="300" y="90" width="55" height="100"/>
        <rect x="360" y="90" width="55" height="100"/>
        <rect x="420" y="90" width="55" height="100"/>
        <rect x="480" y="90" width="55" height="100"/>
        <rect x="540" y="90" width="55" height="100"/>
        <rect x="600" y="90" width="55" height="100"/>
        <rect x="660" y="90" width="55" height="100"/>
        <rect x="720" y="90" width="55" height="100"/>
        <rect x="780" y="90" width="55" height="100"/>
      </g>

      <!-- Drive Aisle -->
      <rect x="110" y="200" width="780" height="90" fill="#f1f5f9" stroke="#94a3b8" stroke-dasharray="6"/>
      <text x="500" y="250" text-anchor="middle" font-size="14" font-weight="bold" fill="#64748b">TWO-WAY VEHICULAR DRIVE AISLE (6,000 mm)</text>

      <!-- Central Core & Cistern -->
      <rect x="400" y="300" width="200" height="130" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="4"/>
      <text x="500" y="355" text-anchor="middle" font-size="13" font-weight="bold" fill="#0369a1">Rainwater Cistern (45,000L)</text>
      <text x="500" y="375" text-anchor="middle" font-size="10" fill="#0284c7">Dual Stage Filtration & UV Treatment</text>

      <!-- Vertical Cores (Lifts & Stairs) -->
      <rect x="220" y="310" width="130" height="100" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
      <text x="285" y="355" text-anchor="middle" font-size="11" font-weight="bold" fill="#c2410c">Lift Lobby & Core</text>
      <text x="285" y="375" text-anchor="middle" font-size="9" fill="#9a3412">2 High-Speed Lifts</text>

      <rect x="650" y="310" width="130" height="100" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
      <text x="715" y="355" text-anchor="middle" font-size="11" font-weight="bold" fill="#c2410c">Fire Egress Stairs</text>
      <text x="715" y="375" text-anchor="middle" font-size="9" fill="#9a3412">Pressurized Shaft</text>

      <!-- Bottom Row Parking Bays -->
      <g fill="#dcfce7" stroke="#16a34a" stroke-width="1.5">
        <rect x="120" y="510" width="55" height="100"/>
        <rect x="180" y="510" width="55" height="100"/>
        <rect x="240" y="510" width="55" height="100"/>
        <rect x="300" y="510" width="55" height="100"/>
        <rect x="360" y="510" width="55" height="100"/>
        <rect x="420" y="510" width="55" height="100"/>
        <rect x="480" y="510" width="55" height="100"/>
        <rect x="540" y="510" width="55" height="100"/>
        <rect x="600" y="510" width="55" height="100"/>
        <rect x="660" y="510" width="55" height="100"/>
        <rect x="720" y="510" width="55" height="100"/>
        <rect x="780" y="510" width="55" height="100"/>
      </g>

      <!-- EV Ramp Ingress / Egress -->
      <polygon points="80,210 10,210 10,280 80,280" fill="#e2e8f0" stroke="#0284c7" stroke-width="3"/>
      <text x="45" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#0369a1" transform="rotate(-90 45 250)">RAMP 1:10</text>

      <!-- Dimension Leaders -->
      <g stroke="#64748b" stroke-width="1.5">
        <line x1="80" y1="40" x2="920" y2="40"/>
        <line x1="80" y1="35" x2="80" y2="45"/>
        <line x1="920" y1="35" x2="920" y2="45"/>
        <text x="500" y="30" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">48,000 mm (PLOT WIDTH)</text>

        <line x1="960" y1="80" x2="960" y2="620"/>
        <line x1="955" y1="80" x2="965" y2="80"/>
        <line x1="955" y1="620" x2="965" y2="620"/>
        <text x="980" y="350" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b" transform="rotate(90 980 350)">36,000 mm (DEPTH)</text>
      </g>
    `
  },

  G: {
    title: "Ground Floor: Active Commercial Arcade & Central Biophilic Courtyard",
    dim: "40,000 mm × 30,000 mm (Podium)",
    totalArea: "1,500 m²",
    height: "4,500 mm (Double Height Commercial)",
    legend: [
      { name: "Commercial Retail Boutiques", color: "#f59e0b" },
      { name: "Central Biophilic Courtyard (224 m²)", color: "#10b981" },
      { name: "Grand Residential Lobby", color: "#3b82f6" },
      { name: "Outdoor Cafe Terrace & Promenade", color: "#8b5cf6" }
    ],
    schedule: [
      { space: "Central Biophilic Courtyard (Atrium)", dim: "16,000 × 14,000 mm", area: "224 m² (Open to Sky)", vent: "Natural Convective Stack Chimney" },
      { space: "Anchor Retail Boutiques (4 Units)", dim: "8,000 × 8,000 mm ea", area: "256 m²", vent: "VAV High-Efficiency HVAC (MERV 14)" },
      { space: "Organic Bakery & Artisan Cafe", dim: "12,000 × 8,000 mm", area: "96 m²", vent: "Kitchen Dedicated Exhaust + Fresh Air" },
      { space: "Grand Residential Double-Height Lobby", dim: "16,000 × 8,000 mm", area: "128 m²", vent: "Displacement Underfloor Ventilation" },
      { space: "Alfresco Pedestrian Promenade", dim: "4,000 mm width perimeter", area: "320 m²", vent: "100% Outdoor Natural Airflow" }
    ],
    svg: `
      <!-- Perimeter Footprint (40,000 × 30,000 mm) -->
      <rect x="120" y="90" width="760" height="520" fill="#ffffff" stroke="#1e293b" stroke-width="4" rx="4"/>

      <!-- Central Courtyard Cutout (16,000 × 14,000 mm) -->
      <rect x="360" y="210" width="280" height="260" fill="#dcfce7" stroke="#16a34a" stroke-width="3" rx="8"/>
      <!-- Courtyard Water Feature -->
      <ellipse cx="500" cy="340" rx="70" ry="50" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      <text x="500" y="345" text-anchor="middle" font-size="12" font-weight="bold" fill="#0369a1">Reflection Pond</text>
      <text x="500" y="240" text-anchor="middle" font-size="13" font-weight="bold" fill="#15803d">CENTRAL BIOPHILIC COURTYARD</text>
      <text x="500" y="258" text-anchor="middle" font-size="10" fill="#166534">16,000 × 14,000 mm (Thermal Chimney)</text>

      <!-- Retail Boutiques (West Wing) -->
      <g fill="#fef3c7" stroke="#d97706" stroke-width="2">
        <rect x="140" y="110" width="190" height="140"/>
        <text x="235" y="175" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">Retail Boutique 01</text>
        <text x="235" y="195" text-anchor="middle" font-size="10" fill="#b45309">8,000 × 8,000 mm</text>

        <rect x="140" y="270" width="190" height="140"/>
        <text x="235" y="335" text-anchor="middle" font-size="12" font-weight="bold" fill="#92400e">Retail Boutique 02</text>
        <text x="235" y="355" text-anchor="middle" font-size="10" fill="#b45309">8,000 × 8,000 mm</text>
      </g>

      <!-- Artisan Cafe & Outdoor Deck (East Wing) -->
      <g fill="#ede9fe" stroke="#7c3aed" stroke-width="2">
        <rect x="670" y="110" width="190" height="200"/>
        <text x="765" y="205" text-anchor="middle" font-size="13" font-weight="bold" fill="#5b21b6">Artisan Cafe & F&B</text>
        <text x="765" y="225" text-anchor="middle" font-size="10" fill="#6d28d9">Alfresco Seating Deck</text>
      </g>

      <!-- Grand Residential Lobby (South Wing) -->
      <g fill="#dbeafe" stroke="#2563eb" stroke-width="2">
        <rect x="360" y="490" width="280" height="100"/>
        <text x="500" y="540" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e40af">Double-Height Residential Lobby</text>
        <text x="500" y="560" text-anchor="middle" font-size="10" fill="#2563eb">Concierge • Controlled Smart Turnstiles</text>
      </g>

      <!-- Dimension Lines -->
      <g stroke="#64748b" stroke-width="1.5">
        <line x1="120" y1="55" x2="880" y2="55"/>
        <line x1="120" y1="50" x2="120" y2="60"/>
        <line x1="880" y1="50" x2="880" y2="60"/>
        <text x="500" y="45" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">40,000 mm (BUILDING WIDTH)</text>
      </g>
    `
  },

  "1F": {
    title: "1st Floor: Commercial Wellness Center & Co-Working Lounge",
    dim: "40,000 mm × 30,000 mm",
    totalArea: "1,450 m²",
    height: "4,000 mm",
    legend: [
      { name: "Flexible Co-Working Suites", color: "#3b82f6" },
      { name: "Wellness Center & Fitness Deck", color: "#10b981" },
      { name: "Skybridge over Courtyard", color: "#f59e0b" },
      { name: "Community Crèche / Daycare", color: "#ec4899" }
    ],
    schedule: [
      { space: "Open Plan Co-Working Hub", dim: "16,000 × 12,000 mm", area: "192 m²", vent: "100% Economizer Fresh Air Mode" },
      { space: "Wellness Gym & Yoga Studio", dim: "14,000 × 8,000 mm", area: "112 m²", vent: "High-Volume Low-Speed (HVLS) Fans" },
      { space: "Skybridge Viewing Walkway", dim: "3,000 × 14,000 mm", area: "42 m²", vent: "Natural Cross-Breeze over Courtyard" },
      { space: "Child Care & Community Crèche", dim: "10,000 × 8,000 mm", area: "80 m²", vent: "HEPA Filtration + Low VOC" },
      { space: "Executive Conference Pods (3)", dim: "5,000 × 4,000 mm ea", area: "60 m²", vent: "Acoustically Attenuated Ducts" }
    ],
    svg: `
      <rect x="120" y="90" width="760" height="520" fill="#ffffff" stroke="#1e293b" stroke-width="4" rx="4"/>

      <!-- Courtyard Void -->
      <rect x="360" y="210" width="280" height="260" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="4" stroke-width="2"/>
      
      <!-- Skybridge across Courtyard -->
      <rect x="470" y="210" width="60" height="260" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="500" y="340" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400e" transform="rotate(-90 500 340)">Courtyard Skybridge (3,000 mm)</text>

      <!-- Co-Working Lounge -->
      <rect x="140" y="110" width="200" height="240" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
      <text x="240" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e40af">Co-Working Suites</text>
      <text x="240" y="240" text-anchor="middle" font-size="10" fill="#3b82f6">Ergonomic Hotdesks & Meeting Pods</text>

      <!-- Wellness Gym -->
      <rect x="660" y="110" width="200" height="240" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="760" y="220" text-anchor="middle" font-size="13" font-weight="bold" fill="#15803d">Wellness Fitness Gym</text>
      <text x="760" y="240" text-anchor="middle" font-size="10" fill="#16a34a">Aerobic Studio & Sauna</text>

      <!-- Community Crèche -->
      <rect x="140" y="370" width="200" height="220" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
      <text x="240" y="475" text-anchor="middle" font-size="13" font-weight="bold" fill="#9d174d">Community Crèche</text>
      <text x="240" y="495" text-anchor="middle" font-size="10" fill="#be185d">Childcare & Play Area</text>
    `
  },

  TYP: {
    title: "Typical Residential Floor (2nd - 9th Floor): 8 Luxury Modular Units per Floor",
    dim: "40,000 mm × 30,000 mm (Per Floor)",
    totalArea: "900 m² / floor (7,200 m² Total across 8 floors)",
    height: "3,300 mm floor-to-floor (2,900 mm clear ceiling)",
    legend: [
      { name: "2BHK Deluxe Units (92 m²)", color: "#3b82f6" },
      { name: "1BHK Executive Units (55 m²)", color: "#10b981" },
      { name: "3BHK Corner Suites (145 m²)", color: "#8b5cf6" },
      { name: "Cantilever Balconies & Planters", color: "#f59e0b" }
    ],
    schedule: [
      { space: "2BHK Deluxe Apartment (Unit 201-204)", dim: "11,200 × 8,200 mm", area: "92 m²", vent: "Dual Aspect Cross-Ventilation" },
      { space: "1BHK Executive Apartment (Unit 205-206)", dim: "8,000 × 6,800 mm", area: "55 m²", vent: "Balcony Sliding Glass + Stack Intake" },
      { space: "3BHK Corner Penthouse Suite", dim: "14,500 × 10,000 mm", area: "145 m²", vent: "Triple Aspect Panoramic Cross Air" },
      { space: "Cantilevered Shaded Balconies", dim: "1,800 mm projection", area: "14 m² / apt", vent: "Open Air with Bio-Planter Buffer" },
      { space: "Daylit Central Ring Corridor", dim: "2,000 mm width", area: "110 m²", vent: "100% Daylit from Central Atrium" }
    ],
    svg: `
      <rect x="120" y="90" width="760" height="520" fill="#ffffff" stroke="#1e293b" stroke-width="4" rx="4"/>

      <!-- Central Courtyard Light Well -->
      <rect x="360" y="210" width="280" height="260" fill="#f8fafc" stroke="#16a34a" stroke-width="3" rx="4"/>
      <text x="500" y="335" text-anchor="middle" font-size="13" font-weight="bold" fill="#15803d">CENTRAL ATRIUM LIGHT WELL</text>
      <text x="500" y="355" text-anchor="middle" font-size="10" fill="#166534">Daylight & Convective Ventilation</text>

      <!-- Daylit Ring Corridor -->
      <rect x="330" y="180" width="340" height="320" fill="none" stroke="#cbd5e1" stroke-width="2"/>

      <!-- 2BHK Unit 01 (North West) -->
      <g fill="#dbeafe" stroke="#2563eb" stroke-width="2">
        <rect x="140" y="110" width="180" height="170"/>
        <text x="230" y="185" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">2BHK Unit A</text>
        <text x="230" y="205" text-anchor="middle" font-size="10" fill="#2563eb">92 m²</text>
      </g>

      <!-- 1BHK Unit 02 (North Center) -->
      <g fill="#dcfce7" stroke="#16a34a" stroke-width="2">
        <rect x="340" y="110" width="150" height="70"/>
        <text x="415" y="150" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">1BHK (55 m²)</text>
      </g>

      <!-- 1BHK Unit 03 (North Center East) -->
      <g fill="#dcfce7" stroke="#16a34a" stroke-width="2">
        <rect x="510" y="110" width="150" height="70"/>
        <text x="585" y="150" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">1BHK (55 m²)</text>
      </g>

      <!-- 3BHK Corner Unit (North East) -->
      <g fill="#ede9fe" stroke="#7c3aed" stroke-width="2">
        <rect x="680" y="110" width="180" height="200"/>
        <text x="770" y="205" text-anchor="middle" font-size="12" font-weight="bold" fill="#5b21b6">3BHK Suite</text>
        <text x="770" y="225" text-anchor="middle" font-size="10" fill="#6d28d9">145 m²</text>
      </g>

      <!-- 2BHK Unit 04 (South West) -->
      <g fill="#dbeafe" stroke="#2563eb" stroke-width="2">
        <rect x="140" y="320" width="180" height="200"/>
        <text x="230" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">2BHK Unit B</text>
        <text x="230" y="435" text-anchor="middle" font-size="10" fill="#2563eb">92 m²</text>
      </g>

      <!-- 2BHK Unit 05 (South East) -->
      <g fill="#dbeafe" stroke="#2563eb" stroke-width="2">
        <rect x="680" y="330" width="180" height="190"/>
        <text x="770" y="415" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e40af">2BHK Unit C</text>
        <text x="770" y="435" text-anchor="middle" font-size="10" fill="#2563eb">92 m²</text>
      </g>

      <!-- Cantilever Balconies (Orange) -->
      <g fill="#fef3c7" stroke="#d97706" stroke-width="2">
        <rect x="140" y="530" width="180" height="40"/>
        <rect x="360" y="530" width="120" height="40"/>
        <rect x="520" y="530" width="120" height="40"/>
        <rect x="680" y="530" width="180" height="40"/>
        <text x="500" y="555" text-anchor="middle" font-size="10" font-weight="bold" fill="#b45309">1,800 mm Shading Balconies + Bio-Planters</text>
      </g>
    `
  },

  ROOF: {
    title: "10th Floor / Rooftop: Bio-Solar Sky Terrace & Urban Agriculture",
    dim: "40,000 mm × 30,000 mm",
    totalArea: "972 m² usable deck",
    height: "3,600 mm (Pergola Height)",
    legend: [
      { name: "Bifacial Solar BIPV Pergola (148 kWp)", color: "#1e1b4b" },
      { name: "Urban Farming Hydroponic Beds", color: "#10b981" },
      { name: "Sky Jogging Track & Yoga Deck", color: "#f59e0b" },
      { name: "Panoramic Observation Pavilion", color: "#0284c7" }
    ],
    schedule: [
      { space: "BIPV Bifacial Solar Pergola Array", dim: "32,000 × 24,000 mm", area: "620 m²", vent: "Natural Heat Dissipation Under Panels" },
      { space: "Community Urban Agriculture Beds", dim: "6,000 × 4,000 mm (4 plots)", area: "96 m²", vent: "Open Air Rooftop Microclimate" },
      { space: "Recycled Rubber Jogging Circuit", dim: "1,500 mm wide loop (160m)", area: "180 m²", vent: "Panoramic Skyline Breeze" },
      { space: "Sky Lounge & Stargazing Pavilion", dim: "8,000 × 6,000 mm", area: "48 m²", vent: "Timber Slatted Pergola Shading" }
    ],
    svg: `
      <rect x="120" y="90" width="760" height="520" fill="#f8fafc" stroke="#1e293b" stroke-width="4" rx="4"/>

      <!-- Solar Panels Grid -->
      <g fill="#1e1b4b" stroke="#38bdf8" stroke-width="1.5">
        <rect x="150" y="120" width="160" height="120"/>
        <rect x="330" y="120" width="160" height="120"/>
        <rect x="510" y="120" width="160" height="120"/>
        <rect x="690" y="120" width="160" height="120"/>

        <rect x="150" y="440" width="160" height="120"/>
        <rect x="330" y="440" width="160" height="120"/>
        <rect x="510" y="440" width="160" height="120"/>
        <rect x="690" y="440" width="160" height="120"/>
      </g>
      <text x="500" y="185" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">148 kWp BIFACIAL SOLAR BIPV ARRAY</text>

      <!-- Central Atrium Skylight -->
      <rect x="360" y="260" width="280" height="160" fill="#e0f2fe" stroke="#0284c7" stroke-width="3" rx="4"/>
      <text x="500" y="345" text-anchor="middle" font-size="12" font-weight="bold" fill="#0369a1">AERATED CENTRAL ATRIUM VENT</text>

      <!-- Urban Farm Plots -->
      <rect x="150" y="270" width="160" height="140" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="230" y="345" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">Urban Farm Plots</text>

      <rect x="690" y="270" width="160" height="140" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="770" y="345" text-anchor="middle" font-size="11" font-weight="bold" fill="#92400e">Sky Yoga Deck</text>
    `
  }
};

export const unitTypologies = {
  "2bhk": {
    name: "2BHK Deluxe Sustainable Residence",
    carpetArea: "92 m² (990 sq.ft)",
    balconyArea: "14 m² with integrated planter",
    occupancy: "3 - 4 Persons",
    orientation: "Dual aspect (South-West for daylight & Courtyard for stack breeze)",
    rooms: [
      { name: "Living / Dining", dim: "6,200 × 4,000 mm", area: "24.8 m²" },
      { name: "Master Bedroom + Ensuite", dim: "4,500 × 3,800 mm", area: "17.1 m²" },
      { name: "Secondary Bedroom", dim: "3,800 × 3,600 mm", area: "13.6 m²" },
      { name: "Modern Modular Kitchen", dim: "3,200 × 2,800 mm", area: "8.9 m²" },
      { name: "Shaded Cantilever Balcony", dim: "6,000 × 1,800 mm", area: "10.8 m²" }
    ]
  },
  "1bhk": {
    name: "1BHK Executive Studio Suite",
    carpetArea: "55 m² (592 sq.ft)",
    balconyArea: "8 m² with kinetic louvers",
    occupancy: "1 - 2 Persons",
    orientation: "North-East (soft morning daylight, zero thermal glare)",
    rooms: [
      { name: "Living & Work-from-Home Alcove", dim: "4,800 × 3,800 mm", area: "18.2 m²" },
      { name: "Master Bedroom", dim: "3,800 × 3,400 mm", area: "12.9 m²" },
      { name: "Open Kitchenette", dim: "2,600 × 2,400 mm", area: "6.2 m²" },
      { name: "Acoustic Balcony", dim: "4,000 × 1,800 mm", area: "7.2 m²" }
    ]
  },
  "3bhk": {
    name: "3BHK Corner Penthouse Residence",
    carpetArea: "145 m² (1,560 sq.ft)",
    balconyArea: "24 m² wrap-around sky garden",
    occupancy: "4 - 6 Persons",
    orientation: "Triple aspect corner orientation with 270° panoramic vistas",
    rooms: [
      { name: "Grand Living & Family Lounge", dim: "8,200 × 5,000 mm", area: "41.0 m²" },
      { name: "Master Bedroom Suite + Walk-in", dim: "5,200 × 4,200 mm", area: "21.8 m²" },
      { name: "Bedroom 2 + Ensuite", dim: "4,200 × 3,800 mm", area: "15.9 m²" },
      { name: "Bedroom 3 / Study", dim: "3,800 × 3,600 mm", area: "13.6 m²" },
      { name: "Gourmet Island Kitchen", dim: "4,000 × 3,200 mm", area: "12.8 m²" },
      { name: "Wrap-around Bio-Balcony", dim: "12,000 × 1,800 mm", area: "21.6 m²" }
    ]
  }
};

export function initFloorPlans() {
  const levelTabs = document.querySelectorAll('.btn-floor-tab');
  const planSvg = document.getElementById('floorPlanSvg');
  const planTitle = document.getElementById('currentPlanTitle');
  const legendBar = document.getElementById('planLegendBar');
  const tableBody = document.getElementById('scheduleTableBody');
  const unitBtns = document.querySelectorAll('.unit-btn');
  const unitSpecBox = document.getElementById('unitSpecBox');
  const unitTypesSection = document.getElementById('unitTypesSection');

  function renderPlan(levelKey) {
    const data = floorPlanData[levelKey];
    if (!data) return;

    if (planTitle) planTitle.textContent = data.title;
    if (planSvg) planSvg.innerHTML = data.svg;

    // Render Legend
    if (legendBar) {
      legendBar.innerHTML = data.legend.map(item => `
        <div class="legend-tag">
          <span class="legend-color" style="background: ${item.color};"></span>
          <span>${item.name}</span>
        </div>
      `).join('');
    }

    // Render Schedule Table
    if (tableBody) {
      tableBody.innerHTML = data.schedule.map(row => `
        <tr>
          <td><strong>${row.space}</strong></td>
          <td>${row.dim}</td>
          <td>${row.area}</td>
          <td>${row.vent}</td>
        </tr>
      `).join('');
    }

    // Show/hide unit typology section
    if (unitTypesSection) {
      unitTypesSection.style.display = (levelKey === 'TYP') ? 'flex' : 'none';
    }
  }

  function renderUnit(unitKey) {
    const u = unitTypologies[unitKey];
    if (!u || !unitSpecBox) return;

    unitSpecBox.innerHTML = `
      <div style="margin-bottom: 0.5rem;">
        <strong style="color: var(--text-main); font-size: 0.85rem;">${u.name}</strong>
        <div style="color: var(--text-muted); font-size: 0.74rem;">Carpet Area: <strong>${u.carpetArea}</strong> • Balcony: <strong>${u.balconyArea}</strong></div>
        <div style="color: var(--accent-green); font-size: 0.74rem; margin-top: 0.2rem;">${u.orientation}</div>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.72rem; margin-top: 0.35rem;">
        ${u.rooms.map(r => `
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 0.25rem 0;">${r.name}</td>
            <td style="padding: 0.25rem 0; font-family: var(--font-mono); color: var(--text-muted);">${r.dim}</td>
            <td style="padding: 0.25rem 0; font-weight: 700; text-align: right; font-family: var(--font-mono);">${r.area}</td>
          </tr>
        `).join('')}
      </table>
    `;
  }

  levelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      levelTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPlan(tab.dataset.floor);
    });
  });

  unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      unitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderUnit(btn.dataset.unit);
    });
  });

  // Initial load
  renderPlan('B1');
  renderUnit('2bhk');
}
