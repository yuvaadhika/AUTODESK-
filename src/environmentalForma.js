import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

/**
 * Autodesk Forma & Insight Conceptual Environmental Analysis Engine
 * Target Performance Benchmarks & Microclimate Studies
 */

let formaCharts = [];

export function initEnvironmentalForma() {
  // Clear any existing charts to avoid duplicates
  formaCharts.forEach(c => {
    try { c.destroy(); } catch (e) {}
  });
  formaCharts = [];

  const greenAccent = '#10b981';
  const orangeAccent = '#f59e0b';

  // 1. Daylight Autonomy & Sun Path Chart
  const ctxDaylight = document.getElementById('daylightChart');
  if (ctxDaylight) {
    const c1 = new Chart(ctxDaylight, {
      type: 'line',
      data: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
        datasets: [
          {
            label: 'Target Daylight Autonomy sDA (%)',
            data: [25, 78, 92, 98, 94, 82, 38],
            borderColor: greenAccent,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: greenAccent
          },
          {
            label: 'Incident Solar Radiation (W/m²)',
            data: [80, 320, 680, 840, 720, 390, 90],
            borderColor: orangeAccent,
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
            bodyFont: { family: 'JetBrains Mono', size: 11 }
          }
        },
        scales: {
          x: { grid: { color: '#e2e8f0' }, ticks: { font: { family: 'JetBrains Mono', size: 10 } } },
          y: {
            min: 0,
            max: 100,
            title: { display: true, text: 'Target sDA (%)', font: { size: 10 } },
            ticks: { font: { family: 'JetBrains Mono', size: 10 } },
            grid: { color: '#e2e8f0' }
          },
          y1: {
            position: 'right',
            min: 0,
            max: 1000,
            title: { display: true, text: 'Radiation (W/m²)', font: { size: 10 } },
            grid: { drawOnChartArea: false },
            ticks: { font: { family: 'JetBrains Mono', size: 10 } }
          }
        }
      }
    });
    formaCharts.push(c1);
  }

  // 2. Wind Flow & Courtyard Stack CFD Chart
  const ctxWind = document.getElementById('windChart');
  if (ctxWind) {
    const c2 = new Chart(ctxWind, {
      type: 'bar',
      data: {
        labels: ['Ground Plaza', 'Courtyard Base', '1F Skybridge', '4F Residential', '7F Residential', 'Roof Terrace Vent'],
        datasets: [
          {
            label: 'Stack Updraft Velocity (m/s)',
            data: [1.2, 1.8, 2.1, 2.4, 2.7, 3.2],
            backgroundColor: 'rgba(2, 132, 199, 0.8)',
            borderRadius: 6
          },
          {
            label: 'Pedestrian Comfort Limit (m/s max)',
            data: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0],
            type: 'line',
            borderColor: '#ef4444',
            borderDash: [6, 4],
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } } },
          y: {
            min: 0,
            max: 5,
            title: { display: true, text: 'Wind Velocity (m/s)', font: { size: 10 } },
            ticks: { font: { family: 'JetBrains Mono', size: 10 } },
            grid: { color: '#e2e8f0' }
          }
        }
      }
    });
    formaCharts.push(c2);
  }

  // 3. EUI Energy Comparison Chart
  const ctxEui = document.getElementById('euiChart');
  if (ctxEui) {
    const c3 = new Chart(ctxEui, {
      type: 'bar',
      data: {
        labels: ['HVAC Cooling', 'Interior Lighting', 'Pumps & MEP', 'Plug Loads', 'Solar PV Offset'],
        datasets: [
          {
            label: 'Baseline Standard (128 kWh/m²/yr)',
            data: [65, 24, 18, 21, 0],
            backgroundColor: '#94a3b8',
            borderRadius: 4
          },
          {
            label: 'Target Proposed (62.8 kWh/m²/yr, -51%)',
            data: [28, 11, 10, 13.8, -25],
            backgroundColor: greenAccent,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 10 } } },
          y: {
            title: { display: true, text: 'Energy Use (kWh/m²/yr)', font: { size: 10 } },
            ticks: { font: { family: 'JetBrains Mono', size: 10 } },
            grid: { color: '#e2e8f0' }
          }
        }
      }
    });
    formaCharts.push(c4);
  }

  // 5. Initialize Interactive ESG ROI & Carbon Calculator
  initEsgRoiCalculator();
}

/**
 * Interactive ESG Carbon & Financial ROI Feasibility Calculator Engine
 */
