const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: get all project IDs the user belongs to
async function getUserProjectIds(userId) {
  const projects = await Project.find({
    $or: [{ admin: userId }, { members: userId }],
  });
  return projects.map((p) => p._id);
}

// GET /api/tasks/stats — dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const projectIds = await getUserProjectIds(req.user.id);
    const tasks = await Task.find({ project: { $in: projectIds } }).populate(
      'assignedTo',
      'name'
    );

    const now = new Date();
    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'To Do').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
      overdue: tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'Done'
      ).length,
    };

    // Tasks per user
    const perUser = {};
    tasks.forEach((t) => {
      if (t.assignedTo) {
        const name = t.assignedTo.name;
        perUser[name] = (perUser[name] || 0) + 1;
      }
    });
    stats.perUser = perUser;

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks?projectId=xxx — get tasks (optionally filtered by project)
router.get('/', auth, async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = {};

    if (projectId) {
      query.project = projectId;
    } else {
      const projectIds = await getUserProjectIds(req.user.id);
      query.project = { $in: projectIds };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('project', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks — create a task (admin only per project)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, project, assignedTo } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Title and project are required.' });

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user.id,
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id — update task (status/fields)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
