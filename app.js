require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Global flash middleware
app.use((req, res, next) => {
  res.locals.successMsg = req.cookies._flash_success || '';
  res.locals.errorMsg   = req.cookies._flash_error   || '';
  if (req.cookies._flash_success) res.clearCookie('_flash_success');
  if (req.cookies._flash_error)   res.clearCookie('_flash_error');
  res.flash = (type, message) => {
    res.cookie(`_flash_${type}`, message, { httpOnly: true, maxAge: 5000 });
  };
  // Initialize user as null to prevent ReferenceError in views if no auth middleware
  res.locals.user = null; 
  next();
});

// Routers (commented out until built)
app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/bom', require('./routes/bomRoutes'));
app.use('/pdf', require('./routes/pdfRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404', { 
    pageTitle: '404 Not Found',
    user: req.user || null
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
