const connectDB = require('../../lib/db');
const verifyAuth = require('../../lib/auth');
const Task = require('../../lib/Task');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
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

    const { id } = req.query;

    // PUT /api/tasks/:id — update task (status/fields)
    if (req.method === 'PUT') {
      try {
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true })
          .populate('assignedTo', 'name email')
          .populate('project', 'name');
        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }
        res.json(task);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
    // DELETE /api/tasks/:id
    else if (req.method === 'DELETE') {
      try {
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully.' });
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
