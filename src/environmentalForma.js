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
    formaCharts.push(c3);
  }

  // 4. Carbon Footprint Breakdown Chart
  const ctxCarbon = document.getElementById('carbonChart');
  if (ctxCarbon) {
    const c4 = new Chart(ctxCarbon, {
      type: 'doughnut',
      data: {
        labels: ['Low-Carbon Concrete (GGBS)', 'Recycled Fe500D Steel', 'High-Perf Glazing Envelope', 'Timber & Biophilic Planters', 'MEP & Solar Systems'],
        datasets: [
          {
            data: [38, 26, 16, 8, 12],
            backgroundColor: ['#10b981', '#0284c7', '#38bdf8', '#f59e0b', '#6366f1'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 10 } } },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}% (${Math.round(context.raw * 3.1)} kgCO₂e/m²)`
            }
          }
        },
        cutout: '65%'
      }
    });
    formaCharts.push(c4);
  }
}

export function resizeFormaCharts() {
  formaCharts.forEach(c => {
    try {
      c.resize();
      c.update();
    } catch (e) {}
  });
}
