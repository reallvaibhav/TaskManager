const connectDB = require('../../lib/db');
const verifyAuth = require('../../lib/auth');
const Task = require('../../lib/Task');
const getUserProjectIds = require('../../lib/utils');

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

    // GET /api/tasks?projectId=xxx — get tasks (optionally filtered by project)
    if (req.method === 'GET') {
      try {
        const { projectId } = req.query;
        let query = {};

        if (projectId) {
          query.project = projectId;
        } else {
          const projectIds = await getUserProjectIds(user.id);
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
    }
    // POST /api/tasks — create a task
    else if (req.method === 'POST') {
      try {
        const { title, description, dueDate, priority, project, assignedTo } = req.body;
        if (!title || !project) {
          return res.status(400).json({ message: 'Title and project are required.' });
        }

        const task = await Task.create({
          title,
          description,
          dueDate,
          priority,
          project,
          assignedTo: assignedTo || null,
          createdBy: user.id,
        });

        const populated = await Task.findById(task._id)
          .populate('assignedTo', 'name email')
          .populate('project', 'name');
        res.status(201).json(populated);
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
