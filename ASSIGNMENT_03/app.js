require('dotenv').config();

const mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./middleware/auth');
const User = require('./models/User');

var app = express();

// ─── DATABASE ─────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ─── VIEW ENGINE ──────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ─── MIDDLEWARE ───────────────────────────────────────
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ─── AUTH MIDDLEWARE (must be before routes) ──────────
app.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      res.locals.user = decoded;
      res.locals.user.cartCount = user ? user.cart.length : 0;
    } catch {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// ─── ROUTES ───────────────────────────────────────────
const indexRouter    = require('./routes/index');
const usersRouter    = require('./routes/users');
const productRoutes  = require('./routes/products');
const cartRouter     = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const ordersRouter   = require('./routes/orders');
const adminRouter    = require('./routes/admin');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRoutes);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);
app.use('/admin', adminRouter);




// Add this temporarily in app.js just before the 404 handler
app.use((req, res, next) => {
  console.log('HIT:', req.method, req.url);
  next();
});



// ─── 404 HANDLER ──────────────────────────────────────
app.use(function(req, res, next) {
  next(createError(404));
});

// ─── ERROR HANDLER ────────────────────────────────────
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;