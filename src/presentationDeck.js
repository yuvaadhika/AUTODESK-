import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';

/**
 * 7-Slide Jury Presentation Deck Controller & Exporter
 * Aligned with Autodesk PS 26116 Submission Guidelines
 */

export class PresentationDeck {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 7;
    this.slides = document.querySelectorAll('.slide-card');
    this.thumbnails = document.querySelectorAll('.thumb-btn');
    this.counterBadge = document.getElementById('slideCounter');

    this.initControls();
  }

  initControls() {
    const prevBtn = document.getElementById('btnPrevSlide');
    const nextBtn = document.getElementById('btnNextSlide');
    const exportPptxBtn = document.getElementById('btnExportPptx');
    const exportPdfBtn = document.getElementById('btnExportPdf');
    const modalPptxBtn = document.getElementById('btnModalPptx');
    const modalPdfBtn = document.getElementById('btnModalPdf');

    if (prevBtn) prevBtn.addEventListener('click', () => this.goToSlide(this.currentSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToSlide(this.currentSlide + 1));

    this.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const slideNum = parseInt(thumb.dataset.slide, 10);
        this.goToSlide(slideNum);
      });
    });

    // Keyboard Arrow Navigation
    window.addEventListener('keydown', (e) => {
      const presView = document.getElementById('view-presentation');
      if (presView && presView.classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          this.goToSlide(this.currentSlide + 1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.goToSlide(this.currentSlide - 1);
        }
      }
    });

    if (exportPptxBtn) exportPptxBtn.addEventListener('click', () => this.exportToPptx());
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', () => this.exportToPdf());
    if (modalPptxBtn) modalPptxBtn.addEventListener('click', () => this.exportToPptx());
    if (modalPdfBtn) modalPdfBtn.addEventListener('click', () => this.exportToPdf());
  }

  goToSlide(slideNum) {
    if (slideNum < 1) slideNum = 1;
    if (slideNum > this.totalSlides) slideNum = this.totalSlides;

    this.currentSlide = slideNum;

    this.slides.forEach(s => {
      const sNum = parseInt(s.dataset.slide, 10);
      s.classList.toggle('active', sNum === this.currentSlide);
    });

    this.thumbnails.forEach(t => {
      const tNum = parseInt(t.dataset.slide, 10);
      t.classList.toggle('active', tNum === this.currentSlide);
    });

    if (this.counterBadge) {
      this.counterBadge.textContent = `Slide ${this.currentSlide} of ${this.totalSlides}`;
    }
  }

  async exportToPptx() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Aura Verticalis Architectural BIM Team';
    pptx.title = 'AURA VERTICALIS — B+G+9 Mixed-Use Sustainable Development';

    // Slide 1: Title & Executive Summary
    const s1 = pptx.addSlide();
    s1.background = { color: 'F8FAFC' };
    s1.addText('AURA VERTICALIS', { x: 0.8, y: 0.8, fontSize: 32, bold: true, color: '1E3A8A' });
    s1.addText('Centrally Located Biophilic B+G+9 Mixed-Use BIM Development', { x: 0.8, y: 1.5, fontSize: 16, color: '2D6A4F', italic: true });
    s1.addText(
      '• Program: Level B1 (24 EV Parking Bays) + Ground (Active Retail & Lobby) + 1F (Commercial & Community) + 2F-9F (48 Residential Sanctuary Units) + Roof Terrace\n' +
      '• Plot Envelope: 48,000 mm × 36,000 mm (1,728 m² GFA) | Total Built-Up Area: 12,850 m²\n' +
      '• Central Biophilic Courtyard (16m × 14m, 224 m²) providing natural stack cooling from Ground to Roof\n' +
      '• Proposed Structural System: RCC Frame (8m Grid) with M40 Columns, M35 Beams, and Fe500D TMT rebar\n' +
      '• Conceptual Environmental Targets: 82.4% Spatial Daylight Autonomy (sDA) and -51% Energy Use Intensity (EUI)',
      { x: 0.8, y: 2.2, w: 8.4, h: 4.0, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 2: Urban Masterplan & EV Infrastructure
    const s2 = pptx.addSlide();
    s2.background = { color: 'F8FAFC' };
    s2.addText('02 | URBAN MASTERPLAN & EV MOBILITY', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s2.addText(
      '• Pedestrian Promenade: Porous ground-level arcade connecting municipal sidewalks directly to the central landscaped courtyard\n' +
      '• Vehicular Segregation: Dedicated one-way ramp descending into Level B1 (1:10 slope) to eliminate pedestrian conflict\n' +
      '• 24 Fast EV Charging Bays: 12 North + 12 South stalls equipped with load-balancing charging posts\n' +
      '• Vertical Cores: Card-key secured residential elevators completely separated from commercial guest elevators\n' +
      '• Site Permeability: Sheltered walkways, bicycle parking, and universal barrier-free accessibility',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 3: Parametric Climate-Responsive Facade
    const s3 = pptx.addSlide();
    s3.background = { color: 'F8FAFC' };
    s3.addText('03 | CLIMATE-RESPONSIVE MODULAR FAÇADE SYSTEM', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s3.addText(
      '1. External Shading Louvers: Aluminum louvers tuned to solar angles blocking 85% peak infrared radiation\n' +
      '2. Recessed Windows: Deep reveal frames minimizing direct solar heat gain into living rooms\n' +
      '3. Green Balconies: Cantilevered 1,800mm balconies with drip-irrigated planters providing 4.2°C evaporative microclimate cooling\n' +
      '4. Operable Ventilation Openings: Dual-aspect acoustic glazing for high-velocity natural cross-ventilation',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 4: Breathable Central Courtyard
    const s4 = pptx.addSlide();
    s4.background = { color: 'F8FAFC' };
    s4.addText('04 | BREATHABLE CENTRAL COURTYARD & THERMAL STACK', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s4.addText(
      '• Open-to-Sky Atrium: 16,000 × 14,000 mm (224 m²) central garden courtyard extending continuously from Ground to Roof\n' +
      '• Passive Convective Stack Effect: Cool ground air pulled across reflection pond, venting warm stale air through the roof\n' +
      '• Target 4.5 Air Changes / Hour: Zero-energy natural cross-ventilation serving all 48 residential apartments\n' +
      '• Daylit Corridors: 100% natural daylighting along residential ring corridors throughout daytime hours\n' +
      '• Biophilic Community Connection: Visual greenery, water cascades, and fresh air for resident wellness',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 5: Functional Planning & Space Efficiency
    const s5 = pptx.addSlide();
    s5.background = { color: 'F8FAFC' };
    s5.addText('05 | PROGRAMMATIC PLANNING & ROOM SCHEDULES', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s5.addText(
      '• Level B1 (1,728 m² GFA): 24 EV charging stalls (12 top + 12 bottom), 45kL rainwater cistern, electrical substation, dual pressurized stairwells\n' +
      '• Ground Floor (1,500 m² GFA): Retail boutiques (320 m²), artisan café (180 m²), grand residential lobby (160 m²), 224 m² central courtyard\n' +
      '• 1st Floor (1,450 m² GFA): Commercial & community floor with co-working hub (380 m²), wellness gym (280 m²), crèche (240 m²), skybridge (60 m²)\n' +
      '• 2nd - 9th Floor (7,200 m² GFA): 48 luxury sustainable apartments (6 units/floor: 3x 2BHK 92m², 2x 1BHK 55m², 1x 3BHK 145m²)\n' +
      '• Roof Terrace (972 m² GFA): 148 kWp BIPV solar canopy, community urban farm plots, yoga deck, jogging circuit',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 6: Proposed Structural System & Detailing
    const s6 = pptx.addSlide();
    s6.background = { color: 'F8FAFC' };
    s6.addText('06 | PROPOSED STRUCTURAL SYSTEM & REINFORCEMENT (IS 456 & IS 13920)', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s6.addText(
      '• Structural Bay: 8,000 × 8,000 mm column grid with two-way flat slab (175 mm depth) + drop panels (2500×2500×75 mm)\n' +
      '• Proposed Columns (C1): 600 × 600 mm M40 concrete reinforced with 12-T25 rebar and 8mm ductile confinement ties per IS 13920:2016\n' +
      '• Proposed Beams (B1): 300 × 600 mm M35 concrete with continuous Top 3-T20 & Bottom 4-T25 steel designed for ductile seismic shear\n' +
      '• Fire Stairwells (S-04): 150mm waist slab with T12 @ 120 c/c tensile rebar, 2-hour fire endurance rating\n' +
      '• Detailed Floor Junction (S-05): 600×600mm vitrified tiles over acoustic sound underlay (ΔLw = 21 dB) and elastomeric waterproofing',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 7: Conceptual Environmental Analysis
    const s7 = pptx.addSlide();
    s7.background = { color: 'F8FAFC' };
    s7.addText('07 | TARGET ENVIRONMENTAL PERFORMANCE & FORMA WORKFLOW', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s7.addText(
      '• 5 Key Environmental Studies: (1) Sun path orientation; (2) Solar radiation shading; (3) Courtyard stack ventilation; (4) Daylight autonomy; (5) Massing comparison\n' +
      '• Target Spatial Daylight Autonomy (sDA > 300 lx): 82.4% (> 75% LEED Platinum benchmark)\n' +
      '• Target Energy Use Intensity (EUI): 62.8 kWh/m²/yr (51% reduction vs baseline standard)\n' +
      '• Renewable Solar Offset: 148 kWp bifacial rooftop solar BIPV yielding ~185,000 kWh/yr clean electricity\n' +
      '• Embodied Carbon Reduction: 310 kgCO₂e/m² (-38% reduction via 40% GGBS slag concrete substitution)\n' +
      '• Project Submission Hierarchy: 1. Revit Model (.rvt) | 2. Structural Drawings (.dwg) | 3. Renders | 4. 30s Walkthrough | 5. PPT Deck | 6. Web Prototype',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 12.5, color: '334155', lineSpacing: 22 }
    );

    await pptx.writeFile({ fileName: 'Aura_Verticalis_BIM_Mixed_Use_Presentation.pptx' });
  }

  async exportToPdf() {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(30, 58, 138);
    pdf.text('AURA VERTICALIS — ARCHITECTURAL & BIM DOSSIER', 15, 20);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text('Centrally Located Sustainable B+G+9 Mixed-Use Development | Metric Units (mm)', 15, 27);
    pdf.line(15, 30, 195, 30);

    let y = 38;
    const sections = [
      {
        title: '1. EXECUTIVE SUMMARY & ZONING PROGRAM (B+G+9)',
        text: 'Aura Verticalis is a centrally located B+G+9 mixed-use sustainable development. It synthesizes active commercial vitality on the lower levels (Ground + 1F) with 48 luxury residential sanctuary apartments above (2F-9F, 6 units/floor), founded on a basement parking & EV charging hub (24 fast-charging bays). Built on an 8,000 × 8,000 mm modular grid with a gross built-up area of 12,850 m² on a 48,000 × 36,000 mm site envelope (1,728 m²).'
      },
      {
        title: '2. 5 CORE ARCHITECTURAL & BIM INNOVATIONS',
        text: '(1) Climate-Responsive Modular Façade with external louvers, recessed glazing, green balconies & operable openings; (2) Open-to-sky Convective Thermal Chimney spanning Ground to Roof (target 4.5 ACH passive airflow); (3) Digital BIM Model & Circular Material Passports with 40% GGBS slag concrete; (4) Biophilic Acoustic & Circadian Neuro-Architecture (-37 dB botanical buffer); (5) Parametric Unit Configuration & Modular Space Planning Engine.'
      },
      {
        title: '3. BREATHABLE CENTRAL COURTYARD (GROUND TO ROOF)',
        text: 'Centered around a 16,000 × 14,000 mm (224 m²) open-to-sky landscape atrium, the building utilizes natural convective stack pressure to draw cool ground air through shaded walkways and across a reflection pond, naturally ventilating all 48 residential apartments.'
      },
      {
        title: '4. PROPOSED STRUCTURAL SYSTEM (IS 456 & IS 13920)',
        text: 'Proposed RCC structural framing conforming to IS 456:2000 and IS 13920:2016 ductile detailing principles. Proposed Columns C1 (600×600 mm M40) with 12-T25 longitudinal rebar and 8mm ties. Proposed Beams B1 (300×600 mm M35) with Top 3-T20 & Bottom 4-T25 rebar. Two-way flat slabs (175 mm) with drop panels (2500×2500×75 mm). 600×600mm vitrified tile flooring over acoustic underlay.'
      },
      {
        title: '5. TARGET ENVIRONMENTAL PERFORMANCE (FORMA & INSIGHT)',
        text: 'Conceptual environmental studies demonstrate target performance of 82.4% Spatial Daylight Autonomy (sDA), 62.8 kWh/m²/yr Energy Use Intensity (-51% vs baseline), 185 MWh/yr rooftop solar BIPV generation, and 310 kgCO₂e/m² embodied carbon.'
      },
      {
        title: '6. PROJECT SUBMISSION HIERARCHY',
        text: '1. Autodesk Revit Model (.rvt) | 2. Structural Drawings & Detailing (.dwg / PDF) | 3. Photorealistic Renders & Visualization | 4. 30-Sec Walkthrough Video | 5. Presentation Pitch Deck (.pptx / PDF) | 6. Interactive Conceptual BIM Web Prototype.'
      }
    ];

    sections.forEach(sec => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(30, 58, 138);
      pdf.text(sec.title, 15, y);
      y += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(51, 65, 85);
      const splitText = pdf.splitTextToSize(sec.text, 180);
      pdf.text(splitText, 15, y);
      y += splitText.length * 4.2 + 5;
    });

    pdf.line(15, 275, 195, 275);
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text('Aura Verticalis BIM Portfolio • Autodesk Revit & Forma Workflow • Metric Dimensions in mm', 15, 282);

    pdf.save('Aura_Verticalis_BIM_Project_Dossier.pdf');
  }
}
