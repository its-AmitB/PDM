const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.flash('error', 'Please log in');
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.user = req.user; // CRITICAL: makes user available in all EJS views
    next();
  } catch (err) {
    res.clearCookie('token');
    res.flash('error', 'Session expired or invalid. Please log in again.');
    return res.redirect('/login');
  }
};

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

module.exports = { protect, generateToken, setTokenCookie };
