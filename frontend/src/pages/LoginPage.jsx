import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

function LoginPage({ onLogin, onCancel }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (isRegister && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await registerUser({ email: email.trim(), password, name: name.trim() });
        // Return to login screen and prompt user to log in
        setIsRegister(false);
        setPassword('');
        setSuccessMessage('Registration successful! Please log in with your credentials.');
      } else {
        const data = await loginUser({ email: email.trim(), password });
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click login for evaluation/demo
  const handleDemoLogin = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const data = await loginUser({ email: 'demo@taskflow.com', password: 'demo123' });
      onLogin(data.user);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {onCancel && (
          <button type="button" className="btn-back-link" onClick={onCancel}>
            &larr; Back to Dashboard
          </button>
        )}

        <div className="login-header">
          <h1>TaskFlow</h1>
          <p>{isRegister ? 'Create an account to get started' : 'Sign in to manage your tasks'}</p>
        </div>

        {error && <div className="login-error">{error}</div>}
        {successMessage && <div className="login-success">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-block"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          Quick Demo Login
        </button>

        <div className="login-footer">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                  setSuccessMessage('');
                }}
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                  setSuccessMessage('');
                }}
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
