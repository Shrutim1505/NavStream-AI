const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shiproute';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Port model
const portSchema = new mongoose.Schema({
  name: String,
  country: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});
const Port = mongoose.model('Port', portSchema);

// Voyage model
const voyageSchema = new mongoose.Schema({
  departurePort: String,
  destinationPort: String,
  parameters: Object,
  route: Array,
  distance: Number,
  estimatedTime: Number,
  fuelConsumption: Number,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'completed' },
  savings: { type: Number, default: 0 },
  efficiency: { type: Number, default: 0 }
});
const Voyage = mongoose.model('Voyage', voyageSchema);

// Mock analytics data
const analytics = {
  totalSavings: 24580,
  averageFuelEfficiency: 85.4,
  onTimeDeliveries: 94.7,
  routesOptimized: 127,
  recentVoyages: [
    { id: 1, route: 'Sydney → Tokyo', savings: 2450, efficiency: 89, status: 'completed' },
    { id: 2, route: 'Hamburg → New York', savings: 3120, efficiency: 92, status: 'in-progress' },
    { id: 3, route: 'Singapore → Rotterdam', savings: 1890, efficiency: 87, status: 'completed' }
  ]
};

// POST /api/optimize-route
app.post('/api/optimize-route', async (req, res) => {
  const { departurePort, destinationPort, parameters } = req.body;
  try {
    // Fetch ports from MongoDB
    const dep = await Port.findOne({ name: departurePort });
    const dest = await Port.findOne({ name: destinationPort });
    if (!dep || !dest) {
      return res.status(404).json({ error: 'Port not found' });
    }

    // Haversine formula to calculate distance (in nautical miles)
    function toRad(x) { return x * Math.PI / 180; }
    const R = 3440.065; // Earth radius in nautical miles
    const dLat = toRad(dest.coordinates.lat - dep.coordinates.lat);
    const dLon = toRad(dest.coordinates.lng - dep.coordinates.lng);
    const lat1 = toRad(dep.coordinates.lat);
    const lat2 = toRad(dest.coordinates.lat);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Interpolate waypoints (5 points including start/end)
    const waypoints = [];
    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const lat = dep.coordinates.lat + (dest.coordinates.lat - dep.coordinates.lat) * frac;
      const lng = dep.coordinates.lng + (dest.coordinates.lng - dep.coordinates.lng) * frac;
      waypoints.push({ latitude: lat, longitude: lng });
    }

    // Estimate time (assume avg speed 20 knots)
    const avgSpeed = 20; // knots
    const estimatedTime = distance / avgSpeed; // hours
    // Estimate fuel (simple: 0.05 tons/nm)
    const fuelConsumption = distance * 0.05;

    // Calculate mock savings/efficiency
    const savings = Math.round(distance * 2.5);
    const efficiency = Math.round(80 + Math.random() * 15);

    const route = {
      departurePort,
      destinationPort,
      parameters,
      route: waypoints,
      distance: Math.round(distance),
      estimatedTime: Math.round(estimatedTime),
      fuelConsumption: Math.round(fuelConsumption)
    };
    // Save voyage
    const voyage = new Voyage({
      ...route,
      savings,
      efficiency
    });
    await voyage.save();
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to optimize route' });
  }
});

// GET /api/ports
app.get('/api/ports', async (req, res) => {
  try {
    const ports = await Port.find();
    res.json(ports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ports' });
  }
});

// GET /api/analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const voyages = await Voyage.find();
    const totalSavings = voyages.reduce((sum, v) => sum + (v.savings || 0), 0);
    const averageFuelEfficiency = voyages.length ? (voyages.reduce((sum, v) => sum + (v.efficiency || 0), 0) / voyages.length) : 0;
    const onTimeDeliveries = voyages.length ? (voyages.filter(v => v.status === 'completed').length / voyages.length) * 100 : 0;
    const routesOptimized = voyages.length;
    const recentVoyages = voyages.slice(-3).reverse().map(v => ({
      id: v._id,
      route: `${v.departurePort} → ${v.destinationPort}`,
      savings: v.savings,
      efficiency: v.efficiency,
      status: v.status
    }));
    res.json({
      totalSavings,
      averageFuelEfficiency: Math.round(averageFuelEfficiency * 10) / 10,
      onTimeDeliveries: Math.round(onTimeDeliveries * 10) / 10,
      routesOptimized,
      recentVoyages
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// POST /api/voyages (create a voyage)
app.post('/api/voyages', async (req, res) => {
  try {
    const voyage = new Voyage(req.body);
    await voyage.save();
    res.status(201).json(voyage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create voyage' });
  }
});

// GET /api/voyages (list all voyages)
app.get('/api/voyages', async (req, res) => {
  try {
    const voyages = await Voyage.find().sort({ createdAt: -1 });
    res.json(voyages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch voyages' });
  }
});

// GET /api/voyages/:id (get voyage details)
app.get('/api/voyages/:id', async (req, res) => {
  try {
    const voyage = await Voyage.findById(req.params.id);
    if (!voyage) return res.status(404).json({ error: 'Voyage not found' });
    res.json(voyage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch voyage' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 