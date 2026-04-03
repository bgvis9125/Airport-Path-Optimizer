// Map setup
const map = L.map('map').setView([39.8283, -98.5795], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let selectedAirports = [];
let airportMarkers = [];
let mstLines = [];
let tspPath = null;
let tspMarkers = [];

const statusElement = document.getElementById('status');
const calculateMSTBtn = document.getElementById('calculate-mst');
const calculateTSPBtn = document.getElementById('calculate-tsp');
const clearBtn = document.getElementById('clear');

async function initialize() {
  try {
    const response = await fetch('http://localhost:5000/api/airports');
    if (!response.ok) throw new Error("Failed to fetch airports");
    
    const airports = await response.json();
    
    airports.forEach(airport => {
      const marker = L.circleMarker([airport.lat, airport.lon], {
        radius: 8,
        fillColor: "#3498db",
        color: "#2980b9",
        weight: 2,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup(`
        <b>${airport.id}</b><br>
        ${airport.name}<br>
        Lat: ${airport.lat.toFixed(4)}, Lon: ${airport.lon.toFixed(4)}
      `);
      
      marker.on('click', () => toggleSelection(airport, marker));
      
      airportMarkers.push({
        id: airport.id,
        marker,
        data: airport
      });
    });
  } catch (error) {
    console.error("Initialization error:", error);
    statusElement.textContent = "Error loading airports";
  }
}

function toggleSelection(airport, marker) {
  const index = selectedAirports.findIndex(a => a.id === airport.id);
  
  if (index === -1) {
    selectedAirports.push(airport);
    marker.setStyle({ fillColor: '#f39c12', color: '#e67e22' });
  } else {
    selectedAirports.splice(index, 1);
    marker.setStyle({ fillColor: '#3498db', color: '#2980b9' });
  }
  
  updateStatus();
}

async function calculateMST() {
  if (selectedAirports.length < 2) {
    alert("Please select at least 2 airports");
    return;
  }

  clearVisualizations();
  calculateMSTBtn.disabled = true;
  calculateMSTBtn.textContent = "Calculating...";
  
  try {
    const response = await fetch('http://localhost:5000/api/mst', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ airportIds: selectedAirports.map(a => a.id) })
    });
    
    if (!response.ok) throw new Error("MST request failed");
    
    const { mst } = await response.json();
    
    mst.forEach(edge => {
      const from = selectedAirports.find(a => a.id === edge.from);
      const to = selectedAirports.find(a => a.id === edge.to);
      
      const line = L.polyline(
        [[from.lat, from.lon], [to.lat, to.lon]],
        { color: '#2ecc71', weight: 3 }
      ).addTo(map);
      
      mstLines.push(line);
    });
    
    statusElement.textContent = `MST showing ${mst.length} connections`;
  } catch (error) {
    console.error("MST Error:", error);
    statusElement.textContent = "Error calculating MST";
  } finally {
    calculateMSTBtn.disabled = false;
    calculateMSTBtn.textContent = "Show MST";
  }
}

async function calculateTSP() {
  if (selectedAirports.length < 2) {
    alert("Please select at least 2 airports");
    return;
  }

  clearVisualizations();
  calculateTSPBtn.disabled = true;
  calculateTSPBtn.textContent = "Calculating...";
  
  try {
    const response = await fetch('http://localhost:5000/api/tsp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ airportIds: selectedAirports.map(a => a.id) })
    });
    
    if (!response.ok) throw new Error("TSP request failed");
    
    const { path, totalDistance } = await response.json();
    
    // Draw TSP path
    const latLngs = path.map(airport => [airport.lat, airport.lon]);
    tspPath = L.polyline(latLngs, {
      color: '#e74c3c',
      weight: 4,
      opacity: 0.8
    }).addTo(map);

    // Add arrowheads if plugin is available
    if (L.Polyline.Arrowheads) {
      tspPath.arrowheads({
        frequency: '50px',
        size: '10px'
      });
    }

    // Add numbered markers
    path.forEach((airport, index) => {
      if (index < path.length - 1) {
        const marker = L.marker([airport.lat, airport.lon], {
          icon: L.divIcon({
            html: `<div class="tsp-marker">${index + 1}</div>`,
            className: 'tsp-label'
          })
        }).addTo(map);
        tspMarkers.push(marker);
      }
    });

    statusElement.textContent = 
      `Shortest Path: ${totalDistance.toFixed(2)} km (${path.length - 1} legs)`;
  } catch (error) {
    console.error("TSP Error:", error);
    statusElement.textContent = "Error calculating path";
  } finally {
    calculateTSPBtn.disabled = false;
    calculateTSPBtn.textContent = "Show Shortest Path";
  }
}

function clearVisualizations() {
  mstLines.forEach(line => map.removeLayer(line));
  mstLines = [];
  
  if (tspPath) map.removeLayer(tspPath);
  tspPath = null;
  
  tspMarkers.forEach(marker => map.removeLayer(marker));
  tspMarkers = [];
}

function clearAll() {
  selectedAirports = [];
  airportMarkers.forEach(({ marker }) => {
    marker.setStyle({ fillColor: '#3498db', color: '#2980b9' });
  });
  clearVisualizations();
  updateStatus();
}

function updateStatus() {
  statusElement.textContent = 
    selectedAirports.length === 0 ? "Select airports to begin" :
    `Selected ${selectedAirports.length} airports`;
}

// Initialize
initialize();

// Event listeners
calculateMSTBtn.addEventListener('click', calculateMST);
calculateTSPBtn.addEventListener('click', calculateTSP);
clearBtn.addEventListener('click', clearAll);