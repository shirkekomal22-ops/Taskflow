import React from 'react';
import TaskCard from './TaskCard';

// totalTasks = all tasks for this user (before any filters)
// tasks = filtered tasks currently shown
function TaskList({ tasks, onEdit, onDelete, onAddTask, totalTasks }) {
  // User has no tasks at all — show the welcome/get started screen
  if (totalTasks === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🚀</div>
        <h3>Let's get started!</h3>
        <p>You don't have any tasks yet. Create your first one to begin.</p>
        <button className="btn btn-primary" onClick={onAddTask}>
          + Add Your First Task
        </button>
      </div>
    );
  }

  // User has tasks, but filters returned nothing
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>No tasks match your filters</h3>
        <p>Try changing the filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
