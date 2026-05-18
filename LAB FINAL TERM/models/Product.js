
// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:        String,
    price:       Number,
    category:    String,      // 'casual', 'formal', 'suits' etc
    subcategory: String,      // 'polo-shirts', 'trousers' etc
    images:      [String],    // array of image URLs
    sizes:       [String],    // ['S', 'M', 'L', 'XL', 'XXL']
    description: String,
    stock:       Number,
    badge:       String,      // 'NEW', 'SALE' etc
    isOnSale:    { type: Boolean, default: false },  // ✅ NEW FIELD
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);