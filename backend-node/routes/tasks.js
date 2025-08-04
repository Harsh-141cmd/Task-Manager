const express = require('express');
const TaskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken);

// Task Routes
router.get('/', TaskController.getAllTasks);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.put('/:id/complete', TaskController.completeTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
