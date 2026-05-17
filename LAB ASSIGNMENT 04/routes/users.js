var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireLogin, JWT_SECRET } = require('../middleware/auth');
const Order = require('../models/Order');

// ─── REGISTER ─────────────────────────────────────────
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    // ✅ Password length validation
    if (password.length < 6) {
      return res.render('register', { error: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.render('register', { error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, age });

    req.flash('success', 'Account created! Please login.');
    res.redirect('/users/login');
  } catch (err) {
    res.render('register', { error: 'Something went wrong' });
  }
});

// ─── LOGIN ────────────────────────────────────────────
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/users/login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/users/login');
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/');
  } catch (err) {
    res.render('login', { error: 'Something went wrong' });
  }
});

// ─── LOGOUT ───────────────────────────────────────────
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'You have successfully logged out');
  res.redirect('/users/login');
});

// ─── PROFILE ──────────────────────────────────────────
router.get('/profile', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let orderCount = 0;
    try { orderCount = await Order.countDocuments({ user: req.user.id }); } catch(e) {}
    res.render('profile', { user, orderCount, success: null, error: null });
  } catch (err) {
    res.redirect('/');
  }
});

router.post('/profile/update', requireLogin, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    await User.findByIdAndUpdate(req.user.id, { name, email, phone, address });
    const user = await User.findById(req.user.id);
    let orderCount = 0;
    try { orderCount = await Order.countDocuments({ user: req.user.id }); } catch(e) {}
    res.render('profile', { user, orderCount, success: 'Profile updated successfully!', error: null });
  } catch (err) {
    res.redirect('/users/profile');
  }
});

router.post('/profile/password', requireLogin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);
    let orderCount = 0;
    try { orderCount = await Order.countDocuments({ user: req.user.id }); } catch(e) {}

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.render('profile', { user, orderCount, success: null, error: 'Current password is incorrect.' });
    }
    if (newPassword !== confirmPassword) {
      return res.render('profile', { user, orderCount, success: null, error: 'New passwords do not match.' });
    }
    if (newPassword.length < 6) {
      return res.render('profile', { user, orderCount, success: null, error: 'Password must be at least 6 characters.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashed });
    res.render('profile', { user, orderCount, success: 'Password updated successfully!', error: null });
  } catch (err) {
    res.redirect('/users/profile');
  }
});

module.exports = router;