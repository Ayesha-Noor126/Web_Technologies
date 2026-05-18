const Product = require('../models/Product.js');
const User    = require('../models/User.js');
var express   = require('express');
var router    = express.Router();

// ─── HOME PAGE ────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ category: 'polo-shirts' }).limit(8);
    res.render('index', { title: 'Royal Tag - Home', products });
  } catch (err) {
    res.render('index', { title: 'Royal Tag - Home', products: [] });
  }
});

// ─── ABOUT ────────────────────────────────────────────
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Royal Tag - About Us' });
});

// ─── CONTACT ──────────────────────────────────────────
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Royal Tag - Contact Us' });
});

router.post('/contact', function(req, res, next) {
  const { name, phone, email, comment } = req.body;
  console.log('Contact Form Submitted:', { name, phone, email, comment });
  res.render('contact', {
    title: 'Royal Tag - Contact Us',
    success: 'Thank you! We will get back to you soon.'
  });
});

// ─── OTHER PAGES ──────────────────────────────────────
router.get('/stores', function(req, res, next) {
  res.render('storelocation', { title: 'Royal Tag - Store Locator' });
});

router.get('/privacy', function(req, res, next) {
  res.render('privacy', { title: 'Royal Tag - Privacy Policy' });
});

router.get('/terms', function(req, res, next) {
  res.render('terms', { title: 'Royal Tag - Returns & Refunds' });
});

router.get('/sizechart', function(req, res, next) {
  res.render('sizechart', { title: 'Royal Tag - Size Guide' });
});

router.get('/career', function(req, res, next) {
  res.render('career', { title: 'Royal Tag - Careers' });
});

router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Royal Tag - Style Journal' });
});

// ─── SEARCH ───────────────────────────────────────────
router.get('/search', async function(req, res) {
  const query = req.query.q ? req.query.q.toLowerCase() : '';
  if (!query) return res.json([]);
  const results = await Product.find({
    name: { $regex: query, $options: 'i' }
  });
  res.json(results.slice(0, 6));
});

// ─── ON-SALE PRODUCTS PAGE ────────────────────────────
router.get('/onsale-products', async (req, res) => {
  try {
    // Fetch ALL on-sale products — client-side jQuery handles pagination
    const products = await Product.find({ isOnSale: true });
    res.render('onsale', { title: 'Royal Tag - On Sale', products });
  } catch (err) {
    console.error(err);
    res.render('onsale', { title: 'Royal Tag - On Sale', products: [] });
  }
});

// ─── SINGLE PRODUCT PAGE ──────────────────────────────
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/');
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);
    res.render('product', { product, related });
  } catch (err) {
    res.redirect('/');
  }
});

// ─── COLLECTION PAGE ──────────────────────────────────
router.get('/collection/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { type, page, search, minPrice, maxPrice, sort } = req.query;

    const LIMIT       = 8;
    const currentPage = parseInt(page) || 1;

    const categoryTitles = {
      'suits':               'Suits & Coats',
      'polo-shirts':         'Polo Shirts',
      'casual-shirts':       'Casual Shirts',
      'formal-shirts':       'Formal Shirts',
      't-shirts':            'T-Shirts',
      'tehwar':              'Tehwar',
      'accessories':         'Accessories',
      'trousers':            'Trousers',
      'online-only':         'Online Only',
      'sale':                'Sale',
      'new-arrivals':        'New Arrivals',
      'dress-shirt-&-pants': 'Dress Shirts & Pants',
      'shop-online-only':    'Shop Online Only'
    };

    const typeTitles = {
      '2-piece': '2-Piece Suits', '3-piece': '3-Piece Suits',
      'waistcoat': 'Waistcoat Sets', 'tuxedo': 'Tuxedos',
      'blazer': 'Blazers', 'overcoat': 'Overcoats', 'wool-coat': 'Wool Coats',
      'formal': 'Formal Shirts', 'casual': 'Casual Shirts',
      'polo': 'Polo Shirts', 't-shirts': 'T-Shirts',
      'trousers': 'Trousers', 'chinos': 'Chinos', 'jeans': 'Jeans',
      'ties': 'Ties & Bow Ties', 'belts': 'Belts',
      'pocket-squares': 'Pocket Squares', 'cufflinks': 'Cufflinks', 'socks': 'Socks',
      'tehwar': 'Tehwar', 'winter': 'Winter',
      'exclusive-shirts': 'Exclusive Shirts', 'exclusive-suits': 'Exclusive Suits',
      'limited': 'Limited Edition', 'clearance': 'Clearance', 'bundle': 'Bundle Deals',
      'new-this-week': 'New This Week', 'best-seller': 'Best Sellers',
      'online-exclusive': 'Online Exclusives'
    };

    const title = type
      ? typeTitles[type] || type
      : categoryTitles[category] || category;

    // ─── BUILD QUERY ──────────────────────────────────
    let dbQuery = {};

    if (category === 'dress-shirt-&-pants') {
      dbQuery.category = { $in: ['formal-shirts', 'casual-shirts', 'polo-shirts', 't-shirts', 'trousers'] };
      if (type) dbQuery.subcategory = type;
    } else if (category === 'shop-online-only') {
      dbQuery.category = 'online-only';
      if (type) dbQuery.subcategory = type;
    } else {
      dbQuery.category = category;
      if (type) dbQuery.subcategory = type;
    }

    if (search)   dbQuery.name  = { $regex: search, $options: 'i' };

    if (minPrice || maxPrice) {
      dbQuery.price = {};
      if (minPrice) dbQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) dbQuery.price.$lte = parseFloat(maxPrice);
    }

    let sortObj = {};
    if (sort === 'price-asc')       sortObj = { price:  1 };
    else if (sort === 'price-desc') sortObj = { price: -1 };
    else if (sort === 'name-asc')   sortObj = { name:   1 };
    else if (sort === 'newest')     sortObj = { createdAt: -1 };

    const total      = await Product.countDocuments(dbQuery);
    const totalPages = Math.ceil(total / LIMIT);
    const skip       = (currentPage - 1) * LIMIT;
    const products   = await Product.find(dbQuery).sort(sortObj).skip(skip).limit(LIMIT);

    res.render('collection', {
      products, title, category,
      type: type || null,
      currentPage, totalPages, total,
      query: {
        search:   search   || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        sort:     sort     || 'default',
        type:     type     || ''
      }
    });

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
