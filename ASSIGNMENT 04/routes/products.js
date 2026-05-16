




const mongoose = require('mongoose'); 

const Product = require('../models/Product.js');
var express = require('express');
var router = express.Router();  


// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get by category
router.get('/category/:cat', async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.cat });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/collection/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { type } = req.query;

    // Map category to a display title
    const categoryTitles = {
      'suits': 'Suits & Coats',
      'polo-shirts': 'Polo Shirts',
      'casual-shirts': 'Casual Shirts',
      'formal-shirts': 'Formal Shirts',
      't-shirts': 'T-Shirts',
      'tehwar': 'Tehwar',
      'accessories': 'Accessories',
      'trousers': 'Trousers',
      'online-only': 'Online Only',
      'sale': 'Sale',
      'new-arrivals': 'New Arrivals'
    };

    // Map type query param to a display name
    const typeTitles = {
      '2-piece': '2-Piece Suits',
      '3-piece': '3-Piece Suits',
      'waistcoat': 'Waistcoat Sets',
      'tuxedo': 'Tuxedos',
      'blazer': 'Blazers',
      'overcoat': 'Overcoats',
      'wool-coat': 'Wool Coats',
      'formal': 'Formal Shirts',
      'casual': 'Casual Shirts',
      'polo': 'Polo Shirts',
      'chinos': 'Chinos',
      'jeans': 'Jeans',
      'ties': 'Ties & Bow Ties',
      'belts': 'Belts',
      'pocket-squares': 'Pocket Squares',
      'cufflinks': 'Cufflinks',
      'socks': 'Socks',
      'exclusive-shirts': 'Exclusive Shirts',
      'exclusive-suits': 'Exclusive Suits',
      'limited': 'Limited Edition',
      'clearance': 'Clearance',
      'bundle': 'Bundle Deals'
    };

    // Use type title if present, otherwise use category title
    const title = type
      ? typeTitles[type] || type
      : categoryTitles[category] || category;

    const products = await Product.find({ category });

    res.render('collection', { products, category, type: type || null, title });
  } catch (err) {
    res.status(500).render('error', { message: 'Something went wrong' });
  }
});



// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;