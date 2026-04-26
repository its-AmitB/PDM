const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.flash('error', 'Access denied. You do not have permission to perform this action.');
      return res.redirect('/dashboard');
    }
    next();
  };
};

module.exports = { authorize };
