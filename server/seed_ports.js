const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shiproute';

const portSchema = new mongoose.Schema({
  name: String,
  country: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});
const Port = mongoose.model('Port', portSchema);

const ports = [
  { name: 'Port of Sydney', country: 'Australia', coordinates: { lat: -33.8688, lng: 151.2093 } },
  { name: 'Port of Tokyo', country: 'Japan', coordinates: { lat: 35.6762, lng: 139.6503 } },
  { name: 'Port of Hamburg', country: 'Germany', coordinates: { lat: 53.5511, lng: 9.9937 } },
  { name: 'Port of Singapore', country: 'Singapore', coordinates: { lat: 1.3521, lng: 103.8198 } },
  { name: 'Port of Rotterdam', country: 'Netherlands', coordinates: { lat: 51.9244, lng: 4.4777 } },
  { name: 'Port of Shanghai', country: 'China', coordinates: { lat: 31.2304, lng: 121.4737 } },
  { name: 'Port of Los Angeles', country: 'USA', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { name: 'Port of New York', country: 'USA', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { name: 'Port of Dubai', country: 'UAE', coordinates: { lat: 25.2048, lng: 55.2708 } },
  { name: 'Port of Hong Kong', country: 'Hong Kong', coordinates: { lat: 22.3193, lng: 114.1694 } },
];

async function seed() {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await Port.deleteMany({});
  await Port.insertMany(ports);
  console.log('Ports seeded successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
}); 