export function initEsgRoiCalculator() {
  const ggbsSlider = document.getElementById('calcGgbsSlider');
  const solarSlider = document.getElementById('calcSolarSlider');
  const waterSlider = document.getElementById('calcWaterSlider');
  const hvacSlider = document.getElementById('calcHvacSlider');

  function calculateESG() {
    const ggbs = parseFloat(ggbsSlider ? ggbsSlider.value : 40);
    const solar = parseFloat(solarSlider ? solarSlider.value : 148);
    const water = parseFloat(waterSlider ? waterSlider.value : 85);
    const hvac = parseFloat(hvacSlider ? hvacSlider.value : 38);

    // Update Slider Value Badges
    const ggbsVal = document.getElementById('calcGgbsVal');
    const solarVal = document.getElementById('calcSolarVal');
    const waterVal = document.getElementById('calcWaterVal');
    const hvacVal = document.getElementById('calcHvacVal');

    if (ggbsVal) ggbsVal.textContent = `${ggbs}% GGBS Blend`;
    if (solarVal) solarVal.textContent = `${solar} kWp Solar Array`;
    if (waterVal) waterVal.textContent = `${water}% Recycling Rate`;
    if (hvacVal) hvacVal.textContent = `${hvac}% Cooling Offset`;

    // Calculations
    const baseConcreteVolume = 4850; // m³
    const baselineEmbodiedCarbon = baseConcreteVolume * 380; // kgCO2e
    const actualEmbodiedCarbon = baseConcreteVolume * (380 * (1 - (ggbs / 100) * 0.85));
    const embodiedCarbonSavedTonnes = ((baselineEmbodiedCarbon - actualEmbodiedCarbon) / 1000).toFixed(1);

    const solarAnnualMwh = Math.round(solar * 1.25);
    const solarAnnualSavingsLakhs = ( (solarAnnualMwh * 1000 * 8.5) / 100000 ).toFixed(2); // ₹8.5/kWh tariff

    const waterAnnualML = ( (12850 * 0.045 * 365 * (water / 100)) / 1000 ).toFixed(1);
    const waterSavingsLakhs = ( (parseFloat(waterAnnualML) * 1000000 * 0.08) / 100000 ).toFixed(2); // ₹80/kL

    const hvacSavingsLakhs = ( (12850 * 65 * (hvac / 100) * 8.5) / 100000 ).toFixed(2);

    const totalAnnualSavingsLakhs = (
      parseFloat(solarAnnualSavingsLakhs) +
      parseFloat(waterSavingsLakhs) +
      parseFloat(hvacSavingsLakhs)
    ).toFixed(2);

    const capExPremiumLakhs = ( (solar * 0.45) + 12 + 18 ).toFixed(2); // solar + STP + louvers premium
    const paybackYears = (parseFloat(capExPremiumLakhs) / (parseFloat(totalAnnualSavingsLakhs) || 1)).toFixed(1);

    // Update UI Output Cards
    const outCarbon = document.getElementById('resCarbonSaved');
    const outSolar = document.getElementById('resSolarGen');
    const outWater = document.getElementById('resWaterSaved');
    const outSavings = document.getElementById('resAnnualSavings');
    const outPayback = document.getElementById('resRoiPayback');
    const outRating = document.getElementById('resGreenRating');

    if (outCarbon) outCarbon.textContent = `${embodiedCarbonSavedTonnes} tCO₂e Saved`;
    if (outSolar) outSolar.textContent = `${solarAnnualMwh} MWh/year`;
    if (outWater) outWater.textContent = `${waterAnnualML} Million Liters/yr`;
    if (outSavings) outSavings.textContent = `₹ ${totalAnnualSavingsLakhs} Lakhs/yr`;
    if (outPayback) outPayback.textContent = `${paybackYears} Years`;

    if (outRating) {
      if (ggbs >= 35 && solar >= 120 && water >= 75 && hvac >= 30) {
        outRating.innerHTML = '<span class="badge-gold">GRIHA 5-Star & LEED Platinum</span>';
      } else if (ggbs >= 25 && solar >= 80) {
        outRating.innerHTML = '<span class="badge-gold">GRIHA 4-Star & LEED Gold</span>';
      } else {
        outRating.innerHTML = '<span class="badge-gold">IGBC Silver Standard</span>';
      }
    }
  }

  [ggbsSlider, solarSlider, waterSlider, hvacSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', calculateESG);
  });

  calculateESG();
}

export function resizeFormaCharts() {
  formaCharts.forEach(c => {
    try {
      c.resize();
      c.update();
    } catch (e) {}
  });
}

