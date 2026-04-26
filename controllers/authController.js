const User = require('../models/User');
const { generateToken, setTokenCookie } = require('../middleware/authMiddleware');

const getLogin = (req, res) => {
  try {
    if (req.cookies.token) {
      return res.redirect('/dashboard');
    }
    res.render('auth/login');
  } catch (err) {
    console.error(err);
    res.flash('error', 'An error occurred.');
    res.redirect('/');
  }
};

const getRegister = (req, res) => {
  try {
    if (req.cookies.token) {
      return res.redirect('/dashboard');
    }
    res.render('auth/register');
  } catch (err) {
    console.error(err);
    res.flash('error', 'An error occurred.');
    res.redirect('/');
  }
};

const postRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate
    if (!name || name.trim() === '') {
      res.flash('error', 'Name is required');
      return res.redirect('/register');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      res.flash('error', 'Valid email is required');
      return res.redirect('/register');
    }
    if (!password || password.length < 8) {
      res.flash('error', 'Password must be at least 8 characters');
      return res.redirect('/register');
    }
    // Exclude admin from register dropdown
    if (!['manager', 'engineer'].includes(role)) {
      res.flash('error', 'Invalid role selected');
      return res.redirect('/register');
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.flash('error', 'Email is already registered');
      return res.redirect('/register');
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password,
      role
    });

    // JWT cookie
    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);
    
    res.flash('success', 'Registration successful. Welcome!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.flash('error', 'An error occurred during registration.');
    res.redirect('/register');
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.flash('error', 'Email and password are required');
      return res.redirect('/login');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const token = generateToken(user._id, user.role);
    setTokenCookie(res, token);

    res.flash('success', 'Logged in successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.flash('error', 'An error occurred during login.');
    res.redirect('/login');
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('token');
    res.flash('success', 'Logged out successfully');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
};

module.exports = {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  logout
};
