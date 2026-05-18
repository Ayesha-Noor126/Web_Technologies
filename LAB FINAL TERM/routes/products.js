const mongoose = require('mongoose'); 
const Product  = require('../models/Product.js');
var express    = require('express');
var router     = express.Router();

// ─── GET ALL PRODUCTS ─────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET BY CATEGORY ──────────────────────────────────
router.get('/category/:cat', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.cat });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET SINGLE PRODUCT BY ID ─────────────────────────
// ⚠️ Must be LAST — /:id is a wildcard that catches everything
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;