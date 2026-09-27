import pptxgen from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 7-Slide Jury Presentation Deck Controller & Exporter
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
      // Check if presentation view is active
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
    pptx.author = 'Aura Verticalis Architectural Team';
    pptx.title = 'AURA VERTICALIS — B+G+9 Mixed-Use Sustainable Development';

    // Slide 1: Title & Executive Summary
    const s1 = pptx.addSlide();
    s1.background = { color: 'F8FAFC' };
    s1.addText('AURA VERTICALIS', { x: 0.8, y: 0.8, fontSize: 32, bold: true, color: '1E3A8A' });
    s1.addText('Centrally Located Biophilic B+G+9 Mixed-Use BIM Development', { x: 0.8, y: 1.5, fontSize: 16, color: '2D6A4F', italic: true });
    s1.addText(
      '• Program: 1 Level Basement (EV Parking) + Ground (Retail) + 1F (Commercial) + 2F-9F (Residential Sanctuary)\n' +
      '• Plot Dimensions: 48,000 mm × 36,000 mm (1,728 m²) | Total Built-Up Area: 12,850 m²\n' +
      '• Central Biophilic Courtyard (224 m²) providing passive stack-effect microclimate cooling\n' +
      '• Structural System: RCC Frame (8,000 × 8,000 mm Bay) with M40 Columns and Fe500D TMT rebar\n' +
      '• Autodesk Forma Optimization: 82.4% Spatial Daylight Autonomy (sDA) and -51% Energy Use Intensity (EUI)',
      { x: 0.8, y: 2.2, w: 8.4, h: 4.0, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 2: Urban Masterplan & EV Infrastructure
    const s2 = pptx.addSlide();
    s2.background = { color: 'F8FAFC' };
    s2.addText('02 | URBAN MASTERPLAN & EV MOBILITY', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s2.addText(
      '• Pedestrian Promenade: Porous perimeter arcade connecting municipal streets into the central landscaped courtyard\n' +
      '• Vehicular Segregation: Dedicated one-way ramp descending into Level B1 (Grade 1:10 slope)\n' +
      '• 48 Fast EV Charging Bays: 100% smart charging stalls with solar dynamic load balancing\n' +
      '• Vertical Cores: Card-key secured residential elevators completely segregated from commercial visitors\n' +
      '• Site Efficiency: 86.4% usable floor area ratio with maximum natural permeability',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 3: Parametric Kinetic Facade
    const s3 = pptx.addSlide();
    s3.background = { color: 'F8FAFC' };
    s3.addText('03 | CLIMATE-RESPONSIVE FACADE SYSTEM', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s3.addText(
      '• Automated Solar Aerofoil Louvers: 42° inclination angles blocking 85% peak infrared radiation\n' +
      '• High-Performance Double Glazing: Low-E (6-12-6 Argon Infilled, SHGC 0.28, U-value 1.4 W/m²K)\n' +
      '• Integrated Balcony Bio-Planters: Drip-irrigated native climbers providing 4.2°C evaporative microclimate cooling\n' +
      '• Acoustic Buffering: Triple-laminated balcony barriers delivering 42 dB ambient noise attenuation',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 4: Breathable Central Courtyard
    const s4 = pptx.addSlide();
    s4.background = { color: 'F8FAFC' };
    s4.addText('04 | BREATHABLE CENTRAL COURTYARD & ATRIUM', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s4.addText(
      '• Natural Convective Thermal Chimney: 16,000 × 14,000 mm open-to-sky atrium spanning all 10 stories\n' +
      '• Passive Stack Ventilation: 4.5 air changes per hour (ACH) achieved without mechanical fans\n' +
      '• Microclimate Water Feature: 40 m² reflection pond humidifying incoming summer breezes\n' +
      '• 100% Daylit Ring Corridors: Zero artificial lighting needed between 08:00 and 17:30',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 5: Functional Planning & Space Efficiency
    const s5 = pptx.addSlide();
    s5.background = { color: 'F8FAFC' };
    s5.addText('05 | FUNCTIONAL PLANNING & PROGRAMMATIC EFFICIENCY', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s5.addText(
      '• Level B1 (1,728 m²): 48 EV bays, 45kL rainwater cistern, electrical substation, dual pressurized stairwells\n' +
      '• Ground Floor (1,500 m²): Double-height retail arcade (4,500 mm), artisan cafe, grand residential lobby\n' +
      '• 1st Floor (1,450 m²): Commercial wellness gym, flexible co-working hub, community crèche, skybridge\n' +
      '• 2nd - 9th Floor (7,200 m²): 64 luxury sustainable apartments (1BHK 55m², 2BHK 92m², 3BHK 145m²)\n' +
      '• 10th Floor / Roof (972 m²): 148 kWp BIPV solar farm, urban hydroponic agriculture, jogging circuit',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 6: Structural Modeling & Detailing
    const s6 = pptx.addSlide();
    s6.background = { color: 'F8FAFC' };
    s6.addText('06 | STRUCTURAL BIM & 2D REINFORCEMENT DETAILING', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s6.addText(
      '• RCC Structural Grid: 8,000 × 8,000 mm modular column grid with post-tensioned flat slab (175 mm depth)\n' +
      '• Columns (C1): 600 × 600 mm M40 concrete with 12-T25 high ductility bars and 8mm seismic ties @ 100/150 c/c\n' +
      '• Main Frame Beams (B1): 300 × 600 mm M35 concrete with Top 3-T20 & Bot 4-T25 rebar + 2L-8mm stirrups\n' +
      '• Doglegged Fire Stairs: 150mm waist slab, T12 @ 120 c/c main steel, 2-hour fire endurance\n' +
      '• Finishes: 600×600mm vitrified tile flooring with acoustic insulation (ΔLw = 21 dB) and elastomeric waterproofing',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
    );

    // Slide 7: Autodesk Forma Climate Simulation
    const s7 = pptx.addSlide();
    s7.background = { color: 'F8FAFC' };
    s7.addText('07 | AUTODESK FORMA ENVIRONMENTAL ANALYSIS & EUI', { x: 0.8, y: 0.8, fontSize: 24, bold: true, color: '1E3A8A' });
    s7.addText(
      '• Spatial Daylight Autonomy (sDA > 300 lx): 82.4% (LEED Platinum threshold: 75%)\n' +
      '• Designed Energy Use Intensity (EUI): 62.8 kWh/m²/yr (51% reduction over ASHRAE 90.1 baseline)\n' +
      '• Solar BIPV Clean Power Yield: 185,000 kWh/yr clean electricity offset\n' +
      '• Embodied Carbon Reduction: 310 kgCO₂e/m² (-38% reduction via GGBS/fly-ash concrete mix)\n' +
      '• Forma Sustainability Score: 94.8 / 100 — Net-Zero Carbon Ready Architecture',
      { x: 0.8, y: 1.8, w: 8.4, h: 4.5, fontSize: 13, color: '334155', lineSpacing: 24 }
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

    let y = 40;
    const sections = [
      {
        title: '1. EXECUTIVE SUMMARY & ZONING PROGRAM',
        text: 'Aura Verticalis is a centrally located B+G+9 mixed-use sustainable development. It seamlessly synthesizes active commercial vitality on the lower levels (Ground + 1F) with luxury residential sanctuaries above (2F-9F), founded on an automated basement parking & EV supercharging hub (B1). Built on an 8,000 × 8,000 mm modular grid with a gross built-up area of 12,850 m² on a 48,000 × 36,000 mm site.'
      },
      {
        title: '2. PASSIVE BIOPHILIC COURTYARD & THERMAL CHIMNEY',
        text: 'Centered around a 16,000 × 14,000 mm (224 m²) open-to-sky landscape atrium, the building utilizes natural convective stack pressure to pull cool ground-level air upwards through shaded retail walkways, cooling all 64 residential apartments passively (4.5 ACH passive air changes).'
      },
      {
        title: '3. CLIMATE-RESPONSIVE FACADE ARCHITECTURE',
        text: 'Equipped with parametric aerofoil solar louvers tuned to 42° solar cutoff angles, high-performance Low-E double glazing (SHGC 0.28, U-value 1.4 W/m²K), and continuous cantilevered balconies with integrated drip-fed bio-planters for microclimate evapotranspiration cooling.'
      },
      {
        title: '4. STRUCTURAL MODELING & REINFORCEMENT SPECIFICATIONS',
        text: 'RCC structural frame adhering to IS 456 & IS 13920 seismic ductile detailing. Columns C1 (600×600 mm M40) with 12-T25 longitudinal rebar and 8mm ties. Beams B1 (300×600 mm M35) with Top 3-T20 and Bottom 4-T25 rebar. Two-way post-tensioned flat slabs (175 mm) with drop panels (2500×2500×75 mm). 600×600mm vitrified tile flooring over acoustic underlay.'
      },
      {
        title: '5. AUTODESK FORMA CLIMATE & CARBON METRICS',
        text: 'Forma cloud simulations demonstrate 82.4% Spatial Daylight Autonomy (sDA), 62.8 kWh/m²/yr Energy Use Intensity (-51% vs baseline), 185 MWh/yr rooftop solar BIPV generation, and 310 kgCO₂e/m² embodied carbon.'
      }
    ];

    sections.forEach(sec => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(30, 58, 138);
      pdf.text(sec.title, 15, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(51, 65, 85);
      const splitText = pdf.splitTextToSize(sec.text, 180);
      pdf.text(splitText, 15, y);
      y += splitText.length * 5 + 6;
    });

    pdf.line(15, 275, 195, 275);
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text('Aura Verticalis BIM Portfolio • Autodesk Revit & Forma Compliant • Metric Dimensions in mm', 15, 282);

    pdf.save('Aura_Verticalis_BIM_Project_Dossier.pdf');
  }
}
