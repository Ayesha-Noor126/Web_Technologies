var express = require('express');
var router = express.Router();
const Order = require('../models/Order');
const { requireLogin } = require('../middleware/auth');

// ─── VIEW ALL ORDERS ──────────────────────────────────
router.get('/', requireLogin, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
                              .populate('items.product')
                              .sort({ createdAt: -1 });
    res.render('orders', { orders });
  } catch (err) {
    res.redirect('/');
  }
});

// ─── ORDER CONFIRMATION PAGE ──────────────────────────
router.get('/confirmation/:id', requireLogin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.redirect('/orders');
    res.render('confirmation', { order });
  } catch (err) {
    res.redirect('/orders');
  }
});

module.exports = router;