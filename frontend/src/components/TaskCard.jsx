import React from 'react';

function TaskCard({ task, onEdit, onDelete }) {
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Get badge class name based on value
  const statusClass = task.status ? task.status.toLowerCase().replace(/\s+/g, '-') : 'pending';
  const priorityClass = task.priority ? task.priority.toLowerCase() : 'medium';

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-badges">
          <span className={`badge priority-${priorityClass}`}>{task.priority}</span>
          <span className={`badge status-${statusClass}`}>{task.status}</span>
        </div>
      </div>

      <p className={`task-description ${!task.description ? 'empty' : ''}`}>
        {task.description || 'No description provided.'}
      </p>

      <div className="task-card-footer">
        <span className="task-date">{formattedDate}</span>
        <div className="task-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
