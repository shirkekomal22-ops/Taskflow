import React from 'react';

function Sidebar({
  user,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  taskCounts,
  onLogout,
  onOpenAdd,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <span className="logo-icon">✓</span>
            <h2>TaskFlow</h2>
          </div>
          <p>Manage your daily tasks</p>
        </div>

        <button
          className="btn btn-primary btn-block sidebar-add-btn"
          onClick={() => {
            onOpenAdd();
            onClose?.();
          }}
        >
          + Add Task
        </button>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Status</div>
          <button
            type="button"
            className={`sidebar-nav-item ${statusFilter === 'All' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('All');
              onClose?.();
            }}
          >
            <span>All Tasks</span>
            <span className="sidebar-count">{taskCounts.all}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${statusFilter === 'Pending' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('Pending');
              onClose?.();
            }}
          >
            <span>Pending</span>
            <span className="sidebar-count">{taskCounts.pending}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${statusFilter === 'In Progress' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('In Progress');
              onClose?.();
            }}
          >
            <span>In Progress</span>
            <span className="sidebar-count">{taskCounts.inProgress}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${statusFilter === 'Completed' ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter('Completed');
              onClose?.();
            }}
          >
            <span>Completed</span>
            <span className="sidebar-count">{taskCounts.completed}</span>
          </button>

          <div className="sidebar-section-title" style={{ marginTop: '1.25rem' }}>
            Priority
          </div>
          <button
            type="button"
            className={`sidebar-nav-item ${priorityFilter === 'All' ? 'active' : ''}`}
            onClick={() => {
              setPriorityFilter('All');
              onClose?.();
            }}
          >
            <span>All Priorities</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${priorityFilter === 'High' ? 'active' : ''}`}
            onClick={() => {
              setPriorityFilter('High');
              onClose?.();
            }}
          >
            <span>High</span>
            <span className="sidebar-count">{taskCounts.high}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${priorityFilter === 'Medium' ? 'active' : ''}`}
            onClick={() => {
              setPriorityFilter('Medium');
              onClose?.();
            }}
          >
            <span>Medium</span>
            <span className="sidebar-count">{taskCounts.medium}</span>
          </button>

          <button
            type="button"
            className={`sidebar-nav-item ${priorityFilter === 'Low' ? 'active' : ''}`}
            onClick={() => {
              setPriorityFilter('Low');
              onClose?.();
            }}
          >
            <span>Low</span>
            <span className="sidebar-count">{taskCounts.low}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || user?.email}</span>
            <span className="sidebar-user-email">{user?.email}</span>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-block"
            onClick={onLogout}
          >
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
