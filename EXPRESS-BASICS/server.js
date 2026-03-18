const express = require('express');
const app = express();
const port = 3000;

// Middleware imports
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');

// Routes
const homeRoute = require('./routes/home');
const aboutRoute = require('./routes/about');
const contactRoute = require('./routes/contact');
const userRoutes = require('./routes/userRoutes');

// View engine
app.set('view engine', 'ejs');

// Global middleware
app.use(express.json());
app.use(logger); // runs for all requests

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'My App' });
});

app.use('/home', homeRoute);
app.use('/about', aboutRoute);
app.use('/contact', contactRoute);

// Protected route
app.get('/dashboard', auth, (req, res) => {
  res.send("Welcome to Dashboard");
});

// API routes with middleware
app.use('/api', auth, userRoutes); 
// 👉 flow: request → auth → userRoutes

// Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});