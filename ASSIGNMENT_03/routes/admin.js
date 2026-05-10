var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// ─── ADMIN MIDDLEWARE ──────────────────────────────────
const requireAdmin = (req, res, next) => {
  const adminToken = req.cookies.adminToken;
  if (!adminToken) return res.redirect('/admin/login');
  try {
    const decoded = jwt.verify(adminToken, JWT_SECRET + '_ADMIN');
    if (decoded.role !== 'admin') return res.redirect('/admin/login');
    req.admin = decoded;
    res.locals.user = decoded;
    next();
  } catch {
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
  }
};

// ─── LOGIN ────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.cookies.adminToken) return res.redirect('/admin/dashboard');
  res.render('admin/login', { error: null });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, adminPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.render('admin/login', { error: 'Invalid credentials' });
    if (user.role !== 'admin') return res.render('admin/login', { error: 'Access denied' });
    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) return res.render('admin/login', { error: 'Invalid credentials' });
    const matchAdmin = await bcrypt.compare(adminPassword, user.adminPassword);
    if (!matchAdmin) return res.render('admin/login', { error: 'Invalid admin password' });
    const adminToken = jwt.sign(
      { id: user._id, name: user.name, role: 'admin' },
      JWT_SECRET + '_ADMIN',
      { expiresIn: '4h' }
    );
    res.cookie('adminToken', adminToken, { httpOnly: true, maxAge: 4 * 60 * 60 * 1000 });
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.render('admin/login', { error: 'Something went wrong' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
});

// ─── DASHBOARD ────────────────────────────────────────
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders   = await Order.countDocuments();
    const totalUsers    = await User.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const recentOrders  = await Order.find().populate('user').sort({ createdAt: -1 }).limit(5);
    const totalRevenue  = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    res.render('admin/dashboard', {
      totalProducts, totalOrders, totalUsers,
      pendingOrders, recentOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) { res.redirect('/admin/login'); }
});

// ─── PRODUCTS ─────────────────────────────────────────
router.get('/products', requireAdmin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render('admin/products', { products });
});

// ─── ADD PRODUCT ──────────────────────────────────────
router.get('/products/add', requireAdmin, (req, res) => {
  res.render('admin/add-product', { error: null, success: null }); // ✅ fixed typo
});



// ─── EDIT PRODUCT ─────────────────────────────────────
router.get('/products/edit/:id', requireAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/edit-product', { product, error: null, success: null });
});



// ─── DELETE PRODUCT ───────────────────────────────────
router.post('/products/delete/:id', requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/products');
  }
});

// ─── ORDERS ───────────────────────────────────────────
router.get('/orders', requireAdmin, async (req, res) => {
  const orders = await Order.find()
                            .populate('user')
                            .populate('items.product')
                            .sort({ createdAt: -1 });
  res.render('admin/orders', { orders });
});

router.post('/orders/status/:id', requireAdmin, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect('/admin/orders');
});

// ─── USERS ────────────────────────────────────────────
router.get('/users', requireAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('admin/users', { users });
});





// ─── ADD PRODUCT POST ─────────────────────────────────
router.post('/products/add', requireAdmin, async (req, res) => {
  try {
    let images = [];
    if (req.body.imageUrls) {
      images = req.body.imageUrls.split(',').map(i => i.trim()).filter(i => i);
    }

    const { name, price, category, badge, stock, description } = req.body;
    const subcategory = req.body.subcategory || '';
    const sizesArr = Array.isArray(req.body.sizes)
      ? req.body.sizes
      : (req.body.sizes ? [req.body.sizes] : []);

    await Product.create({
      name,
      price: Number(price),
      category,
      subcategory,          // ✅ saved
      badge: badge || '',
      sizes: sizesArr,
      stock: Number(stock),
      description,
      images
    });

    res.render('admin/add-product', { error: null, success: 'Product added successfully!' });
  } catch (err) {
    console.log(err);
    res.render('admin/add-product', { error: 'Something went wrong: ' + err.message, success: null });
  }
});

// ─── EDIT PRODUCT POST ────────────────────────────────
router.post('/products/edit/:id', requireAdmin, async (req, res) => {
  try {
    const { name, price, category, badge, stock, description } = req.body;
    const subcategory = req.body.subcategory || '';
    const sizesArr = Array.isArray(req.body.sizes)
      ? req.body.sizes
      : (req.body.sizes ? [req.body.sizes] : []);

    const update = {
      name,
      price: Number(price),
      category,
      subcategory,          // ✅ saved
      badge: badge || '',
      sizes: sizesArr,
      stock: Number(stock),
      description
    };

    if (req.body.imageUrls && req.body.imageUrls.trim()) {
      update.images = req.body.imageUrls.split(',').map(i => i.trim()).filter(i => i);
    }

    await Product.findByIdAndUpdate(req.params.id, update);
    const product = await Product.findById(req.params.id);
    res.render('admin/edit-product', { product, error: null, success: 'Product updated!' });
  } catch (err) {
    console.log(err);
    const product = await Product.findById(req.params.id);
    res.render('admin/edit-product', { product, error: 'Something went wrong: ' + err.message, success: null });
  }
});







module.exports = router;