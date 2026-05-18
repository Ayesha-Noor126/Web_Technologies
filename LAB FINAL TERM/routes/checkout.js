var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { requireLogin } = require('../middleware/auth');




// SHOW CHECKOUT PAGE
router.get('/', requireLogin, async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product');
  if (user.cart.length === 0) return res.redirect('/cart');

  // ✅ Filter out deleted products (null)
  const validCart = user.cart.filter(i => i.product !== null);

  // ✅ If cart had deleted products, clean them from DB too
  if (validCart.length !== user.cart.length) {
    user.cart = validCart;
    await user.save();
  }

  if (validCart.length === 0) return res.redirect('/cart');

  const total = validCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  res.render('checkout', { user, cart: validCart, total });
});











// PLACE ORDER
router.post('/place-order', requireLogin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    const { address, city, phone } = req.body;

    // ✅ Check stock for every item before placing order
    for (const item of user.cart) {
      if (item.product.stock < item.quantity) {
        return res.redirect('/cart?error=stockchanged');
      }
    }

    const items = user.cart.map(i => ({
      product:  i.product._id,
      quantity: i.quantity,
      price:    i.product.price
    }));

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ✅ Deduct stock from each product
    for (const item of user.cart) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }  // reduce stock
      });
    }

    // ✅ Create order
    const order = await Order.create({
      user:    user._id,
      items,
      total,
      address: `${address}, ${city}`,
      phone
    });

    // ✅ Clear cart
    user.cart = [];
    await user.save();

    // ✅ Redirect to confirmation page with order ID
    res.redirect(`/orders/confirmation/${order._id}`);

  } catch (err) {
    console.log(err);
    res.redirect('/checkout');
  }
});

module.exports = router;