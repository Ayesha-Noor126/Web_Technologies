const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key_change_this';

// ─── IS LOGGED IN (for customers) ─────────────────────
const requireLogin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.flash('error', 'Please login to continue');
    return res.redirect('/users/login');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    req.flash('error', 'Session expired, please login again');
    res.redirect('/users/login');
  }
};

// ─── IS ADMIN (for admin panel) ───────────────────────
const isAdmin = (req, res, next) => {
  const adminToken = req.cookies.adminToken;

  if (!adminToken) {
    return res.redirect('/admin/login');
  }

  try {
    const decoded = jwt.verify(adminToken, JWT_SECRET + '_ADMIN');

    if (decoded.role !== 'admin') {
      return res.status(403).render('error', {
        message: 'Access Denied: You do not have permission to view this page.',
        error: { status: 403, stack: '' }
      });
    }

    req.admin = decoded;
    res.locals.user = decoded;
    // ✅ ADD THESE TWO LINES — admin routes bypass app.js flash middleware
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg   = req.flash('error');
    next();

  } catch {
    res.clearCookie('adminToken');
    return res.redirect('/admin/login');
  }
};


// ─── VERIFY TOKEN (for REST API) ──────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};


module.exports = { requireLogin, isAdmin, verifyToken, JWT_SECRET };