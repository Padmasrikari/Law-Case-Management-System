const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');

exports.preloadLawyers = async (req, res) => {
  try {
    const lawyersData = [
      { name: 'Ravi Kumar', email: 'ravi@legal.com', specialization: 'Criminal Law', location: 'Vijayawada' },
      { name: 'Anita Sharma', email: 'anita@legal.com', specialization: 'Family Law', location: 'Guntur' },
      { name: 'Vikram Reddy', email: 'vikram@legal.com', specialization: 'Corporate Law', location: 'Visakhapatnam' },
      { name: 'Neha Gupta', email: 'neha@legal.com', specialization: 'Cyber Law', location: 'Tirupati' },
      { name: 'Rahul Verma', email: 'rahul@legal.com', specialization: 'Property Law', location: 'Nellore' },
      { name: 'Priya Nair', email: 'priya@legal.com', specialization: 'Civil Law', location: 'Kurnool' },
      { name: 'Arjun Mehta', email: 'arjun@legal.com', specialization: 'Immigration Law', location: 'Rajahmundry' },
      { name: 'Kavya Iyer', email: 'kavya@legal.com', specialization: 'Tax Law', location: 'Vijayawada' },
      { name: 'Suresh Babu', email: 'suresh@legal.com', specialization: 'Labour Law', location: 'Anantapur' },
      { name: 'Divya Reddy', email: 'divya@legal.com', specialization: 'Environmental Law', location: 'Eluru' }
    ];

    let count = 0;
    for (const data of lawyersData) {
      const exists = await User.findOne({ email: data.email });
      if (!exists) {
        const user = await User.create({
          name: data.name,
          email: data.email,
          password: 'password123', // Bcrypt will hash this automatically via pre-save hook
          role: 'lawyer',
          status: 'pending',
          phone: '9876543210'
        });

        await LawyerProfile.create({
          userId: user._id,
          specialization: data.specialization,
          location: data.location,
          experience: Math.floor(Math.random() * 10) + 2,
          bio: `Experienced ${data.specialization} specialist based in ${data.location}.`,
          education: 'LLB, LLM',
          barNumber: `AP-${Math.floor(Math.random() * 10000)}/201${Math.floor(Math.random() * 9)}`,
          consultationFee: Math.floor(Math.random() * 500) + 500,
          documents: {} // Dummy empty object or mock docs can go here
        });
        count++;
      }
    }

    res.json({ message: `Successfully preloaded ${count} lawyers.`, count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
