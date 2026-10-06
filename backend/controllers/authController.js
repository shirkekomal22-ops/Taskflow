const crypto = require('crypto');
const User = require('../models/User');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = new User({
      email,
      name: name || email.split('@')[0],
      password: hashPassword(password),
    });

    await user.save();

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Log in user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Auto-provision demo account if requested
    if (email.toLowerCase() === 'demo@taskflow.com' && password === 'demo123') {
      let demoUser = await User.findOne({ email: 'demo@taskflow.com' });
      if (!demoUser) {
        demoUser = new User({
          email: 'demo@taskflow.com',
          name: 'Demo User',
          password: hashPassword('demo123'),
        });
        await demoUser.save();
      }
      return res.json({
        user: {
          id: demoUser._id,
          email: demoUser.email,
          name: demoUser.name,
        },
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      password: hashPassword(password),
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

module.exports = {
  register,
  login,
};
