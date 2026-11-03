const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: String, status: { type: String, default: 'active' }, createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);
const LawyerProfile = mongoose.model('LawyerProfile', new mongoose.Schema({}, { strict: false }));
const Case = mongoose.model('Case', new mongoose.Schema({}, { strict: false }));
const Appointment = mongoose.model('Appointment', new mongoose.Schema({}, { strict: false }));
const Review = mongoose.model('Review', new mongoose.Schema({}, { strict: false }));

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await LawyerProfile.deleteMany({});
  await Case.deleteMany({});
  await Appointment.deleteMany({});
  await Review.deleteMany({});
  console.log('Cleared existing database records');

  const hashed = await bcrypt.hash('password123', 12);
  const adminHashed = await bcrypt.hash('987654', 12);
  
  await User.create({ name: 'Admin', email: 'admin@legal.com', password: adminHashed, role: 'admin', status: 'active' });
  console.log('✅ Admin created: admin@legal.com / 987654');

  // Create Lawyers
  const lawyer1 = await User.create({ name: 'John Doe', email: 'john@lawyer.com', password: hashed, role: 'lawyer', status: 'active' });
  const lawyer2 = await User.create({ name: 'Jane Smith', email: 'jane@lawyer.com', password: hashed, role: 'lawyer', status: 'active' });

  await LawyerProfile.create([
    { userId: lawyer1._id, specialization: 'Criminal Law', experience: 10, bio: 'Expert in criminal defense.' },
    { userId: lawyer2._id, specialization: 'Family Law', experience: 8, bio: 'Experienced in family disputes.' }
  ]);
  console.log('✅ Lawyers created (john@lawyer.com, jane@lawyer.com) / password123');

  // Create Clients
  const clientsData = [
    { name: 'Doprajna', email: 'doprajna@client.com', password: hashed, role: 'client', status: 'active' },
    { name: 'Padma', email: 'padma@client.com', password: hashed, role: 'client', status: 'active' },
    { name: 'Sumit', email: 'sumit@client.com', password: hashed, role: 'client', status: 'active' },
    { name: 'Siri', email: 'siri@client.com', password: hashed, role: 'client', status: 'active' }
  ];
  
  const clients = await User.insertMany(clientsData);
  console.log('✅ Clients created: doprajna, padma, sumit, siri (email: name@client.com) / password123');

  // Create Cases
  const statuses = ['Filed', 'In Progress', 'Hearing', 'Closed', 'Won', 'Lost'];
  const caseTypes = ['Criminal', 'Family', 'Corporate', 'Civil', 'Property'];
  
  const casesData = clients.map((client, i) => {
    return {
      clientId: client._id,
      lawyerId: i % 2 === 0 ? lawyer1._id : lawyer2._id,
      title: `${client.name}'s Legal Matter`,
      description: `Description for ${client.name}'s case.`,
      caseNumber: 'CASE-' + Date.now() + '-' + i,
      caseType: caseTypes[i % caseTypes.length],
      status: statuses[i % statuses.length],
      createdAt: new Date(Date.now() - Math.random() * 10000000000), // Random past dates for graph
      updatedAt: new Date()
    };
  });
  
  // Add some more cases for graph variety
  for(let i=0; i<5; i++) {
    casesData.push({
      clientId: clients[0]._id,
      lawyerId: lawyer1._id,
      title: `Additional Case ${i}`,
      description: `Description ${i}`,
      caseNumber: 'CASE-EXTRA-' + Date.now() + '-' + i,
      caseType: caseTypes[i % caseTypes.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      updatedAt: new Date()
    });
  }

  await Case.insertMany(casesData);
  console.log(`✅ ${casesData.length} Cases created for dashboard stats.`);

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
