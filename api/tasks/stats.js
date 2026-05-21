const connectDB = require('../../lib/db');
const verifyAuth = require('../../lib/auth');
const Task = require('../../lib/Task');
const getUserProjectIds = require('../../lib/utils');

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

    // GET /api/tasks/stats — dashboard statistics
    const projectIds = await getUserProjectIds(user.id);
    const tasks = await Task.find({ project: { $in: projectIds } }).populate('assignedTo', 'name');

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
};
