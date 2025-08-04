const Task = require('../models/Task');

class TaskController {
  static async getAllTasks(req, res) {
    try {
      const { status, sortByDueDate } = req.query;
      const userId = req.user.id;

      const tasks = await Task.findAllByUserId(userId, status, sortByDueDate === 'true');
      res.json(tasks);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ message: 'Database error' });
    }
  }

  static async getTaskById(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;

      const task = await Task.findByIdAndUserId(taskId, userId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Get task by ID error:', error);
      res.status(500).json({ message: 'Database error' });
    }
  }

  static async createTask(req, res) {
    try {
      const { title, description, dueDate } = req.body;
      const userId = req.user.id;

      const task = await Task.create(title, description, dueDate, userId);
      res.json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ message: 'Error creating task' });
    }
  }

  static async updateTask(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;
      const { title, description, status, dueDate } = req.body;

      // First check if task exists and belongs to user
      const existingTask = await Task.findByIdAndUserId(taskId, userId);
      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const updatedTask = await Task.update(taskId, userId, title, description, status, dueDate);
      res.json(updatedTask);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ message: 'Error updating task' });
    }
  }

  static async completeTask(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;

      // First check if task exists and belongs to user
      const existingTask = await Task.findByIdAndUserId(taskId, userId);
      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const updatedTask = await Task.markAsCompleted(taskId, userId);
      res.json(updatedTask);
    } catch (error) {
      console.error('Complete task error:', error);
      res.status(500).json({ message: 'Error updating task' });
    }
  }

  static async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      const userId = req.user.id;

      console.log(`🗑️ DELETE request received for task ID: ${taskId}, User ID: ${userId}`);

      // First check if task exists and belongs to user
      const existingTask = await Task.findByIdAndUserId(taskId, userId);
      if (!existingTask) {
        console.log(`❌ Task not found or doesn't belong to user`);
        return res.status(404).json({ message: 'Task not found' });
      }

      console.log(`📋 Task found:`, existingTask);

      const result = await Task.delete(taskId, userId);
      console.log(`✅ Task deleted successfully, changes: ${result.changes}`);
      
      res.json({ message: 'Task deleted successfully!' });
    } catch (error) {
      console.error('💥 Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task' });
    }
  }
}

module.exports = TaskController;
