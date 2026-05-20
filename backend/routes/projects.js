const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

// GET /api/projects — get all projects for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ admin: req.user.id }, { members: req.user.id }],
    })
      .populate('admin', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects — create a new project (creator = admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required.' });

    const project = await Project.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id], // creator is also a member
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/projects/:id/members — admin adds a member by email
router.post('/:id/members', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (project.admin.toString() !== req.user.id)
      return res.status(403).json({ message: 'Only admin can add members.' });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User with that email not found.' });

    if (!project.members.map(String).includes(String(user._id))) {
      project.members.push(user._id);
      await project.save();
    }

    const updated = await Project.findById(project._id)
      .populate('admin', 'name email')
      .populate('members', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/projects/:id/members/:userId — admin removes a member
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (project.admin.toString() !== req.user.id)
      return res.status(403).json({ message: 'Only admin can remove members.' });

    if (req.params.userId === req.user.id)
      return res.status(400).json({ message: 'Admin cannot remove themselves.' });

    project.members = project.members.filter(
      (m) => m.toString() !== req.params.userId
    );
    await project.save();
    res.json({ message: 'Member removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/projects/users/all — get all registered users (for assignment dropdown)
router.get('/users/all', auth, async (req, res) => {
  try {
    const users = await User.find({}, 'name email _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
