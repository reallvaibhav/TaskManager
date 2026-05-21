const connectDB = require('../../../lib/db');
const verifyAuth = require('../../../lib/auth');
const Project = require('../../../lib/Project');
const User = require('../../../lib/User');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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

    const { id, userId } = req.query;

    // POST /api/projects/:id/members — admin adds a member by email
    if (req.method === 'POST') {
      try {
        const project = await Project.findById(id);
        if (!project) {
          return res.status(404).json({ message: 'Project not found.' });
        }

        if (project.admin.toString() !== user.id) {
          return res.status(403).json({ message: 'Only admin can add members.' });
        }

        const member = await User.findOne({ email: req.body.email });
        if (!member) {
          return res.status(404).json({ message: 'User with that email not found.' });
        }

        if (!project.members.map(String).includes(String(member._id))) {
          project.members.push(member._id);
          await project.save();
        }

        const updated = await Project.findById(project._id)
          .populate('admin', 'name email')
          .populate('members', 'name email');
        res.json(updated);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    // DELETE /api/projects/:id/members/:userId — admin removes a member
    else if (req.method === 'DELETE') {
      try {
        const project = await Project.findById(id);
        if (!project) {
          return res.status(404).json({ message: 'Project not found.' });
        }

        if (project.admin.toString() !== user.id) {
          return res.status(403).json({ message: 'Only admin can remove members.' });
        }

        if (userId === user.id) {
          return res.status(400).json({ message: 'Admin cannot remove themselves.' });
        }

        project.members = project.members.filter((m) => m.toString() !== userId);
        await project.save();
        res.json({ message: 'Member removed.' });
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
