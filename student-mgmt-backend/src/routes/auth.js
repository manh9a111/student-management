const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register (dev use). In production, restrict this or seed an admin.
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'username & password are required' });
    }
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: 'Username already exists' });

    const u = new User({ username, role });
    await u.setPassword(password);
    await u.save();
    return res.status(201).json({ id: u._id, username: u.username });
  } catch (err) {
    console.error('[auth/register] error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const u = await User.findOne({ username });
    if (!u || !(await u.validatePassword(password))) {
      return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }
    const token = jwt.sign(
      { sub: u._id.toString(), role: u.role },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '7d' }
    );
    return res.json({ token });
  } catch (err) {
    console.error('[auth/login] error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
