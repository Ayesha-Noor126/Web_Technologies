var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { requireLogin } = require('../middleware/auth');

// ─── ADD TO CART ──────────────────────────────────────
router.post('/add', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(req.body.productId);

    // ✅ Check if product exists
    if (!product) return res.redirect('/');

    // ✅ Check if out of stock
    if (product.stock <= 0) {
      return res.redirect('/?error=outofstock');
    }

    const existing = user.cart.find(i => i.product.toString() === req.body.productId);

    if (existing) {
      // ✅ Check stock limit before increasing
      if (existing.quantity >= product.stock) {
        return res.redirect('/cart?error=maxstock');
      }
      existing.quantity += 1;
    } else {
      user.cart.push({ product: req.body.productId, quantity: 1 });
    }

    await user.save();
    res.redirect('/cart');

  } catch (err) {
    res.redirect('/');
  }
});

// ─── VIEW CART ────────────────────────────────────────
router.get('/', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');

    // ✅ Filter out null products
    const validCart = user.cart.filter(i => i.product !== null);

    // ✅ Clean DB if needed
    if (validCart.length !== user.cart.length) {
      user.cart = validCart;
      await user.save();
    }

    const total = validCart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const error = req.query.error || null;
    res.render('cart', { cart: validCart, total, error });

  } catch (err) {
    res.render('cart', { cart: [], total: 0, error: null });
  }
});

// ─── REMOVE FROM CART ─────────────────────────────────
router.post('/remove', requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { cart: { product: req.body.productId } }
    });
    res.redirect('/cart');
  } catch (err) {
    res.redirect('/cart');
  }
});

// ─── UPDATE QUANTITY ──────────────────────────────────
router.post('/update', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(req.body.productId);
    const newQty = parseInt(req.body.quantity);

    if (newQty <= 0) {
      // remove item
      user.cart = user.cart.filter(i => i.product.toString() !== req.body.productId);
    } else {
      const item = user.cart.find(i => i.product.toString() === req.body.productId);
      if (item) {
        // ✅ cap at stock limit
        item.quantity = Math.min(newQty, product.stock);
      }
    }

    await user.save();
    res.redirect('/cart');
  } catch (err) {
    res.redirect('/cart');
  }
});

module.exports = router;