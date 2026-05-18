const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');

const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

const { JWT_SECRET, verifyToken } = require('../middleware/auth');



// ════════════════════════════════════════════════════════
// PUBLIC ENDPOINTS
// ════════════════════════════════════════════════════════

// ─── POST /api/v1/auth/login ──────────────────────────
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Sign token with user_id and role in payload
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/v1/products ─────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, sort, page, category } = req.query;

    const limit       = 8;
    const currentPage = parseInt(page) || 1;
    const skip        = (currentPage - 1) * limit;

    let filter = {};

    if (category) {
      filter.$or = [
        { category: category },
        { subcategory: category }
      ];
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc')  sortObj = { price:  1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    if (sort === 'name-asc')   sortObj = { name:   1 };

    const total      = await Product.countDocuments(filter);
    const products   = await Product.find(filter).sort(sortObj).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      total,
      currentPage,
      totalPages,
      products
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── GET /api/v1/products/:id ─────────────────────────
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.status(200).json({ success: true, product });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ════════════════════════════════════════════════════════
// PROTECTED ENDPOINTS — verifyToken applied below
// ════════════════════════════════════════════════════════

// ─── GET /api/v1/user/profile ─────────────────────────
router.get('/user/profile', verifyToken, async (req, res) => {
  try {
    // req.user.user_id comes from the decoded JWT payload
    const user = await User.findById(req.user.user_id).select('-password -adminPassword');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({ success: true, user });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/v1/orders ──────────────────────────────
router.post('/orders', verifyToken, async (req, res) => {
  try {
    const { items, address, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.'
      });
    }

    const order = await Order.create({
      user:    req.user.user_id,  // from JWT payload
      items,
      address,
      total,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = { router, verifyToken };