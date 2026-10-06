import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';

function DashboardPage({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load tasks on mount
  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Compute live task counts for sidebar badges
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    high: tasks.filter((t) => t.priority === 'High').length,
    medium: tasks.filter((t) => t.priority === 'Medium').length,
    low: tasks.filter((t) => t.priority === 'Low').length,
  };

  // Add or update task
  const handleSaveTask = async (taskData) => {
    try {
      if (currentTask) {
        const updated = await updateTask(currentTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save task:', err.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err.message);
    }
  };

  const handleOpenAdd = () => {
    setCurrentTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setSearch('');
  };

  // Filter tasks locally by search, status, and priority
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'All' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchTitle = task.title?.toLowerCase().includes(query);
      const matchDesc = task.description?.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const isFiltered = statusFilter !== 'All' || priorityFilter !== 'All' || search.trim() !== '';

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar
        user={user}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        taskCounts={taskCounts}
        onLogout={onLogout}
        onOpenAdd={handleOpenAdd}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="menu-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="topbar-right">
            {isFiltered && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenAdd}
            >
              + Add Task
            </button>
          </div>
        </header>

        <main className="content-body">
          <div className="content-header">
            <div className="content-title-area">
              <h2>
                {statusFilter === 'All' ? 'All Tasks' : `${statusFilter} Tasks`}
                {priorityFilter !== 'All' && ` (${priorityFilter} Priority)`}
              </h2>
              <span className="task-count-text">
                Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
          </div>

          {loading ? (
            <p className="loading">Loading tasks...</p>
          ) : (
            <TaskList
              tasks={filteredTasks}
              totalTasks={tasks.length}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTask}
              onAddTask={handleOpenAdd}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveTask}
        task={currentTask}
      />
    </div>
  );
}

export default DashboardPage;
