const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_secret_key_change_this';  // change this!

const requireLogin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/users/login');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.redirect('/users/login');
  }
};

module.exports = { requireLogin, JWT_SECRET };