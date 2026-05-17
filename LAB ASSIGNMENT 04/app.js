require('dotenv').config();

const MongoStore   = require('connect-mongo');
const mongoose     = require('mongoose');
var createError    = require('http-errors');
var express        = require('express');
var path           = require('path');
var cookieParser   = require('cookie-parser');
var logger         = require('morgan');
const jwt          = require('jsonwebtoken');
const { JWT_SECRET } = require('./middleware/auth');
const User         = require('./models/User');
const session      = require('express-session');
const flash        = require('connect-flash');

var app = express();

// ─── SESSION ──────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(flash());

// ─── DATABASE ─────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// ─── VIEW ENGINE ──────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ─── CORE MIDDLEWARE ──────────────────────────────────
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ─── REQUIRE ALL ROUTERS ──────────────────────────────
const { router: apiRouter } = require('./routes/api');
const adminRouter            = require('./routes/admin');
var indexRouter              = require('./routes/index');
var usersRouter              = require('./routes/users');
const productRoutes          = require('./routes/products');
const cartRouter             = require('./routes/cart');
const checkoutRouter         = require('./routes/checkout');
const ordersRouter           = require('./routes/orders');

// ─── MOUNT ROUTES (order matters!) ────────────────────

// ✅ API first — most specific prefix, no interference
app.use('/api/v1', apiRouter);

// ✅ Admin next
app.use('/admin', adminRouter);

// ✅ Flash + user locals for all EJS views
app.use(async (req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg   = req.flash('error');
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user    = await User.findById(decoded.id);
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

// ✅ All other routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRoutes);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);

// ─── 404 HANDLER ──────────────────────────────────────
app.use(function(req, res, next) {
  next(createError(404));
});

// ─── ERROR HANDLER ────────────────────────────────────
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;