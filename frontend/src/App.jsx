import React, { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Determines current view: 'dashboard' or 'login'
  const [view, setView] = useState(() => {
    if (window.location.hash === '#login') return 'login';
    const saved = localStorage.getItem('taskflow_user');
    return saved ? 'dashboard' : 'login';
  });

  // Sync hash changes (e.g. #login or #dashboard)
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#login') {
        setView('login');
      } else {
        setView('dashboard');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    setView('dashboard');
    window.location.hash = '';
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
    setView('login');
    window.location.hash = '#login';
  };

  if (view === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onCancel={() => {
          setView('dashboard');
          window.location.hash = '';
        }}
      />
    );
  }

  return <DashboardPage user={user} onLogout={handleLogout} />;
}

export default App;
