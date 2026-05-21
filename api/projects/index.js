const connectDB = require('../../lib/db');
const verifyAuth = require('../../lib/auth');
const Project = require('../../lib/Project');
const User = require('../../lib/User');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // Verify auth
    const user = verifyAuth(req, res);
    if (!user) return;

    // GET /api/projects — get all projects for logged-in user
    if (req.method === 'GET') {
      try {
        const projects = await Project.find({
          $or: [{ admin: user.id }, { members: user.id }],
        })
          .populate('admin', 'name email')
          .populate('members', 'name email');
        res.json(projects);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    // POST /api/projects — create a new project (creator = admin)
    else if (req.method === 'POST') {
      try {
        const { name, description } = req.body;
        if (!name) {
          return res.status(400).json({ message: 'Project name is required.' });
        }

        const project = await Project.create({
          name,
          description,
          admin: user.id,
          members: [user.id], // creator is also a member
        });

        res.status(201).json(project);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
