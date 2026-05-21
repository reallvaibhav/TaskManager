const connectDB = require('../../../lib/db');
const verifyAuth = require('../../../lib/auth');
const User = require('../../../lib/User');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Verify auth
    const user = verifyAuth(req, res);
    if (!user) return;

    // GET /api/projects/users/all — get all registered users (for assignment dropdown)
    const users = await User.find({}, 'name email _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
