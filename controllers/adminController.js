const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/users', {
      pageTitle: 'User Management',
      currentPage_nav: 'users',
      users
    });
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to load users');
    res.redirect('/dashboard');
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'manager', 'engineer'];
    
    if (!validRoles.includes(role)) {
      if(res.flash) res.flash('error', 'Invalid role selected');
      return res.redirect('/admin/users');
    }

    if (req.user.id === req.params.id && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        if(res.flash) res.flash('error', 'Cannot demote the last admin account');
        return res.redirect('/admin/users');
      }
    }

    await User.findByIdAndUpdate(req.params.id, { role });
    
    if(res.flash) res.flash('success', 'User role updated successfully');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to update user role');
    res.redirect('/admin/users');
  }
};

const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      if(res.flash) res.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }

    if (req.user.id === userToDelete._id.toString()) {
      if(res.flash) res.flash('error', 'You cannot delete your own account');
      return res.redirect('/admin/users');
    }

    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        if(res.flash) res.flash('error', 'Cannot delete the last admin account');
        return res.redirect('/admin/users');
      }
    }

    await User.findByIdAndDelete(req.params.id);
    if(res.flash) res.flash('success', 'User deleted successfully');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    if(res.flash) res.flash('error', 'Failed to delete user');
    res.redirect('/admin/users');
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser
};
