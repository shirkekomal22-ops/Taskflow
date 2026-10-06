const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Get the logged-in user's ID from localStorage and send it as a header.
// The backend uses this to show only that user's tasks.
const getAuthHeaders = () => {
  try {
    const user = JSON.parse(localStorage.getItem('taskflow_user'));
    return user?.id ? { 'Content-Type': 'application/json', 'x-user-id': user.id } : { 'Content-Type': 'application/json' };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
};

// --- Task API ---

export const fetchTasks = async () => {
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to load tasks');
  }
  return res.json();
};

export const createTask = async (taskData) => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create task');
  }
  return data;
};

export const updateTask = async (id, taskData) => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update task');
  }
  return data;
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete task');
  }
  return data;
};

// --- Auth API ---

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};
