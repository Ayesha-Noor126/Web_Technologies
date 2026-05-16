const mongoose = require('mongoose'); 
const Product = require('../models/Product.js');
var express = require('express');
var router = express.Router();  

// ─── GET ALL PRODUCTS ─────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ─── GET BY CATEGORY (API) ────────────────────────────
router.get('/category/:cat', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.cat });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ─── COLLECTION PAGE (with pagination, filter, search) ─
router.get('/collection/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { type, search, minPrice, maxPrice, sort, page } = req.query;

    const limit = 8;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * limit;

    // Match by category OR subcategory (so ties appear under accessories too)
    let filter = {
      $or: [
        { category: category },
        { subcategory: category }
      ]
    };

    // If ?type= is set, narrow down to that subcategory
    if (type) {
      filter = { subcategory: type };
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'price-asc')  sortObj = { price:  1 };
    if (sort === 'price-desc') sortObj = { price: -1 };
    if (sort === 'name-asc')   sortObj = { name:   1 };
    if (sort === 'newest')     sortObj = { createdAt: -1 };

    const total      = await Product.countDocuments(filter);
    const products   = await Product.find(filter).sort(sortObj).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);

    const titleMap = {
      'polo-shirts':   'Polo Shirts',
      'suits':         'Suits & Coats',
      'casual-shirts': 'Casual Shirts',
      'formal-shirts': 'Formal Shirts',
      't-shirts':      'T-Shirts',
      'tehwar':        'Tehwar',
      'accessories':   'Accessories',
      'trousers':      'Trousers',
      'online-only':   'Online Only',
      'sale':          'Sale',
      'new-arrivals':  'New Arrivals',
    };

    const subtypeMap = {
      'ties':            'Ties & Bow Ties',
      'belts':           'Belts',
      'pocket-squares':  'Pocket Squares',
      'cufflinks':       'Cufflinks',
      'socks':           'Socks',
      '2-piece':         '2-Piece Suits',
      '3-piece':         '3-Piece Suits',
      'waistcoat':       'Waistcoat Sets',
      'tuxedo':          'Tuxedos',
      'blazer':          'Blazers',
      'overcoat':        'Overcoats',
      'wool-coat':       'Wool Coats',
      'formal':          'Formal Shirts',
      'casual':          'Casual Shirts',
      'polo':            'Polo Shirts',
      'chinos':          'Chinos',
      'jeans':           'Jeans',
      'exclusive-shirts':'Exclusive Shirts',
      'exclusive-suits': 'Exclusive Suits',
      'limited':         'Limited Edition',
      'clearance':       'Clearance',
      'bundle':          'Bundle Deals',
      'new-this-week':   'New This Week',
      'online-exclusives':'Online Exclusives',
    };

    res.render('collection', {
      products,
      category,
      title: subtypeMap[type] || titleMap[category] || category,
      total,
      currentPage,
      totalPages,
      query: {
        search:   search   || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        sort:     sort     || 'default',
        type:     type     || ''
      }
    });

  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// ─── GET SINGLE PRODUCT BY ID ─────────────────────────
// ⚠️  Keep this LAST — /:id would catch /collection/:category if placed above it
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;