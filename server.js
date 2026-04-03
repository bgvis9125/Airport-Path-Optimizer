const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const airports = [
  { id: "JFK", name: "New York (JFK)", lat: 40.6413, lon: -73.7781 },
  { id: "LAX", name: "Los Angeles", lat: 33.9416, lon: -118.4085 },
  { id: "ORD", name: "Chicago O'Hare", lat: 41.9742, lon: -87.9073 },
  { id: "DFW", name: "Dallas/Fort Worth", lat: 32.8998, lon: -97.0403 },
  { id: "MIA", name: "Miami", lat: 25.7932, lon: -80.2906 },
  { id: "SEA", name: "Seattle", lat: 47.4502, lon: -122.3088 },
  { id: "ATL", name: "Atlanta", lat: 33.6407, lon: -84.4277 },
  { id: "DEN", name: "Denver", lat: 39.8561, lon: -104.6737 },
  { id: "SFO", name: "San Francisco", lat: 37.6213, lon: -122.3790 },
  { id: "BOS", name: "Boston", lat: 42.3644, lon: -71.0059 }
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function primsMST(selectedAirports) {
  const mst = [];
  const visited = new Set();
  
  if (selectedAirports.length < 2) return mst;

  visited.add(selectedAirports[0].id);

  while (visited.size < selectedAirports.length) {
    let minEdge = null;
    
    for (const srcId of visited) {
      const src = selectedAirports.find(a => a.id === srcId);
      for (const dest of selectedAirports) {
        if (!visited.has(dest.id)) {
          const distance = calculateDistance(src.lat, src.lon, dest.lat, dest.lon);
          if (!minEdge || distance < minEdge.distance) {
            minEdge = { from: src.id, to: dest.id, distance };
          }
        }
      }
    }

    if (minEdge) {
      mst.push(minEdge);
      visited.add(minEdge.to);
    }
  }

  return mst;
}

function nearestNeighborTSP(selectedAirports) {
  if (selectedAirports.length < 2) return [];
  
  const path = [];
  const unvisited = [...selectedAirports];
  
  let current = unvisited.shift();
  path.push(current);
  
  while (unvisited.length > 0) {
    let nearest = null;
    let minDistance = Infinity;
    
    for (const airport of unvisited) {
      const dist = calculateDistance(current.lat, current.lon, airport.lat, airport.lon);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = airport;
      }
    }
    
    if (nearest) {
      path.push(nearest);
      unvisited.splice(unvisited.indexOf(nearest), 1);
      current = nearest;
    }
  }
  
  // Return to start
  path.push(path[0]);
  return path;
}

app.get('/api/airports', (req, res) => {
  res.json(airports);
});

app.post('/api/mst', (req, res) => {
  try {
    const selectedIds = req.body.airportIds;
    const selectedAirports = airports.filter(a => selectedIds.includes(a.id));
    res.json({ mst: primsMST(selectedAirports) });
  } catch (error) {
    res.status(500).json({ error: "MST calculation failed" });
  }
});

app.post('/api/tsp', (req, res) => {
  try {
    const selectedIds = req.body.airportIds;
    const selectedAirports = airports.filter(a => selectedIds.includes(a.id));
    const path = nearestNeighborTSP(selectedAirports);
    const totalDistance = path.reduce((total, _, i, arr) => {
      if (i < arr.length - 1) {
        return total + calculateDistance(
          arr[i].lat, arr[i].lon,
          arr[i+1].lat, arr[i+1].lon
        );
      }
      return total;
    }, 0);
    
    res.json({ path, totalDistance });
  } catch (error) {
    console.error("TSP Error:", error);
    res.status(500).json({ error: "TSP calculation failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));