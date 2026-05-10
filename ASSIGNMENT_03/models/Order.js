const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price:    Number
  }],
  total:   Number,
  address: String,
  phone:   String,
  status:  { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);