import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    // For SQLite datetime format (YYYY-MM-DD HH:MM:SS), append 'Z' to treat as UTC
    // then convert to local time for display
    let date;
    if (dateString.includes('T')) {
      // Already in ISO format
      date = new Date(dateString);
    } else {
      // SQLite format - convert to ISO and parse
      const isoString = dateString.replace(' ', 'T') + '.000Z';
      date = new Date(isoString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Format as DD/MM/YYYY HH:MM:SS
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const isOverdue = (dueDate) => {
    if (!dueDate || task.status === 'COMPLETED') return false;
    return new Date(dueDate) < new Date();
  };

  const getDueDateClass = () => {
    if (!task.due_date) return '';
    if (task.status === 'COMPLETED') return 'completed';
    if (isOverdue(task.due_date)) return 'overdue';
    return 'upcoming';
  };

  return (
    <div className={`task-card ${task.status.toLowerCase()}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="edit-btn" title="Edit">
            ✏️
          </button>
          <button onClick={() => onDelete(task.id)} className="delete-btn" title="Delete">
            🗑️
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <div className="status-section">
          <span className={`status-badge ${task.status.toLowerCase()}`}>
            {task.status === 'PENDING' ? 'Pending' : 'Completed'}
          </span>
          
          {task.status === 'PENDING' && (
            <button 
              onClick={() => onToggleComplete(task.id)} 
              className="complete-btn"
              title="Mark as completed"
            >
              ✓ Complete
            </button>
          )}
        </div>
        
        {task.due_date && (
          <div className={`due-date ${getDueDateClass()}`}>
            <strong>Due:</strong> {formatDate(task.due_date)}
            {isOverdue(task.due_date) && <span className="overdue-indicator">⚠️ Overdue</span>}
          </div>
        )}
        
        <div className="timestamps">
          <small className="created-at">
            Created: {formatDate(task.created_at)}
          </small>
          {task.updated_at !== task.created_at && (
            <small className="updated-at">
              Updated: {formatDate(task.updated_at)}
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
