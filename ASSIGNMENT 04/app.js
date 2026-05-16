require('dotenv').config();


const mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./middleware/auth');
const User = require('./models/User');  // ← ADD THIS at top

var app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);




// ✅ REPLACE your old middleware with this
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

// ✅ Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productRoutes = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const ordersRouter = require('./routes/orders');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRoutes);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);


// ✅ 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// ✅ Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;