var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAdmin, JWT_SECRET } = require('../middleware/auth');

// ─── LOGIN (public routes) ─────────────────────────────
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
router.get('/dashboard', isAdmin, async (req, res) => {
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
  } catch (err) {
    res.redirect('/admin/login');
  }
});

// ─── PRODUCTS ─────────────────────────────────────────
router.get('/products', isAdmin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render('admin/products', { products });
});

// ─── ADD PRODUCT ──────────────────────────────────────
router.get('/products/add', isAdmin, (req, res) => {
  res.render('admin/add-product');
});

router.post('/products/add', isAdmin, async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(f => f.path);
    } else if (req.body.imageUrls) {
      images = req.body.imageUrls.split(',').map(i => i.trim()).filter(i => i);
    }

    // ✅ subcategory added
    const { name, price, category, subcategory, badge, sizes, stock, description } = req.body;
    const sizesArr = Array.isArray(sizes) ? sizes : (sizes ? sizes.split(',').map(s => s.trim()) : []);

    await Product.create({
      name, price: Number(price), category,
      subcategory: subcategory || '',  // ✅
      badge: badge || '',
      sizes: sizesArr,
      stock: Number(stock),
      description, images
    });

    req.flash('success', 'Product added successfully!');
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/admin/products/add');
  }
});

// ─── EDIT PRODUCT ─────────────────────────────────────
router.get('/products/edit/:id', isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('admin/edit-product', { product });
});

router.post('/products/edit/:id', isAdmin, async (req, res) => {
  try {
    // ✅ subcategory added
    const { name, price, category, subcategory, badge, sizes, stock, description } = req.body;
    const sizesArr = Array.isArray(sizes) ? sizes : (sizes ? sizes.split(',').map(s => s.trim()) : []);

    const update = {
      name, price: Number(price), category,
      subcategory: subcategory || '',  // ✅
      badge: badge || '',
      sizes: sizesArr,
      stock: Number(stock),
      description
    };

    if (req.files && req.files.length > 0) {
      update.images = req.files.map(f => f.path);
    } else if (req.body.imageUrls && req.body.imageUrls.trim()) {
      update.images = req.body.imageUrls.split(',').map(i => i.trim()).filter(i => i);
    }

    await Product.findByIdAndUpdate(req.params.id, update);

    req.flash('success', 'Product updated successfully!');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect(`/admin/products/edit/${req.params.id}`);
  }
});

// ─── DELETE PRODUCT ───────────────────────────────────
router.post('/products/delete/:id', isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted.');
    res.redirect('/admin/products');
  } catch (err) {
    req.flash('error', 'Could not delete product.');
    res.redirect('/admin/products');
  }
});

// ─── ORDERS ───────────────────────────────────────────
router.get('/orders', isAdmin, async (req, res) => {
  const orders = await Order.find()
                            .populate('user')
                            .populate('items.product')
                            .sort({ createdAt: -1 });
  res.render('admin/orders', { orders });
});

router.post('/orders/status/:id', isAdmin, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect('/admin/orders');
});

// ─── USERS ────────────────────────────────────────────
router.get('/users', isAdmin, async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('admin/users', { users });
});

module.exports = router;