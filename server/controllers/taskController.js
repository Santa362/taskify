const mongoose = require('mongoose');
const Task = require('../models/Task');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/tasks?status=all|pending|completed
exports.getTasks = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'status must be all, pending or completed' });
      }
      filter.status = status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/stats
exports.getStats = async (req, res, next) => {
  try {
    const [total, pending, completed] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'pending' }),
      Task.countDocuments({ status: 'completed' }),
    ]);
    res.json({ total, pending, completed });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });
    const updates = {};
    ['title', 'description', 'status'].forEach((k) => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });
    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id/toggle
exports.toggleTask = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: task._id });
  } catch (err) {
    next(err);
  }
};
