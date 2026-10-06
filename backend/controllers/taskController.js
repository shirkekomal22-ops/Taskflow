const mongoose = require('mongoose');
const Task = require('../models/Task');

// Helper: get userId from request header
// The frontend sends the logged-in user's ID with every request
const getUserId = (req) => req.headers['x-user-id'];

// Get all tasks for the logged-in user (supports search, status, priority filters)
const getTasks = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { search, status, priority } = req.query;

    // Always filter by the logged-in user's ID
    const filter = { userId };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
  }
};

// Get a single task by ID (only if it belongs to the logged-in user)
const getTaskById = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find by both id AND userId so users can't access each other's tasks
    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving task', error: error.message });
  }
};

// Create a new task and assign it to the logged-in user
const createTask = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { title, description, priority, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const task = new Task({
      userId,             // Link the task to the logged-in user
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      status: status || 'Pending',
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task (only if it belongs to the logged-in user)
const updateTask = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (priority !== undefined) updateFields.priority = priority;
    if (status !== undefined) updateFields.status = status;

    // findOneAndUpdate with userId ensures a user can only update their own tasks
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task (only if it belongs to the logged-in user)
const deleteTask = async (req, res) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // findOneAndDelete with userId ensures a user can only delete their own tasks
    const task = await Task.findOneAndDelete({ _id: id, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
