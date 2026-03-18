const express = require('express');
const router = express.Router();

// GET request
router.get('/', (req, res) => {
  res.send("Welcome to Home Page");
});

// POST request (practice)
router.post('/', (req, res) => {
  res.send("Home POST request");
});

module.exports = router;