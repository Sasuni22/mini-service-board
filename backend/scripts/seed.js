require('dotenv').config();
const mongoose = require('mongoose');
const JobRequest = require('../models/JobRequest');
const connectDB = require('../config/db');

const sampleJobs = [
  {
    title: 'Emergency Leak in Kitchen',
    description:
      'The main pipe under the sink has burst. Immediate assistance required to prevent water damage spreading to the floor and cabinets.',
    category: 'Plumbing',
    location: 'Borella ,Sri Lanka',
    contactName: 'P. B. Silva',
    contactEmail: 'silva@gmail.com',
    status: 'Open',
  },
  {
    title: 'Living Room Rewiring',
    description:
      'Complete electrical overhaul for a Victorian renovation. New sockets and light fittings required throughout. Consumer unit also needs replacing.',
    category: 'Electrical',
    location: 'Maharagama, Sri Lanka',
    contactName: 'Kumara Gamage',
    contactEmail: 'gamage123@gmail.com',
    status: 'In Progress',
  },
  {
    title: 'Fence Painting & Treatment',
    description:
      'Annual treatment and charcoal grey painting of the garden perimeter fence. Approximately 40 metres total. Wood is in good condition.',
    category: 'Painting',
    location: 'Moratuwa, Sri Lanka',
    contactName: 'Sampath Kumara',
    contactEmail: 'sampathkumara@gmail.com',
    status: 'Closed',
  },
  {
    title: 'Industrial HVAC Systems Inspection & Maintenance',
    description:
      'Full diagnostic inspection required for the central HVAC unit servicing the warehouse floor. Intermittent pressure drops in the primary circuit have been reported. Includes filter replacement, sensor calibration, and a full structural integrity check of all ducting.',
    category: 'HVAC',
    location: 'Nawala',
    contactName: 'Sarath Dissanayake',
    contactEmail: 'SDissanayke@gmail.com',
    status: 'In Progress',
  },
  {
    title: 'Roof Tile Replacement After Storm Damage',
    description:
      'Approximately 15 tiles have cracked or displaced following last week\'s storm. Flashing around the chimney stack also needs inspection and resealing.',
    category: 'Roofing',
    location: 'Siddamulla ,Sri Lanka',
    contactName: 'Wilson Perera',
    contactEmail: 'pererawilson@gmail.com',
    status: 'Open',
  },
  {
    title: 'Garden Landscaping Overhaul',
    description:
      'Looking to completely redesign the rear garden. Includes new patio, raised flower beds, lawn levelling, and installation of an irrigation system.',
    category: 'Landscaping',
    location: 'Thalangama,Sri Lanka',
    contactName: 'Pawan Madushan',
    contactEmail: 'pawanmadu@gmail.com',
    status: 'Open',
  },
  {
    title: 'Office Network & IT Infrastructure Setup',
    description:
      'New office space requires full IT infrastructure setup: structured cabling, switch installation, Wi-Fi access point placement, and NAS configuration for 20 workstations.',
    category: 'IT Support',
    location: 'Moratuwa, Sri Lanka',
    contactName: 'Avishka Dilsan',
    contactEmail: 'avishkadilshan@gmail.com',
    status: 'Open',
  },
  {
    title: 'Bespoke Kitchen Cabinet Fitting',
    description:
      'Custom-made kitchen cabinets delivered and awaiting installation. Work includes wall preparation, precision fitting, and finishing. Kitchen dimensions have been provided to the manufacturer.',
    category: 'Joinery',
    location: 'Kottawa, Sri Lanka',
    contactName: 'Randika Perera',
    contactEmail: 'pererarandy@gmail.com',
    status: 'Open',
  },
];

const seed = async () => {
  await connectDB();
  try {
    await JobRequest.deleteMany({});
    console.log('🗑️  Existing jobs cleared');

    const created = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱 Seeded ${created.length} job requests successfully`);
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seed();
