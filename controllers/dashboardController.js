const Product = require('../models/Product');
const Component = require('../models/Component');
const User = require('../models/User');

const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'Active' });
    const totalComponents = await Component.countDocuments();
    const inReviewCount = await Product.countDocuments({ status: 'In Review' });
    
    const recentProducts = await Product.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    let totalUsers = null;
    if (req.user && req.user.role === 'admin') {
      totalUsers = await User.countDocuments();
    }

    res.render('dashboard/index', {
      pageTitle: 'Dashboard',
      currentPage_nav: 'dashboard',
      totalProducts,
      activeProducts,
      totalComponents,
      inReviewCount,
      recentProducts,
      totalUsers
    });
  } catch (err) {
    console.error(err);
    if (res.flash) res.flash('error', 'Failed to load dashboard data');
    res.redirect('/');
  }
};

module.exports = { getDashboard };
