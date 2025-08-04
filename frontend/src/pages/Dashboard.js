import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { tasksAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === 'ALL' ? '' : filter;
      const response = await tasksAPI.getTasks(statusFilter, sortByDueDate);
      setTasks(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, sortByDueDate]);

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      setShowForm(false);
      fetchTasks();
    } catch (error) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await tasksAPI.updateTask(editingTask.id, taskData);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    console.log('🗑️ Delete button clicked for task ID:', taskId);
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      console.log('✅ User confirmed deletion');
      try {
        console.log('🔄 Making API call to delete task...');
        await tasksAPI.deleteTask(taskId);
        console.log('✅ API call completed, updating UI...');
        
        // Immediately remove the task from local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        // Clear any errors
        setError('');
        
        console.log('🔄 Task removed from UI');
      } catch (error) {
        setError('Failed to delete task. Please try again.');
        console.error('💥 Error deleting task:', error);
      }
    } else {
      console.log('❌ User cancelled deletion');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await tasksAPI.markAsCompleted(taskId);
      fetchTasks();
    } catch (error) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const getFilteredTasks = () => {
    return tasks;
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'COMPLETED').length;
    const pending = tasks.filter(task => task.status === 'PENDING').length;
    const overdue = tasks.filter(task => 
      task.status === 'PENDING' && 
      task.due_date && 
      new Date(task.due_date) < new Date()
    ).length;

    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="dashboard">
      <Header />
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <h3>Total Tasks</h3>
              <span className="stat-number">{stats.total}</span>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <span className="stat-number pending">{stats.pending}</span>
            </div>
            <div className="stat-card">
              <h3>Completed</h3>
              <span className="stat-number completed">{stats.completed}</span>
            </div>
            <div className="stat-card">
              <h3>Overdue</h3>
              <span className="stat-number overdue">{stats.overdue}</span>
            </div>
          </div>

          {/* Controls Section */}
          <div className="controls-section">
            <div className="filters">
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Tasks</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
              
              <label className="sort-checkbox">
                <input
                  type="checkbox"
                  checked={sortByDueDate}
                  onChange={(e) => setSortByDueDate(e.target.checked)}
                />
                Sort by Due Date
              </label>
            </div>
            
            <button 
              onClick={() => setShowForm(true)} 
              className="create-task-btn"
            >
              + Add New Task
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError('')} className="close-error">×</button>
            </div>
          )}

          {/* Tasks Section */}
          <div className="tasks-section">
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading your tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No tasks found</h3>
                <p>
                  {filter === 'ALL' 
                    ? "You don't have any tasks yet. Create your first task to get started!"
                    : `No ${filter.toLowerCase()} tasks found.`
                  }
                </p>
                {filter === 'ALL' && (
                  <button 
                    onClick={() => setShowForm(true)} 
                    className="create-first-task-btn"
                  >
                    Create Your First Task
                  </button>
                )}
              </div>
            ) : (
              <div className="tasks-grid">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          initialTask={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
