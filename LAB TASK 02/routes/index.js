var express = require('express');
var router = express.Router();

// HOME PAGE
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Royal Tag - Home' });
});

// ABOUT PAGE  ← ADD THIS
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Royal Tag - About Us' });
});

// CONTACT PAGE - GET (show the form)
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Royal Tag - Contact Us' });
});

// CONTACT PAGE - POST (handle form submission)
router.post('/contact', function(req, res, next) {
  const { name, phone, email, comment } = req.body;
  // Later you can email this data or save to MongoDB
  console.log('Contact Form Submitted:', { name, phone, email, comment });
  res.render('contact', { 
    title: 'Royal Tag - Contact Us',
    success: 'Thank you! We will get back to you soon.'
  });
});

// STORE LOCATOR
router.get('/stores', function(req, res, next) {
  res.render('storelocation', { title: 'Royal Tag - Store Locator' });
});

// PRIVACY POLICY
router.get('/privacy', function(req, res, next) {
  res.render('privacy', { title: 'Royal Tag - Privacy Policy' });
});

// TERMS & RETURNS
router.get('/terms', function(req, res, next) {
  res.render('terms', { title: 'Royal Tag - Returns & Refunds' });
});

// SIZE CHART
router.get('/sizechart', function(req, res, next) {
  res.render('sizechart', { title: 'Royal Tag - Size Guide' });
});


router.get('/career', function(req, res, next) {
  res.render('career', { title: 'Royal Tag - Careers' });
});


router.get('/blog', function(req, res, next) {
  res.render('blog', { title: 'Royal Tag - Style Journal' });
});



// PRODUCT DATA — later replace with MongoDB query
const products = [
  { name: 'Off White Signature Polo', price: 7450, badge: 'New', image: '/assest/hertiage polo pict 1.webp', url: '/shop' },
  { name: 'Navy Signature Polo', price: 7450, badge: 'New', image: '/assest/hertiage polo 2.jpg', url: '/shop' },
  { name: 'Black Signature Polo', price: 7450, badge: 'New', image: '/assest/black signature polo.webp', url: '/shop' },
  { name: 'Olive Signature Polo', price: 7450, badge: 'New', image: '/assest/olive signature polo.webp', url: '/shop' },
  { name: 'Beige Signature Polo', price: 7450, badge: 'New', image: '/assest/beige signature polo.webp', url: '/shop' },
  { name: 'Pink Signature Polo', price: 7450, badge: 'New', image: '/assest/pink signature polo.jpg', url: '/shop' },
  { name: 'Brown Signature Polo', price: 7250, badge: 'New', image: '/assest/brown signature polo.webp', url: '/shop' },
  { name: 'Rust Signature Polo', price: 7250, badge: 'New', image: '/assest/rust signature polo.jpg', url: '/shop' },
];

// SEARCH ROUTE
router.get('/search', function(req, res) {
  const query = req.query.q ? req.query.q.toLowerCase() : '';

  if (!query || query.length < 1) {
    return res.json([]);
  }

  const results = products.filter(p =>
    p.name.toLowerCase().includes(query)
  );

  res.json(results.slice(0, 6)); // max 6 results
});


module.exports = router;