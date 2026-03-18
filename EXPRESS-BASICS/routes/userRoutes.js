const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ✅ import at top

router.get('/search', (req, res) => {
  res.send(`Search: ${req.query.name}`);
});

router.get('/user/:id', (req, res) => {
  res.send(`User ID is ${req.params.id}`);
});

router.post('/user', (req, res) => {
  res.json(req.body);
});

router.get('/hello', (req, res) => {  // ✅ only once
  res.send('Hello Ayesha 👋');
});

router.get('/user', (req, res) => {
  res.json({ name: 'Ayesha', age: 21, role: 'student' });
});

router.get('/success', (req, res) => {
  res.status(200).send('Request successful');
});

router.get('/error', (req, res) => {
  res.status(404).send('Page not found');
});

router.get('/profile', auth, (req, res) => {  // ✅ protected route
  res.json({ name: 'Ayesha', university: 'COMSATS' });
});

module.exports = router;